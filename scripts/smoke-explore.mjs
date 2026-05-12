// One-off smoke test: launch the static explore mode in headless chromium
// and grab a screenshot to verify it renders without server connectivity.
import http from 'node:http';
import { createReadStream, statSync, writeFileSync } from 'node:fs';
import { extname, resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import WebSocket from 'ws';

const PUBLIC_DIR = resolve('public');
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  const filePath = join(PUBLIC_DIR, urlPath === '/' ? '/index.html' : urlPath);
  try {
    const st = statSync(filePath);
    if (st.isDirectory()) return res.end();
    res.setHeader('Content-Type', MIME[extname(filePath)] || 'application/octet-stream');
    createReadStream(filePath).pipe(res);
  } catch { res.statusCode = 404; res.end(); }
});
const PORT = await new Promise(r => server.listen(0, () => r(server.address().port)));

const CDP_PORT = 9700 + Math.floor(Math.random() * 200);
const profileDir = mkdtempSync(join(tmpdir(), 'craftplan-smoke-'));
const chrome = spawn('chromium', [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
  '--window-size=1280,720',
  `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${profileDir}`,
  `http://127.0.0.1:${PORT}/?explore=demo`,
], { stdio: ['ignore', 'pipe', 'pipe'], detached: true });

const fetchJSON = async (url, tries = 50) => {
  for (let i = 0; i < tries; i++) {
    try {
      const data = await new Promise((res, rej) => {
        const req = http.get(url, (r) => { let b = ''; r.on('data', c => b += c); r.on('end', () => res(b)); });
        req.on('error', rej);
        req.setTimeout(500, () => req.destroy(new Error('timeout')));
      });
      return JSON.parse(data);
    } catch { await new Promise(r => setTimeout(r, 200)); }
  }
  throw new Error('CDP not reachable');
};

await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json/version`);
let targets = await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json`);
let target = targets.find(t => t.type === 'page' && t.url.includes(`:${PORT}`));
for (let i = 0; i < 20 && !target; i++) {
  await new Promise(r => setTimeout(r, 200));
  targets = await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json`);
  target = targets.find(t => t.type === 'page' && t.url.includes(`:${PORT}`));
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;
ws.on('message', (d) => {
  const msg = JSON.parse(d.toString());
  if (msg.id != null) {
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(msg.error.message));
    else p.resolve(msg.result);
  } else if (msg.method === 'Runtime.consoleAPICalled') {
    const args = msg.params.args.map(a => a.value ?? a.description).join(' ');
    console.log(`[page] ${args}`);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    console.error('[page error]', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
  }
});
function send(method, params = {}) {
  return new Promise((res, rej) => {
    const id = nextId++;
    pending.set(id, { resolve: res, reject: rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
}
await new Promise(r => ws.once('open', r));
await send('Runtime.enable');
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });

// Wait for snapshot to load + apply
await new Promise(r => setTimeout(r, 12000));

const shot = await send('Page.captureScreenshot', { format: 'png' });
writeFileSync('recordings/explore-smoke.png', Buffer.from(shot.data, 'base64'));
console.log('wrote recordings/explore-smoke.png');

try { process.kill(-chrome.pid, 'SIGKILL'); } catch {}
server.close();
process.exit(0);
