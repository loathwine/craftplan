// godzilla-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Godzilla — bipedal kaiju, facing -Z (snout forward), tail sweeping +Z.
const STONE=3, COBBLE=8, OAK_LOG=4, LEAVES=5, SAND=6, PLANKS=7, BRICK=10, GLASS=11, SNOW=12, ICE=13, AIR=0;

function disk2(y, cx, cz, rx, rz, id){
  const x1=Math.floor(cx-rx), x2=Math.ceil(cx+rx);
  const z1=Math.floor(cz-rz), z2=Math.ceil(cz+rz);
  for(let x=x1;x<=x2;x++){
    const nx=(x-cx)/rx;
    for(let z=z1;z<=z2;z++){
      const nz=(z-cz)/rz;
      if(nx*nx+nz*nz<=1.0) block(x,y,z,id);
    }
  }
}

function bellyPatch(y, cz, rx, rz, id){
  const x1=Math.floor(-rx*0.85), x2=Math.ceil(rx*0.85);
  const zFront=Math.round(cz-rz*0.88), zBack=Math.round(cz-rz*0.3);
  for(let x=x1;x<=x2;x++)for(let z=zFront;z<=zBack;z++) block(x,y,z,id);
}

function diskXY(z, cx, cy, r, id){
  const x1=Math.floor(cx-r), x2=Math.ceil(cx+r);
  const y1=Math.floor(cy-r), y2=Math.ceil(cy+r);
  for(let x=x1;x<=x2;x++){
    const dx=x-cx;
    for(let y=y1;y<=y2;y++){
      const dy=y-cy;
      if(dx*dx+dy*dy<=r*r) block(x,y,z,id);
    }
  }
}

// thin triangular dorsal plate: wide in X, thin in Z, tapers to a point going up
function plate(cx, z, baseY, height, halfWidth, thickness, id, tip){
  for(let i=0;i<height;i++){
    const w = Math.max(0.6, halfWidth*(1-i/height));
    const y = baseY+i;
    cube(Math.round(cx-w), y, Math.round(z-thickness/2), Math.round(cx+w), y, Math.round(z+thickness/2), id);
  }
  block(Math.round(cx), baseY+height, Math.round(z), tip||SNOW);
}

// ===================== LEGS =====================
const legProfile = [
  [0,3.2,4.0,-1.8],[1,2.8,3.5,-1.3],[2,1.9,2.0,-0.5],[3,1.8,1.9,0],
  [4,2.0,2.0,0],[5,2.1,2.1,0],[6,2.3,2.2,0],[7,2.6,2.5,0],[8,2.5,2.4,0],
  [9,2.8,2.6,0.2],[10,3.1,2.8,0.3],[11,3.4,3.0,0.5],[12,3.7,3.3,0.7]
];
for(const side of [-1,1]){
  const cx = side*6.2;
  for(const [y,rx,rz,cz] of legProfile){
    const id = (y%3===0)?COBBLE:STONE;
    disk2(y, cx, cz, rx, rz, id);
  }
  // toe claws on the feet (pointing -Z, forward)
  for(const dx of [-1.6,0,1.6]){
    line(Math.round(cx+dx), 0, -5, Math.round(cx+dx), 0, -6, SNOW);
  }
  // knee bulge
  sphere(cx, 8, 0, 2.0, STONE);
}

// ===================== PELVIS =====================
const pelvisProfile = [
  [13,9.5,6.0,1.0],[14,9.0,6.3,1.2],[15,8.5,6.0,1.0],[16,8.0,5.7,0.7]
];
for(const [y,rx,rz,cz] of pelvisProfile){
  const id = (y%3===0)?COBBLE:STONE;
  disk2(y, 0, cz, rx, rz, id);
  bellyPatch(y, cz, rx, rz, PLANKS);
}

// ===================== TORSO =====================
const torsoProfile = [
  [17,7.5,5.5,0.3],[18,7.2,5.3,0.0],[19,6.8,5.0,-0.3],[20,6.4,4.8,-0.6],
  [21,6.0,4.5,-0.9],[22,5.5,4.3,-1.2],[23,5.0,4.0,-1.5],[24,4.5,3.8,-1.8],[25,4.0,3.5,-2.0]
];
for(const [y,rx,rz,cz] of torsoProfile){
  const id = (y%3===0)?COBBLE:STONE;
  disk2(y, 0, cz, rx, rz, id);
  bellyPatch(y, cz, rx, rz, PLANKS);
}

// ===================== NECK =====================
disk2(26, 0, -2.5, 3.3, 3.3, STONE);
disk2(27, 0, -3.0, 3.0, 3.2, STONE);

// ===================== HEAD / SNOUT =====================
disk2(28, 0, -6.0, 4.5, 6.5, STONE);   // jaw base, long snout
disk2(29, 0, -6.5, 4.2, 7.0, STONE);   // widest jaw
disk2(30, 0, -6.5, 3.7, 6.0, STONE);   // upper snout narrowing
disk2(31, 0, -5.0, 3.0, 4.0, STONE);   // brow / upper skull
disk2(32, 0, -4.0, 2.0, 2.5, COBBLE);  // skull cap
// small skull crest spikes
plate(0, -3, 33, 2, 1.2, 2, COBBLE, STONE);
plate(-1.5, -2, 33, 1, 1.0, 2, COBBLE, STONE);
plate(1.5, -2, 33, 1, 1.0, 2, COBBLE, STONE);

// snout underside carve for open jaw + teeth
cube(-3, 27, -12, 3, 27, -8, AIR);
cube(-3, 27, -12, 3, 27, -8, BRICK); // mouth interior (red)
for(const x of [-2,-1,0,1,2]){
  block(x, 28, -12, SNOW);
  block(x, 27, -8, SNOW);
}
line(-3, 27, -12, -3, 28, -12, SNOW);
line(3, 27, -12, 3, 28, -12, SNOW);

// eyes
block(-2, 30, -6, BRICK); block(-2, 31, -6, BRICK);
block(2, 30, -6, BRICK); block(2, 31, -6, BRICK);
// brow ridge accents
cube(-3, 31, -5, -1, 31, -3, COBBLE);
cube(1, 31, -5, 3, 31, -3, COBBLE);

// ===================== ARMS (small T-rex-style) =====================
for(const side of [-1,1]){
  const s = side;
  sphere(s*7.0, 23, -1.0, 1.5, STONE);   // shoulder
  sphere(s*7.6, 21.3, -2.6, 1.3, STONE); // elbow
  sphere(s*8.0, 19.7, -4.0, 1.1, STONE); // hand
  line(Math.round(s*7.0), 23, -1, Math.round(s*7.6), 21, -3, STONE);
  line(Math.round(s*7.6), 21, -3, Math.round(s*8.0), 20, -4, STONE);
  // claws
  for(const dz of [-1,0,1]){
    line(Math.round(s*8.0), 19, -5, Math.round(s*8.0)+ (dz), 19, -6, SNOW);
  }
}

// ===================== DORSAL PLATES (spine) =====================
const spineSpikes = [
  [7,14,3,1.4],[6,16,5,2.0],[5,18,6,2.4],[3.5,20,7,2.6],
  [2,22,8,2.8],[0.5,24,6,2.2],[-0.5,26,5,1.8],[-1.5,28,4,1.4],[-2.5,30,3,1.0]
];
for(const [z,baseY,h,w] of spineSpikes){
  plate(0, z, baseY, h, w, 2, COBBLE, SNOW);
}

// ===================== TAIL =====================
for(let i=0;i<15;i++){
  const z = 7 + i;
  if(z>21) break;
  const r = Math.max(0.8, 3.3 - i*0.19);
  let y = 14 + i*0.15;
  if(i>9) y += (i-9)*0.55;
  const x = Math.sin(i*0.35)*1.2;
  const id = (i%3===0)?COBBLE:STONE;
  diskXY(z, x, y, r, id);
  if(i%2===0 && r>1.2){
    plate(x, z, Math.round(y+r), Math.max(2,Math.round(r+1)), Math.max(1,r*0.6), 2, COBBLE, SNOW);
  }
}
// tail tip claw
block(Math.round(Math.sin(14*0.35)*1.2), Math.round(14+14*0.15+5*0.55)+1, 21, SNOW);
