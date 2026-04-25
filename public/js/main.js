import * as THREE from 'three';
import { Block, TASK_SIZES } from './Textures.js';
import { World, WORLD_HEIGHT, WORLD_SIZE } from './World.js';
import { Network } from './Network.js';
import { TaskManager } from './TaskManager.js';
import { UI } from './UI.js';

// --- State ---
let scene, camera, renderer, clock;
let world, network, taskManager, ui;

const pos = new THREE.Vector3(64, 30, 64);
let yaw = 0, pitch = 0, velY = 0, onGround = false;
let flying = false;
let pointerLocked = false;
const keys = {};
const otherPlayers = new Map();

// Block targeting
let highlight;
let target = null;     // { hit: [x,y,z], place: [x,y,z] } for world blocks
let targetTask = null; // task object if aiming at a task structure
const raycaster = new THREE.Raycaster();
raycaster.far = 7;

let lastNetSend = 0;

// --- Constants ---
const GRAVITY = 25;
const JUMP_VEL = 9;
const MOVE_SPEED = 5.5;
const SPRINT_SPEED = 8.5;
const FLY_SPEED = 12;
const EYE_HEIGHT = 1.62;
const PW = 0.29; // player half-width

// =====================================================
// INIT
// =====================================================
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8e3);
  scene.fog = new THREE.Fog(0x7ec8e3, 60, 150);

  camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 300);
  const canvas = document.getElementById('game');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight(0x808080));
  const sun = new THREE.DirectionalLight(0xfff4e0, 0.85);
  sun.position.set(80, 120, 40);
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0x87CEEB, 0x556633, 0.45));

  clock = new THREE.Clock();

  // World
  world = new World(scene);

  // Block highlight
  const hlGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.005, 1.005, 1.005));
  highlight = new THREE.LineSegments(hlGeo, new THREE.LineBasicMaterial({
    color: 0x000000, transparent: true, opacity: 0.45,
  }));
  highlight.visible = false;
  highlight.renderOrder = 2;
  scene.add(highlight);

  // Task manager
  taskManager = new TaskManager(scene, world);

  // UI
  ui = new UI({
    onJoin: startGame,
    onTaskCreate: (n, d, s) => {
      network?.sendTaskCreate(n, d, s, getTaskSpawnPosition());
    },
    onTaskUpdate: (id, ch) => network?.sendTaskUpdate(id, ch),
    onTaskDelete: (id) => network?.sendTaskDelete(id),
    onChat: (msg) => network?.sendChat(msg),
  });

  setupControls(canvas);

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  animate();
}

// =====================================================
// START GAME (after join)
// =====================================================
function startGame(name) {
  network = new Network({
    onWelcome(msg) {
      ui.hideJoinScreen();
      // Spawn above terrain
      const sy = world.getHighestBlock(64, 64) + 2;
      pos.set(64, sy, 64);

      for (const p of msg.players) addRemotePlayer(p);
      for (const t of msg.tasks) taskManager.addTask(t);
      ui.renderTaskList(taskManager.getTasks());
      if (msg.blockChanges && Object.keys(msg.blockChanges).length)
        world.applyBlockChanges(msg.blockChanges);

      ui.addChatMessage('', 'Welcome to CraftPlan! Press T to manage tasks.', true);
      ui.updatePlayerCount(otherPlayers.size + 1);
      document.getElementById('game').requestPointerLock();
    },

    onPlayerJoin(p) {
      addRemotePlayer(p);
      ui.addChatMessage('', `${p.name} joined`, true);
      ui.updatePlayerCount(otherPlayers.size + 1);
    },

    onPlayerMove(msg) {
      const p = otherPlayers.get(msg.id);
      if (p) {
        p.targetPos.set(msg.position[0], msg.position[1], msg.position[2]);
        p.targetRotY = msg.rotation[0];
      }
    },

    onPlayerLeave(id) {
      removeRemotePlayer(id);
      ui.updatePlayerCount(otherPlayers.size + 1);
    },

    onChat(msg) { ui.addChatMessage(msg.name, msg.message); },

    onBlockUpdate(msg) { world.setBlock(msg.x, msg.y, msg.z, msg.block); },

    onTaskCreated(task) {
      taskManager.addTask(task);
      ui.renderTaskList(taskManager.getTasks());
      ui.addChatMessage('', `New task: "${task.name}" [${task.size}]`, true);
    },

    onTaskUpdated(task) {
      taskManager.updateTask(task);
      ui.renderTaskList(taskManager.getTasks());
      ui.updateTaskDetail(task);
    },

    onTaskDeleted(id) {
      taskManager.removeTask(id);
      ui.renderTaskList(taskManager.getTasks());
    },

    onDisconnect() { ui.addChatMessage('', 'Disconnected from server', true); },
    onWorldReset() { location.reload(); },
  });

  network.connect(name);
}

// =====================================================
// CONTROLS
// =====================================================
function setupControls(canvas) {
  canvas.addEventListener('click', () => {
    if (!ui.isInputFocused() && !ui.isTaskPanelOpen && !ui.isTaskDetailOpen) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });

  document.addEventListener('mousemove', (e) => {
    if (!pointerLocked) return;
    yaw -= e.movementX * 0.006;
    pitch -= e.movementY * 0.006;
    pitch = Math.max(-1.55, Math.min(1.55, pitch));
  });

  canvas.addEventListener('mousedown', (e) => {
    if (!pointerLocked) return;
    if (e.button === 0) breakBlock();
    if (e.button === 2) placeBlock();
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (ui.isInputFocused()) return;

    if (e.code === 'KeyT' && !ui.isChatActive) {
      e.preventDefault();
      const open = ui.toggleTaskPanel();
      if (open) document.exitPointerLock();
    }
    if (e.code === 'Enter' && !ui.isChatActive && !ui.isTaskPanelOpen) {
      e.preventDefault();
      ui.activateChat();
      document.exitPointerLock();
    }
    if (e.code === 'KeyF' && !ui.isChatActive && !ui.isTaskPanelOpen) {
      flying = !flying;
      velY = 0;
      ui.addChatMessage('', flying ? 'Fly mode ON' : 'Fly mode OFF', true);
    }
    if (e.code === 'KeyE') {
      if (ui.isTaskDetailOpen) {
        ui.hideTaskDetail();
        canvas.requestPointerLock();
      } else if (pointerLocked && targetTask) {
        ui.showTaskDetail(targetTask);
        document.exitPointerLock();
      }
    }
    if (e.code === 'Escape') {
      if (ui.isTaskDetailOpen) {
        ui.hideTaskDetail();
        canvas.requestPointerLock();
      } else if (ui.isTaskPanelOpen) {
        ui.toggleTaskPanel();
        canvas.requestPointerLock();
      }
    }
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) ui.handleNumberKey(num);
  });

  document.addEventListener('keyup', (e) => { keys[e.code] = false; });

  canvas.addEventListener('wheel', (e) => {
    if (pointerLocked) ui.handleScroll(e.deltaY);
  });
}

// =====================================================
// PHYSICS
// =====================================================
function canStandAt(x, y, z) {
  for (let bx = Math.floor(x - PW); bx <= Math.floor(x + PW); bx++) {
    for (let bz = Math.floor(z - PW); bz <= Math.floor(z + PW); bz++) {
      for (let by = Math.floor(y); by <= Math.floor(y + 1.79); by++) {
        if (world.getBlock(bx, by, bz) !== Block.AIR) return false;
      }
    }
  }
  return true;
}

function updatePhysics(dt) {
  if (!network) return;
  dt = Math.min(dt, 0.05);
  const inputOk = !ui.isInputFocused();

  if (flying) {
    // --- Fly mode: no gravity, no collision ---
    const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    const move = new THREE.Vector3();
    if (inputOk) {
      if (keys['KeyW']) move.add(fwd);
      if (keys['KeyS']) move.sub(fwd);
      if (keys['KeyD']) move.add(right);
      if (keys['KeyA']) move.sub(right);
      if (keys['Space']) move.y += 1;
      if (keys['ShiftLeft'] || keys['ShiftRight']) move.y -= 1;
    }
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(FLY_SPEED * dt);
      pos.add(move);
    }
    velY = 0;
  } else {
    // --- Normal mode: gravity + collision ---
    velY -= GRAVITY * dt;
    velY = Math.max(velY, -35);
    const newY = pos.y + velY * dt;

    if (canStandAt(pos.x, newY, pos.z)) {
      pos.y = newY;
      onGround = false;
    } else {
      if (velY <= 0) {
        let gy = Math.floor(pos.y);
        while (gy > 0 && canStandAt(pos.x, gy - 1, pos.z)) gy--;
        pos.y = gy;
        onGround = true;
      }
      velY = 0;
    }

    if (keys['Space'] && onGround && inputOk) {
      velY = JUMP_VEL;
      onGround = false;
    }

    if (inputOk) {
      const sprint = keys['ShiftLeft'] || keys['ShiftRight'];
      const speed = sprint ? SPRINT_SPEED : MOVE_SPEED;
      const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
      const move = new THREE.Vector3();
      if (keys['KeyW']) move.add(fwd);
      if (keys['KeyS']) move.sub(fwd);
      if (keys['KeyD']) move.add(right);
      if (keys['KeyA']) move.sub(right);
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        if (canStandAt(pos.x + move.x, pos.y, pos.z)) pos.x += move.x;
        if (canStandAt(pos.x, pos.y, pos.z + move.z)) pos.z += move.z;
      }
    }
  }

  // World bounds & void respawn
  pos.x = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, pos.x));
  pos.z = Math.max(0.5, Math.min(WORLD_SIZE - 0.5, pos.z));
  pos.y = Math.max(-10, Math.min(WORLD_HEIGHT + 20, pos.y));
  if (pos.y <= -10) { pos.y = world.getHighestBlock(64, 64) + 2; velY = 0; }
}

// =====================================================
// BLOCK INTERACTION
// =====================================================
function getTaskSpawnPosition() {
  const fx = Math.max(1, Math.min(126, Math.floor(pos.x - Math.sin(yaw) * 6)));
  const fz = Math.max(1, Math.min(126, Math.floor(pos.z - Math.cos(yaw) * 6)));
  return { x: fx, y: world.getHighestBlock(fx, fz) + 1, z: fz };
}

// Manual AABB ray test for task structures (InstancedMesh raycasting is unreliable)
const _ray = new THREE.Ray();
const _hitPt = new THREE.Vector3();
const _box = new THREE.Box3();

function findTargetedTask(origin, dir) {
  _ray.set(origin, dir);
  let best = null;
  let bestDist = 20;
  for (const task of taskManager.getTasks()) {
    let minX, maxX, minZ, maxZ, height;
    if (task.extents) {
      minX = task.extents.minX; maxX = task.extents.maxX;
      minZ = task.extents.minZ; maxZ = task.extents.maxZ;
      height = task.extents.height;
    } else {
      const d = TASK_SIZES[task.size] || TASK_SIZES.M;
      minX = 0; maxX = d.w; minZ = 0; maxZ = d.w; height = d.h;
    }
    _box.min.set(task.position.x + minX, task.baseY, task.position.z + minZ);
    _box.max.set(task.position.x + maxX, task.baseY + height, task.position.z + maxZ);
    if (_ray.intersectBox(_box, _hitPt)) {
      const dist = _hitPt.distanceTo(origin);
      if (dist < bestDist) { bestDist = dist; best = { task, dist }; }
    }
  }
  return best;
}

function updateTarget() {
  if (!pointerLocked) { highlight.visible = false; target = null; targetTask = null; return; }

  // Single ray from current player state (camera lags one frame behind)
  const origin = new THREE.Vector3(pos.x, pos.y + EYE_HEIGHT, pos.z);
  const dir = new THREE.Vector3(
    -Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    -Math.cos(yaw) * Math.cos(pitch)
  ).normalize();
  raycaster.set(origin, dir);

  const taskResult = findTargetedTask(origin, dir);
  const chunkHits = raycaster.intersectObjects(world.getChunkMeshes());
  const chunkDist = chunkHits[0]?.distance ?? Infinity;
  const taskDist = taskResult?.dist ?? Infinity;

  if (taskResult && taskDist <= chunkDist) {
    // Aiming at a task structure - highlight the whole thing
    const t = taskResult.task;
    let cx, cz, w, depth, height;
    if (t.extents) {
      cx = t.extents.cx; cz = t.extents.cz;
      w = t.extents.maxX - t.extents.minX;
      depth = t.extents.maxZ - t.extents.minZ;
      height = t.extents.height;
    } else {
      const d = TASK_SIZES[t.size] || TASK_SIZES.M;
      cx = d.w / 2; cz = d.w / 2; w = d.w; depth = d.w; height = d.h;
    }
    highlight.position.set(t.position.x + cx, t.baseY + height / 2, t.position.z + cz);
    highlight.scale.set(w + 0.1, height + 0.1, depth + 0.1);
    highlight.visible = true;
    targetTask = t;
    target = null;
  } else if (chunkHits.length > 0) {
    // Aiming at a world block
    highlight.scale.set(1, 1, 1);
    const n = chunkHits[0].face.normal;
    const p = chunkHits[0].point;
    const hit = [
      Math.floor(p.x - n.x * 0.5), Math.floor(p.y - n.y * 0.5), Math.floor(p.z - n.z * 0.5),
    ];
    const place = [
      Math.floor(p.x + n.x * 0.5), Math.floor(p.y + n.y * 0.5), Math.floor(p.z + n.z * 0.5),
    ];
    highlight.position.set(hit[0] + 0.5, hit[1] + 0.5, hit[2] + 0.5);
    highlight.visible = true;
    targetTask = null;
    target = { hit, place };
  } else {
    highlight.visible = false;
    target = null;
    targetTask = null;
  }
}

function breakBlock() {
  if (targetTask) { ui.showTaskDetail(targetTask); document.exitPointerLock(); return; }
  if (!target) return;
  const [x, y, z] = target.hit;
  const block = world.getBlock(x, y, z);
  if (block === Block.BEDROCK) return;
  world.setBlock(x, y, z, Block.AIR);
  network?.sendBlockBreak(x, y, z);
}

function placeBlock() {
  if (!target) return;
  const [x, y, z] = target.place;
  if (y < 0 || y >= WORLD_HEIGHT) return;

  // Don't place inside self
  if (x >= Math.floor(pos.x - PW) && x <= Math.floor(pos.x + PW) &&
      z >= Math.floor(pos.z - PW) && z <= Math.floor(pos.z + PW) &&
      y >= Math.floor(pos.y) && y <= Math.floor(pos.y + 1.8)) return;

  const bt = ui.selectedBlock;
  world.setBlock(x, y, z, bt);
  network?.sendBlockPlace(x, y, z, bt);
}

// =====================================================
// REMOTE PLAYERS
// =====================================================
function addRemotePlayer(data) {
  const group = new THREE.Group();
  const col = new THREE.Color(data.color);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 1.2, 0.35),
    new THREE.MeshLambertMaterial({ color: col })
  );
  body.position.y = 0.6;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.42, 0.42),
    new THREE.MeshLambertMaterial({ color: 0xffcc88 })
  );
  head.position.y = 1.42;
  group.add(head);

  const tag = makeNameSprite(data.name);
  tag.position.y = 2.0;
  group.add(tag);

  group.position.set(...data.position);
  scene.add(group);

  otherPlayers.set(data.id, {
    mesh: group,
    targetPos: new THREE.Vector3(...data.position),
    targetRotY: data.rotation?.[0] || 0,
    name: data.name,
  });
}

function removeRemotePlayer(id) {
  const p = otherPlayers.get(id);
  if (!p) return;
  scene.remove(p.mesh);
  p.mesh.traverse(c => {
    if (c.geometry) c.geometry.dispose();
    if (c.material) { c.material.map?.dispose(); c.material.dispose(); }
  });
  ui.addChatMessage('', `${p.name} left`, true);
  otherPlayers.delete(id);
}

function makeNameSprite(name) {
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
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const s = new THREE.Sprite(mat);
  s.scale.set(2.5, 0.625, 1);
  s.renderOrder = 1;
  return s;
}

function updateRemotePlayers(dt) {
  for (const [, p] of otherPlayers) {
    p.mesh.position.lerp(p.targetPos, Math.min(1, dt * 10));
    p.mesh.children[0].rotation.y = -p.targetRotY;
  }
}

// =====================================================
// GAME LOOP
// =====================================================
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  updatePhysics(dt);
  updateTarget();
  updateRemotePlayers(dt);

  camera.position.set(pos.x, pos.y + EYE_HEIGHT, pos.z);
  camera.rotation.order = 'YXZ';
  camera.rotation.set(pitch, yaw, 0);

  // Network sync @ 10 Hz
  const now = performance.now();
  if (network && now - lastNetSend > 100) {
    lastNetSend = now;
    network.sendMove([pos.x, pos.y, pos.z], [yaw, pitch]);
  }

  ui.updateCoords(pos.x, pos.y, pos.z, flying);
  renderer.render(scene, camera);
}

// =====================================================
init();
