// eagle-4x-opus — prompt:
// a bald eagle with wings spread...

// ===== Bald eagle, wings spread — monument on a rocky crag =====
// Front (face/beak) points NORTH (-Z), toward the camera. Wingspan runs along X.

const BODY  = OAK_LOG;  // brown plumage
const DARKF = STONE;     // dark feather tips / primaries
const WHITE = SNOW;      // white head, neck, tail
const YEL   = SAND;      // beak, talons
const ROCK  = COBBLE;

// ---------- Rocky pedestal / crag (grounds the monument) ----------
cylinder(0, -2, 4, 3, 6, ROCK);   // broad base  y=-2..3
cylinder(0,  3, 4, 2, 4, ROCK);   // narrower neck y=3..6
// rough, natural bumps
const bumps = [[-3,0,4],[3,1,3],[-2,2,6],[2,3,5],[-3,-1,3],[3,-1,5],[-1,4,3],[2,5,4],[-2,5,5]];
for (const [bx,by,bz] of bumps) block(bx,by,bz, (bx+by)%2 ? STONE : ROCK);
// weathered perch branch the talons grip
cube(-4,6,4, 4,6,4, OAK_LOG);
block(-5,6,4, OAK_LOG); block(5,6,5, OAK_LOG);

// ---------- Body (brown ellipsoid torso) ----------
const bcx=0, bcy=14, bcz=5, rx=4, ry=7, rz=4;
for (let y=-ry; y<=ry; y++)
  for (let x=-rx; x<=rx; x++)
    for (let z=-rz; z<=rz; z++) {
      const d = (x*x)/(rx*rx) + (y*y)/(ry*ry) + (z*z)/(rz*rz);
      if (d <= 1) {
        // darker feather streaks low on the belly
        const b = (y < -3 && (x+z)%3===0) ? DARKF : BODY;
        block(bcx+x, bcy+y, bcz+z, b);
      }
    }

// ---------- Head (white) ----------
const hcx=0, hcy=22, hcz=3, hr=3;
for (let y=-hr; y<=hr; y++)
  for (let x=-hr; x<=hr; x++)
    for (let z=-hr; z<=hr; z++)
      if (x*x+y*y+z*z <= hr*hr) block(hcx+x, hcy+y, hcz+z, WHITE);
// white nape blending head into shoulders
cube(-2,18,2, 2,21,4, WHITE);

// eyes (fierce) + brow
block(-2,23,0, DARKF); block(2,23,0, DARKF);
block(-2,24,1, DARKF); block(2,24,1, DARKF);  // brow ridge

// ---------- Beak (yellow, hooked, pointing NORTH -Z) ----------
cube(-1,22,0,  1,23,0,  YEL);
cube(-1,22,-1, 1,22,-1, YEL);
cube(-1,22,-2, 0,22,-2, YEL);
block(0,22,-3, YEL);
block(0,21,-3, YEL);   // hooked tip curling down
block(0,21,-2, YEL);

// ---------- Legs + talons (tucked, gripping the branch) ----------
cube(-2,6,4, -2,8,4, YEL);
cube( 2,6,4,  2,8,4, YEL);
for (const [tx,tz] of [[-3,4],[-2,5],[-2,3],[3,4],[2,5],[2,3]]) block(tx,6,tz, DARKF);

// a fish clutched in the talons
cube(-1,5,3, 1,5,6, STONE);
block(0,5,7, STONE); block(0,5,2, STONE);
block(-2,5,4, WHITE); block(2,5,4, WHITE);

// ---------- Tail (white fan streaming back / down, dark terminal band) ----------
for (let k=0; k<=6; k++) {
  const z  = 9 + k;
  const y  = 8 - Math.floor(k*0.8);
  const hw = 1 + Math.floor(k*0.7);
  const mat = (k===6) ? DARKF : WHITE;
  cube(-hw, y, z, hw, y, z, mat);
  if (k<6) cube(-hw+1, y-1, z, hw-1, y-1, z, WHITE);
}

// ---------- Wings (spread, arching up to splayed primaries) ----------
function wing(sign){
  const N = 19;
  for (let i=0; i<=N; i++){
    const t    = i/N;
    const x    = sign*(3+i);
    const cY   = 15 + Math.round(t*5);                 // rises toward the tip
    const half = Math.max(1, Math.round(6*(1-t)+1));   // 7 near body -> 1 at tip
    const zc   = 3 + Math.round(t*4);                  // swept back toward +Z
    const zH   = Math.max(0, 2 - Math.floor(t*2));     // thick near body, thin at tip

    // main feather sheet
    for (let dz=-zH; dz<=zH; dz++)
      cube(x, cY-half, zc+dz, x, cY+half, zc+dz, BODY);

    // dark trailing (lower) feather edge
    cube(x, cY-half, zc, x, cY-half+1, zc, DARKF);

    // outer feathers become dark primaries
    if (i >= 13) cube(x, cY-half, zc, x, cY+half, zc, DARKF);

    // covert layer — shorter feathers on the leading (front, -Z) edge
    if (i < 14) cube(x, cY, zc-zH-1, x, cY+half-1, zc-zH-1, BODY);
  }
  // splayed "finger" primaries fanning out at the tip
  for (let k=0; k<=4; k++)
    line(sign*17, 19, 7, sign*22, 17+k, 7 + (k%2), DARKF);
}
wing(1);
wing(-1);

// shoulder coverts connecting wings to the back
cube(-4,17,4, 4,20,6, BODY);