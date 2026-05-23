// Shared scene environment: stylized gradient sky + sun disc + sun-aligned
// directional light + ambient/hemisphere fill + fog. Looks cartoony rather
// than physically realistic — a voxel world doesn't want atmospheric Rayleigh
// haze washing out every horizon.
//
// All three entry points (live, recorder, explore) call this so the look
// stays consistent.

import * as THREE from 'three';

const DEFAULTS = {
  elevationDeg: 42,
  azimuthDeg:  135,     // 0 = north, 90 = east
  zenithColor:  0x3a7fc8,  // deep saturated blue
  horizonColor: 0xb4dcef,  // pale cyan
  sunColor:     0xfff4d4,
  sunSize:      0.0008,    // angular size of the sun disc (smaller = sharper)
  sunGlowSize:  0.06,      // soft halo around the sun
  sunIntensity: 2.1,       // bright + contrasty; tonemapping rolls highlights back
  ambientIntensity: 0.22,  // keep shadow areas readable but clearly dimmer
  hemiIntensity:    0.22,
  hemiSky:    0xbedaf0,
  hemiGround: 0x3a4a2a,
  fogNear: 60,
  fogFar:  220,
  fogColor: 0xa6cee0,
  skyScale: 4000,          // sky sphere radius; must be < camera.far

  // Shadow map: ortho frustum centred on the world (256×256). Big enough to
  // cover the whole map at once — for tighter scenes a future commit can
  // follow the camera, but a static frustum keeps the look consistent across
  // every shot in the manuscript.
  shadowCenter:   [128, 32, 128],
  shadowExtent:   200,
  shadowDistance: 320,
  shadowMapSize:  2048,
  shadowBias:    -0.0008,
  shadowNormalBias: 0.04,

  // Ocean horizon: a tessellated blue plane below world Y, displaced by a
  // sine-wave shader for slow rolling waves. Extends beyond the camera so
  // the gradient sky meets a water line far away.
  ocean:        true,
  oceanY:       12,
  oceanExtent:  3000,
  oceanColor:   0x1d6ea3,   // brighter saturated cobalt, was 0x2a5f7a
  oceanWaveAmp: 0.45,
  oceanWaveLen: 24,
  oceanWaveSpeed: 1.2,
};

const VS = `
varying vec3 vWorldDir;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldDir = normalize(worldPos.xyz - cameraPosition);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position.z = gl_Position.w;          // park at far plane
}
`;

const FS = `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uSunColor;
uniform vec3 uSunDir;
uniform float uSunSize;
uniform float uSunGlow;
varying vec3 vWorldDir;

void main() {
  vec3 dir = normalize(vWorldDir);

  // y goes from -1 (down) to +1 (up). Map to a smooth 0..1 with a small
  // bias so the horizon band is a clean line, not a fade well below ground.
  float t = smoothstep(-0.05, 0.55, dir.y);
  vec3 color = mix(uHorizon, uZenith, t);

  // Sun disc + soft glow around it
  float cosTheta = clamp(dot(dir, uSunDir), -1.0, 1.0);
  float angDist  = acos(cosTheta);
  float disc     = smoothstep(uSunSize * 1.5, uSunSize * 0.5, angDist);
  float glow     = smoothstep(uSunGlow, 0.0, angDist) * 0.45;
  color = mix(color, uSunColor, max(disc, glow));

  gl_FragColor = vec4(color, 1.0);
}
`;

export function setupSky(scene, opts = {}) {
  const o = { ...DEFAULTS, ...opts };

  const phi = THREE.MathUtils.degToRad(90 - o.elevationDeg);
  const theta = THREE.MathUtils.degToRad(o.azimuthDeg);
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

  const skyMat = new THREE.ShaderMaterial({
    uniforms: {
      uZenith:    { value: new THREE.Color(o.zenithColor) },
      uHorizon:   { value: new THREE.Color(o.horizonColor) },
      uSunColor:  { value: new THREE.Color(o.sunColor) },
      uSunDir:    { value: sunDir.clone() },
      uSunSize:   { value: o.sunSize },
      uSunGlow:   { value: o.sunGlowSize },
    },
    vertexShader: VS,
    fragmentShader: FS,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(o.skyScale, 32, 24), skyMat);
  sky.frustumCulled = false;
  scene.add(sky);

  scene.background = new THREE.Color(o.horizonColor);
  scene.fog = new THREE.Fog(o.fogColor, o.fogNear, o.fogFar);

  const center = new THREE.Vector3(...o.shadowCenter);

  const sun = new THREE.DirectionalLight(o.sunColor, o.sunIntensity);
  sun.position.copy(center).add(sunDir.clone().multiplyScalar(o.shadowDistance));
  const target = new THREE.Object3D();
  target.position.copy(center);
  scene.add(target);
  sun.target = target;

  sun.castShadow = true;
  sun.shadow.mapSize.set(o.shadowMapSize, o.shadowMapSize);
  const ext = o.shadowExtent;
  sun.shadow.camera.left   = -ext;
  sun.shadow.camera.right  =  ext;
  sun.shadow.camera.top    =  ext;
  sun.shadow.camera.bottom = -ext;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = o.shadowDistance + ext + 100;
  sun.shadow.bias        = o.shadowBias;
  sun.shadow.normalBias  = o.shadowNormalBias;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);

  scene.add(new THREE.AmbientLight(0xb0c4d8, o.ambientIntensity));
  scene.add(new THREE.HemisphereLight(o.hemiSky, o.hemiGround, o.hemiIntensity));

  let ocean = null;
  if (o.ocean) {
    const e = o.oceanExtent;
    // Tessellate so the wave displacement actually has vertices to move.
    const segs = 96;
    const geo = new THREE.PlaneGeometry(e * 2, e * 2, segs, segs);
    const oceanMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:       { value: 0 },
        uColor:      { value: new THREE.Color(o.oceanColor) },
        uHighlight:  { value: new THREE.Color(0x7fbedf) },
        uAmp:        { value: o.oceanWaveAmp },
        uWavelen:    { value: o.oceanWaveLen },
        uSpeed:      { value: o.oceanWaveSpeed },
        uSunDir:     { value: sunDir.clone() },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uAmp;
        uniform float uWavelen;
        uniform float uSpeed;
        varying float vWaveH;
        varying vec3 vWorldNormal;
        void main() {
          vec3 p = position;
          // Two perpendicular sine waves to break up the symmetry.
          float k = 6.28318530718 / uWavelen;
          float w1 = sin(p.x * k + uTime * uSpeed);
          float w2 = sin(p.y * k * 0.7 + uTime * uSpeed * 1.3 + 1.7);
          float h = (w1 + 0.6 * w2) * uAmp;
          p.z += h;
          vWaveH = h / uAmp;
          // Cheap normal: gradient of the height field.
          float dx = cos(p.x * k + uTime * uSpeed) * k * uAmp;
          float dy = cos(p.y * k * 0.7 + uTime * uSpeed * 1.3 + 1.7) * k * 0.7 * uAmp * 0.6;
          vWorldNormal = normalize(vec3(-dx, -dy, 1.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uHighlight;
        uniform vec3 uSunDir;
        varying float vWaveH;
        varying vec3 vWorldNormal;
        void main() {
          // Crests get the lighter highlight tint; troughs get base colour.
          vec3 base = mix(uColor, uHighlight, smoothstep(-0.2, 0.9, vWaveH));
          // Cheap specular: dot of crest normal with sun direction.
          float spec = pow(max(dot(vWorldNormal, normalize(uSunDir)), 0.0), 18.0);
          gl_FragColor = vec4(base + vec3(spec) * 0.35, 1.0);
        }
      `,
    });
    ocean = new THREE.Mesh(geo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = o.oceanY;
    ocean.frustumCulled = false;
    scene.add(ocean);
  }

  return { sun, sky, sunDir, ocean };
}

// Renderer setup that pairs with setupSky: shadows on, sRGB output.
// Tonemapping is set here as a baseline but the post-processing composer
// (composer.js) takes ownership when active. Call this right after the
// WebGLRenderer is constructed in each entry point.
export function setupRenderer(renderer, opts = {}) {
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 0.95;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
