import * as THREE from 'three';
import { STATUS_COLORS, TASK_SIZES } from './Textures.js';

export class TaskManager {
  constructor(scene, world) {
    this.scene = scene;
    this.world = world;
    this.tasks = new Map();
    this.group = new THREE.Group();
    scene.add(this.group);
  }

  addTask(task) {
    if (this.tasks.has(task.id)) this.removeTask(task.id);

    const dim = TASK_SIZES[task.size] || TASK_SIZES.M;
    const color = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
    const terrainY = this.world.getHighestBlock(
      task.position.x + Math.floor(dim.w / 2),
      task.position.z + Math.floor(dim.w / 2)
    ) + 1;
    const baseY = Math.max(task.position.y, terrainY);

    const container = new THREE.Group();

    // --- Structure blocks ---
    const count = dim.w * dim.w * dim.h;
    const blockGeo = new THREE.BoxGeometry(0.92, 0.92, 0.92);
    const blockMat = new THREE.MeshLambertMaterial();
    const instMesh = new THREE.InstancedMesh(blockGeo, blockMat, count);

    const matrix = new THREE.Matrix4();
    const tmpColor = new THREE.Color();
    let idx = 0;

    for (let y = 0; y < dim.h; y++) {
      for (let x = 0; x < dim.w; x++) {
        for (let z = 0; z < dim.w; z++) {
          matrix.setPosition(
            task.position.x + x + 0.5,
            baseY + y + 0.5,
            task.position.z + z + 0.5
          );
          instMesh.setMatrixAt(idx, matrix);

          // Color with variation and slight gradient (lighter at top)
          const heightFade = 0.85 + 0.15 * (y / dim.h);
          const v = (0.88 + hash(idx) * 0.24) * heightFade;
          tmpColor.setRGB(
            Math.min(1, color[0] * v),
            Math.min(1, color[1] * v),
            Math.min(1, color[2] * v)
          );
          instMesh.setColorAt(idx, tmpColor);
          idx++;
        }
      }
    }
    instMesh.instanceMatrix.needsUpdate = true;
    instMesh.instanceColor.needsUpdate = true;
    container.add(instMesh);

    // --- Floating label ---
    const label = this._makeLabel(task.name, task.size, task.status);
    label.position.set(
      task.position.x + dim.w / 2,
      baseY + dim.h + 1.5,
      task.position.z + dim.w / 2
    );
    container.add(label);

    this.group.add(container);
    this.tasks.set(task.id, { ...task, baseY, container, instMesh, label, blockGeo, blockMat });
  }

  updateTask(task) {
    this.removeTask(task.id);
    this.addTask(task);
  }

  removeTask(id) {
    const t = this.tasks.get(id);
    if (!t) return;
    this.group.remove(t.container);
    t.blockGeo.dispose();
    t.blockMat.dispose();
    if (t.label.material.map) t.label.material.map.dispose();
    t.label.material.dispose();
    this.tasks.delete(id);
  }

  getTaskAtPosition(x, y, z) {
    for (const [, task] of this.tasks) {
      const dim = TASK_SIZES[task.size] || TASK_SIZES.M;
      if (x >= task.position.x && x < task.position.x + dim.w &&
          z >= task.position.z && z < task.position.z + dim.w &&
          y >= task.baseY && y < task.baseY + dim.h) {
        return task;
      }
    }
    return null;
  }

  getTasks() {
    return [...this.tasks.values()];
  }

  getRaycastTargets() {
    return [...this.tasks.values()].map(t => t.instMesh);
  }

  getTaskByMesh(mesh) {
    for (const [, task] of this.tasks) {
      if (task.instMesh === mesh) return task;
    }
    return null;
  }

  _makeLabel(name, size, status) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.roundRect(0, 0, 512, 128, 16);
    ctx.fill();

    // Status bar
    const sc = STATUS_COLORS[status] || STATUS_COLORS.todo;
    ctx.fillStyle = `rgb(${sc.map(c => Math.round(c * 255)).join(',')})`;
    ctx.beginPath();
    ctx.roundRect(12, 12, 8, 104, 4);
    ctx.fill();

    // Task name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 36, 44, 460);

    // Size & status
    const labels = { todo: 'TO DO', wip: 'IN PROGRESS', done: 'DONE', blocked: 'BLOCKED' };
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(`${size}`, 36, 90);
    ctx.fillStyle = `rgb(${sc.map(c => Math.round(c * 255)).join(',')})`;
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(labels[status] || status, 70, 90);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(6, 1.5, 1);
    sprite.renderOrder = 1;
    return sprite;
  }
}

function hash(n) {
  n = Math.imul(n ^ (n >>> 15), 2654435769);
  return ((n ^ (n >>> 13)) >>> 0) / 4294967296;
}
