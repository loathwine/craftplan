// Headless recording mode. Activated by ?record=1.
//
// Reads the manuscript (public/js/manuscript.mjs), fetches every referenced
// plan from public/data/plans/, and compiles them into a global timeline.
// The page exposes:
//   window.__demoReady   -- true once world + plans are loaded
//   window.__demoFrame(t) -- update world/avatars/camera/overlays for time t
//   window.__demoState   -- { width, height, duration, fps }
//
// The page never reads a wall clock; the recorder is the clock.
import * as THREE from 'three';
import { World } from './World.js';
import { TaskManager } from './TaskManager.js';
import { MANUSCRIPT } from './manuscript.mjs';
import { terrainHeight } from './terrain.js';
import { makeAvatar, setExpression, setTagVisible } from './avatar.js';

const ease = (t) => t * t * (3 - 2 * t);
const lerp = (a, b, t) => a + (b - a) * t;
const lerpVec = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clamp01 = (t) => Math.max(0, Math.min(1, t));

// ---------------------------------------------------------------------------
// Camera path: each shot's camera spec → function(localT) -> { pos, look }
// ---------------------------------------------------------------------------
function makeCameraPath(spec, duration) {
  switch (spec.type) {
    case 'orbit': {
      const { center, radius, height, startAngle, endAngle } = spec;
      return (t) => {
        const f = duration > 0 ? ease(clamp01(t / duration)) : 0;
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
        const f = duration > 0 ? ease(clamp01(t / duration)) : 0;
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
// Overlays (DOM): prompt card (top), dialog/subtitle (bottom), title (center)
// ---------------------------------------------------------------------------
function ensureOverlays() {
  let prompt = document.getElementById('demo-rec-prompt');
  if (!prompt) {
    prompt = document.createElement('div');
    prompt.id = 'demo-rec-prompt';
    Object.assign(prompt.style, {
      position: 'fixed', left: '50%', top: '40px', transform: 'translateX(-50%)',
      padding: '14px 28px', borderRadius: '12px', background: 'rgba(0,0,0,0.6)',
      color: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '28px',
      fontWeight: 600, letterSpacing: '0.5px', opacity: 0, pointerEvents: 'none',
      textShadow: '0 2px 6px rgba(0,0,0,0.5)', maxWidth: '90%', textAlign: 'center',
    });
    document.body.appendChild(prompt);
  }
  let dialog = document.getElementById('demo-rec-dialog');
  if (!dialog) {
    dialog = document.createElement('div');
    dialog.id = 'demo-rec-dialog';
    Object.assign(dialog.style, {
      position: 'fixed', left: '50%', bottom: '60px', transform: 'translateX(-50%)',
      padding: '12px 22px', borderRadius: '6px', background: 'rgba(0,0,0,0.7)',
      color: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '24px',
      fontWeight: 500, opacity: 0, pointerEvents: 'none', maxWidth: '80%',
      textAlign: 'center', borderLeft: '4px solid #4ade80',
    });
    document.body.appendChild(dialog);
  }
  let title = document.getElementById('demo-rec-title');
  if (!title) {
    title = document.createElement('div');
    title.id = 'demo-rec-title';
    Object.assign(title.style, {
      position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
      color: '#fff', fontFamily: 'system-ui, sans-serif', fontSize: '64px',
      fontWeight: 800, letterSpacing: '2px', opacity: 0, pointerEvents: 'none',
      textShadow: '0 4px 16px rgba(0,0,0,0.7)', textAlign: 'center',
    });
    document.body.appendChild(title);
  }
  let fader = document.getElementById('demo-rec-fader');
  if (!fader) {
    fader = document.createElement('div');
    fader.id = 'demo-rec-fader';
    Object.assign(fader.style, {
      position: 'fixed', inset: 0, background: '#000', opacity: 0,
      pointerEvents: 'none', zIndex: 100,
    });
    document.body.appendChild(fader);
  }
  return { prompt, dialog, title, fader };
}

function overlayOpacity(o, localT) {
  if (!o) return 0;
  const t0 = o.t0 ?? 0, t1 = o.t1 ?? Infinity;
  if (localT < t0 || localT > t1) return 0;
  const fadeIn = o.fadeIn ?? 0.3;
  const fadeOut = o.fadeOut ?? 0.6;
  const sinceStart = localT - t0;
  const tillEnd = t1 - localT;
  if (sinceStart < fadeIn) return sinceStart / fadeIn;
  if (tillEnd < fadeOut) return Math.max(0, tillEnd / fadeOut);
  return 1;
}

// ---------------------------------------------------------------------------
// Build replay: a shot's `build` is compiled to events + bot motion.
// ---------------------------------------------------------------------------
async function fetchPlan(slug) {
  const r = await fetch(`/data/plans/${slug}.json`);
  if (!r.ok) throw new Error(`failed to load plan ${slug}: ${r.status}`);
  return r.json();
}

function compileBuild(buildSpec, planJson) {
  const { startT, endT, bot } = buildSpec;
  const span = Math.max(0.001, endT - startT);
  const origin = buildSpec.origin
    ? { x: buildSpec.origin[0], y: buildSpec.origin[1], z: buildSpec.origin[2] }
    : planJson.origin;
  const rotY = buildSpec.rotateY ? Math.round(buildSpec.rotateY / (Math.PI / 2)) & 3 : 0;
  const rotate = ([x, z]) => {
    switch (rotY) {
      case 1: return [-z, x];
      case 2: return [-x, -z];
      case 3: return [z, -x];
      default: return [x, z];
    }
  };
  const rotated = planJson.plan.map(b => {
    const [rx, rz] = rotate([b.x, b.z]);
    return { x: rx, y: b.y, z: rz, block: b.block };
  });
  const ordered = rotated.sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
  const events = ordered.map((b, i) => ({
    t: startT + (span * i) / ordered.length,
    x: origin.x + b.x, y: origin.y + b.y, z: origin.z + b.z,
    block: b.block,
  }));
  const radius = buildSpec.botRadius ?? 5;
  const heightOff = buildSpec.botHeight ?? 3;
  function botAt(localT, cameraPos) {
    if (localT <= startT || events.length === 0) {
      return { pos: [origin.x + radius, origin.y + heightOff, origin.z], look: [origin.x, origin.y, origin.z] };
    }
    const progress = clamp01((localT - startT) / span);
    const idx = Math.min(events.length - 1, Math.floor(progress * events.length));
    const b = events[idx];
    if (cameraPos) {
      const toCamX = cameraPos[0] - b.x, toCamZ = cameraPos[2] - b.z;
      const len = Math.hypot(toCamX, toCamZ) || 1;
      const ux = toCamX / len, uz = toCamZ / len;
      const perpX = -uz, perpZ = ux;
      const swing = Math.sin(localT * 0.5);
      const front = radius * 0.6;
      const side = radius * 0.6 * swing;
      return {
        pos: [b.x + ux * front + perpX * side, b.y + heightOff, b.z + uz * front + perpZ * side],
        look: [b.x, b.y, b.z],
      };
    }
    const orbit = 0.6 * localT;
    return {
      pos: [b.x + radius * Math.cos(orbit), b.y + heightOff, b.z + radius * Math.sin(orbit)],
      look: [b.x, b.y, b.z],
    };
  }
  return { events, botAt, botName: bot };
}

// ---------------------------------------------------------------------------
// Avatar registry: one persistent group per character in the scene.
// ---------------------------------------------------------------------------
function buildAvatarRegistry(scene) {
  const defs = MANUSCRIPT.avatars || {};
  const reg = new Map();
  for (const [name, def] of Object.entries(defs)) {
    const av = makeAvatar({ name, ...def });
    av.visible = false;
    scene.add(av);
    reg.set(name, av);
  }
  // Ensure any bot referenced by a build but not declared in MANUSCRIPT.avatars
  // still gets a default avatar.
  function ensure(name) {
    if (reg.has(name)) return reg.get(name);
    const av = makeAvatar({ name });
    av.visible = false;
    scene.add(av);
    reg.set(name, av);
    return av;
  }
  return { reg, ensure };
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------
export async function startRecorder() {
  for (const id of ['join-screen', 'hud', 'task-panel', 'chat', 'task-detail']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';
  document.body.style.background = '#000';

  // URL params win so the headless recorder can request a specific render
  // size without us re-publishing the manuscript.
  const params = new URLSearchParams(location.search);
  const W = parseInt(params.get('w')) || MANUSCRIPT.width;
  const H = parseInt(params.get('h')) || MANUSCRIPT.height;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8e3);
  scene.fog = new THREE.Fog(0x7ec8e3, 120, 360);

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
  const _tm = new TaskManager(scene, world);

  // Apply pre-timeline setup (clear forest at build sites etc.)
  if (MANUSCRIPT.setup) {
    const bulk = {};
    for (const op of MANUSCRIPT.setup) {
      if (op.type === 'clear') {
        const [x0, y0, z0] = op.min, [x1, y1, z1] = op.max;
        for (let x = x0; x <= x1; x++)
          for (let y = y0; y <= y1; y++)
            for (let z = z0; z <= z1; z++)
              bulk[`${x},${y},${z}`] = 0;
      } else if (op.type === 'clearAboveGround') {
        const [x0, z0] = op.min, [x1, z1] = op.max, topY = op.topY;
        for (let x = x0; x <= x1; x++) {
          for (let z = z0; z <= z1; z++) {
            const h = terrainHeight(x, z);
            for (let y = h + 1; y <= topY; y++) bulk[`${x},${y},${z}`] = 0;
          }
        }
      } else if (op.type === 'block') {
        bulk[`${op.x},${op.y},${op.z}`] = op.block;
      }
    }
    if (Object.keys(bulk).length) world.applyBlockChanges(bulk);
  }

  // Avatars
  const avatars = buildAvatarRegistry(scene);

  // Compile shots → global timeline
  const shots = [];
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
      avatars.ensure(compiled.botName);
    }
    // Pre-sort explicit events if the shot provides them directly
    if (s.events && !shot.events) {
      shot.events = [...s.events].sort((a, b) => a.t - b.t);
      shot.appliedIdx = 0;
    } else if (s.events && shot.events) {
      // Both build and explicit events: merge
      shot.events = [...shot.events, ...s.events].sort((a, b) => a.t - b.t);
      shot.appliedIdx = 0;
    }
    shots.push(shot);
    totalDuration += s.duration;
  }

  const overlays = ensureOverlays();

  function frame(t) {
    // Find current shot
    let shot = shots[shots.length - 1];
    for (const s of shots) { if (t < s.end) { shot = s; break; } }
    const localT = Math.max(0, t - shot.start);

    // Apply pending world events (batched)
    if (shot.events && shot.appliedIdx < shot.events.length) {
      const batch = {};
      let n = 0;
      while (shot.appliedIdx < shot.events.length && shot.events[shot.appliedIdx].t <= localT) {
        const e = shot.events[shot.appliedIdx++];
        batch[`${e.x},${e.y},${e.z}`] = e.block;
        n++;
      }
      if (n > 0) world.applyBlockChanges(batch);
    }

    // Camera
    const cam = shot.cameraFn(localT);
    camera.position.set(cam.pos[0], cam.pos[1], cam.pos[2]);
    camera.lookAt(cam.look[0], cam.look[1], cam.look[2]);

    // Hide all avatars, then position the active ones for this shot
    for (const av of avatars.reg.values()) av.visible = false;

    // Build-driven bot (montage shots)
    if (shot.botFn && shot.botName) {
      const av = avatars.ensure(shot.botName);
      const { pos: bp, look: bl } = shot.botFn(localT, cam.pos);
      av.position.set(bp[0], bp[1], bp[2]);
      const dx = bl[0] - bp[0], dz = bl[2] - bp[2];
      av.rotation.y = Math.atan2(dx, dz);
      av.visible = true;
      if (shot.botExpression) setExpression(av, shot.botExpression);
    }

    // Explicit per-shot avatar positions (skit shots). Format:
    //   shot.avatars = { Name: { pos, look, posTo?, lookTo?, expression?,
    //                            expressionAt?, lookAtCamera?, showTag?, still? } }
    if (shot.avatars) {
      for (const [name, spec] of Object.entries(shot.avatars)) {
        const av = avatars.ensure(name);
        const f = clamp01(localT / Math.max(0.001, shot.duration));
        const p = spec.posTo ? lerpVec(spec.pos, spec.posTo, ease(f)) : spec.pos;
        let l = spec.lookTo ? lerpVec(spec.look ?? spec.pos, spec.lookTo, ease(f)) : (spec.look ?? spec.pos);
        if (spec.lookAtCamera) l = cam.pos;
        // Subtle idle: gentle head bob so characters don't read as statues.
        // Disable with `still: true` for shots that need locked framing.
        const bob = spec.still ? 0 : 0.04 * Math.sin(t * 2.6 + (name.charCodeAt(0) || 0));
        av.position.set(p[0], p[1] + bob, p[2]);
        const dx = l[0] - p[0], dz = l[2] - p[2];
        if (dx !== 0 || dz !== 0) av.rotation.y = Math.atan2(dx, dz);
        av.visible = true;
        if (spec.showTag !== undefined) setTagVisible(av, !!spec.showTag);
        if (spec.expressionAt) {
          let exp = spec.expression || 'neutral';
          for (const ex of spec.expressionAt) {
            if (localT >= ex.t) exp = ex.expression;
            else break;
          }
          setExpression(av, exp);
        } else if (spec.expression) {
          setExpression(av, spec.expression);
        }
      }
    }
    // Shot-wide tag default for build-driven bots
    if (shot.botName && shot.hideTags) {
      const av = avatars.ensure(shot.botName);
      setTagVisible(av, false);
    } else if (shot.botName) {
      const av = avatars.ensure(shot.botName);
      setTagVisible(av, true);
    }

    // Overlays
    overlays.prompt.style.opacity = overlayOpacity(shot.overlay, localT);
    if (shot.overlay) overlays.prompt.textContent = shot.overlay.html;

    overlays.dialog.style.opacity = overlayOpacity(shot.dialog, localT);
    if (shot.dialog) {
      const speaker = shot.dialog.speaker ? `${shot.dialog.speaker}: ` : '';
      overlays.dialog.textContent = speaker + shot.dialog.text;
    }

    overlays.title.style.opacity = overlayOpacity(shot.title, localT);
    if (shot.title) overlays.title.textContent = shot.title.html;

    // Fade at shot boundaries. Per-side color (fadeInColor/fadeOutColor)
    // lets a transition flash white for music drops or stay black for cuts.
    const fIn  = shot.fadeIn  ?? shot.fade ?? 0;
    const fOut = shot.fadeOut ?? shot.fade ?? 0;
    let fade = 0;
    let fadeColor = '#000';
    if (fIn > 0 && localT < fIn) {
      fade = 1 - localT / fIn;
      fadeColor = shot.fadeInColor ?? shot.fadeColor ?? '#000';
    } else if (fOut > 0 && localT > shot.duration - fOut) {
      fade = (localT - (shot.duration - fOut)) / fOut;
      fadeColor = shot.fadeOutColor ?? shot.fadeColor ?? '#000';
    }
    overlays.fader.style.background = fadeColor;
    overlays.fader.style.opacity = Math.max(0, Math.min(1, fade));

    renderer.render(scene, camera);
  }

  frame(0);

  // Audio markers: one per shot start, plus any custom cues from the manuscript.
  // Recorder script reads this and writes a sidecar JSON for post-production.
  const markers = [];
  for (const s of shots) {
    markers.push({ t: +s.start.toFixed(3), kind: 'shot', id: s.id });
    if (s.audio) markers.push({ t: +s.start.toFixed(3), kind: 'audio', ...s.audio });
  }
  if (MANUSCRIPT.audioMarkers) for (const m of MANUSCRIPT.audioMarkers) markers.push({ kind: 'audio', ...m });
  markers.sort((a, b) => a.t - b.t);

  window.__demoFrame = frame;
  window.__demoMarkers = markers;
  window.__demoState = { width: W, height: H, duration: totalDuration, fps: MANUSCRIPT.fps };
  window.__demoReady = true;
}
