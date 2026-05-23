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
