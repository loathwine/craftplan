// Headless recording mode. Activated by ?record=1.
//
// Reads the manuscript (public/js/manuscript.mjs), fetches every referenced
// plan from public/data/plans/, and compiles them into a global timeline.
// The page exposes:
//   window.__demoReady   -- true once world + plans are loaded
//   window.__demoFrame(t) -- update world/bots/camera/overlays for time t (s)
//   window.__demoState   -- { width, height, duration, fps }
//
// The page never reads a wall clock; the recorder is the clock.
import * as THREE from 'three';
import { World } from './World.js';
import { TaskManager } from './TaskManager.js';
import { MANUSCRIPT } from './manuscript.mjs';

const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpVec = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

// ---------------------------------------------------------------------------
// Camera path: each shot's camera spec → function(localT) -> { pos, look }
// ---------------------------------------------------------------------------
function makeCameraPath(spec, duration) {
  switch (spec.type) {
    case 'orbit': {
      const { center, radius, height, startAngle, endAngle } = spec;
      return (t) => {
        const f = duration > 0 ? ease(Math.min(1, Math.max(0, t / duration))) : 0;
        const a = startAngle + (endAngle - startAngle) * f;
        return {
          pos: [center[0] + radius * Math.cos(a), center[1] + height, center[2] + radius * Math.sin(a)],
          look: center,
        };
      };
    }
    case 'dolly': {
      const { from, to, lookFrom, lookTo } = spec;
      const look0 = lookFrom, look1 = lookTo || lookFrom;
      return (t) => {
        const f = duration > 0 ? ease(Math.min(1, Math.max(0, t / duration))) : 0;
        return { pos: lerpVec(from, to, f), look: lerpVec(look0, look1, f) };
      };
    }
    case 'still':
      return () => ({ pos: spec.pos, look: spec.look });
    default:
      throw new Error(`Unknown camera type: ${spec.type}`);
  }
}

// ---------------------------------------------------------------------------
// Bot avatar: small humanoid (body + head + name sprite)
// ---------------------------------------------------------------------------
function makeBotAvatar(name, color = 0x4ade80) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1.2, 0.35),
    new THREE.MeshLambertMaterial({ color }),
  );
  body.position.y = 0.6;
  g.add(body);
  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42),
    new THREE.MeshLambertMaterial({ color: 0xffcc88 }),
  );
  head.position.y = 1.42;
  g.add(head);
  // Name sprite
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(0, 0, 256, 64, 10); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  const tagMat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const tag = new THREE.Sprite(tagMat);
  tag.position.y = 2.0;
  tag.scale.set(2.5, 0.625, 1);
  tag.renderOrder = 1;
  g.add(tag);
  return g;
}

// ---------------------------------------------------------------------------
// Overlay (DOM): prompt text card
// ---------------------------------------------------------------------------
function ensureOverlay() {
  let el = document.getElementById('demo-rec-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'demo-rec-overlay';
    Object.assign(el.style, {
      position: 'fixed', left: '50%', top: '40px', transform: 'translateX(-50%)',
      padding: '14px 28px', borderRadius: '12px', background: 'rgba(0,0,0,0.6)',
      color: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '28px',
      fontWeight: 600, letterSpacing: '0.5px', opacity: 0, pointerEvents: 'none',
      backdropFilter: 'blur(6px)', textShadow: '0 2px 6px rgba(0,0,0,0.5)',
    });
    document.body.appendChild(el);
  }
  return el;
}

function overlayOpacity(o, localT) {
  if (!o || localT < o.t0 || localT > o.t1) return 0;
  const fadeIn = o.fadeIn ?? 0.3;
  const fadeOut = o.fadeOut ?? 0.6;
  const sinceStart = localT - o.t0;
  const tillEnd = o.t1 - localT;
  if (sinceStart < fadeIn) return sinceStart / fadeIn;
  if (tillEnd < fadeOut) return Math.max(0, tillEnd / fadeOut);
  return 1;
}

// ---------------------------------------------------------------------------
// Build replay: a shot's `build` is compiled to (event[], botMotion(localT)).
// ---------------------------------------------------------------------------
async function fetchPlan(slug) {
  const r = await fetch(`/data/plans/${slug}.json`);
  if (!r.ok) throw new Error(`failed to load plan ${slug}: ${r.status}`);
  return r.json();
}

function compileBuild(buildSpec, planJson) {
  const { startT, endT, bot } = buildSpec;
  const span = Math.max(0.001, endT - startT);
  const origin = planJson.origin;
  // Sort by Y so the build grows bottom-up; small visual win.
  const ordered = [...planJson.plan].sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
  const events = ordered.map((b, i) => ({
    t: startT + (span * i) / ordered.length,
    x: origin.x + b.x, y: origin.y + b.y, z: origin.z + b.z,
    block: b.block,
  }));
  const radius = buildSpec.botRadius ?? 5;
  const heightOff = buildSpec.botHeight ?? 3;
  // Bot orbits the most recently placed block at a soft radius
  function botAt(localT) {
    if (localT <= startT || events.length === 0) {
      return { pos: [origin.x + radius, origin.y + heightOff, origin.z], look: [origin.x, origin.y, origin.z] };
    }
    // Find current block index based on progress through the build
    const progress = Math.min(1, (localT - startT) / span);
    const idx = Math.min(events.length - 1, Math.floor(progress * events.length));
    const b = events[idx];
    const orbit = 0.6 * localT; // gentle spin
    return {
      pos: [b.x + radius * Math.cos(orbit), b.y + heightOff, b.z + radius * Math.sin(orbit)],
      look: [b.x, b.y, b.z],
    };
  }
  return { events, botAt, botName: bot };
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
export async function startRecorder() {
  // Hide live-mode UI
  for (const id of ['join-screen', 'hud', 'task-panel', 'chat', 'task-detail']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';
  document.body.style.background = '#000';

  const W = MANUSCRIPT.width, H = MANUSCRIPT.height;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8e3);
  scene.fog = new THREE.Fog(0x7ec8e3, 60, 200);

  const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 400);
  const canvas = document.getElementById('game');
  canvas.width = W; canvas.height = H;
  canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(W, H, false);
  renderer.setPixelRatio(1);

  scene.add(new THREE.AmbientLight(0x808080));
  const sun = new THREE.DirectionalLight(0xfff4e0, 0.85);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x87CEEB, 0x556633, 0.45));

  const world = new World(scene);
  const _tm = new TaskManager(scene, world); // empty, for parity

  // Apply pre-timeline setup (e.g. clear forest at build sites). Batched
  // through applyBlockChanges so chunks rebuild once instead of per-cell.
  if (MANUSCRIPT.setup) {
    const bulk = {};
    for (const op of MANUSCRIPT.setup) {
      if (op.type === 'clear') {
        const [x0, y0, z0] = op.min, [x1, y1, z1] = op.max;
        for (let x = x0; x <= x1; x++)
          for (let y = y0; y <= y1; y++)
            for (let z = z0; z <= z1; z++)
              bulk[`${x},${y},${z}`] = 0;
      }
    }
    if (Object.keys(bulk).length) world.applyBlockChanges(bulk);
  }

  // Compile shots → global timeline
  const shots = [];
  const bots = new Map(); // botName -> avatar group
  let totalDuration = 0;
  for (const s of MANUSCRIPT.shots) {
    const start = totalDuration;
    const shot = {
      ...s,
      start,
      end: start + s.duration,
      cameraFn: makeCameraPath(s.camera, s.duration),
    };
    if (s.build) {
      const planJson = await fetchPlan(s.build.plan);
      const compiled = compileBuild(s.build, planJson);
      shot.events = compiled.events;
      shot.appliedIdx = 0;
      shot.botFn = compiled.botAt;
      shot.botName = compiled.botName;
      if (!bots.has(compiled.botName)) {
        const avatar = makeBotAvatar(compiled.botName);
        avatar.visible = false;
        scene.add(avatar);
        bots.set(compiled.botName, avatar);
      }
    }
    shots.push(shot);
    totalDuration += s.duration;
  }

  const overlayEl = ensureOverlay();

  // Track which shot's events we've applied. Recorder is forward-only.
  let lastT = -1;

  function frame(t) {
    // Find current shot
    let shot = shots[shots.length - 1];
    for (const s of shots) { if (t < s.end) { shot = s; break; } }
    const localT = Math.max(0, t - shot.start);

    // Apply pending world events (forward only). If the recorder skips back,
    // events from later shots may already have been applied; that's fine —
    // we'd reload the page for a rewind.
    if (shot.events && shot.appliedIdx < shot.events.length) {
      while (shot.appliedIdx < shot.events.length && shot.events[shot.appliedIdx].t <= localT) {
        const e = shot.events[shot.appliedIdx++];
        world.setBlock(e.x, e.y, e.z, e.block);
      }
    }

    // Camera
    const { pos, look } = shot.cameraFn(localT);
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(look[0], look[1], look[2]);

    // Bots: hide all, then position the active one
    for (const av of bots.values()) av.visible = false;
    if (shot.botFn && shot.botName) {
      const av = bots.get(shot.botName);
      if (av) {
        const { pos: bp, look: bl } = shot.botFn(localT);
        av.position.set(bp[0], bp[1], bp[2]);
        // Yaw toward look target
        const dx = bl[0] - bp[0], dz = bl[2] - bp[2];
        av.rotation.y = Math.atan2(dx, dz);
        av.visible = true;
      }
    }

    // Overlay
    const op = overlayOpacity(shot.overlay, localT);
    if (op > 0) {
      overlayEl.textContent = shot.overlay.html;
      overlayEl.style.opacity = op;
    } else {
      overlayEl.style.opacity = 0;
    }

    renderer.render(scene, camera);
    lastT = t;
  }

  // Render one frame at t=0 so the first screenshot is valid
  frame(0);

  window.__demoFrame = frame;
  window.__demoState = { width: W, height: H, duration: totalDuration, fps: MANUSCRIPT.fps };
  window.__demoReady = true;
}
