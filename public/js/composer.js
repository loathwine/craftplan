// Post-processing pipeline: RenderPass → SSAO → UnrealBloom → Output.
// SSAO adds screen-space contact shadows (where geometry meets), bloom
// gives sun glow and any bright surfaces some bleed, OutputPass handles
// the final tonemapping + sRGB conversion in HDR space (which is why we
// disable the renderer's own toneMapping when this is in use).
//
// Caller pattern:
//   const composer = setupComposer(renderer, scene, camera, W, H);
//   // ... in animation loop ...
//   composer.render();
//   // ... in resize handler ...
//   composer.resize(W, H);

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const DEFAULTS = {
  // SSAO: subtle contact shadow. Voxels are blocky so a small kernel is
  // enough to read; large kernels just smear the cube edges.
  ssaoKernelRadius: 4,
  ssaoMinDistance:  0.0005,
  ssaoMaxDistance:  0.02,
  ssaoEnabled:      true,

  // Bloom: glow on bright pixels. Threshold low enough that the sky band
  // and sunlit faces bleed; strength tuned so it reads as glow, not haze.
  bloomThreshold: 0.72,
  bloomStrength:  0.55,
  bloomRadius:    0.6,
  bloomEnabled:   true,
};

export function setupComposer(renderer, scene, camera, width, height, opts = {}) {
  const o = { ...DEFAULTS, ...opts };

  // OutputPass owns the final tonemap; disable the renderer's so we don't
  // tonemap twice. Keep the same ACES filmic curve.
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = opts.exposure ?? 0.95;

  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);

  composer.addPass(new RenderPass(scene, camera));

  let ssao = null;
  if (o.ssaoEnabled) {
    ssao = new SSAOPass(scene, camera, width, height);
    ssao.kernelRadius = o.ssaoKernelRadius;
    ssao.minDistance  = o.ssaoMinDistance;
    ssao.maxDistance  = o.ssaoMaxDistance;
    composer.addPass(ssao);
  }

  let bloom = null;
  if (o.bloomEnabled) {
    bloom = new UnrealBloomPass(new THREE.Vector2(width, height), o.bloomStrength, o.bloomRadius, o.bloomThreshold);
    composer.addPass(bloom);
  }

  composer.addPass(new OutputPass());

  composer.resize = (w, h) => {
    composer.setSize(w, h);
    if (ssao)  ssao.setSize(w, h);
    if (bloom) bloom.setSize(w, h);
  };
  composer.passes_ = { ssao, bloom };
  return composer;
}
