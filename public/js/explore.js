// Static explore mode — fly around the finished demo world in the browser.
// No server, no LLM. The page loads world-snapshot.json (a delta against
// the natural terrain) plus the cached LLM build plans.
//
// Desktop: pointer-lock, WASD, scroll to cycle builds, B to spawn.
// Touch:   virtual joystick (move), drag to look, up/down + spawn buttons,
//          tap the build pill to open the build picker.
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

// "Touch device" = primary input is touch (phone/tablet). Hybrid laptops with
// touchscreens but a mouse stay on the desktop path. `pointer: coarse` is the
// standard signal for this; we fall back to maxTouchPoints for old browsers.
const isTouchDevice = (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches)
  || (!matchMedia && (navigator.maxTouchPoints || 0) > 0);

export async function startExplore() {
  for (const id of ['join-screen', 'task-panel', 'task-detail', 'chat', 'hud']) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }
  document.body.style.margin = '0';
  if (isTouchDevice) document.body.classList.add('touch');

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

  // Mobile/touch input state
  const joy = { x: 0, y: 0 };          // [-1..1], y positive = forward
  const touchBtns = { up: false, down: false };
  let lookTouchId = null;
  let lookLastX = 0, lookLastY = 0;

  // --- Desktop: pointer-lock + keyboard ----------------------------------
  if (!isTouchDevice) {
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
    canvas.addEventListener('wheel', (e) => {
      if (!pointerLocked) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      cycleBuild(dir);
    }, { passive: false });
  }

  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (e.code === 'KeyB' && (pointerLocked || isTouchDevice)) {
      e.preventDefault();
      spawnSelected();
    }
  });
  document.addEventListener('keyup', (e) => { keys[e.code] = false; });

  // --- Touch input -------------------------------------------------------
  if (isTouchDevice) {
    setupTouchLook(canvas);
    setupJoystick(document.getElementById('touch-joystick'));
    bindHoldButton(document.getElementById('touch-up'),   () => touchBtns.up = true,   () => touchBtns.up = false);
    bindHoldButton(document.getElementById('touch-down'), () => touchBtns.down = true, () => touchBtns.down = false);
    document.getElementById('touch-build').addEventListener('click', (e) => {
      e.preventDefault();
      spawnSelected();
    });
    document.getElementById('touch-menu').addEventListener('click', (e) => {
      e.preventDefault();
      ui.toggleMenu();
    });
  }

  let selectedIdx = 0;
  ui.setSelected(selectedIdx);
  function cycleBuild(dir) {
    selectedIdx = (selectedIdx + dir + BUILDS.length) % BUILDS.length;
    ui.setSelected(selectedIdx);
  }

  ui.onMenuClick((i) => {
    selectedIdx = i;
    ui.setSelected(i);
    if (isTouchDevice) {
      ui.closeMenu();
      spawnSelected();
    } else if (!pointerLocked) {
      spawnSelected();
    }
  });

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

  // --- Touch helpers ------------------------------------------------------
  function setupTouchLook(canvasEl) {
    canvasEl.addEventListener('touchstart', (e) => {
      for (const t of e.changedTouches) {
        // Skip touches that started inside an interactive overlay.
        const tgt = document.elementFromPoint(t.clientX, t.clientY);
        if (tgt && tgt.closest('.no-look')) continue;
        if (lookTouchId === null) {
          lookTouchId = t.identifier;
          lookLastX = t.clientX;
          lookLastY = t.clientY;
        }
      }
    }, { passive: true });
    canvasEl.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === lookTouchId) {
          const dx = t.clientX - lookLastX;
          const dy = t.clientY - lookLastY;
          lookLastX = t.clientX;
          lookLastY = t.clientY;
          yaw   -= dx * 0.006;
          pitch -= dy * 0.006;
          pitch  = Math.max(-1.55, Math.min(1.55, pitch));
        }
      }
    }, { passive: true });
    const end = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === lookTouchId) lookTouchId = null;
      }
    };
    canvasEl.addEventListener('touchend', end);
    canvasEl.addEventListener('touchcancel', end);
  }

  function setupJoystick(stick) {
    if (!stick) return;
    const knob = stick.querySelector('.knob');
    const radius = 50; // px
    let activeId = null;
    let cx = 0, cy = 0;

    const reset = () => {
      activeId = null;
      joy.x = 0; joy.y = 0;
      knob.style.transform = '';
      stick.classList.remove('active');
    };

    stick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (activeId !== null) return;
      const t = e.changedTouches[0];
      activeId = t.identifier;
      const r = stick.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      stick.classList.add('active');
      updateFromTouch(t);
    }, { passive: false });

    stick.addEventListener('touchmove', (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === activeId) {
          e.preventDefault();
          updateFromTouch(t);
        }
      }
    }, { passive: false });

    const endHandler = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === activeId) reset();
      }
    };
    stick.addEventListener('touchend', endHandler);
    stick.addEventListener('touchcancel', endHandler);

    function updateFromTouch(t) {
      let dx = t.clientX - cx;
      let dy = t.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > radius) {
        dx = dx * radius / d;
        dy = dy * radius / d;
      }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      joy.x =  dx / radius;
      joy.y = -dy / radius; // up on screen = forward
    }
  }

  function bindHoldButton(el, onDown, onUp) {
    if (!el) return;
    const down = (e) => { e.preventDefault(); el.classList.add('active'); onDown(); };
    const up   = (e) => { e.preventDefault(); el.classList.remove('active'); onUp(); };
    el.addEventListener('touchstart', down, { passive: false });
    el.addEventListener('touchend',   up,   { passive: false });
    el.addEventListener('touchcancel', up,  { passive: false });
    // Mouse fallback (helpful for desktop browser DevTools "touch" simulation)
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseup',   up);
    el.addEventListener('mouseleave', up);
  }

  // --- Game loop -----------------------------------------------------------
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, clock.getDelta());

    const fastKey = keys['ShiftLeft'] || keys['ShiftRight'];
    const speed = fastKey ? FAST_FLY_SPEED : FLY_SPEED;
    const inputActive = pointerLocked || isTouchDevice;
    if (inputActive) {
      const fwd = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = new THREE.Vector3();
      if (keys['KeyW']) move.add(fwd);
      if (keys['KeyS']) move.sub(fwd);
      if (keys['KeyD']) move.add(right);
      if (keys['KeyA']) move.sub(right);
      if (keys['Space']) move.y += 1;
      if (keys['ControlLeft'] || keys['KeyC']) move.y -= 1;
      // Touch joystick: y forward/back, x strafe
      if (joy.x !== 0 || joy.y !== 0) {
        const flat = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        move.add(flat.multiplyScalar(joy.y));
        move.add(right.clone().multiplyScalar(joy.x));
      }
      if (touchBtns.up)   move.y += 1;
      if (touchBtns.down) move.y -= 1;
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
  // Hint (collapsible). Hidden on touch — there's no keyboard to call out.
  const hint = document.createElement('div');
  hint.id = 'explore-hint';
  hint.classList.add('no-look');
  hint.innerHTML = `
    <div class="hint-title">
      <span>CraftPlan · static demo</span>
      <button id="explore-hint-toggle" aria-label="Collapse">−</button>
    </div>
    <div class="hint-body">
      Click the canvas to start · <b>WASD</b> fly · <b>Space</b>/<b>Ctrl</b> up/down · <b>Shift</b> faster<br>
      <b>Scroll</b> to pick a build · <b>B</b> to spawn it · <b>Esc</b> to release the mouse
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.2);margin:8px 0">
      Want Claude to <i>invent</i> NEW builds from your prompt? Clone the repo and run:
      <div style="margin:4px 0;padding:4px 8px;background:rgba(255,255,255,0.08);border-radius:4px;font-family:monospace;font-size:12px">
        ./craftplan.sh start &nbsp;<span style="opacity:0.6">— server</span><br>
        ./craftplan.sh bot   &nbsp;<span style="opacity:0.6">— @Claude builder</span>
      </div>
      Then chat <code style="background:rgba(255,255,255,0.1);padding:1px 4px;border-radius:3px">@Claude build a dragon, here</code> in-game.
      <div style="margin-top:6px"><a href="https://github.com/loathwine/craftplan" style="color:#7dd3fc" target="_blank">github.com/loathwine/craftplan</a></div>
    </div>
  `;
  document.body.appendChild(hint);
  const hintToggle = hint.querySelector('#explore-hint-toggle');
  hintToggle.addEventListener('click', () => {
    const collapsed = hint.classList.toggle('collapsed');
    hintToggle.textContent = collapsed ? '+' : '−';
  });

  // Crosshair
  const crosshair = document.createElement('div');
  crosshair.id = 'explore-crosshair';
  crosshair.textContent = '+';
  document.body.appendChild(crosshair);

  // Status line
  const status = document.createElement('div');
  status.id = 'explore-status';
  document.body.appendChild(status);

  // Build menu
  const menu = document.createElement('div');
  menu.id = 'explore-menu';
  menu.classList.add('no-look');
  menu.innerHTML = `
    <div class="menu-header">
      <span class="menu-title">Tell Claude what to build</span>
      <button id="explore-menu-close" aria-label="Close">×</button>
    </div>
    <div class="menu-hint">Scroll cycles · B spawns</div>
    <div id="explore-menu-list"></div>
  `;
  document.body.appendChild(menu);

  const list = menu.querySelector('#explore-menu-list');
  const menuTitle = menu.querySelector('.menu-title');
  const onClickHandlers = [];
  const btns = builds.map((b, i) => {
    const btn = document.createElement('button');
    btn.className = 'build-btn';
    btn.textContent = b.name;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      for (const h of onClickHandlers) h(i);
    });
    list.appendChild(btn);
    return btn;
  });

  // Menu header behavior on small screens: tap header to expand/collapse.
  const menuClose = menu.querySelector('#explore-menu-close');
  const menuHeader = menu.querySelector('.menu-header');
  const closeMenu = () => menu.classList.remove('open');
  menuClose.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeMenu(); });
  menuHeader.addEventListener('click', (e) => {
    if (e.target === menuClose) return;
    if (!document.body.classList.contains('touch')) return;
    if (menu.classList.contains('open')) return;
    e.preventDefault();
    menu.classList.add('open');
  });

  // Selected-build chip (centered, hidden on touch since there's no crosshair)
  const chip = document.createElement('div');
  chip.id = 'explore-chip';
  document.body.appendChild(chip);

  // Touch controls (visible only when body.touch). Built unconditionally so
  // CSS controls visibility; cheap and avoids branching.
  const touch = document.createElement('div');
  touch.id = 'touch-controls';
  touch.innerHTML = `
    <div id="touch-joystick" class="no-look"><div class="knob"></div></div>
    <button id="touch-up"    class="touch-btn no-look" aria-label="Up">▲</button>
    <button id="touch-down"  class="touch-btn no-look" aria-label="Down">▼</button>
    <button id="touch-menu"  class="touch-btn no-look" aria-label="Builds">≡</button>
    <button id="touch-build" class="touch-btn no-look" aria-label="Spawn">Spawn</button>
  `;
  document.body.appendChild(touch);

  return {
    status(msg) {
      if (!msg) { status.style.opacity = 0; return; }
      status.textContent = msg;
      status.style.opacity = 1;
    },
    setSelected(i) {
      btns.forEach((b, j) => {
        if (j === i) b.dataset.active = '1';
        else delete b.dataset.active;
      });
      const onTouch = document.body.classList.contains('touch');
      chip.innerHTML = `<b>${builds[i].name}</b> &nbsp;<span style="opacity:0.7">— press B</span>`;
      menuTitle.textContent = onTouch ? `Build: ${builds[i].name}` : 'Tell Claude what to build';
      btns[i].scrollIntoView({ block: 'nearest' });
    },
    onMenuClick(handler) { onClickHandlers.push(handler); },
    toggleMenu() { menu.classList.toggle('open'); },
    closeMenu,
  };
}
