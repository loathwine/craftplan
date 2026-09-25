// Planar reflection for voxel water: renders the scene from a camera mirrored
// across the dominant water plane (y = h) into a half-res HDR target, which the
// water shader samples with ripple distortion + fresnel. Same maths as three's
// Reflector (oblique near-plane clip so nothing below the water leaks in), but
// driven by World so one reflection serves every water mesh.
import * as THREE from 'three';

export class WaterReflection {
  constructor({ scale = 0.5, clipBias = 0.003 } = {}) {
    this.scale = scale;
    this.clipBias = clipBias;
    this.target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 0 });
    this.texMatrix = new THREE.Matrix4();
    this.virtualCamera = new THREE.PerspectiveCamera();
    this.height = null;             // water plane y (world); null = no reflection
    this._sig = '';
    this._rendering = false;
    this.uniforms = {
      tReflection: { value: this.target.texture },
      uReflMat: { value: this.texMatrix },
      uWaterY: { value: -9999 },
      uReflOn: { value: 0 },
    };
  }

  // Render (at most once per distinct camera+world state). `hide` = meshes to
  // hide while rendering the mirror (the water itself).
  update(renderer, scene, camera, version, hide) {
    if (this._rendering || this.height === null || scene.overrideMaterial) return;
    const size = renderer.getDrawingBufferSize(new THREE.Vector2());
    const w = Math.max(1, Math.round(size.x * this.scale)), h = Math.max(1, Math.round(size.y * this.scale));
    const sig = camera.matrixWorld.elements.join(',') + '|' + camera.projectionMatrix.elements[0] + '|' + version + '|' + this.height + '|' + w;
    if (sig === this._sig) return;
    this._sig = sig;
    if (this.target.width !== w || this.target.height !== h) this.target.setSize(w, h);

    const normal = new THREE.Vector3(0, 1, 0);
    const planePoint = new THREE.Vector3(0, this.height, 0);
    const camPos = new THREE.Vector3().setFromMatrixPosition(camera.matrixWorld);
    if (camPos.y <= this.height) { this.uniforms.uReflOn.value = 0; return; }   // camera under water

    const rot = new THREE.Matrix4().extractRotation(camera.matrixWorld);
    const view = planePoint.clone().sub(camPos).reflect(normal).negate().add(planePoint);
    const lookAt = new THREE.Vector3(0, 0, -1).applyMatrix4(rot).add(camPos);
    const target = planePoint.clone().sub(lookAt).reflect(normal).negate().add(planePoint);
    const vc = this.virtualCamera;
    vc.position.copy(view);
    vc.up.set(0, 1, 0).applyMatrix4(rot).reflect(normal);
    vc.lookAt(target);
    vc.far = camera.far; vc.near = camera.near;
    vc.updateMatrixWorld();
    vc.projectionMatrix.copy(camera.projectionMatrix);

    this.texMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
    this.texMatrix.multiply(vc.projectionMatrix).multiply(vc.matrixWorldInverse);

    // Oblique near plane = the water plane (Lengyel), so geometry below the
    // surface never appears in the reflection.
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, planePoint);
    plane.applyMatrix4(vc.matrixWorldInverse);
    const clip = new THREE.Vector4(plane.normal.x, plane.normal.y, plane.normal.z, plane.constant);
    const pm = vc.projectionMatrix, e = pm.elements;
    const q = new THREE.Vector4(
      (Math.sign(clip.x) + e[8]) / e[0], (Math.sign(clip.y) + e[9]) / e[5], -1, (1 + e[10]) / e[14]);
    clip.multiplyScalar(2 / clip.dot(q));
    e[2] = clip.x; e[6] = clip.y; e[10] = clip.z + 1 - this.clipBias; e[14] = clip.w;

    this._rendering = true;
    const prevTarget = renderer.getRenderTarget();
    const prevShadowAuto = renderer.shadowMap.autoUpdate;
    renderer.shadowMap.autoUpdate = false;       // reuse this frame's shadow map
    for (const m of hide) m.visible = false;
    renderer.setRenderTarget(this.target);
    renderer.state.buffers.depth.setMask(true);
    if (renderer.autoClear === false) renderer.clear();
    renderer.render(scene, vc);
    for (const m of hide) m.visible = true;
    renderer.shadowMap.autoUpdate = prevShadowAuto;
    renderer.setRenderTarget(prevTarget);
    this._rendering = false;

    this.uniforms.uWaterY.value = this.height;
    this.uniforms.uReflOn.value = 1;
  }

  dispose() { this.target.dispose(); }
}
