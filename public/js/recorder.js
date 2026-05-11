// Headless recording mode. Activated by ?record=1.
//
// Builds a deterministic scene (no network, no controls) and exposes:
//   window.__demoReady   -- true once the world is fully meshed
//   window.__demoFrame(t) -- update + render a single frame at virtual time t (seconds)
//   window.__demoState   -- read-only camera/clock state for debugging
//
// The headless recorder (scripts/record-demo.mjs) calls __demoFrame(t) once
// per frame and screenshots the canvas. Because the page never touches a
// wall clock, the output is identical across runs given the same script.
import * as THREE from 'three';
import { World } from './World.js';
import { TaskManager } from './TaskManager.js';
import { terrainHeight } from './terrain.js';

// --- Camera path primitives -------------------------------------------------
// Each clip exposes .at(localT) -> { pos: [x,y,z], look: [x,y,z] } where
// localT is a number in [0, 1]. A timeline composes clips end-to-end.

const ease = (t) => t * t * (3 - 2 * t);

function still(pos, look) {
  return { duration: 0, at: () => ({ pos, look }) };
}

function dolly(a, b, look, duration) {
  // Look can be a single point or [from, to]
  const look0 = Array.isArray(look[0]) ? look[0] : look;
  const look1 = Array.isArray(look[0]) ? look[1] : look;
  return {
    duration,
    at(t) {
      const f = ease(t);
      return {
        pos: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f],
        look: [look0[0] + (look1[0] - look0[0]) * f, look0[1] + (look1[1] - look0[1]) * f, look0[2] + (look1[2] - look0[2]) * f],
      };
    },
  };
}

function orbit(center, radius, height, startA, endA, duration) {
  return {
    duration,
    at(t) {
      const a = startA + (endA - startA) * ease(t);
      return {
        pos: [center[0] + radius * Math.cos(a), center[1] + height, center[2] + radius * Math.sin(a)],
        look: center,
      };
    },
  };
}

function makeTimeline(clips) {
  let total = 0;
  const entries = clips.map((c) => {
    const e = { start: total, end: total + c.duration, clip: c };
    total += c.duration;
    return e;
  });
  return {
    duration: total,
    at(t) {
      if (t <= 0) return entries[0].clip.at(0);
      for (const e of entries) {
        if (t <= e.end) {
          const span = e.end - e.start;
          const local = span > 0 ? (t - e.start) / span : 1;
          return e.clip.at(local);
        }
      }
      const last = entries[entries.length - 1];
      return last.clip.at(1);
    },
  };
}

// --- POC scene + timeline ---------------------------------------------------

const C = [128, terrainHeight(128, 128), 128]; // world center, terrain-relative
const POC_TIMELINE = makeTimeline([
  // 0-2s: high reveal shot
  dolly([C[0] + 60, 80, C[2] + 80], [C[0] + 50, 50, C[2] + 50], C, 2),
  // 2-7s: slow orbit at mid-height
  orbit(C, 55, 45, Math.PI * 0.25, Math.PI * 1.75, 5),
  // 7-10s: pull back up
  dolly([C[0] + 55, 45, C[2] + 55], [C[0] + 80, 90, C[2] + 80], C, 3),
]);

// --- Bootstrap --------------------------------------------------------------

export function startRecorder() {
  const params = new URLSearchParams(location.search);
  const w = parseInt(params.get('w') || '1280');
  const h = parseInt(params.get('h') || '720');

  // Hide every UI overlay that lives in index.html
  for (const id of ['join-screen', 'hud', 'task-panel', 'chat', 'task-detail']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';
  document.body.style.background = '#000';

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8e3);
  scene.fog = new THREE.Fog(0x7ec8e3, 60, 200);

  const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 400);

  const canvas = document.getElementById('game');
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  // preserveDrawingBuffer so screenshots taken after render are valid
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(1);

  scene.add(new THREE.AmbientLight(0x808080));
  const sun = new THREE.DirectionalLight(0xfff4e0, 0.85);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x87CEEB, 0x556633, 0.45));

  const world = new World(scene);
  // TaskManager initialized for parity with main.js (empty until we add tasks)
  const _tm = new TaskManager(scene, world);

  // Force one render so first __demoFrame produces a coherent image
  renderer.render(scene, camera);

  // Expose API
  window.__demoTimeline = POC_TIMELINE;
  window.__demoState = { width: w, height: h, duration: POC_TIMELINE.duration };
  window.__demoFrame = (t) => {
    const { pos, look } = POC_TIMELINE.at(t);
    camera.position.set(pos[0], pos[1], pos[2]);
    camera.lookAt(look[0], look[1], look[2]);
    renderer.render(scene, camera);
  };

  // Signal ready last
  window.__demoReady = true;
}
