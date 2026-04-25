// Populate a fresh demo world with thoughtful tasks (and optionally bot builds).
// Each task auto-triggers server-side AI structure generation, so after running
// this and waiting a few minutes, the world is full of unique buildings.
//
// Usage:
//   nix develop --command node scripts/setup-demo-world.mjs
//   nix develop --command node scripts/setup-demo-world.mjs --with-builds   # also issue @Claude build commands
import WebSocket from 'ws';

const HOST = process.env.HOST || 'localhost:3000';
const WITH_BUILDS = process.argv.includes('--with-builds');

// Tasks chosen so the AI prompt produces visually distinct, recognizable buildings.
// Spread across a clearing area in the world.
const tasks = [
  // Main row (north)
  { name: 'Implement OAuth 2.0',        description: 'Add SSO + 2FA auth flow',                              size: 'L',  pos: { x: 130, y: 0, z: 110 } },
  { name: 'Database migration v2',      description: 'Migrate user table to new schema with zero downtime', size: 'L',  pos: { x: 145, y: 0, z: 110 } },
  { name: 'Frontend redesign',          description: 'New design system, new colors, new components',      size: 'M',  pos: { x: 160, y: 0, z: 110 } },
  // Middle row
  { name: 'Q4 marketing launch',        description: 'Big product launch with PR, ads, and a website',     size: 'XL', pos: { x: 130, y: 0, z: 130 } },
  { name: 'Fix critical login bug',     description: 'Users cannot log in on Safari',                       size: 'S',  pos: { x: 150, y: 0, z: 128 } },
  { name: 'API documentation',          description: 'Generate OpenAPI specs and a docs site',             size: 'M',  pos: { x: 160, y: 0, z: 130 } },
  // South row
  { name: 'Deploy to production',       description: 'Roll out v3 to all customers',                       size: 'M',  pos: { x: 132, y: 0, z: 148 } },
  { name: 'Team retrospective',         description: 'Sprint retro with whole team',                       size: 'S',  pos: { x: 145, y: 0, z: 148 } },
  { name: 'Performance optimization',   description: 'Reduce p99 latency to under 100ms',                  size: 'M',  pos: { x: 158, y: 0, z: 148 } },
];

// Optional: bot landmark builds
const builds = [
  { what: 'a grand wizard tower with a glowing top',  pos: { x: 110, y: 0, z: 130 } },
  { what: 'a stone bridge over a small pond',         pos: { x: 178, y: 0, z: 130 } },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const ws = new WebSocket(`ws://${HOST}`);

ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'join', name: 'DemoSetup' }));
});

ws.on('message', async (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.type !== 'welcome') return;

  console.log(`Connected. Creating ${tasks.length} tasks...`);
  for (const t of tasks) {
    ws.send(JSON.stringify({
      type: 'task_create',
      name: t.name,
      description: t.description,
      size: t.size,
      position: t.pos,
    }));
    process.stdout.write(`  + ${t.name} [${t.size}] @ (${t.pos.x},${t.pos.z})\n`);
    await sleep(150);
  }

  if (WITH_BUILDS) {
    console.log('\nIssuing bot build commands...');
    for (const b of builds) {
      const text = `@Claude build ${b.what} ${b.pos.x} ${b.pos.y} ${b.pos.z}`;
      ws.send(JSON.stringify({ type: 'chat', message: text }));
      console.log(`  > ${text}`);
      await sleep(60000); // give the bot time to finish before the next request
    }
  }

  console.log('\nDone. Server-side AI generation will run in the background.');
  console.log('With AI_TASK_STRUCTURES=1 (default), tasks gradually become unique buildings.');
  setTimeout(() => { ws.close(); process.exit(0); }, 800);
});

ws.on('error', (e) => { console.error('WS error:', e.message); process.exit(1); });
