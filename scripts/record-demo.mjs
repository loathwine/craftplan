// Headless demo recorder. Spawns a static HTTP server for ./public, drives a
// headless Chromium via CDP, calls window.__demoFrame(t) once per frame, and
// captures PNG screenshots. ffmpeg then stitches them into MP4.
//
// Run inside `nix develop .#record` so chromium + ffmpeg are on PATH.
//
// Usage:
//   nix develop .#record --command node scripts/record-demo.mjs
//   node scripts/record-demo.mjs --fps 30 --duration 10 --out demo.mp4 --width 1280 --height 720
//   node scripts/record-demo.mjs --frames 5      # POC: capture just 5 frames

import http from 'node:http';
import { createReadStream, statSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { extname, resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import WebSocket from 'ws';

// --- Args -------------------------------------------------------------------
const argv = (() => {
  const a = {};
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const next = process.argv[i + 1];
      if (next && !next.startsWith('--')) { a[key] = next; i++; } else { a[key] = true; }
    }
  }
  return a;
})();

const FPS      = parseInt(argv.fps || '30');
const DURATION = parseFloat(argv.duration || '10');
const FRAMES   = parseInt(argv.frames || '0') || Math.round(FPS * DURATION);
const WIDTH    = parseInt(argv.width || '1280');
const HEIGHT   = parseInt(argv.height || '720');
const OUT      = resolve(argv.out || 'recordings/demo.mp4');
const FRAMES_DIR = resolve(argv['frames-dir'] || 'recordings/frames');
const KEEP     = !!argv.keep;
const NO_MP4   = !!argv['no-mp4'];

console.log(`[rec] ${FRAMES} frames at ${FPS}fps, ${WIDTH}x${HEIGHT} → ${OUT}`);

// --- Static server ----------------------------------------------------------
const PUBLIC_DIR = resolve('public');
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml',
};
const staticServer = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  let filePath = join(PUBLIC_DIR, urlPath === '/' ? '/index.html' : urlPath);
  if (!filePath.startsWith(PUBLIC_DIR)) { res.statusCode = 403; res.end(); return; }
  try {
    const st = statSync(filePath);
    if (st.isDirectory()) filePath = join(filePath, 'index.html');
    const ct = MIME[extname(filePath)] || 'application/octet-stream';
    res.setHeader('Content-Type', ct);
    createReadStream(filePath).pipe(res);
  } catch (e) {
    res.statusCode = 404; res.end(`Not found: ${urlPath}`);
  }
});
const STATIC_PORT = await new Promise((r) => staticServer.listen(0, () => r(staticServer.address().port)));
const PAGE_URL = `http://127.0.0.1:${STATIC_PORT}/?record=1&w=${WIDTH}&h=${HEIGHT}`;
console.log(`[rec] static: http://127.0.0.1:${STATIC_PORT}`);

// --- Output dir -------------------------------------------------------------
if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true, force: true });
mkdirSync(FRAMES_DIR, { recursive: true });
mkdirSync(resolve(OUT, '..'), { recursive: true });

// --- Spawn chromium ---------------------------------------------------------
const CDP_PORT = 9222 + Math.floor(Math.random() * 1000);
const profileDir = mkdtempSync(join(tmpdir(), 'craftplan-rec-'));
const chrome = spawn('chromium', [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--hide-scrollbars',
  '--mute-audio',
  '--disable-dev-shm-usage',
  '--no-first-run',
  '--enable-unsafe-swiftshader',
  '--use-gl=angle', '--use-angle=swiftshader',
  `--window-size=${WIDTH},${HEIGHT}`,
  `--remote-debugging-port=${CDP_PORT}`,
  `--user-data-dir=${profileDir}`,
  PAGE_URL,
], { stdio: ['ignore', 'pipe', 'pipe'] });

let chromeStderr = '';
chrome.stderr.on('data', (d) => { chromeStderr += d.toString(); });
chrome.on('exit', (code) => {
  if (code !== 0 && code !== null) console.error(`[rec] chromium exited ${code}\n${chromeStderr.slice(-2000)}`);
});

function cleanup() {
  try { chrome.kill('SIGKILL'); } catch {}
  try { staticServer.close(); } catch {}
  if (!KEEP) { try { rmSync(profileDir, { recursive: true, force: true }); } catch {} }
}
process.on('SIGINT', () => { cleanup(); process.exit(130); });

// --- Wait for CDP -----------------------------------------------------------
async function fetchJSON(url, retries = 100) {
  for (let i = 0; i < retries; i++) {
    try {
      const data = await new Promise((res, rej) => {
        const req = http.get(url, (r) => {
          let buf = '';
          r.on('data', (c) => buf += c);
          r.on('end', () => res(buf));
        });
        req.on('error', rej);
        req.setTimeout(800, () => req.destroy(new Error('timeout')));
      });
      return JSON.parse(data);
    } catch {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  throw new Error(`CDP not reachable at ${url}`);
}

console.log('[rec] waiting for chromium...');
const version = await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json/version`);
console.log(`[rec] ${version.Browser}`);

// Find the page target. Sometimes there are several (about:blank from a
// devtools setup); pick the one with our URL.
let targets = await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json`);
let pageTarget = targets.find(t => t.type === 'page' && t.url.includes(`:${STATIC_PORT}`));
for (let i = 0; i < 20 && !pageTarget; i++) {
  await new Promise(r => setTimeout(r, 200));
  targets = await fetchJSON(`http://127.0.0.1:${CDP_PORT}/json`);
  pageTarget = targets.find(t => t.type === 'page' && t.url.includes(`:${STATIC_PORT}`));
}
if (!pageTarget) throw new Error(`No page target found. Targets:\n${JSON.stringify(targets, null, 2)}`);

// --- CDP client -------------------------------------------------------------
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 1;
const onEvents = [];

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id != null) {
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(`${msg.error.code}: ${msg.error.message}`));
    else p.resolve(msg.result);
  } else if (msg.method) {
    for (const cb of onEvents) cb(msg);
  }
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise((r) => ws.once('open', r));

await send('Runtime.enable');
await send('Page.enable');
// Force the rendered viewport to exactly WIDTHxHEIGHT regardless of any
// chrome UI the headless browser still reserves.
await send('Emulation.setDeviceMetricsOverride', {
  width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false,
});

// Capture console + errors from the page so we can debug
onEvents.push((msg) => {
  if (msg.method === 'Runtime.consoleAPICalled') {
    const args = msg.params.args.map(a => a.value ?? a.description).join(' ');
    console.log(`[page:${msg.params.type}] ${args}`);
  } else if (msg.method === 'Runtime.exceptionThrown') {
    const e = msg.params.exceptionDetails;
    console.error(`[page:error] ${e.text} ${e.exception?.description || ''}`);
  }
});

// --- Wait for __demoReady ---------------------------------------------------
console.log('[rec] waiting for __demoReady...');
const READY_TIMEOUT_MS = 30000;
const readyStart = Date.now();
while (true) {
  const r = await send('Runtime.evaluate', { expression: 'window.__demoReady === true', returnByValue: true });
  if (r.result?.value === true) break;
  if (Date.now() - readyStart > READY_TIMEOUT_MS) throw new Error('demo never signalled ready');
  await new Promise(r => setTimeout(r, 100));
}
const state = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__demoState)', returnByValue: true });
console.log(`[rec] ready. ${state.result.value}`);

// --- Render & capture frames ------------------------------------------------
const t0 = Date.now();
for (let f = 0; f < FRAMES; f++) {
  const t = f / FPS;
  await send('Runtime.evaluate', { expression: `window.__demoFrame(${t})` });
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(FRAMES_DIR, `frame_${String(f).padStart(5, '0')}.png`), Buffer.from(shot.data, 'base64'));
  if (f % Math.max(1, Math.floor(FRAMES / 10)) === 0 || f === FRAMES - 1) {
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    process.stdout.write(`\r[rec] frame ${f + 1}/${FRAMES} (${elapsed}s)   `);
  }
}
console.log('\n[rec] capture done');

ws.close();

// --- ffmpeg -----------------------------------------------------------------
if (!NO_MP4) {
  console.log(`[rec] ffmpeg → ${OUT}`);
  const ff = spawn('ffmpeg', [
    '-y', '-framerate', String(FPS),
    '-i', join(FRAMES_DIR, 'frame_%05d.png'),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
    OUT,
  ], { stdio: ['ignore', 'inherit', 'inherit'] });
  await new Promise((r, rej) => ff.on('exit', (c) => c === 0 ? r() : rej(new Error(`ffmpeg exited ${c}`))));
}

cleanup();
console.log(`[rec] done. ${OUT}`);
process.exit(0);
