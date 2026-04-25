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
import { PLANNERS, planSphere, AIR } from './builders.mjs';
import { planWithAI, SANDBOX_API_DOC } from './ai.mjs';
import { describeLocalTerrain } from '../public/js/terrain.js';

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
const AI_PROMPT = (description, terrainCtx) => `You are a voxel architect. Design: "${description}".

You write JavaScript that calls builder functions. Your code runs in a sandbox that collects block placements.

${SANDBOX_API_DOC}

COORDS: Relative - origin (0,0,0) is center-bottom (sits on the ground at the build location). +X east, +Y up, +Z south.
Limits: X,Z ∈ [-22,22], Y ∈ [-8,40]. Negative Y allowed for foundations/digging into the ground. Total placed blocks <= 4000.

LOCAL GEOGRAPHY:
${terrainCtx}

GUIDANCE:
- If terrain rises (positive deltas) into your footprint, EITHER carve into it (place AIR at those coords) OR raise the structure up onto it.
- If terrain drops (negative deltas), EITHER place foundation blocks at negative Y to build up, OR raise the build to keep it level.
- If trees are in the way, clear them with AIR blocks at their trunk and leaves coordinates.
- For "build a town", place several smaller buildings spread across the area with paths between, not one big building.

Output ONLY JavaScript. No markdown fences, no prose. Just code:`;

async function botPlanWithAI(description, originX, originZ, originY) {
  const terrainCtx = describeLocalTerrain(originX, originZ, originY, 10);
  const { code, plan } = await planWithAI(AI_PROMPT(description, terrainCtx), {
    model: AI_MODEL, maxX: 22, maxZ: 22, maxY: 45, minY: -8,
  });
  console.log(`[AI code] ${code.length} chars at (${originX},${originY},${originZ}):\n${code.slice(0, 300)}${code.length > 300 ? '...' : ''}`);
  return plan;
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
          const relPlan = await botPlanWithAI(description, x, z, y);
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
