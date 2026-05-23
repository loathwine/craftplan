// Weather: particle systems for snow and rain. One BufferGeometry per
// type, animated via shader so the CPU work is constant regardless of
// particle count. Returns an update(dt) callback the entry point loops
// in animate().
//
// API:
//   const wx = setupWeather(scene, 'snow', { count: 6000, area: 200 });
//   // each frame:
//   wx.update(dt);
//
// Presets:
//   'clear' - no particles (returns a no-op updater)
//   'snow'  - slow falling white flakes with horizontal drift
//   'rain'  - fast slanted streaks
//   'storm' - heavier rain + slight tint shift

import * as THREE from 'three';

const SHADERS = {
  snow: {
    vertex: `
      attribute float aOffset;
      uniform float uTime;
      uniform float uArea;
      uniform float uTopY;
      uniform float uFallH;
      uniform vec3  uCamPos;
      varying float vAlpha;
      void main() {
        // Each particle has a deterministic offset so the column it falls
        // in stays stable; uTime shifts the Y down, wraps via mod.
        float t = uTime * 0.65 + aOffset * 17.0;
        // Particles spawn relative to the camera so the field follows the view.
        float x = mod(position.x + uCamPos.x + sin(t * 0.3 + aOffset * 6.28) * 0.6, uArea) - uArea * 0.5;
        float z = mod(position.z + uCamPos.z + cos(t * 0.27 + aOffset * 3.14) * 0.6, uArea) - uArea * 0.5;
        float y = uTopY - mod(t * 4.0 + position.y, uFallH);
        vec3 worldPos = vec3(x + uCamPos.x, y, z + uCamPos.z);
        vec4 mv = viewMatrix * vec4(worldPos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 360.0 / max(1.0, -mv.z);
        vAlpha = clamp(1.0 - (uTopY - y) / uFallH, 0.0, 1.0);
      }
    `,
    fragment: `
      varying float vAlpha;
      void main() {
        vec2 d = gl_PointCoord - vec2(0.5);
        float r = length(d);
        if (r > 0.5) discard;
        float a = (1.0 - r * 2.0) * vAlpha;
        gl_FragColor = vec4(1.0, 1.0, 1.0, a * 0.95);
      }
    `,
  },
  rain: {
    vertex: `
      attribute float aOffset;
      uniform float uTime;
      uniform float uArea;
      uniform float uTopY;
      uniform float uFallH;
      uniform vec3  uCamPos;
      varying float vAlpha;
      void main() {
        float t = uTime * 1.8 + aOffset * 31.0;
        float x = mod(position.x + uCamPos.x + t * 0.5, uArea) - uArea * 0.5;
        float z = mod(position.z + uCamPos.z, uArea) - uArea * 0.5;
        float y = uTopY - mod(t * 24.0 + position.y, uFallH);
        vec3 worldPos = vec3(x + uCamPos.x, y, z + uCamPos.z);
        vec4 mv = viewMatrix * vec4(worldPos, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = 180.0 / max(1.0, -mv.z);
        vAlpha = clamp(1.0 - (uTopY - y) / uFallH, 0.0, 1.0);
      }
    `,
    fragment: `
      varying float vAlpha;
      void main() {
        // Streak rather than dot: stretch alpha by gl_PointCoord.y.
        float s = smoothstep(0.0, 0.5, gl_PointCoord.y) * smoothstep(1.0, 0.5, gl_PointCoord.y);
        float horiz = smoothstep(0.45, 0.5, abs(gl_PointCoord.x - 0.5));
        if (horiz > 0.0) discard;
        gl_FragColor = vec4(0.75, 0.82, 0.95, s * 0.6 * vAlpha);
      }
    `,
  },
};

export function setupWeather(scene, kind = 'clear', opts = {}) {
  if (!kind || kind === 'clear' || kind === 'none') {
    return { kind: 'clear', update: () => {} };
  }
  if (kind === 'clouds') return setupClouds(scene, opts);
  const preset = SHADERS[kind === 'storm' ? 'rain' : kind];
  if (!preset) {
    console.warn(`[weather] unknown kind "${kind}"`);
    return { kind: 'clear', update: () => {} };
  }
  const count = opts.count ?? (kind === 'snow' ? 9000 : 5000);
  const area  = opts.area  ?? 220;
  const topY  = opts.topY  ?? 75;
  const fallH = opts.fallH ?? 80;

  const positions = new Float32Array(count * 3);
  const offsets   = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i*3+0] = Math.random() * area;
    positions[i*3+1] = Math.random() * fallH;
    positions[i*3+2] = Math.random() * area;
    offsets[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: preset.vertex,
    fragmentShader: preset.fragment,
    uniforms: {
      uTime:   { value: 0 },
      uArea:   { value: area },
      uTopY:   { value: topY },
      uFallH:  { value: fallH },
      uCamPos: { value: new THREE.Vector3() },
    },
    transparent: true,
    depthWrite: false,
  });

  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  scene.add(points);

  // Storm: slightly grey out the fog + ambient to read as overcast.
  if (kind === 'storm') {
    if (scene.fog) scene.fog.color.setHex(0x6b7682);
  }

  return {
    kind,
    update(dt, camera) {
      mat.uniforms.uTime.value += dt;
      if (camera) mat.uniforms.uCamPos.value.copy(camera.position);
    },
  };
}

// Semi-transparent drifting clouds: a handful of large horizontal quads
// scattered above the world, slowly translating with the wind. Each quad
// has a soft alpha falloff so the edges blend with the sky.
function setupClouds(scene, opts = {}) {
  const count = opts.count ?? 14;
  const baseY = opts.baseY ?? 95;
  const yJitter = opts.yJitter ?? 18;
  const area = opts.area ?? 380;
  const cloudSize = opts.cloudSize ?? 80;
  const driftSpeed = opts.driftSpeed ?? 3.5;

  const group = new THREE.Group();
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTint: { value: new THREE.Color(0xffffff) } },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uTint;
      varying vec2 vUv;
      void main() {
        // Soft elliptical alpha so edges don't have hard lines
        vec2 d = vUv - vec2(0.5);
        float r = length(d * vec2(1.0, 1.6));
        float a = smoothstep(0.5, 0.18, r);
        gl_FragColor = vec4(uTint, a * 0.72);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const clouds = [];
  for (let i = 0; i < count; i++) {
    const w = cloudSize * (0.7 + Math.random() * 0.8);
    const h = cloudSize * (0.35 + Math.random() * 0.4);
    const geo = new THREE.PlaneGeometry(w, h);
    const m = new THREE.Mesh(geo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(
      (Math.random() - 0.5) * area,
      baseY + Math.random() * yJitter,
      (Math.random() - 0.5) * area,
    );
    m.userData.driftX = (Math.random() - 0.5) * 1.2 + 0.6;  // mostly +X
    m.userData.driftZ = (Math.random() - 0.5) * 0.8;
    group.add(m);
    clouds.push(m);
  }
  scene.add(group);

  return {
    kind: 'clouds',
    update(dt, camera) {
      const camX = camera ? camera.position.x : 0;
      const camZ = camera ? camera.position.z : 0;
      for (const c of clouds) {
        c.position.x += c.userData.driftX * driftSpeed * dt;
        c.position.z += c.userData.driftZ * driftSpeed * dt;
        // Wrap the cloud field around the camera so it always looks populated.
        const halfArea = area * 0.6;
        if (c.position.x - camX > halfArea) c.position.x -= area * 1.2;
        if (c.position.x - camX < -halfArea) c.position.x += area * 1.2;
        if (c.position.z - camZ > halfArea) c.position.z -= area * 1.2;
        if (c.position.z - camZ < -halfArea) c.position.z += area * 1.2;
      }
    },
  };
}
