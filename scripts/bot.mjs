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

// --- AI builder: shells out to `claude -p` for freeform build requests ---
const AI_PROMPT = (description) => `You are a voxel sculptor. Design a structure matching: "${description}".

Each block is a 1x1x1 cube on a 3D grid. The structure must be ONE coherent, contiguous shape - recognizable from silhouette, every part touches another. Aim for something recognizable, not huge.

Plan silently: main form, orientation (e.g., sword stands vertically, Y=0 handle, blade up Y+), where parts connect.

Blocks: 0=air 1=grass 2=dirt 3=stone(gray) 4=oak_log(brown) 5=leaves(green) 6=sand(yellow) 7=planks(tan) 8=cobblestone 10=brick(red) 11=glass(blue)

Color guide: metal→3 or 8, wood→4 or 7, foliage→5, red/fire→10, water/blue→11, skin→6, bone→1.

Coord system (relative, bot translates): +X east, +Y up, +Z south. Origin (0,0,0) is center-bottom. Build UP from Y=0. Range: X,Z ∈ [-15,15], Y ∈ [0,25].

OUTPUT FORMAT - two supported entry shapes, mix freely:
  Single block:  [x, y, z, block]                         (4 numbers)
  Filled box:    [x1, y1, z1, x2, y2, z2, block]          (7 numbers, inclusive both ends)

PREFER BOXES for walls, floors, filled volumes, columns - they are 5-100x more compact. Only use singles for isolated detail blocks.

Output ONLY one JSON array of such arrays. No prose, no markdown, no \`\`\`.

Example (a simple hut with a door gap):
[[-3,0,-3,3,0,3,8],[-3,1,-3,-3,4,3,7],[3,1,-3,3,4,3,7],[-3,1,-3,3,4,-3,7],[-3,1,3,3,4,3,7],[0,1,3,0,2,3,0],[-3,5,-3,3,5,3,10]]

Your turn:`;

function planWithAI(description) {
  return new Promise((resolve, reject) => {
    const prompt = AI_PROMPT(description);
    const proc = spawn('claude', ['-p', '--model', AI_MODEL], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0) return reject(new Error(`claude exit ${code}: ${stderr.slice(0, 150)}`));
      const match = stdout.match(/\[[\s\S]*\]/);
      if (!match) return reject(new Error(`No JSON found: ${stdout.slice(0, 150)}`));
      let raw;
      try { raw = JSON.parse(match[0]); } catch (e) { return reject(new Error(`Parse: ${e.message}`)); }
      if (!Array.isArray(raw)) return reject(new Error('Not an array'));
      const valid = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 11]);
      const MAX_BLOCKS = 5000;

      // Expand entries: [x,y,z,block] = single, [x1,y1,z1,x2,y2,z2,block] = filled box
      const result = [];
      for (const entry of raw) {
        if (result.length >= MAX_BLOCKS) break;
        let ops;
        if (Array.isArray(entry) && entry.length === 4) {
          ops = [{ x: entry[0], y: entry[1], z: entry[2], block: entry[3] }];
        } else if (Array.isArray(entry) && entry.length === 7) {
          const [a, b, c, d, e, f, block] = entry;
          const x1 = Math.min(a, d), x2 = Math.max(a, d);
          const y1 = Math.min(b, e), y2 = Math.max(b, e);
          const z1 = Math.min(c, f), z2 = Math.max(c, f);
          ops = [];
          for (let x = x1; x <= x2; x++)
            for (let y = y1; y <= y2; y++)
              for (let z = z1; z <= z2; z++)
                ops.push({ x, y, z, block });
        } else if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
          ops = [{ x: entry.x, y: entry.y, z: entry.z, block: entry.block }];
        } else {
          continue;
        }
        for (const op of ops) {
          if (!Number.isFinite(op.x) || !Number.isFinite(op.y) || !Number.isFinite(op.z)) continue;
          if (!valid.has(op.block)) continue;
          if (Math.abs(op.x) > 20 || Math.abs(op.z) > 20 || op.y < 0 || op.y > 35) continue;
          result.push({ x: Math.round(op.x), y: Math.round(op.y), z: Math.round(op.z), block: op.block });
          if (result.length >= MAX_BLOCKS) break;
        }
      }
      resolve(result);
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
