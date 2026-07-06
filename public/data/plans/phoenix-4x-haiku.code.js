// phoenix-4x-haiku — prompt:
// phoenix...

const STONE = 3;
const OAK_LOG = 4;
const LEAVES = 5;
const BRICK = 10;
const GLASS = 11;
const AIR = 0;

// ===== BODY =====
cube(-2, 1, -1, 2, 5, 2, BRICK);
cube(-2, 4, -2, 2, 7, 1, STONE);
cube(-1, 2, 3, 1, 5, 4, STONE);

// ===== BREAST & CHEST =====
cube(-2, 6, -3, 2, 9, 0, BRICK);

// ===== NECK =====
cube(-1, 8, -3, 1, 11, -1, OAK_LOG);

// ===== HEAD =====
cube(-1, 11, -5, 1, 13, -2, BRICK);
block(0, 12, -6, BRICK);
block(0, 12, -7, GLASS);

// ===== CREST =====
block(0, 13, -4, BRICK);
block(-1, 13, -3, BRICK);
block(1, 13, -3, BRICK);

// ===== LEFT WING - PRIMARY FEATHERS =====
for (let seg = 0; seg < 10; seg++) {
  const x = -2 - seg;
  const yBase = 6 - seg * 0.3;
  const zEnd = Math.max(1, 4 - Math.floor(seg / 2));
  const h = Math.max(1, 3 - Math.floor(seg / 3));
  cube(x, Math.floor(yBase), 0, x, Math.floor(yBase) + h, zEnd, LEAVES);
  
  if (seg > 0 && seg < 8) {
    block(x, Math.floor(yBase) + h + 1, 2, BRICK);
  }
}

// ===== RIGHT WING - MIRROR =====
for (let seg = 0; seg < 10; seg++) {
  const x = 2 + seg;
  const yBase = 6 - seg * 0.3;
  const zEnd = Math.max(1, 4 - Math.floor(seg / 2));
  const h = Math.max(1, 3 - Math.floor(seg / 3));
  cube(x, Math.floor(yBase), 0, x, Math.floor(yBase) + h, zEnd, LEAVES);
  
  if (seg > 0 && seg < 8) {
    block(x, Math.floor(yBase) + h + 1, 2, BRICK);
  }
}

// ===== TAIL - FLOWING BACK =====
for (let i = 0; i < 13; i++) {
  const z = 4 + i;
  const y = 5 - i * 0.22;
  const w = Math.max(0, 2 - Math.floor(i / 3));
  
  if (y >= 1) {
    for (let x = -w; x <= w; x++) {
      const color = (i + Math.abs(x)) % 3 === 0 ? BRICK : LEAVES;
      block(x, Math.floor(y), z, color);
      
      if (i > 3) {
        block(x, Math.floor(y) - 1, z, LEAVES);
      }
    }
  }
}

// ===== LEGS =====
line(-1, 0, 1, -1, 2, 1, OAK_LOG);
line(1, 0, 1, 1, 2, 1, OAK_LOG);
block(0, 0, -1, OAK_LOG);
block(0, 1, -1, OAK_LOG);

// ===== FLAME AURA - RINGS OF FIRE =====
for (let ring = 3; ring <= 5; ring++) {
  const radius = 3 + (ring - 3) * 0.5;
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const fx = Math.round(radius * Math.cos(angle));
    const fz = Math.round(radius * Math.sin(angle));
    
    if (Math.abs(fx) < 22 && Math.abs(fz) < 22) {
      block(fx, ring, fz, BRICK);
    }
  }
}

// ===== WING FIRE HIGHLIGHTS =====
for (let i = 1; i < 7; i++) {
  block(-3 - i, 5 - i * 0.3, 1, BRICK);
  block(3 + i, 5 - i * 0.3, 1, BRICK);
}

// ===== BELLY DETAIL =====
cube(-1, 2, 0, 1, 4, 1, LEAVES);

// ===== UPPER BACK PLUMAGE =====
cube(-2, 6, 2, 2, 8, 3, LEAVES);