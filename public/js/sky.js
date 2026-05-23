// Shared scene environment: atmospheric sky shader, sun-aligned directional
// light, ambient/hemisphere fill, and matching fog. All three entry points
// (live, recorder, explore) call this so the look stays consistent.
//
// Returns { sun, skyMesh, sunPosition } so callers can move the sun for
// time-of-day or weather variants.

import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

const DEFAULTS = {
  elevationDeg: 35,     // sun angle above horizon
  azimuthDeg:  135,     // 0 = north, 90 = east, 180 = south
  turbidity:     5,
  rayleigh:      1.6,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  sunIntensity:  1.6,
  ambientIntensity: 0.35,
  hemiIntensity:    0.30,
  fogNear: 60,
  fogFar:  220,
  fogColor: 0xb9d6e8,   // light hazy blue; matches sky horizon better than pure sky
};

export function setupSky(scene, opts = {}) {
  const o = { ...DEFAULTS, ...opts };

  const sky = new Sky();
  sky.scale.setScalar(450000);
  const u = sky.material.uniforms;
  u.turbidity.value = o.turbidity;
  u.rayleigh.value = o.rayleigh;
  u.mieCoefficient.value = o.mieCoefficient;
  u.mieDirectionalG.value = o.mieDirectionalG;

  const sunPosition = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - o.elevationDeg);
  const theta = THREE.MathUtils.degToRad(o.azimuthDeg);
  sunPosition.setFromSphericalCoords(1, phi, theta);
  u.sunPosition.value.copy(sunPosition);

  scene.add(sky);

  scene.fog = new THREE.Fog(o.fogColor, o.fogNear, o.fogFar);

  const sun = new THREE.DirectionalLight(0xfff2d8, o.sunIntensity);
  sun.position.copy(sunPosition).multiplyScalar(200);
  scene.add(sun);

  scene.add(new THREE.AmbientLight(0xb0c4d8, o.ambientIntensity));
  scene.add(new THREE.HemisphereLight(0xbfdcf2, 0x4a5a3a, o.hemiIntensity));

  return { sun, sky, sunPosition };
}
