import * as THREE from 'three';
import { STATUS_COLORS, TASK_SIZES, BLOCK_COLORS, Block } from './Textures.js';

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
    const terrainY = this.world.getHighestBlock(
      task.position.x + Math.floor(dim.w / 2),
      task.position.z + Math.floor(dim.w / 2)
    ) + 1;
    const baseY = Math.max(task.position.y, terrainY);

    const container = new THREE.Group();
    const meshes = []; // for cleanup

    // Compute footprint extents (used for hit-testing and label placement)
    let extents;
    if (task.structure?.length) {
      extents = this._buildAIStructure(container, task, baseY, meshes);
    } else {
      extents = this._buildDefaultTower(container, task, baseY, meshes);
    }

    // --- Floating label ---
    const label = this._makeLabel(task.name, task.size, task.status);
    label.position.set(
      task.position.x + extents.cx,
      baseY + extents.height + 1.5,
      task.position.z + extents.cz
    );
    container.add(label);

    this.group.add(container);
    this.tasks.set(task.id, { ...task, baseY, container, meshes, label, extents });
  }

  _buildDefaultTower(container, task, baseY, meshes) {
    const dim = TASK_SIZES[task.size] || TASK_SIZES.M;
    const color = STATUS_COLORS[task.status] || STATUS_COLORS.todo;

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
    meshes.push({ mesh: instMesh, geo: blockGeo, mat: blockMat });

    return {
      minX: 0, maxX: dim.w, minZ: 0, maxZ: dim.w,
      cx: dim.w / 2, cz: dim.w / 2, height: dim.h,
    };
  }

  _buildAIStructure(container, task, baseY, meshes) {
    // Group blocks by type for one InstancedMesh per block type
    const byType = new Map();
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxYRel = 0;
    for (const b of task.structure) {
      if (!byType.has(b.block)) byType.set(b.block, []);
      byType.get(b.block).push(b);
      if (b.x < minX) minX = b.x;
      if (b.x > maxX) maxX = b.x;
      if (b.z < minZ) minZ = b.z;
      if (b.z > maxZ) maxZ = b.z;
      if (b.y > maxYRel) maxYRel = b.y;
    }
    // Status tint (subtle so AI's color choices remain dominant)
    const tint = STATUS_COLORS[task.status] || STATUS_COLORS.todo;
    const tintStrength = 0.18;

    const matrix = new THREE.Matrix4();
    const tmpColor = new THREE.Color();
    for (const [blockType, blocks] of byType) {
      const colors = BLOCK_COLORS[blockType] || BLOCK_COLORS[Block.STONE];
      const base = colors.top;
      const geo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
      const mat = new THREE.MeshLambertMaterial();
      const mesh = new THREE.InstancedMesh(geo, mat, blocks.length);

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        matrix.setPosition(
          task.position.x + b.x + 0.5,
          baseY + b.y + 0.5,
          task.position.z + b.z + 0.5
        );
        mesh.setMatrixAt(i, matrix);
        const v = 0.92 + hash(b.x * 31 + b.y * 17 + b.z * 7) * 0.16;
        tmpColor.setRGB(
          Math.min(1, base[0] * (1 - tintStrength) * v + tint[0] * tintStrength),
          Math.min(1, base[1] * (1 - tintStrength) * v + tint[1] * tintStrength),
          Math.min(1, base[2] * (1 - tintStrength) * v + tint[2] * tintStrength)
        );
        mesh.setColorAt(i, tmpColor);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true;
      container.add(mesh);
      meshes.push({ mesh, geo, mat });
    }

    return {
      minX, maxX: maxX + 1, minZ, maxZ: maxZ + 1,
      cx: (minX + maxX + 1) / 2, cz: (minZ + maxZ + 1) / 2,
      height: maxYRel + 1,
    };
  }

  updateTask(task) {
    this.removeTask(task.id);
    this.addTask(task);
  }

  removeTask(id) {
    const t = this.tasks.get(id);
    if (!t) return;
    this.group.remove(t.container);
    for (const m of t.meshes || []) {
      m.geo.dispose();
      m.mat.dispose();
    }
    if (t.label.material.map) t.label.material.map.dispose();
    t.label.material.dispose();
    this.tasks.delete(id);
  }

  getTaskAtPosition(x, y, z) {
    for (const [, task] of this.tasks) {
      const e = task.extents;
      if (!e) continue;
      if (x >= task.position.x + e.minX && x < task.position.x + e.maxX &&
          z >= task.position.z + e.minZ && z < task.position.z + e.maxZ &&
          y >= task.baseY && y < task.baseY + e.height) {
        return task;
      }
    }
    return null;
  }

  getTasks() {
    return [...this.tasks.values()];
  }

  getRaycastTargets() {
    const out = [];
    for (const [, t] of this.tasks)
      for (const m of t.meshes || []) out.push(m.mesh);
    return out;
  }

  getTaskByMesh(mesh) {
    for (const [, task] of this.tasks)
      for (const m of task.meshes || [])
        if (m.mesh === mesh) return task;
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
