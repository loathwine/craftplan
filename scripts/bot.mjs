// CraftPlan bot: connects as a player, listens for @claude commands in chat,
// and builds structures around the world.
//
// Usage:
//   nix develop --command node scripts/bot.mjs
//
// In-game chat commands (type after pressing Enter):
//   @claude build castle              -> builds at bot's current position
//   @claude build tower 20 20 21      -> builds at coords
//   @claude build sphere 40 25 40 7 glass
//   @claude goto x y z
//   @claude stop
//   @claude help

import WebSocket from 'ws';
import { spawn } from 'child_process';
import vm from 'vm';
import { PLANNERS, planSphere, AIR } from './builders.mjs';

const AI_MODEL = process.env.AI_MODEL || 'claude-opus-4-7';

const HOST = process.env.HOST || 'localhost:3000';
const NAME = process.env.BOT_NAME || 'Claude';
const BUILD_RATE = parseInt(process.env.BUILD_RATE || '40'); // blocks/sec

// Bot state
let ws = null;
let myId = null;
const pos = [64, 30, 64];
let yaw = 0, pitch = 0;
let currentTask = null; // { cancel: bool }
let lastPosSend = 0;
let posInterval = null;

// Track other players: id -> { name, position: [x,y,z] }
const players = new Map();

const sleep = ms => new Promise(r => setTimeout(r, ms));

function send(type, data = {}) {
  if (ws.readyState === 1) ws.send(JSON.stringify({ type, ...data }));
}

function sendChat(text) { send('chat', { message: text }); }

function sendPosition() {
  send('move', { position: [...pos], rotation: [yaw, pitch] });
  lastPosSend = Date.now();
}

function lookAt(tx, ty, tz) {
  const dx = tx - pos[0], dy = ty - (pos[1] + 1.6), dz = tz - pos[2];
  yaw = Math.atan2(-dx, -dz);
  pitch = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
}

async function teleport(x, y, z) {
  pos[0] = x; pos[1] = y; pos[2] = z;
  sendPosition();
}

async function executePlan(plan, description) {
  currentTask = { cancel: false };
  const delay = 1000 / BUILD_RATE;
  const batchSize = Math.max(1, Math.ceil(BUILD_RATE / 20)); // ~20 batches/sec

  sendChat(`Building ${description} (${plan.length} blocks)...`);

  // Deduplicate: later ops on same cell overwrite earlier ones
  const byCell = new Map();
  for (const op of plan) byCell.set(`${op.x},${op.y},${op.z}`, op);
  const ordered = [...byCell.values()];

  const start = Date.now();
  for (let i = 0; i < ordered.length; i++) {
    if (currentTask.cancel) { sendChat('Stopped.'); currentTask = null; return; }
    const b = ordered[i];
    lookAt(b.x + 0.5, b.y + 0.5, b.z + 0.5);
    const type = b.block === AIR ? 'block_break' : 'block_place';
    send(type, { x: b.x, y: b.y, z: b.z, block: b.block });

    if (i % batchSize === batchSize - 1) {
      if (Date.now() - lastPosSend > 150) sendPosition();
      await sleep(delay * batchSize);
    }
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  sendChat(`Done in ${elapsed}s (${ordered.length} blocks)`);
  currentTask = null;
}

// --- AI builder: LLM writes JavaScript that calls builder primitives ---
const AI_PROMPT = (description) => `You are a voxel architect. Design: "${description}".

You write JavaScript that calls builder functions. Your code runs in a sandbox that collects block placements.

AVAILABLE FUNCTIONS:
  block(x, y, z, id)                           single block
  cube(x1, y1, z1, x2, y2, z2, id)             filled box (inclusive both ends)
  hollowCube(x1, y1, z1, x2, y2, z2, id)       box shell (edges) only
  sphere(cx, cy, cz, radius, id)               filled sphere
  hollowSphere(cx, cy, cz, radius, id)         sphere shell
  cylinder(cx, cy, cz, radius, height, id)     vertical cylinder (grows +Y)
  hollowCylinder(cx, cy, cz, radius, height, id)
  line(x1, y1, z1, x2, y2, z2, id)             line of blocks
  disk(cx, cy, cz, radius, id)                 filled flat disk at Y=cy

BLOCK CONSTANTS (just use these names):
  AIR       (0, carves/clears)
  GRASS (1), DIRT (2), STONE (3 gray), OAK_LOG (4 brown)
  LEAVES (5 green), SAND (6 yellow), PLANKS (7 tan)
  COBBLE (8), BRICK (10 red), GLASS (11 blue)

Color guide: metal/blade→STONE or COBBLE, wood→OAK_LOG or PLANKS, foliage→LEAVES, red/fire→BRICK, water/sky→GLASS, bone/white→GRASS.

COORDS: Relative - origin (0,0,0) is center-bottom. +X east, +Y up, +Z south.
Limits: X,Z ∈ [-18,18], Y ∈ [0,30]. Total placed blocks <= 4000.

Math is available. You can define local helper functions.

Example (a cozy stone tower):
  // Hollow stone base
  hollowCylinder(0, 0, 0, 4, 10, STONE);
  cube(-4, 0, -4, 4, 0, 4, COBBLE);  // floor cap
  cube(0, 1, 4, 0, 2, 4, AIR);       // doorway
  // Windows spiraling up
  for (let y = 3; y < 10; y += 2) {
    const a = y * 0.8;
    block(Math.round(4*Math.cos(a)), y, Math.round(4*Math.sin(a)), GLASS);
  }
  // Conical brick roof
  for (let h = 0; h < 5; h++) hollowCylinder(0, 10+h, 0, 5-h, 1, BRICK);
  block(0, 15, 0, OAK_LOG);          // spire

Output ONLY JavaScript. No markdown fences, no prose. Just code:`;

// Sandbox: provides building primitives, collects block operations
function makeSandbox() {
  const ops = [];
  const MAX_BLOCKS = 5000;
  let hitLimit = false;

  const addBlock = (x, y, z, id) => {
    if (hitLimit) return;
    if (ops.length >= MAX_BLOCKS) { hitLimit = true; return; }
    x = Math.round(x); y = Math.round(y); z = Math.round(z);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return;
    if (typeof id !== 'number') return;
    ops.push({ x, y, z, block: id });
  };

  const api = {
    // Block constants
    AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, OAK_LOG: 4, LEAVES: 5,
    SAND: 6, PLANKS: 7, COBBLE: 8, BRICK: 10, GLASS: 11,

    block: addBlock,

    cube(x1, y1, z1, x2, y2, z2, id) {
      const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
      const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
      const za = Math.min(z1, z2), zb = Math.max(z1, z2);
      for (let x = xa; x <= xb; x++)
        for (let y = ya; y <= yb; y++)
          for (let z = za; z <= zb; z++) {
            if (hitLimit) return;
            addBlock(x, y, z, id);
          }
    },

    hollowCube(x1, y1, z1, x2, y2, z2, id) {
      const xa = Math.min(x1, x2), xb = Math.max(x1, x2);
      const ya = Math.min(y1, y2), yb = Math.max(y1, y2);
      const za = Math.min(z1, z2), zb = Math.max(z1, z2);
      for (let x = xa; x <= xb; x++)
        for (let y = ya; y <= yb; y++)
          for (let z = za; z <= zb; z++)
            if (x === xa || x === xb || y === ya || y === yb || z === za || z === zb)
              addBlock(x, y, z, id);
    },

    sphere(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dy = -ri; dy <= ri; dy++)
          for (let dz = -ri; dz <= ri; dz++)
            if (Math.sqrt(dx*dx + dy*dy + dz*dz) <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
    },

    hollowSphere(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dy = -ri; dy <= ri; dy++)
          for (let dz = -ri; dz <= ri; dz++) {
            const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
            if (d >= r - 0.75 && d <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
          }
    },

    cylinder(cx, cy, cz, r, h, id) {
      const ri = Math.ceil(r);
      for (let dy = 0; dy < h; dy++)
        for (let dx = -ri; dx <= ri; dx++)
          for (let dz = -ri; dz <= ri; dz++)
            if (Math.sqrt(dx*dx + dz*dz) <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
    },

    hollowCylinder(cx, cy, cz, r, h, id) {
      const ri = Math.ceil(r);
      for (let dy = 0; dy < h; dy++)
        for (let dx = -ri; dx <= ri; dx++)
          for (let dz = -ri; dz <= ri; dz++) {
            const d = Math.sqrt(dx*dx + dz*dz);
            if (d >= r - 0.75 && d <= r + 0.25)
              addBlock(cx + dx, cy + dy, cz + dz, id);
          }
    },

    disk(cx, cy, cz, r, id) {
      const ri = Math.ceil(r);
      for (let dx = -ri; dx <= ri; dx++)
        for (let dz = -ri; dz <= ri; dz++)
          if (Math.sqrt(dx*dx + dz*dz) <= r + 0.25)
            addBlock(cx + dx, cy, cz + dz, id);
    },

    line(x1, y1, z1, x2, y2, z2, id) {
      const steps = Math.max(Math.abs(x2-x1), Math.abs(y2-y1), Math.abs(z2-z1), 1);
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        addBlock(x1 + (x2-x1)*t, y1 + (y2-y1)*t, z1 + (z2-z1)*t, id);
      }
    },

    Math,
  };

  return { api, ops: () => ops };
}

function extractCode(stdout) {
  // Strip markdown fences if present
  const fence = stdout.match(/```(?:javascript|js)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  return stdout.trim();
}

function runSandbox(code) {
  const { api, ops } = makeSandbox();
  const ctx = vm.createContext(api);
  vm.runInContext(code, ctx, { timeout: 5000, displayErrors: true });
  const valid = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11]);
  return ops()
    .filter(op => valid.has(op.block))
    .filter(op => Math.abs(op.x) <= 22 && Math.abs(op.z) <= 22 && op.y >= 0 && op.y <= 40);
}

function planWithAI(description) {
  return new Promise((resolve, reject) => {
    const prompt = AI_PROMPT(description);
    const proc = spawn('claude', ['-p', '--model', AI_MODEL], { stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`claude exit ${code}: ${stderr.slice(0, 150)}`));
      const src = extractCode(stdout);
      if (!src) return reject(new Error('Empty AI response'));
      console.log(`[AI code] ${src.length} chars:\n${src.slice(0, 300)}${src.length > 300 ? '...' : ''}`);
      try {
        const plan = runSandbox(src);
        resolve(plan);
      } catch (e) {
        reject(new Error(`Sandbox error: ${e.message.slice(0, 150)}`));
      }
    });
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

// Split args into description + trailing coord markers
function splitDescAndCoords(args) {
  if (args.length === 0) return { description: '', coordArgs: [] };
  const last = args[args.length - 1].toLowerCase();
  if (last === 'here' || last === 'me') {
    return { description: args.slice(0, -1).join(' '), coordArgs: [args[args.length - 1]] };
  }
  if (args.length >= 3) {
    const tail = args.slice(-3).map(Number);
    if (tail.every(Number.isFinite)) {
      return { description: args.slice(0, -3).join(' '), coordArgs: args.slice(-3) };
    }
  }
  return { description: args.join(' '), coordArgs: [] };
}

// Expand "here"/"me" tokens to the speaker's position. Returns { args, used }
// where used=true if any expansion happened.
function expandHere(args, speakerPos) {
  if (!speakerPos) return { args, used: false };
  let used = false;
  const expanded = [];
  for (const a of args) {
    const t = a.toLowerCase();
    if (t === 'here' || t === 'me') {
      expanded.push(String(Math.round(speakerPos[0])));
      expanded.push(String(Math.round(speakerPos[1])));
      expanded.push(String(Math.round(speakerPos[2])));
      used = true;
    } else {
      expanded.push(a);
    }
  }
  return { args: expanded, used };
}

function parseCoords(args, defaults) {
  const [x, y, z] = args;
  const px = parseInt(x), py = parseInt(y), pz = parseInt(z);
  return [
    Number.isFinite(px) ? px : defaults[0],
    Number.isFinite(py) ? py : defaults[1],
    Number.isFinite(pz) ? pz : defaults[2],
  ];
}

async function handleCommand(speakerId, speakerName, words) {
  const cmd = (words[0] || '').toLowerCase();
  const speakerPos = players.get(speakerId)?.position;
  const { args } = expandHere(words.slice(1), speakerPos);

  if (currentTask && cmd !== 'stop' && cmd !== 'help') {
    sendChat(`Busy! Try @${NAME} stop first.`);
    return;
  }

  switch (cmd) {
    case 'build': {
      if (args.length === 0) { sendChat('What should I build?'); return; }

      // Split into description + trailing coords
      const { description, coordArgs } = splitDescAndCoords(args);
      const firstWord = description.split(/\s+/)[0]?.toLowerCase() || '';
      const preset = PLANNERS[firstWord];

      // Expand "here" in coord args too
      const { args: expandedCoords } = expandHere(coordArgs, speakerPos);
      const defaults = speakerPos
        ? [Math.round(speakerPos[0]) + 5, Math.round(speakerPos[1]) - 1, Math.round(speakerPos[2]) + 5]
        : [Math.round(pos[0]), Math.max(15, Math.round(pos[1]) - 1), Math.round(pos[2]) + 8];
      const [x, y, z] = parseCoords(expandedCoords, defaults);

      let plan;
      let label;

      if (preset || firstWord === 'sphere') {
        // Preset mode
        if (firstWord === 'sphere') {
          const rest = description.split(/\s+/).slice(1);
          const radius = parseInt(rest[0]) || 5;
          plan = planSphere(x, y, z, radius);
        } else {
          plan = preset(x, y, z);
        }
        label = `${firstWord} at ${x},${y},${z}`;
      } else {
        // AI mode
        if (!description.trim()) { sendChat('What should I build?'); return; }
        sendChat(`Thinking about "${description}" (${AI_MODEL.split('-').slice(1,2).join('-')})...`);
        const startT = Date.now();
        const progressTimer = setInterval(() => {
          const sec = Math.round((Date.now() - startT) / 1000);
          sendChat(`...still thinking (${sec}s)`);
        }, 12000);
        try {
          const relPlan = await planWithAI(description);
          clearInterval(progressTimer);
          const took = Math.round((Date.now() - startT) / 1000);
          if (relPlan.length === 0) { sendChat('AI returned empty plan.'); return; }
          sendChat(`Got ${relPlan.length} blocks in ${took}s`);
          plan = relPlan.map(b => ({ x: x + b.x, y: y + b.y, z: z + b.z, block: b.block }));
          label = `"${description}" at ${x},${y},${z}`;
        } catch (e) {
          clearInterval(progressTimer);
          sendChat(`AI failed: ${e.message.slice(0, 100)}`);
          return;
        }
      }

      await teleport(x + 8, y + 10, z + 8);
      await sleep(200);
      await executePlan(plan, label);
      break;
    }

    case 'come':
    case 'goto': {
      if (cmd === 'come' && !speakerPos) {
        sendChat(`I don't know where you are yet, ${speakerName}.`);
        return;
      }
      const defaults = cmd === 'come' ? speakerPos : pos;
      const [x, y, z] = parseCoords(args, defaults);
      await teleport(x, y, z);
      sendChat(`@ ${x},${y},${z}`);
      break;
    }

    case 'stop': {
      if (currentTask) currentTask.cancel = true;
      else sendChat('Nothing to stop.');
      break;
    }

    case 'help': {
      sendChat(`build <${Object.keys(PLANNERS).join('|')}|sphere> [x y z | here], come, goto x y z, stop`);
      break;
    }

    default:
      sendChat(`Unknown command "${cmd}". Try @${NAME} help`);
  }
}

function connect() {
  console.log(`Connecting to ws://${HOST} as "${NAME}"...`);
  ws = new WebSocket(`ws://${HOST}`);
  wireUp();
}

function wireUp() {

ws.on('open', () => {
  send('join', { name: NAME });
});

ws.on('message', (data) => {
  let msg;
  try { msg = JSON.parse(data.toString()); } catch { return; }

  switch (msg.type) {
    case 'welcome':
      myId = msg.id;
      players.clear();
      for (const p of msg.players || [])
        players.set(p.id, { name: p.name, position: [...p.position] });
      console.log(`Connected. Listening for @${NAME} commands in chat.`);
      if (posInterval) clearInterval(posInterval);
      posInterval = setInterval(sendPosition, 500);
      setTimeout(() => sendChat(`Hi! I'm ${NAME}. Say "@${NAME} help" for commands.`), 800);
      break;
    case 'player_join':
      players.set(msg.player.id, { name: msg.player.name, position: [...msg.player.position] });
      break;
    case 'player_move': {
      const p = players.get(msg.id);
      if (p) p.position = [...msg.position];
      break;
    }
    case 'player_leave':
      players.delete(msg.id);
      break;
    case 'chat': {
      if (msg.id === myId) return; // ignore self
      const trigger = new RegExp(`^@${NAME}\\s+(.+)$`, 'i');
      const m = msg.message.match(trigger);
      if (!m) return;
      const words = m[1].trim().split(/\s+/);
      console.log(`<${msg.name}> ${msg.message}`);
      handleCommand(msg.id, msg.name, words).catch(e => {
        console.error(e);
        sendChat(`Error: ${e.message}`);
        currentTask = null;
      });
      break;
    }
  }
});

ws.on('close', () => {
  console.log('Disconnected. Reconnecting in 3s...');
  if (posInterval) { clearInterval(posInterval); posInterval = null; }
  currentTask = null;
  setTimeout(connect, 3000);
});
ws.on('error', (e) => { console.error('WS error:', e.message); });

} // end wireUp

process.on('SIGINT', () => { ws?.close(); process.exit(0); });

connect();
