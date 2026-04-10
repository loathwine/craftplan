import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const DATA_FILE = './data.json';

app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

// --- Game State ---
const players = new Map();   // id -> { id, name, position, rotation, color, ws }
const tasks = new Map();     // id -> { id, name, description, size, status, position, createdBy }
const blockChanges = new Map(); // "x,y,z" -> blockType (0=removed)

let nextTaskSlot = 0;

function getTaskPosition() {
  const col = nextTaskSlot % 6;
  const row = Math.floor(nextTaskSlot / 6);
  nextTaskSlot++;
  return { x: 78 + col * 10, y: 0, z: 78 + row * 10 };
}

function broadcast(msg, excludeId = null) {
  const data = JSON.stringify(msg);
  for (const [id, p] of players) {
    if (id !== excludeId && p.ws.readyState === 1) {
      p.ws.send(data);
    }
  }
}

function playerInfo(p) {
  return { id: p.id, name: p.name, position: p.position, rotation: p.rotation, color: p.color };
}

wss.on('connection', (ws) => {
  let playerId = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'join': {
        playerId = randomUUID();
        const hue = Math.floor(Math.random() * 360);
        const player = {
          id: playerId,
          name: (msg.name || 'Steve').slice(0, 20),
          position: [64, 30, 64],
          rotation: [0, 0],
          color: `hsl(${hue}, 70%, 55%)`,
          ws,
        };
        players.set(playerId, player);

        ws.send(JSON.stringify({
          type: 'welcome',
          id: playerId,
          color: player.color,
          players: [...players.values()].filter(p => p.id !== playerId).map(playerInfo),
          tasks: [...tasks.values()],
          blockChanges: Object.fromEntries(blockChanges),
        }));

        broadcast({ type: 'player_join', player: playerInfo(player) }, playerId);
        console.log(`[+] ${player.name} joined (${players.size} online)`);
        break;
      }

      case 'move': {
        const p = players.get(playerId);
        if (!p) return;
        p.position = msg.position;
        p.rotation = msg.rotation;
        broadcast({ type: 'player_move', id: playerId, position: msg.position, rotation: msg.rotation }, playerId);
        break;
      }

      case 'chat': {
        const p = players.get(playerId);
        if (!p || !msg.message) return;
        broadcast({ type: 'chat', id: playerId, name: p.name, message: msg.message.slice(0, 200) });
        break;
      }

      case 'block_break': {
        const key = `${msg.x},${msg.y},${msg.z}`;
        blockChanges.set(key, 0);
        broadcast({ type: 'block_update', x: msg.x, y: msg.y, z: msg.z, block: 0 });
        break;
      }

      case 'block_place': {
        const key = `${msg.x},${msg.y},${msg.z}`;
        blockChanges.set(key, msg.block);
        broadcast({ type: 'block_update', x: msg.x, y: msg.y, z: msg.z, block: msg.block });
        break;
      }

      case 'task_create': {
        const id = randomUUID();
        const pos = msg.position || getTaskPosition();
        const task = {
          id,
          name: (msg.name || 'Untitled').slice(0, 50),
          description: (msg.description || '').slice(0, 200),
          size: ['S', 'M', 'L', 'XL'].includes(msg.size) ? msg.size : 'M',
          status: 'todo',
          position: { x: Math.floor(pos.x), y: Math.floor(pos.y), z: Math.floor(pos.z) },
          createdBy: players.get(playerId)?.name || 'Unknown',
        };
        tasks.set(id, task);
        broadcast({ type: 'task_created', task });
        break;
      }

      case 'task_update': {
        const task = tasks.get(msg.id);
        if (!task) return;
        if (msg.status && ['todo', 'wip', 'done', 'blocked'].includes(msg.status)) {
          task.status = msg.status;
        }
        if (msg.name) task.name = msg.name.slice(0, 50);
        if (msg.description !== undefined) task.description = msg.description.slice(0, 200);
        broadcast({ type: 'task_updated', task });
        break;
      }

      case 'task_delete': {
        if (tasks.has(msg.id)) {
          tasks.delete(msg.id);
          broadcast({ type: 'task_deleted', id: msg.id });
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    if (playerId) {
      const name = players.get(playerId)?.name;
      players.delete(playerId);
      broadcast({ type: 'player_leave', id: playerId });
      console.log(`[-] ${name} left (${players.size} online)`);
    }
  });
});

// --- Persistence ---
function loadState() {
  try {
    const data = JSON.parse(readFileSync(DATA_FILE, 'utf8'));
    for (const t of data.tasks || []) tasks.set(t.id, t);
    for (const [k, v] of Object.entries(data.blockChanges || {})) blockChanges.set(k, v);
    nextTaskSlot = data.nextTaskSlot || 0;
    console.log(`  Loaded ${tasks.size} tasks, ${blockChanges.size} block changes`);
  } catch { console.log('  No saved state, starting fresh'); }
}

function saveState() {
  try {
    writeFileSync(DATA_FILE, JSON.stringify({
      tasks: [...tasks.values()],
      blockChanges: Object.fromEntries(blockChanges),
      nextTaskSlot,
    }));
  } catch (e) { console.error('Save failed:', e.message); }
}

loadState();
setInterval(saveState, 30000);
process.on('SIGINT', () => { saveState(); console.log('\n  Saved. Bye!'); process.exit(); });
process.on('SIGTERM', () => { saveState(); process.exit(); });

// --- Export / Import API ---
app.get('/api/export', (_req, res) => {
  res.setHeader('Content-Disposition', 'attachment; filename="craftplan-export.json"');
  res.json({ tasks: [...tasks.values()], blockChanges: Object.fromEntries(blockChanges) });
});

app.post('/api/import', (req, res) => {
  const data = req.body;
  if (!data?.tasks) return res.status(400).json({ error: 'Invalid data' });
  tasks.clear();
  blockChanges.clear();
  for (const t of data.tasks) tasks.set(t.id, t);
  for (const [k, v] of Object.entries(data.blockChanges || {})) blockChanges.set(k, v);
  saveState();
  broadcast({ type: 'world_reset' });
  res.json({ ok: true, tasks: tasks.size, blocks: blockChanges.size });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  CraftPlan running at http://localhost:${PORT}\n`);
});
