// Static explore mode — fly around the finished demo world in the browser.
// No server, no LLM. The page loads world-snapshot.json (a delta against
// the natural terrain) plus the cached LLM build plans. Viewers cycle
// through the build menu with the scroll wheel and press B to spawn the
// selected one — no need to leave pointer-lock.
//
// To unlock real Claude-driven builds from a freeform prompt, the viewer
// has to clone + run locally — there's a note on screen explaining this.
import * as THREE from 'three';
import { World, WORLD_HEIGHT, WORLD_SIZE } from './World.js';
import { Block } from './Textures.js';
import { terrainHeight } from './terrain.js';
import { makeAvatar, setExpression } from './avatar.js';
import { spiralStaircase, bigTreeWithVines, sauronEye } from './montage.mjs';

// Each build returns a list of blocks RELATIVE to (0,0,0). Cached LLM
// plans are fetched lazily; helper builds run synchronously.
const cachedPlan = (slug) => async () => {
  const r = await fetch(`data/plans/${slug}.json`);
  if (!r.ok) throw new Error(`failed to load ${slug}`);
  return (await r.json()).plan;
};
const helperPlan = (fn) => async () => fn(0, 0, 0, { startT: 0 }).map(b => ({ x: b.x, y: b.y, z: b.z, block: b.block }));

const BUILDS = [
  { name: 'Dragon coiled around a tower',       getPlan: cachedPlan('dragon-tower') },
  { name: 'Hogwarts castle',                    getPlan: cachedPlan('hogwarts') },
  { name: 'Pirate ship',                        getPlan: cachedPlan('pirate-ship') },
  { name: 'Kurama (9-tailed fox)',              getPlan: cachedPlan('naruto-kurama') },
  { name: 'Giant octopus',                      getPlan: cachedPlan('octopus') },
  { name: 'Roman colosseum',                    getPlan: cachedPlan('colosseum') },
  { name: 'Stonehenge',                         getPlan: cachedPlan('stonehenge') },
  { name: 'Erupting volcano',                   getPlan: cachedPlan('volcano') },
  { name: 'Pyramid of Giza',                    getPlan: cachedPlan('pyramid') },
  { name: 'Eiffel Tower',                       getPlan: cachedPlan('eiffel-tower') },
  { name: 'Sci-fi spaceship',                   getPlan: cachedPlan('rocinante') },
  { name: 'Japanese pagoda',                    getPlan: cachedPlan('glass-pagoda') },
  { name: 'Knight statue',                      getPlan: cachedPlan('knight-statue') },
  // Synthetic builds — deterministic JS helpers, no LLM needed.
  { name: 'Spiral staircase',                   getPlan: helperPlan(spiralStaircase) },
  { name: 'Big tree with vines',                getPlan: helperPlan(bigTreeWithVines) },
  { name: 'Eye of Sauron tower',                getPlan: helperPlan(sauronEye) },
];

const FLY_SPEED = 14;
const FAST_FLY_SPEED = 28;

export async function startExplore() {
  for (const id of ['join-screen', 'task-panel', 'task-detail', 'chat', 'hud']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';

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

  const world = new World(scene);
  const ui = installUI(BUILDS);

  // Stream the snapshot in the background so terrain renders immediately.
  ui.status('Loading world…');
  fetch('data/world-snapshot.json')
    .then(r => r.json())
    .then(snap => {
      world.applyBlockChanges(snap.changes);
      ui.status(`Loaded ${snap.blockCount.toLocaleString()} demo blocks`);
      setTimeout(() => ui.status(''), 2500);
    })
    .catch(e => ui.status(`Failed to load snapshot: ${e.message}`));

  // --- Player + fly controls ----------------------------------------------
  const pos = new THREE.Vector3(130, 70, 100);
  let yaw = 0, pitch = -0.35;
  const keys = {};
  let pointerLocked = false;
  const clock = new THREE.Clock();

  canvas.addEventListener('click', () => canvas.requestPointerLock());
  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });
  document.addEventListener('mousemove', (e) => {
    if (!pointerLocked) return;
    yaw   -= e.movementX * 0.006;
    pitch -= e.movementY * 0.006;
    pitch  = Math.max(-1.55, Math.min(1.55, pitch));
  });
  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyB' && pointerLocked) { e.preventDefault(); spawnSelected(); }
  });
  document.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  // Scroll wheel cycles the selected build when in fly mode.
  let selectedIdx = 0;
  ui.setSelected(selectedIdx);
  canvas.addEventListener('wheel', (e) => {
    if (!pointerLocked) return;
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1 : -1;
    selectedIdx = (selectedIdx + dir + BUILDS.length) % BUILDS.length;
    ui.setSelected(selectedIdx);
  }, { passive: false });

  // Also let direct menu clicks trigger a build (only when pointer-lock off).
  ui.onMenuClick((i) => { selectedIdx = i; ui.setSelected(i); spawnSelected(); });

  // --- Bot avatar + build replay ------------------------------------------
  const claudeBot = makeAvatar({
    name: 'Claude',
    bodyColor: 0x10b981, headColor: 0xffcc88,
    hat: { shape: 'cone', color: 0x6b46c1 },
    expression: 'happy',
  });
  claudeBot.visible = false;
  scene.add(claudeBot);

  let active = null;
  function spawnSelected() {
    if (active) { ui.status('Bot busy — wait for the current build.'); return; }
    const build = BUILDS[selectedIdx];
    ui.status(`Loading "${build.name}"…`);
    build.getPlan()
      .then(plan => {
        const lookX = -Math.sin(yaw), lookZ = -Math.cos(yaw);
        const bx = Math.max(20, Math.min(WORLD_SIZE - 20, Math.round(pos.x + lookX * 35)));
        const bz = Math.max(20, Math.min(WORLD_SIZE - 20, Math.round(pos.z + lookZ * 35)));
        const by = terrainHeight(bx, bz) + 1;
        startBuild(plan, [bx, by, bz], build.name);
      })
      .catch(e => ui.status(`Failed: ${e.message}`));
  }

  function startBuild(plan, origin, name) {
    const ordered = [...plan].sort((a, b) => a.y - b.y || a.z - b.z || a.x - b.x);
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
          const stop = active.stop;
          active = { stop, tick() {} };
          setTimeout(() => stop(), 2000);
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
function installUI(builds) {
  // Help / hint overlay
  const hint = document.createElement('div');
  Object.assign(hint.style, {
    position: 'fixed', top: '12px', left: '12px', padding: '10px 14px',
    background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '13px', lineHeight: '1.5', borderRadius: '8px', pointerEvents: 'none',
    maxWidth: '340px', zIndex: 5, backdropFilter: 'blur(4px)',
  });
  hint.innerHTML = `
    <div style="font-weight:700;font-size:14px;margin-bottom:4px">CraftPlan · static demo</div>
    Click the canvas to start · <b>WASD</b> fly · <b>Space</b>/<b>Ctrl</b> up/down · <b>Shift</b> faster<br>
    <b>Scroll</b> to pick a build · <b>B</b> to spawn it · <b>Esc</b> to release the mouse
    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.2);margin:8px 0">
    Want Claude to <i>invent</i> NEW builds from your prompt? Clone the repo and run:
    <div style="margin:4px 0;padding:4px 8px;background:rgba(255,255,255,0.08);border-radius:4px;font-family:monospace;font-size:12px">
      ./craftplan.sh start &nbsp;<span style="opacity:0.6">— server</span><br>
      ./craftplan.sh bot   &nbsp;<span style="opacity:0.6">— @Claude builder</span>
    </div>
    Then chat <code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px">@Claude build a dragon, here</code> in-game.
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

  // Build menu
  const menu = document.createElement('div');
  Object.assign(menu.style, {
    position: 'fixed', top: '12px', right: '12px', padding: '10px',
    background: 'rgba(0,0,0,0.65)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '13px', borderRadius: '8px', zIndex: 6, maxWidth: '260px',
    backdropFilter: 'blur(4px)', maxHeight: 'calc(100vh - 40px)', overflowY: 'auto',
  });
  menu.innerHTML = `
    <div style="font-weight:700;margin-bottom:4px">Tell Claude what to build:</div>
    <div style="font-size:11px;opacity:0.7;margin-bottom:8px">Scroll wheel cycles · B spawns</div>
  `;
  document.body.appendChild(menu);

  const onClickHandlers = [];
  const btns = builds.map((b, i) => {
    const btn = document.createElement('button');
    btn.textContent = b.name;
    Object.assign(btn.style, {
      display: 'block', width: '100%', margin: '2px 0', padding: '5px 9px',
      background: 'rgba(255,255,255,0.08)', color: '#fff',
      border: '1px solid rgba(255,255,255,0.18)', borderRadius: '4px',
      fontFamily: 'inherit', fontSize: '13px', cursor: 'pointer',
      textAlign: 'left', transition: 'background 0.15s',
    });
    btn.addEventListener('mouseenter', () => { if (!btn.dataset.active) btn.style.background = 'rgba(255,255,255,0.18)'; });
    btn.addEventListener('mouseleave', () => { if (!btn.dataset.active) btn.style.background = 'rgba(255,255,255,0.08)'; });
    btn.addEventListener('click', () => { for (const h of onClickHandlers) h(i); });
    menu.appendChild(btn);
    return btn;
  });

  // Selected-build chip near the crosshair
  const chip = document.createElement('div');
  Object.assign(chip.style, {
    position: 'fixed', left: '50%', top: 'calc(50% + 22px)', transform: 'translateX(-50%)',
    background: 'rgba(0,0,0,0.55)', color: '#fff', fontFamily: 'system-ui, sans-serif',
    fontSize: '13px', padding: '4px 10px', borderRadius: '12px', pointerEvents: 'none',
    zIndex: 4, whiteSpace: 'nowrap',
  });
  document.body.appendChild(chip);

  return {
    status(msg) {
      if (!msg) { status.style.opacity = 0; return; }
      status.textContent = msg;
      status.style.opacity = 1;
    },
    setSelected(i) {
      btns.forEach((b, j) => {
        if (j === i) { b.dataset.active = '1'; b.style.background = 'rgba(125,211,252,0.35)'; b.style.borderColor = '#7dd3fc'; }
        else          { delete b.dataset.active;  b.style.background = 'rgba(255,255,255,0.08)'; b.style.borderColor = 'rgba(255,255,255,0.18)'; }
      });
      chip.innerHTML = `<b>${builds[i].name}</b> &nbsp;<span style="opacity:0.7">— press B</span>`;
      // Scroll the selected button into view in the menu
      btns[i].scrollIntoView({ block: 'nearest' });
    },
    onMenuClick(handler) { onClickHandlers.push(handler); },
  };
}
