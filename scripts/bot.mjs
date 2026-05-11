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
import { terrainHeight } from '../public/js/terrain.js';
import { describeLocalGeometry } from './geometry.mjs';

const AI_MODEL = process.env.AI_MODEL || 'claude-opus-4-7';

const HOST = process.env.HOST || 'localhost:3000';
const NAME = process.env.BOT_NAME || 'Claude';
const BUILD_RATE = parseInt(process.env.BUILD_RATE || '40'); // blocks/sec

// Idle behavior (traditional, no LLM)
const TICK_HZ = 10;
const WANDER_SPEED = 3.5; // blocks/sec
const WORLD_MIN = 16, WORLD_MAX = 240; // stay away from world edges (256x256)

// Autonomous building (LLM). Disable with AUTO_BUILD=0
const AUTO_BUILD = process.env.AUTO_BUILD !== '0';
const AUTO_BUILD_MIN_S = parseInt(process.env.AUTO_BUILD_MIN_INTERVAL || '300'); // 5 min
const AUTO_BUILD_MAX_S = parseInt(process.env.AUTO_BUILD_MAX_INTERVAL || '900'); // 15 min
const AUTO_BUILD_THEMES = [
  'small wooden cottage', 'stone watchtower', 'flower garden',
  'wooden well', 'campfire pit', 'large mushroom', 'outdoor bench',
  'stone fountain', 'snowman', 'tiny windmill', 'pumpkin patch',
  'archway', 'wooden bridge', 'stone obelisk', 'fox sculpture',
  'meditation pond', 'flagpole', 'sandcastle', 'gazebo',
];

// Bot state
let ws = null;
let myId = null;
const pos = [64, 30, 64];
let yaw = 0, pitch = 0;
let currentTask = null; // { cancel: bool }
let posInterval = null;

// Idle state machine
let state = 'idle';
let idleUntil = 0;
let wanderTarget = null;
let nextAutoBuildAt = 0;

// Track other players: id -> { name, position: [x,y,z] }
const players = new Map();

const sleep = ms => new Promise(r => setTimeout(r, ms));

function send(type, data = {}) {
  if (ws.readyState === 1) ws.send(JSON.stringify({ type, ...data }));
}

function sendChat(text) { send('chat', { message: text }); }

function sendPosition() {
  send('move', { position: [...pos], rotation: [yaw, pitch] });
}

const rand = (min, max) => min + Math.random() * (max - min);
const clampBounds = v => Math.max(WORLD_MIN, Math.min(WORLD_MAX, v));

function setIdle(minS = 2, maxS = 6) {
  state = 'idle';
  idleUntil = Date.now() + rand(minS, maxS) * 1000;
}

function startWander() {
  const angle = Math.random() * Math.PI * 2;
  const dist = rand(10, 40);
  const tx = clampBounds(pos[0] + Math.cos(angle) * dist);
  const tz = clampBounds(pos[2] + Math.sin(angle) * dist);
  wanderTarget = [tx, tz];
  state = 'wander';
}

function tickIdle() {
  if (Date.now() < idleUntil) return;
  if (tryStartAutoBuild()) return;
  startWander();
}

function tickWander() {
  const [tx, tz] = wanderTarget;
  const dx = tx - pos[0], dz = tz - pos[2];
  const dist = Math.hypot(dx, dz);
  if (dist < 0.5) { setIdle(); return; }
  const step = WANDER_SPEED / TICK_HZ;
  if (step >= dist) { pos[0] = tx; pos[2] = tz; }
  else {
    pos[0] += dx * step / dist;
    pos[2] += dz * step / dist;
  }
  pos[1] = terrainHeight(Math.floor(pos[0]), Math.floor(pos[2])) + 1;
  yaw = Math.atan2(-dx, -dz);
  pitch = 0;
}

function tryStartAutoBuild() {
  if (!AUTO_BUILD) return false;
  if (currentTask) return false;
  if (Date.now() < nextAutoBuildAt) return false;
  const theme = AUTO_BUILD_THEMES[Math.floor(Math.random() * AUTO_BUILD_THEMES.length)];
  const angle = Math.random() * Math.PI * 2;
  const dist = rand(15, 30);
  const x = Math.round(clampBounds(pos[0] + Math.cos(angle) * dist));
  const z = Math.round(clampBounds(pos[2] + Math.sin(angle) * dist));
  // Reschedule before kicking off so failures don't spam the LLM
  nextAutoBuildAt = Date.now() + rand(AUTO_BUILD_MIN_S, AUTO_BUILD_MAX_S) * 1000;
  console.log(`[auto-build] "${theme}" at ${x},${z}`);
  runAutoBuild(theme, x, z).catch(e => {
    console.error('[auto-build error]', e);
    sendChat(`Hmm, that didn't work: ${(e.message || '').slice(0, 80)}`);
    currentTask = null;
    setIdle(5, 10);
  });
  return true;
}

async function runAutoBuild(theme, x, z) {
  const ground = terrainHeight(x, z) + 1;
  sendChat(`I think I'll build a ${theme}.`);
  let plan;
  try {
    const relPlan = await botPlanWithAI(theme, x, z, ground);
    if (relPlan.length === 0) { sendChat('Never mind, lost my train of thought.'); setIdle(5, 10); return; }
    plan = relPlan.map(b => ({ x: x + b.x, y: ground + b.y, z: z + b.z, block: b.block }));
  } catch (e) {
    sendChat(`Couldn't plan a ${theme}: ${(e.message || '').slice(0, 60)}`);
    setIdle(5, 10);
    return;
  }
  await teleport(x + 8, ground + 10, z + 8);
  await sleep(200);
  await executePlan(plan, theme);
}

function tick() {
  if (!currentTask) {
    if (state === 'idle') tickIdle();
    else if (state === 'wander') tickWander();
  }
  if (ws && ws.readyState === 1) sendPosition();
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
    if (currentTask.cancel) {
      sendChat('Stopped.');
      currentTask = null;
      setIdle(2, 5);
      return;
    }
    const b = ordered[i];

    // Hover and slowly orbit around the block being placed
    const elapsed = (Date.now() - start) / 1000;
    const orbitR = 6, theta = elapsed * 0.4;
    pos[0] = b.x + 0.5 + Math.cos(theta) * orbitR;
    pos[1] = b.y + 4;
    pos[2] = b.z + 0.5 + Math.sin(theta) * orbitR;
    lookAt(b.x + 0.5, b.y + 0.5, b.z + 0.5);

    const type = b.block === AIR ? 'block_break' : 'block_place';
    send(type, { x: b.x, y: b.y, z: b.z, block: b.block });

    if (i % batchSize === batchSize - 1) {
      await sleep(delay * batchSize);
    }
  }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  sendChat(`Done in ${elapsed}s (${ordered.length} blocks)`);
  currentTask = null;
  // Space out the next auto-build so it doesn't fire right after this one
  nextAutoBuildAt = Date.now() + rand(AUTO_BUILD_MIN_S, AUTO_BUILD_MAX_S) * 1000;
  setIdle(5, 12);
}

// --- AI builder: LLM writes JavaScript that calls builder primitives ---
const AI_PROMPT = (description, geomCtx, radius, vradius) => `You are a voxel architect. Design: "${description}".

You write JavaScript that calls builder functions. Your code runs in a sandbox that collects block placements. Your output OVERRIDES whatever was at those coordinates.

${SANDBOX_API_DOC}

COORDS: Relative - origin (0,0,0) is the player's feet at the build location, on top of the ground. +X east, +Y up, +Z south.
Limits: X,Z ∈ [-${radius},${radius}], Y ∈ [-8,${vradius * 2 + 5}]. Negative Y allowed for foundations / digging in. Total <= 4000 blocks.
The geometry below is the SAME area: it covers exactly the cells you're allowed to build into, so anything you see there is guaranteed to be in your way / available to use.

${geomCtx}

How to read it: each entry [x1,y1,z1,x2,y2,z2,b] is a filled box of block id b spanning those inclusive coords. Y=-1 is the surface ground. Y=0 is the air cell at the player's feet (what you build on top of).

CRITICAL — INTEGRATE WITH EXISTING GEOMETRY:
- READ the boxes above before writing any code. They are real and already in the world.
- Identify landmarks: tree trunks (4=OAK_LOG vertical columns), leaf canopies (5=LEAVES), surface (1=GRASS / 6=SAND / 12=SNOW), other structures.
- USE them when fitting. "Treehouse" → build a platform AROUND an existing trunk and add planks; do NOT plant a new trunk through it. "Tunnel" / "cave" → carve into the existing hill. "Bridge" → start and end on existing terrain.
- AVOID them when in the way. Either route around (preferable for trees that aren't relevant) or place AIR at their coords to clear them.
- DON'T overlap your structure with existing OAK_LOG / LEAVES / STONE unless you intentionally place AIR there first to clear them.

If terrain rises into your footprint: carve in (AIR) or step the build up. If it drops: foundation blocks at negative Y, or raise the build. For "town"-style requests: several small buildings with paths.

Output ONLY JavaScript. No markdown fences, no prose. Just code:`;

async function botPlanWithAI(description, originX, originZ, originY) {
  // BFS sample must cover at least as much as the build limits so the model
  // can't extend into terrain it never saw.
  const RADIUS = 22, VRADIUS = 14;
  const geomCtx = describeLocalGeometry({ origin: [originX, originY, originZ], radius: RADIUS, vradius: VRADIUS });
  const { code, plan } = await planWithAI(AI_PROMPT(description, geomCtx, RADIUS, VRADIUS), {
    model: AI_MODEL, maxX: RADIUS, maxZ: RADIUS, maxY: VRADIUS * 2 + 5, minY: -8,
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
      let [x, yIn, z] = parseCoords(expandedCoords, defaults);
      // If y looks underground or unspecified-ish, snap to terrain surface
      const ground = terrainHeight(x, z) + 1;
      const y = (yIn < 5 || yIn < ground - 5) ? ground : yIn;

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
          console.error(`[AI error] ${description}:`, e.message);
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
      setIdle(8, 15); // hang out instead of immediately wandering off
      sendChat(`@ ${x},${y},${z}`);
      break;
    }

    case 'stop': {
      if (currentTask) currentTask.cancel = true;
      else sendChat('Nothing to stop.');
      setIdle(3, 6);
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
      // Drop bot onto the surface near spawn so it doesn't appear floating
      pos[1] = terrainHeight(Math.floor(pos[0]), Math.floor(pos[2])) + 1;
      setIdle(3, 6);
      nextAutoBuildAt = Date.now() + rand(AUTO_BUILD_MIN_S, AUTO_BUILD_MAX_S) * 1000;
      if (posInterval) clearInterval(posInterval);
      posInterval = setInterval(tick, 1000 / TICK_HZ);
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
