// Character avatars for the demo recorder.
//
// A character is a THREE.Group with body + head + name tag. The head's
// front face is texture-mapped with a cartoon expression that can be
// swapped at frame time via setExpression(av, name).
//
// Variants:
//   makeAvatar({ name, bodyColor, headColor, expression, hat })
//
// Built-in expressions:
//   neutral, happy, surprised, frustrated, smug, focused, sad
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Face textures: tiny canvas cartoons, cached per (expression, headColor).
// ---------------------------------------------------------------------------
const FACE_CACHE = new Map();
const SIZE = 64;

function drawFace(name, fillStyle) {
  const c = document.createElement('canvas');
  c.width = SIZE; c.height = SIZE;
  const ctx = c.getContext('2d');
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = '#1a1a1a';
  // Eyes: two black pixels
  const eyeY = 24;
  const drawEye = (x, w = 8, h = 10) => ctx.fillRect(x - w / 2, eyeY - h / 2, w, h);
  // Mouth: line
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  const drawMouth = (path) => { ctx.beginPath(); for (let i = 0; i < path.length; i += 2) {
    if (i === 0) ctx.moveTo(path[0], path[1]);
    else ctx.lineTo(path[i], path[i + 1]);
  } ctx.stroke(); };
  switch (name) {
    case 'happy':
      drawEye(22); drawEye(42);
      drawMouth([20, 42, 28, 50, 36, 50, 44, 42]);
      break;
    case 'surprised':
      // Wide eyes, O mouth
      drawEye(22, 10, 12); drawEye(42, 10, 12);
      ctx.beginPath(); ctx.arc(32, 46, 6, 0, Math.PI * 2); ctx.stroke();
      break;
    case 'frustrated':
      // Angry slanted eyes, downturned mouth
      ctx.beginPath();
      ctx.moveTo(16, 18); ctx.lineTo(28, 24); ctx.lineTo(28, 28); ctx.lineTo(16, 22); ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(48, 18); ctx.lineTo(36, 24); ctx.lineTo(36, 28); ctx.lineTo(48, 22); ctx.closePath();
      ctx.fill();
      drawMouth([20, 48, 32, 42, 44, 48]);
      break;
    case 'smug':
      // Half-closed eyes, smirk
      ctx.fillRect(18, 22, 12, 4);
      ctx.fillRect(38, 22, 12, 4);
      drawMouth([22, 46, 32, 44, 42, 50]);
      break;
    case 'focused':
      // Narrowed eyes, neutral mouth
      ctx.fillRect(18, 22, 12, 5);
      ctx.fillRect(38, 22, 12, 5);
      drawMouth([24, 46, 40, 46]);
      break;
    case 'sad':
      drawEye(22); drawEye(42);
      drawMouth([20, 50, 28, 44, 36, 44, 44, 50]);
      // Tear
      ctx.fillStyle = '#67aaff';
      ctx.fillRect(20, 32, 4, 8);
      break;
    case 'thinking':
      drawEye(22); drawEye(42);
      drawMouth([28, 46, 40, 46]);
      // Sweat drop
      ctx.fillStyle = '#67aaff';
      ctx.beginPath(); ctx.arc(54, 30, 4, 0, Math.PI * 2); ctx.fill();
      break;
    case 'neutral':
    default:
      drawEye(22); drawEye(42);
      drawMouth([24, 46, 40, 46]);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function getFaceTex(expression, headColor) {
  const key = `${expression}|${headColor}`;
  if (!FACE_CACHE.has(key)) FACE_CACHE.set(key, drawFace(expression, '#' + headColor.toString(16).padStart(6, '0')));
  return FACE_CACHE.get(key);
}

function nameSprite(name) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.beginPath(); ctx.roundRect(0, 0, 256, 64, 10); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, 128, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------
export function makeAvatar({
  name,
  bodyColor = 0x4ade80,
  headColor = 0xffcc88,
  expression = 'neutral',
  hat = null,
  showTag = true,
}) {
  const g = new THREE.Group();
  g.userData.kind = 'avatar';
  g.userData.headColor = headColor;

  // Body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.8, 0.55),
    new THREE.MeshLambertMaterial({ color: bodyColor }),
  );
  body.position.y = 0.9;
  g.add(body);

  // Head: 6 materials so the front face can carry an expression texture.
  // BoxGeometry face order: +X, -X, +Y, -Y, +Z (front), -Z.
  const plain = new THREE.MeshLambertMaterial({ color: headColor });
  const faceMat = new THREE.MeshLambertMaterial({ map: getFaceTex(expression, headColor) });
  const headMats = [plain, plain, plain, plain, faceMat, plain];
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), headMats);
  head.position.y = 2.15;
  g.add(head);
  g.userData.headFront = faceMat;

  // Hat: optional accessory mesh on top of head
  if (hat) {
    const hatMat = new THREE.MeshLambertMaterial({ color: hat.color ?? 0x222222 });
    const hatGeo =
      hat.shape === 'cone' ? new THREE.ConeGeometry(0.45, 0.6, 8) :
      hat.shape === 'cyl'  ? new THREE.CylinderGeometry(0.4, 0.5, 0.25, 8) :
                              new THREE.BoxGeometry(0.75, 0.18, 0.75);
    const hatMesh = new THREE.Mesh(hatGeo, hatMat);
    hatMesh.position.y = 2.6;
    g.add(hatMesh);
  }

  // Name tag (toggleable; close-up shots usually hide it)
  if (showTag) {
    const tagMat = new THREE.SpriteMaterial({ map: nameSprite(name), transparent: true, depthTest: false });
    const tag = new THREE.Sprite(tagMat);
    tag.position.y = 3.0;
    tag.scale.set(3.2, 0.8, 1);
    tag.renderOrder = 1;
    g.add(tag);
    g.userData.tag = tag;
  }

  g.userData.expression = expression;
  return g;
}

export function setTagVisible(avatar, visible) {
  if (avatar.userData.tag) avatar.userData.tag.visible = visible;
}

export function setExpression(avatar, expression) {
  if (avatar.userData.expression === expression) return;
  const headColor = avatar.userData.headColor ?? 0xffcc88;
  const mat = avatar.userData.headFront;
  mat.map?.dispose?.();
  mat.map = getFaceTex(expression, headColor);
  mat.needsUpdate = true;
  avatar.userData.expression = expression;
}
