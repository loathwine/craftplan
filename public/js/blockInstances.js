// Instanced block rendering for the lightweight viewers (models.html, qa.html).
// Mirrors World.js's look: BLOCK_COLORS are *linear* (same as the chunk mesher's
// vertex colours), matte blocks use Lambert, and blocks with BLOCK_MATERIALS get
// a MeshStandardMaterial per block type (metal / gloss / emissive / water).
// Pair with `scene.environment = makeSkyEnvMap(renderer, scene)` so metals reflect.
import * as THREE from 'three';
import { BLOCK_COLORS, BLOCK_MATERIALS, TRANSPARENT_BLOCKS, colorVariation } from './Textures.js';

const BOX = new THREE.BoxGeometry(1, 1, 1);
const FALLBACK = { side: [0.6, 0.6, 0.6] };

// pts: [{x,y,z,block}] already in viewer coords; offset: (x,y,z) added to each.
export function addBlockInstances(group, pts, offset = [0, 0, 0]) {
  const buckets = new Map(); // key -> { pts, mat }
  const bucket = (key, makeMat) => {
    if (!buckets.has(key)) buckets.set(key, { pts: [], mat: makeMat() });
    return buckets.get(key).pts;
  };
  for (const p of pts) {
    const mp = BLOCK_MATERIALS[p.block];
    const trans = TRANSPARENT_BLOCKS.has(p.block);
    if (mp) {
      bucket(`s${p.block}`, () => {
        const c = (BLOCK_COLORS[p.block] || FALLBACK).side;
        return new THREE.MeshStandardMaterial({
          roughness: mp.roughness, metalness: mp.metalness,
          emissive: new THREE.Color(c[0], c[1], c[2]), emissiveIntensity: mp.emissive,
          ...(trans ? { transparent: true, opacity: 0.62, depthWrite: false } : {}),
        });
      }).push(p);
    } else if (trans) {
      bucket('t', () => new THREE.MeshLambertMaterial({ transparent: true, opacity: 0.55 })).push(p);
    } else {
      bucket('o', () => new THREE.MeshLambertMaterial()).push(p);
    }
  }

  const m = new THREE.Matrix4(), col = new THREE.Color();
  for (const [key, { pts: arr, mat }] of buckets) {
    const im = new THREE.InstancedMesh(BOX, mat, arr.length);
    im.castShadow = !mat.transparent; im.receiveShadow = true;
    arr.forEach((p, i) => {
      m.setPosition(p.x + offset[0], p.y + offset[1], p.z + offset[2]);
      im.setMatrixAt(i, m);
      const c = (BLOCK_COLORS[p.block] || FALLBACK).side;
      // Emissive blocks: damp the lit diffuse so colour comes from the glow.
      const v = colorVariation(p.x, p.y, p.z) * ((BLOCK_MATERIALS[p.block]?.emissive ?? 0) > 0 ? 0.15 : 1);
      col.setRGB(Math.min(1, c[0] * v), Math.min(1, c[1] * v), Math.min(1, c[2] * v));
      im.setColorAt(i, col);
    });
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.renderOrder = mat.transparent ? 1 : 0;
    group.add(im);
  }
}
