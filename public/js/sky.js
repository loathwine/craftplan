// Shared scene environment: stylized gradient sky + sun disc + sun-aligned
// directional light + ambient/hemisphere fill + fog. Looks cartoony rather
// than physically realistic — a voxel world doesn't want atmospheric Rayleigh
// haze washing out every horizon.
//
// All three entry points (live, recorder, explore) call this so the look
// stays consistent.

import * as THREE from 'three';

const DEFAULTS = {
  elevationDeg: 45,
  azimuthDeg:  135,     // 0 = north, 90 = east
  zenithColor:  0x3a7fc8,  // deep saturated blue
  horizonColor: 0xb4dcef,  // pale cyan
  sunColor:     0xfff4d4,
  sunSize:      0.0008,    // angular size of the sun disc (smaller = sharper)
  sunGlowSize:  0.06,      // soft halo around the sun
  sunIntensity: 1.7,
  ambientIntensity: 0.32,
  hemiIntensity:    0.30,
  hemiSky:    0xbedaf0,
  hemiGround: 0x4a5a3a,
  fogNear: 60,
  fogFar:  220,
  fogColor: 0xa6cee0,
  skyScale: 4000,          // sky sphere radius; must be < camera.far
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

  const sun = new THREE.DirectionalLight(o.sunColor, o.sunIntensity);
  sun.position.copy(sunDir).multiplyScalar(200);
  scene.add(sun);

  scene.add(new THREE.AmbientLight(0xb0c4d8, o.ambientIntensity));
  scene.add(new THREE.HemisphereLight(o.hemiSky, o.hemiGround, o.hemiIntensity));

  return { sun, sky, sunDir };
}
