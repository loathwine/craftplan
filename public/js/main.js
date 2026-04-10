import * as THREE from 'three';
import { Block } from './Textures.js';
import { World, WORLD_HEIGHT } from './World.js';
import { Network } from './Network.js';
import { TaskManager } from './TaskManager.js';
import { UI } from './UI.js';

// --- State ---
let scene, camera, renderer, clock;
let world, network, taskManager, ui;

const pos = new THREE.Vector3(64, 30, 64);
let yaw = 0, pitch = 0, velY = 0, onGround = false;
let pointerLocked = false;
const keys = {};
const otherPlayers = new Map();

// Block targeting
let highlight;
let target = null; // { hit: [x,y,z], place: [x,y,z] }
const raycaster = new THREE.Raycaster();
raycaster.far = 7;

let lastNetSend = 0;

// --- Constants ---
const GRAVITY = 25;
const JUMP_VEL = 9;
const MOVE_SPEED = 5.5;
const SPRINT_SPEED = 8.5;
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
    onTaskCreate: (n, d, s) => network?.sendTaskCreate(n, d, s),
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
  ui.hideJoinScreen();

  network = new Network({
    onWelcome(msg) {
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
  });

  network.connect(name);
  document.getElementById('game').requestPointerLock();
}

// =====================================================
// CONTROLS
// =====================================================
function setupControls(canvas) {
  canvas.addEventListener('click', () => {
    if (!ui.isInputFocused() && !ui.isTaskPanelOpen) {
      canvas.requestPointerLock();
    }
  });

  document.addEventListener('pointerlockchange', () => {
    pointerLocked = document.pointerLockElement === canvas;
  });

  document.addEventListener('mousemove', (e) => {
    if (!pointerLocked) return;
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
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
    if (e.code === 'Escape') {
      if (ui.isTaskPanelOpen) ui.toggleTaskPanel();
      ui.hideTaskDetail();
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

  // Gravity
  velY -= GRAVITY * dt;
  velY = Math.max(velY, -35); // terminal velocity
  const newY = pos.y + velY * dt;

  if (canStandAt(pos.x, newY, pos.z)) {
    pos.y = newY;
    onGround = false;
  } else {
    if (velY <= 0) {
      // Snap to ground: step down from current floor-position
      let gy = Math.floor(pos.y);
      while (gy > 0 && canStandAt(pos.x, gy - 1, pos.z)) gy--;
      pos.y = gy;
      onGround = true;
    }
    velY = 0;
  }

  // Jump
  if (keys['Space'] && onGround && !ui.isInputFocused()) {
    velY = JUMP_VEL;
    onGround = false;
  }

  // Movement
  if (ui.isInputFocused()) return;
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

  // World bounds & void respawn
  pos.x = Math.max(0.5, Math.min(127.5, pos.x));
  pos.z = Math.max(0.5, Math.min(127.5, pos.z));
  if (pos.y < -10) { pos.y = world.getHighestBlock(64, 64) + 2; velY = 0; }
}

// =====================================================
// BLOCK INTERACTION
// =====================================================
function updateTarget() {
  if (!pointerLocked) { highlight.visible = false; target = null; return; }

  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(world.getChunkMeshes());

  if (hits.length > 0) {
    const h = hits[0];
    const n = h.face.normal;
    const p = h.point;

    const hit = [
      Math.floor(p.x - n.x * 0.5),
      Math.floor(p.y - n.y * 0.5),
      Math.floor(p.z - n.z * 0.5),
    ];
    const place = [
      Math.floor(p.x + n.x * 0.5),
      Math.floor(p.y + n.y * 0.5),
      Math.floor(p.z + n.z * 0.5),
    ];

    highlight.position.set(hit[0] + 0.5, hit[1] + 0.5, hit[2] + 0.5);
    highlight.visible = true;
    target = { hit, place };
  } else {
    highlight.visible = false;
    target = null;
  }
}

function breakBlock() {
  if (!target) return;
  const [x, y, z] = target.hit;
  const block = world.getBlock(x, y, z);
  if (block === Block.BEDROCK) return;

  // Check for task structure click
  const task = taskManager.getTaskAtPosition(x, y, z);
  if (task) { ui.showTaskDetail(task); return; }

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

  ui.updateCoords(pos.x, pos.y, pos.z);
  renderer.render(scene, camera);
}

// =====================================================
init();
