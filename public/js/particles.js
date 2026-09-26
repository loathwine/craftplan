// GPU particle effects for voxel emitters (fire, lava embers, electric sparks)
// plus CPU lightning arcs. Every particle's state is a pure function of
// (uTime, seed): no per-frame simulation, deterministic for the recorder, and
// the only CPU work is rebuilding the attribute buffers when emitters change.
//
// Emitters come from World: a list of {x,y,z, block} cells (see BLOCK_EMITTERS).
import * as THREE from 'three';
import { BLOCK_COLORS, BLOCK_EMITTERS } from './Textures.js';

const KIND = { flame: 0, ember: 1, spark: 2, smoke: 3 };
const MAX_PARTICLES = 60000;

const hash = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };

const VS = /* glsl */`
uniform float uTime;
uniform float uScale;
attribute vec3 emitter;
attribute vec3 tint;
attribute vec2 seedKind;       // x = seed 0..1, y = kind
varying vec3 vColor;
varying float vAlpha;
varying float vKind;
float h1(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
void main() {
  float seed = seedKind.x, kind = seedKind.y;
  vec3 p = emitter + vec3(0.5, 0.0, 0.5);
  float size = 0.0, a = 0.0;
  vec3 col = tint;
  if (kind < 0.5) {                               // flame
    float life = 0.7 + 0.4 * seed;
    float ph = uTime / life + seed * 7.0, cyc = floor(ph), age = fract(ph);
    float r1 = h1(seed * 91.0 + cyc) - 0.5, r2 = h1(seed * 53.0 + cyc * 1.7) - 0.5;
    float sway = sin(uTime * 7.0 + seed * 40.0) * 0.07 * age;
    p += vec3(r1 * 0.8 * (1.0 - age) + sway, 0.05 + age * (1.6 + 0.8 * seed), r2 * 0.8 * (1.0 - age));
    size = mix(1.1, 0.25, age);
    col = mix(vec3(2.2, 1.15, 0.28), vec3(1.5, 0.3, 0.04), smoothstep(0.05, 0.7, age));
    a = smoothstep(0.0, 0.08, age) * (1.0 - age);
  } else if (kind < 1.5) {                        // ember
    float life = 2.2 + 1.2 * seed;
    float ph = uTime / life + seed * 5.0, cyc = floor(ph), age = fract(ph);
    float r1 = h1(seed * 17.0 + cyc) - 0.5, r2 = h1(seed * 29.0 + cyc * 3.1) - 0.5;
    p += vec3(r1 * 0.9 + sin(uTime * 1.3 + seed * 20.0) * 0.5 * age,
              1.0 + age * (2.5 + 2.5 * seed),
              r2 * 0.9 + cos(uTime * 1.1 + seed * 30.0) * 0.5 * age);
    size = 0.28;
    col = vec3(4.0, 1.5, 0.3);
    a = (1.0 - age) * (0.6 + 0.4 * step(0.5, fract(uTime * 9.0 + seed * 13.0)));
  } else if (kind < 2.5) {                        // spark: short flick, then idle
    float period = 0.9 + 1.1 * seed;
    float ph = uTime / period + seed * 3.0, cyc = floor(ph), local = fract(ph) * period;
    float life = 0.18;
    float age = local / life;
    vec3 dir = normalize(vec3(h1(seed * 11.0 + cyc) - 0.5, h1(seed * 23.0 + cyc) - 0.3, h1(seed * 37.0 + cyc) - 0.5));
    float jit = floor(age * 5.0);
    p += vec3(0.0, 0.5, 0.0) + dir * (0.55 + age * 0.9)
       + 0.12 * vec3(h1(seed + jit) - 0.5, h1(seed * 2.0 + jit) - 0.5, h1(seed * 3.0 + jit) - 0.5);
    size = 0.32;
    col = tint * 6.0 + vec3(1.5);
    a = age < 1.0 ? 1.0 : 0.0;
  } else {                                        // smoke (separate, normal-blended)
    float life = 3.2 + 1.0 * seed;
    float ph = uTime / life + seed * 4.0, cyc = floor(ph), age = fract(ph);
    float r1 = h1(seed * 71.0 + cyc) - 0.5, r2 = h1(seed * 43.0 + cyc) - 0.5;
    p += vec3(r1 * 0.5 + sin(uTime * 0.7 + seed * 9.0) * 0.6 * age, 1.2 + age * 3.2, r2 * 0.5);
    size = mix(0.7, 2.6, age);
    col = vec3(0.16, 0.15, 0.15);
    a = 0.4 * smoothstep(0.0, 0.2, age) * (1.0 - age);
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  // Clamp screen size: a particle right in front of the lens would otherwise
  // fill the screen (hundreds of those = GPU watchdog / context loss).
  float dist = -mv.z;
  gl_PointSize = (a > 0.0 && dist > 1.0) ? min(size * uScale / dist, 96.0) : 0.0;
  vColor = col; vAlpha = a; vKind = kind;
}`;

const FS = /* glsl */`
varying vec3 vColor;
varying float vAlpha;
varying float vKind;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float soft = vKind > 1.5 && vKind < 2.5 ? smoothstep(0.5, 0.15, d) : smoothstep(0.5, 0.0, d);
  float a = soft * vAlpha;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vColor * a, a);
}`;

function makePoints(additive) {
  const geo = new THREE.BufferGeometry();
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uScale: { value: 500 } },
    vertexShader: VS, fragmentShader: FS,
    transparent: true, depthWrite: false,
    blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  if (!additive) {
    // premultiplied smoke: src*1 + dst*(1-a)
    mat.blending = THREE.CustomBlending;
    mat.blendSrc = THREE.OneFactor; mat.blendDst = THREE.OneMinusSrcAlphaFactor;
  }
  const pts = new THREE.Points(geo, mat);
  pts.frustumCulled = false;
  pts.renderOrder = additive ? 3 : 2;
  return pts;
}

export class VoxelParticles {
  constructor(parent) {
    this.glow = makePoints(true);
    this.smoke = makePoints(false);
    // Lightning: dense trail of soft HDR points (thick glowing bolts; GL lines are 1px).
    this.arcs = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({
      size: 0.35, sizeAttenuation: true, map: discTexture(),   // PointsMaterial: GPU caps size color: new THREE.Color(2.2, 4.0, 6.0),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.arcs.frustumCulled = false;
    this.arcs.renderOrder = 3;
    this.group = new THREE.Group();
    this.group.add(this.smoke, this.glow, this.arcs);
    parent.add(this.group);
    this._arcSources = [];
    this._arcCycle = -1;
    this.time = 0;
    const tick = (renderer) => {
      const h = renderer.getDrawingBufferSize(new THREE.Vector2()).y;
      for (const m of [this.glow.material, this.smoke.material]) {
        m.uniforms.uTime.value = this.time;
        m.uniforms.uScale.value = h * 0.95;       // ≈ h / (2·tan(fov/2)) for fov ~55°
      }
      // Geometry swapped inside a render callback only shows next frame; the
      // recorder avoids that by calling update(t) up front via World.setTime.
      if (!this._drivenExternally) this._updateArcs();
    };
    this.glow.onBeforeRender = tick;
  }

  // Advance to time t before rendering (deterministic path).
  update(t) { this._drivenExternally = true; this.time = t; this._updateArcs(); }

  // cells: flat Int32Array/array of x,y,z,block quadruples
  setEmitters(cells) {
    const glow = [], smoke = [];
    const arcSrc = [];
    for (let i = 0; i < cells.length; i += 4) {
      const x = cells[i], y = cells[i + 1], z = cells[i + 2], b = cells[i + 3];
      const em = BLOCK_EMITTERS[b]; if (!em) continue;
      const tint = BLOCK_COLORS[b].side;
      const cellSeed = hash(x * 0.137 + y * 1.93 + z * 0.711);
      for (const kindName in em) {
        if (kindName === 'arc') { arcSrc.push(x + 0.5, y + 0.5, z + 0.5); continue; }
        let n = em[kindName];
        if (n < 1) n = hash(cellSeed * 97.1 + KIND[kindName]) < n ? 1 : 0;
        const dst = kindName === 'smoke' ? smoke : glow;
        for (let k = 0; k < n; k++) dst.push(x, y, z, tint[0], tint[1], tint[2], hash(cellSeed * 13.7 + k * 1.618 + KIND[kindName]), KIND[kindName]);
      }
    }
    fill(this.glow.geometry, glow);
    fill(this.smoke.geometry, smoke);
    this._arcSources = arcSrc;
    this._arcCycle = -1;
    if (this._drivenExternally) this._updateArcs();
  }

  // Lightning: every 0.12 s each ELECTRIC source throws 1-2 jagged bolts to a
  // random point within ~3 blocks. Rebuilt on CPU (tiny), seeded by cycle.
  _updateArcs() {
    const src = this._arcSources;
    const cyc = Math.floor(this.time / 0.12);
    if (cyc === this._arcCycle) return;
    this._arcCycle = cyc;
    const pos = [];
    for (let s = 0; s < src.length; s += 3) {
      const base = s * 7.31 + cyc * 3.17;
      if (hash(base) < 0.35) continue;            // flicker: some cycles dark
      const bolts = 1 + (hash(base + 1) < 0.4 ? 1 : 0);
      for (let b = 0; b < bolts; b++) {
        const r = (k) => hash(base + b * 11 + k) - 0.5;
        const ex = src[s] + r(2) * 6, ey = src[s + 1] + r(3) * 4 + 0.5, ez = src[s + 2] + r(4) * 6;
        let px = src[s], py = src[s + 1], pz = src[s + 2];
        const SEG = 7;
        for (let k = 1; k <= SEG; k++) {
          const f = k / SEG, j = k === SEG ? 0 : 0.45 * (1 - Math.abs(f - 0.5));
          const nx = src[s] + (ex - src[s]) * f + r(10 + k) * j * 2;
          const ny = src[s + 1] + (ey - src[s + 1]) * f + r(30 + k) * j * 2;
          const nz = src[s + 2] + (ez - src[s + 2]) * f + r(50 + k) * j * 2;
          const steps = Math.max(2, Math.ceil(Math.hypot(nx - px, ny - py, nz - pz) / 0.12));
          for (let t = 0; t < steps; t++) { const u = t / steps; pos.push(px + (nx - px) * u, py + (ny - py) * u, pz + (nz - pz) * u); }
          px = nx; py = ny; pz = nz;
        }
      }
    }
    this.arcs.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.arcs.geometry.setDrawRange(0, pos.length / 3);
  }
}

function fill(geo, arr) {
  const n = Math.min(arr.length / 8, MAX_PARTICLES);
  const em = new Float32Array(n * 3), ti = new Float32Array(n * 3), sk = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const o = i * 8;
    em[i * 3] = arr[o]; em[i * 3 + 1] = arr[o + 1]; em[i * 3 + 2] = arr[o + 2];
    ti[i * 3] = arr[o + 3]; ti[i * 3 + 1] = arr[o + 4]; ti[i * 3 + 2] = arr[o + 5];
    sk[i * 2] = arr[o + 6]; sk[i * 2 + 1] = arr[o + 7];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(em.slice(), 3));   // required by three; unused by VS
  geo.setAttribute('emitter', new THREE.BufferAttribute(em, 3));
  geo.setAttribute('tint', new THREE.BufferAttribute(ti, 3));
  geo.setAttribute('seedKind', new THREE.BufferAttribute(sk, 2));
  geo.setDrawRange(0, n);
}

let _disc = null;
function discTexture() {
  if (_disc) return _disc;
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d'), grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(0.35, 'rgba(255,255,255,0.6)'); grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 32, 32);
  _disc = new THREE.CanvasTexture(c);
  return _disc;
}
