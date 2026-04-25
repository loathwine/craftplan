import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { planWithAI, SANDBOX_API_DOC } from './scripts/ai.mjs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const DATA_FILE = './data.json';
const AI_TASK_STRUCTURES = process.env.AI_TASK_STRUCTURES !== '0';
const TASK_AI_MODEL = process.env.TASK_AI_MODEL || 'claude-opus-4-7';

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
        enqueueTaskGen(id);
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

      case 'task_move': {
        const task = tasks.get(msg.id);
        if (!task) return;
        if (msg.position) {
          task.position = {
            x: Math.floor(msg.position.x),
            y: Math.floor(msg.position.y || 0),
            z: Math.floor(msg.position.z),
          };
        }
        if ([0, 90, 180, 270].includes(msg.rotation)) {
          task.rotation = msg.rotation;
        }
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

// --- AI task structure generation ---
const TASK_DIMS = {
  S:  { foot: 3, height: 5,  budget: 60 },
  M:  { foot: 5, height: 8,  budget: 120 },
  L:  { foot: 7, height: 12, budget: 250 },
  XL: { foot: 9, height: 18, budget: 500 },
};

const taskGenQueue = [];
let taskGenInFlight = 0;
const TASK_GEN_CONCURRENT = 2;

function taskPrompt(task) {
  const d = TASK_DIMS[task.size] || TASK_DIMS.M;
  const half = Math.floor(d.foot / 2);
  return `Design a small voxel building that visually represents this project task in a Minecraft-style world.

TASK:
  Name: "${task.name}"
  Description: ${task.description || '(none)'}
  Size: ${task.size}

The building must:
- Visually evoke the task's theme (e.g., security/auth → fortress/gate; database/data → silo/cylinder; UI → colorful house with windows; testing/CI → conveyor/tower; documentation → library/scroll; bug fix → broken thing being repaired). Use your judgment.
- Sit flat on the ground. Origin (0,0,0) is the center-bottom block.
- Stay within budget: footprint X,Z ∈ [-${half}, ${half}], height Y ∈ [0, ${d.height}], total ~${d.budget} blocks.
- Be recognizable, not abstract. People will walk up and inspect it.

You write JavaScript using these primitives, run in a sandbox:

${SANDBOX_API_DOC}

Output ONLY JavaScript code. No markdown fences, no prose, no comments before/after the code. Just code:`;
}

async function generateTaskStructure(task) {
  const d = TASK_DIMS[task.size] || TASK_DIMS.M;
  const half = Math.floor(d.foot / 2);
  const { code, plan } = await planWithAI(taskPrompt(task), {
    model: TASK_AI_MODEL,
    maxX: half + 1,
    maxZ: half + 1,
    maxY: d.height + 1,
  });
  console.log(`[task ${task.id.slice(0, 8)}] "${task.name}" → ${plan.length} blocks (${code.length} chars code)`);
  return plan;
}

function enqueueTaskGen(taskId) {
  if (!AI_TASK_STRUCTURES) return;
  taskGenQueue.push(taskId);
  pumpTaskGenQueue();
}

async function pumpTaskGenQueue() {
  while (taskGenInFlight < TASK_GEN_CONCURRENT && taskGenQueue.length > 0) {
    const taskId = taskGenQueue.shift();
    const task = tasks.get(taskId);
    if (!task || task.structure) continue;
    taskGenInFlight++;
    generateTaskStructure(task)
      .then(structure => {
        const t = tasks.get(taskId);
        if (!t) return;
        t.structure = structure;
        broadcast({ type: 'task_updated', task: t });
      })
      .catch(e => console.error(`[task ${taskId.slice(0, 8)}] gen failed: ${e.message}`))
      .finally(() => { taskGenInFlight--; pumpTaskGenQueue(); });
  }
}

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

// --- JIRA Import ---
app.post('/api/jira/import', async (req, res) => {
  const { url, email, token, jql } = req.body;
  if (!url || !email || !token || !jql) {
    return res.status(400).json({ error: 'Missing fields: url, email, token, jql' });
  }

  try {
    const baseUrl = url.replace(/\/+$/, '');
    const auth = Buffer.from(`${email}:${token}`).toString('base64');
    console.log(`  JIRA import: url=${baseUrl} jql="${jql}"`);
    const searchUrl = `${baseUrl}/rest/api/3/search/jql`;

    const resp = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jql,
        maxResults: 100,
        fields: ['summary', 'description', 'status', 'issuetype', 'customfield_10016', 'priority', 'key', 'parent', 'subtasks'],
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`  JIRA API ${resp.status}: ${searchUrl}\n  ${body.slice(0, 500)}`);
      return res.status(resp.status).json({ error: `JIRA ${resp.status}: ${body.slice(0, 200)}` });
    }

    const data = await resp.json();
    const issues = data.issues || [];
    console.log(`  JIRA: ${issues.length} issues fetched`);

    // --- Build parent/child tree ---
    const issueMap = new Map();       // jira id -> issue
    const childrenOf = new Map();     // jira id -> [jira ids]

    for (const issue of issues) {
      const f = issue.fields || {};
      issueMap.set(issue.id, issue);
      const parentId = f.parent?.id;
      if (parentId) {
        if (!childrenOf.has(parentId)) childrenOf.set(parentId, []);
        childrenOf.get(parentId).push(issue.id);
      }
    }

    // Top-level = no parent in our result set
    const topLevel = issues.filter(i => {
      const pid = i.fields?.parent?.id;
      return !pid || !issueMap.has(pid);
    });

    // --- Helper: extract description text ---
    function extractDesc(f) {
      if (typeof f.description === 'string') return f.description;
      if (f.description?.content) {
        const walk = (n) => n.text || (n.content || []).map(walk).join(' ');
        return walk(f.description);
      }
      return '';
    }

    // --- Helper: map status ---
    function mapStatus(f) {
      const key = f.status?.statusCategory?.key || 'new';
      if (key === 'done') return 'done';
      if (key === 'indeterminate') return 'wip';
      return 'todo';
    }

    // --- Helper: create task from issue ---
    function makeTask(issue, size, x, z) {
      const f = issue.fields || {};
      return {
        id: randomUUID(),
        name: `${issue.key || ''}: ${(f.summary || 'Untitled').slice(0, 50)}`,
        description: extractDesc(f).slice(0, 200),
        size,
        status: mapStatus(f),
        position: { x, y: 0, z },
        createdBy: 'JIRA Import',
        jiraKey: issue.key,
      };
    }

    // --- Size based on child count ---
    function sizeByChildren(issueId) {
      const n = (childrenOf.get(issueId) || []).length;
      if (n >= 8) return 'XL';
      if (n >= 4) return 'L';
      if (n >= 1) return 'M';
      return 'S';
    }

    // --- Place in clusters: parent + children around it ---
    const created = [];
    let gridIdx = 0;

    for (const parent of topLevel) {
      const col = gridIdx % 6;
      const row = Math.floor(gridIdx / 6);
      const px = 25 + col * 14;
      const pz = 25 + row * 14;

      const parentTask = makeTask(parent, sizeByChildren(parent.id), px, pz);
      tasks.set(parentTask.id, parentTask);
      created.push(parentTask);

      // Place children around parent
      const children = childrenOf.get(parent.id) || [];
      for (let ci = 0; ci < children.length; ci++) {
        const child = issueMap.get(children[ci]);
        if (!child) continue;
        const angle = (ci / Math.max(children.length, 1)) * Math.PI * 2;
        const dist = 5;
        const cx = px + Math.round(Math.cos(angle) * dist);
        const cz = pz + Math.round(Math.sin(angle) * dist);

        const childTask = makeTask(child, 'S', cx, cz);
        tasks.set(childTask.id, childTask);
        created.push(childTask);
      }
      gridIdx++;
    }

    saveState();
    for (const task of created) {
      broadcast({ type: 'task_created', task });
      enqueueTaskGen(task.id);
    }

    console.log(`  Imported ${created.length} tasks (${topLevel.length} parents, ${created.length - topLevel.length} children)`);
    res.json({ ok: true, imported: created.length, parents: topLevel.length });
  } catch (err) {
    console.error('JIRA import error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n  CraftPlan running at http://localhost:${PORT}\n`);
});
