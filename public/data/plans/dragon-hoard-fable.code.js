// dragon-hoard-fable — prompt:
// a dragon sleeping on a pile of gold...

// Sleeping dragon on a hoard of gold — head toward the camera (north / -Z)

function rnd(i){ const s = Math.sin(i*127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

function ellipsoid(cx, cy, cz, rx, ry, rz, colorFn){
  for (let x = Math.floor(cx-rx); x <= Math.ceil(cx+rx); x++)
    for (let y = Math.floor(cy-ry); y <= Math.ceil(cy+ry); y++)
      for (let z = Math.floor(cz-rz); z <= Math.ceil(cz+rz); z++){
        const dx=(x-cx)/rx, dy=(y-cy)/ry, dz=(z-cz)/rz;
        if (dx*dx+dy*dy+dz*dz <= 1) block(x, y, z, colorFn(x,y,z));
      }
}

function tube(pts, radii, id){
  for (let i = 0; i < pts.length-1; i++){
    const [a,b] = [pts[i], pts[i+1]];
    const steps = 4;
    for (let s = 0; s < steps; s++){
      const t = s/steps;
      const r = radii[i] + (radii[i+1]-radii[i])*t;
      sphere(Math.round(a[0]+(b[0]-a[0])*t), Math.round(a[1]+(b[1]-a[1])*t), Math.round(a[2]+(b[2]-a[2])*t), r, id);
    }
  }
  const e = pts[pts.length-1];
  sphere(e[0], e[1], e[2], radii[radii.length-1], id);
}

// ---- clear the forest around the lair (trees only) ----
cube(-16, 0, -16, 18, 10, 12, AIR);

// ---- the gold hoard: stepped mound ----
disk(0, -1, 0, 12, GOLD);
disk(0, 0, 0, 12, GOLD);
disk(0, 1, 0, 10, GOLD);
disk(0, 2, 0, 8, GOLD);
disk(0, 3, 0, 6, GOLD);
disk(2, 4, 3, 3, GOLD);

// treasure mixed into the pile: coins, silver, copper, gems, pearls
const gems = [IRON, COPPER, CYAN, MAGENTA, LIGHT_BLUE, WHITE, GLASS, IRON, COPPER, GOLD];
for (let i = 0; i < 110; i++){
  const a = rnd(i) * Math.PI * 2, r = rnd(i+500) * 11.5;
  const x = Math.round(Math.cos(a)*r), z = Math.round(Math.sin(a)*r);
  const y = r < 6 ? 3 : r < 8 ? 2 : r < 10 ? 1 : 0;
  block(x, y, z, gems[Math.floor(rnd(i+900)*gems.length)]);
}
// small heaps on the slope
sphere(-8, 1, 3, 2, GOLD);
sphere(7, 1, -6, 2, GOLD);
sphere(-4, 1, 9, 2, GOLD);

// coins spilled onto the ground around the mound
for (let i = 0; i < 70; i++){
  const a = rnd(i+2000) * Math.PI * 2, r = 12.5 + rnd(i+2500) * 5;
  block(Math.round(Math.cos(a)*r), 0, Math.round(Math.sin(a)*r), rnd(i+3000) < 0.8 ? GOLD : COPPER);
}

// open chest overflowing with gold (west, front)
cube(-15, 0, -6, -12, 1, -3, OAK_LOG);
cube(-15, 2, -6, -12, 2, -3, GOLD);
cube(-15, 3, -6, -12, 3, -6, OAK_LOG);   // propped lid
block(-13, 3, -4, MAGENTA); block(-14, 3, -5, CYAN);
// a sword stuck in the hoard
line(-9, 1, -8, -9, 4, -8, IRON);
block(-10, 2, -8, GOLD); block(-8, 2, -8, GOLD);
// a shield and a crown
block(11, 1, -9, IRON); block(11, 2, -9, IRON); block(11, 2, -8, RED);
block(-6, 2, -11, GOLD); block(-7, 2, -11, GOLD); block(-6, 3, -11, RED);

// ---- ruined pillars behind the lair with braziers ----
for (const px of [-15, 17]){
  cylinder(px, 0, 9, 1, 6, COBBLE);
  cube(px-1, 6, 8, px+1, 6, 10, STONE);
  block(px, 7, 9, FIRE);
}
// crumbled stone bits
block(-13, 0, 11, COBBLE); block(-14, 0, 12, STONE); block(16, 0, 12, COBBLE); block(18, 0, 11, STONE);

// ---- the dragon ----
const scale = (x,y,z) => (rnd(x*31+y*17+z*7) < 0.15 ? BRICK : RED);

// body: big curled torso resting on the mound
ellipsoid(2, 6, 3, 7, 4, 5, scale);
// haunches
sphere(-4, 4, 6, 2, RED);
sphere(8, 4, 6, 2, RED);
// hind foot peeking out on the east
cube(9, 2, 4, 11, 2, 6, RED); block(12, 2, 4, IRON); block(12, 2, 6, IRON);

// neck: curving down from the chest to the resting head
tube([[0,7,-1],[-1,6,-3],[-2,5,-5],[-3,4,-7]], [2.5,2.2,2,2], RED);
// neck underside scales
for (let z = -6; z <= -2; z++) block(-2, 3, z, ORANGE);

// head: resting on the gold, snout toward the viewer (north)
ellipsoid(-3, 4, -9, 3, 2.5, 4, (x,y,z) => y < 4 ? ORANGE : RED);
// brow ridges
line(-5, 6, -9, -5, 6, -7, BRICK);
line(-1, 6, -9, -1, 6, -7, BRICK);
// closed eyes (sleeping) — thin dark lines
block(-5, 5, -10, BLACK); block(-5, 5, -11, BLACK);
block(-1, 5, -10, BLACK); block(-1, 5, -11, BLACK);
// nostrils + a lazy wisp of smoke from the snout
block(-4, 4, -13, BLACK); block(-2, 4, -13, BLACK);
block(-3, 4, -14, FIRE);
// teeth peeking from the jaw
block(-5, 3, -12, WHITE); block(-1, 3, -12, WHITE); block(-3, 3, -13, WHITE);
// horns sweeping back
line(-5, 6, -7, -7, 9, -3, BLACK);
line(-1, 6, -7, 1, 9, -3, BLACK);
line(-6, 6, -8, -8, 8, -5, BLACK);
line(0, 6, -8, 2, 8, -5, BLACK);
// cheek frills
block(-7, 4, -8, BRICK); block(1, 4, -8, BRICK);

// front legs folded beside the head, claws in the gold
cylinder(-8, 2, -6, 1, 3, RED);
cylinder(2, 2, -6, 1, 3, RED);
cube(-9, 2, -8, -7, 2, -7, RED);  block(-9, 2, -9, IRON); block(-8, 2, -9, IRON); block(-7, 2, -9, IRON);
cube(1, 2, -8, 3, 2, -7, RED);    block(1, 2, -9, IRON);  block(2, 2, -9, IRON);  block(3, 2, -9, IRON);

// tail: curls around the east side of the hoard toward the front
tube([[7,5,7],[10,4,9],[13,3,7],[15,2,3],[15,1,-2],[13,1,-6],[10,1,-9]], [2.2,2,2,1.5,1.2,1,1], RED);
// tail spade
block(9, 1, -10, BLACK); block(9, 2, -10, BLACK); block(8, 1, -10, BLACK); block(10, 1, -11, BLACK); block(9, 1, -11, BLACK);
// tail ridge
for (let i = 0; i < 6; i++) block(15, 3 + (i < 3 ? 0 : -1), 3 - i, BLACK);

// dorsal spines along the back and neck
for (let z = -2; z <= 8; z++){
  const dz = (z-3)/5;
  const top = 6 + 4*Math.sqrt(Math.max(0, 1 - dz*dz));
  block(2, Math.floor(top) + 1, z, BLACK);
  if (z % 2 === 0) block(2, Math.floor(top) + 2, z, BLACK);
}
block(0, 10, -1, BLACK); block(-1, 9, -3, BLACK); block(-2, 8, -5, BLACK); block(-3, 7, -7, BLACK);

// folded wings hugging the flanks, finger spikes rising over the shoulders
function wing(side){
  for (let y = 7; y <= 13; y++){
    const t = (y-7)/6;
    const zmin = Math.round(-1 + 3*t), zmax = Math.round(9 - 7*t);
    const x = 2 + side*(7 - Math.floor(t*4));
    for (let z = zmin; z <= zmax; z++){
      const edge = (z === zmin || z === zmax || y === 7);
      block(x, y, z, edge ? BRICK : BLACK);
    }
    if (y > 8) block(x + side, y, zmin, BRICK); // leading-edge bone
  }
  // wing claw spike at the apex
  const ax = 2 + side*3;
  line(ax, 13, 2, ax + side, 15, 0, BRICK);
  block(ax + side, 16, -1, IRON);
}
wing(-1);
wing(1);

// belly/chest plates visible at the front, under the neck
for (let x = -2; x <= 4; x++) block(x, 3, -2, ORANGE);
for (let x = -1; x <= 3; x++) block(x, 4, -3, ORANGE);