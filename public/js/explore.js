// Static explore mode — fly around the finished demo world in the browser.
// No server, no LLM. The page loads world-snapshot.json (a delta against
// the natural terrain) plus the cached LLM build plans. Viewers can
// trigger new "simple bot" builds from a menu; each replays a cached plan
// with a bot avatar visibly placing blocks.
//
// To unlock real Claude-driven builds from a freeform prompt, the viewer
// has to clone + run locally — there's a note on screen explaining this.
import * as THREE from 'three';
import { World, WORLD_HEIGHT, WORLD_SIZE } from './World.js';
import { Block } from './Textures.js';
import { terrainHeight } from './terrain.js';
import { makeAvatar, setExpression, setTagVisible } from './avatar.js';

// Builds the viewer can spawn (matches plans cached in public/data/plans/).
const BUILDS = [
  { slug: 'dragon-tower',   name: 'Dragon coiled around a tower' },
  { slug: 'hogwarts',       name: 'Hogwarts castle' },
  { slug: 'pirate-ship',    name: 'Pirate ship' },
  { slug: 'naruto-kurama',  name: 'Kurama (9-tailed fox)' },
  { slug: 'octopus',        name: 'Giant octopus' },
  { slug: 'colosseum',      name: 'Roman colosseum' },
  { slug: 'stonehenge',     name: 'Stonehenge' },
  { slug: 'volcano',        name: 'Erupting volcano' },
  { slug: 'pyramid',        name: 'Pyramid of Giza' },
  { slug: 'eiffel-tower',   name: 'Eiffel Tower' },
  { slug: 'rocinante',      name: 'Sci-fi spaceship' },
  { slug: 'glass-pagoda',   name: 'Japanese pagoda' },
  { slug: 'knight-statue',  name: 'Knight statue' },
];

const FLY_SPEED = 14;
const FAST_FLY_SPEED = 28;
const EYE_HEIGHT = 1.62;

export async function startExplore() {
  // Hide live-mode UI; build our own overlays below.
  for (const id of ['join-screen', 'task-panel', 'task-detail', 'chat', 'hud']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';

  // --- Scene ---------------------------------------------------------------
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8e3);
  scene.fog = new THREE.Fog(0x7ec8e3, 120, 360);

  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 400);
  const canvas = document.getElementById('game');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0x808080));
  const sun = new THREE.DirectionalLight(0xfff4e0, 0.85);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x87CEEB, 0x556633, 0.45));

  // --- World ---------------------------------------------------------------
  const world = new World(scene);

  // Boot UI before async fetch so the viewer sees the loading state
  const ui = installUI();
  ui.status('Loading world…');

  // Async-load the snapshot. Don't block the animation loop on it — the
  // natural noise-generated terrain renders immediately and the demo
  // builds pop in once applyBlockChanges finishes.
  fetch('data/world-snapshot.json')
    .then(r => r.json())
    .then(snap => {
      world.applyBlockChanges(snap.changes);
      ui.status(`Loaded ${snap.blockCount.toLocaleString()} demo blocks`);
      setTimeout(() => ui.status(''), 2500);
    })
    .catch(e => ui.status(`Failed to load snapshot: ${e.message}`));

  // --- Player (fly mode only) ----------------------------------------------
  // Start hovering south of the throne, looking northwest at the grid.
  const pos = new THREE.Vector3(130, 70, 100);
  let yaw = 0, pitch = -0.35;
  const keys = {};
  let pointerLocked = false;
  const clock = new THREE.Clock();

  canvas.addEventListener('click', () => {
    if (document.body.dataset.menuOpen !== 'true') canvas.requestPointerLock();
  });
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });
  document.addEventListener('mousemove', (e) => {
    if (!pointerLocked) return;
    yaw   -= e.movementX * 0.006;
    pitch -= e.movementY * 0.006;
    pitch  = Math.max(-1.55, Math.min(1.55, pitch));
  });
  document.addEventListener('keydown', (e) => { keys[e.code] = true; });
  document.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  // --- Build menu -----------------------------------------------------------
  const claudeBot = makeAvatar({
    name: 'Claude',
    bodyColor: 0x10b981, headColor: 0xffcc88,
    hat: { shape: 'cone', color: 0x6b46c1 },
    expression: 'happy',
  });
  claudeBot.visible = false;
  scene.add(claudeBot);

  // Per-frame "active build" state — null when idle.
  let active = null;

  ui.buildMenu(BUILDS, async (slug, name) => {
    if (active) { ui.status('Bot busy — wait for the current build.'); return; }
    ui.status(`Loading "${name}"…`);
    let plan;
    try {
      plan = await (await fetch(`data/plans/${slug}.json`)).json();
    } catch (e) {
      ui.status(`Failed to load ${slug}: ${e.message}`);
      return;
    }
    // Build in front of the player, on the surface.
    const lookX = -Math.sin(yaw), lookZ = -Math.cos(yaw);
    const bx = Math.max(20, Math.min(WORLD_SIZE - 20, Math.round(pos.x + lookX * 35)));
    const bz = Math.max(20, Math.min(WORLD_SIZE - 20, Math.round(pos.z + lookZ * 35)));
    const by = terrainHeight(bx, bz) + 1;
    startBuild({ plan, origin: [bx, by, bz], name });
  });

  function startBuild({ plan, origin, name }) {
    // Sort plan blocks bottom-up; build over ~10s wall time.
    const ordered = [...plan.plan].sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
    const start = performance.now();
    const duration = 10000;
    let placedIdx = 0;
    claudeBot.visible = true;
    setExpression(claudeBot, 'focused');
    ui.status(`Building: ${name}`);
    active = {
      stop() { active = null; claudeBot.visible = false; ui.status(''); },
      tick(now) {
        const f = Math.min(1, (now - start) / duration);
        const target = Math.floor(f * ordered.length);
        const batch = {};
        let n = 0;
        while (placedIdx < target) {
          const b = ordered[placedIdx++];
          batch[`${origin[0] + b.x},${origin[1] + b.y},${origin[2] + b.z}`] = b.block;
          n++;
        }
        if (n > 0) world.applyBlockChanges(batch);
        // Position the bot near the most recent block, biased toward the player.
        if (placedIdx > 0) {
          const last = ordered[Math.min(placedIdx - 1, ordered.length - 1)];
          const bx = origin[0] + last.x, by = origin[1] + last.y, bz = origin[2] + last.z;
          const toPlayerX = pos.x - bx, toPlayerZ = pos.z - bz;
          const len = Math.hypot(toPlayerX, toPlayerZ) || 1;
          claudeBot.position.set(bx + (toPlayerX / len) * 4, by + 3, bz + (toPlayerZ / len) * 4);
          claudeBot.rotation.y = Math.atan2(bx - claudeBot.position.x, bz - claudeBot.position.z);
        }
        if (f >= 1) {
          setExpression(claudeBot, 'happy');
          ui.status(`Built: ${name}`);
          setTimeout(() => { if (active) active.stop(); }, 2000);
          active = { stop: active.stop, tick() {} }; // freeze
        }
      },
    };
  }

  // --- Game loop -----------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());

    if (pointerLocked) {
      const speed = (keys['ShiftLeft'] || keys['ShiftRight']) ? FAST_FLY_SPEED : FLY_SPEED;
      const fwd = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = new THREE.Vector3();
      if (keys['KeyW']) move.add(fwd);
      if (keys['KeyS']) move.sub(fwd);
      if (keys['KeyD']) move.add(right);
      if (keys['KeyA']) move.sub(right);
      if (keys['Space']) move.y += 1;
      if (keys['ControlLeft'] || keys['KeyC']) move.y -= 1;
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        pos.add(move);
      }
      pos.x = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, pos.x));
      pos.z = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, pos.z));
      pos.y = Math.max(2, Math.min(WORLD_HEIGHT + 80, pos.y));
    }

    if (active) active.tick(performance.now());

    camera.position.copy(pos);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(pitch, yaw, 0);
    renderer.render(scene, camera);
  }
  animate();

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}

// --- UI ---------------------------------------------------------------------
function installUI() {
  // Help / hint overlay
  const hint = document.createElement('div');
  Object.assign(hint.style, {
    position: 'fixed', top: '12px', left: '12px', padding: '10px 14px',
    background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '13px', lineHeight: '1.45', borderRadius: '8px', pointerEvents: 'none',
    maxWidth: '320px', zIndex: 5, backdropFilter: 'blur(4px)',
  });
  hint.innerHTML = `
    <div style="font-weight:700;font-size:14px;margin-bottom:4px">CraftPlan · static demo</div>
    Click the canvas to capture the mouse · <b>WASD</b> fly · <b>Space</b>/<b>Ctrl</b> up/down · <b>Shift</b> faster · <b>Esc</b> to release the mouse and open the menu.
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.2);margin:8px 0">
    Want Claude to <i>invent</i> new builds from your prompt? Clone the repo and run <code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px">./craftplan.sh start</code> locally — that's the multiplayer version with bots.
    <div style="margin-top:6px"><a href="https://github.com/loathwine/craftplan" style="color:#7dd3fc;pointer-events:auto" target="_blank">github.com/loathwine/craftplan</a></div>
  `;
  document.body.appendChild(hint);

  // Crosshair
  const crosshair = document.createElement('div');
  Object.assign(crosshair.style, {
    position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
    color: '#fff', fontSize: '20px', opacity: 0.5, pointerEvents: 'none', zIndex: 4,
    textShadow: '0 0 2px rgba(0,0,0,0.5)',
  });
  crosshair.textContent = '+';
  document.body.appendChild(crosshair);

  // Status line
  const status = document.createElement('div');
  Object.assign(status.style, {
    position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.6)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '14px', padding: '8px 14px', borderRadius: '6px', pointerEvents: 'none',
    opacity: 0, transition: 'opacity 0.3s', zIndex: 5,
  });
  document.body.appendChild(status);

  // Build menu panel
  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position: 'fixed', top: '12px', right: '12px', padding: '10px',
    background: 'rgba(0,0,0,0.65)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '13px', borderRadius: '8px', zIndex: 6, maxWidth: '240px',
    backdropFilter: 'blur(4px)',
  });
  menu.innerHTML = `<div style="font-weight:700;margin-bottom:6px">Tell Claude what to build:</div>`;
  document.body.appendChild(menu);
  // Track when menu is being interacted with so canvas click doesn't grab pointer
  menu.addEventListener('pointerenter', () => { document.body.dataset.menuOpen = 'true'; });
  menu.addEventListener('pointerleave', () => { document.body.dataset.menuOpen = 'false'; });

  return {
    status(msg) {
      if (!msg) { status.style.opacity = 0; return; }
      status.textContent = msg;
      status.style.opacity = 1;
    },
    buildMenu(builds, onClick) {
      for (const b of builds) {
        const btn = document.createElement('button');
        btn.textContent = b.name;
        Object.assign(btn.style, {
          display: 'block', width: '100%', margin: '3px 0', padding: '6px 10px',
          background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '4px', fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer',
          textAlign: 'left',
        });
        btn.addEventListener('mouseenter', () => { btn.style.background = 'rgba(255,255,255,0.18)'; });
        btn.addEventListener('mouseleave', () => { btn.style.background = 'rgba(255,255,255,0.08)'; });
        btn.addEventListener('click', () => onClick(b.slug, b.name));
        menu.appendChild(btn);
      }
    },
  };
}
