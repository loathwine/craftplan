// x-wing-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
const STONE=3, COBBLE=8, BRICK=10, GLASS=11, SNOW=12, ICE=13;

const centerY = 7;

function lerp(a,b,t){ return a+(b-a)*t; }

function radiusAt(z){
  const pts = [
    [-20,0.2],[-17,1.0],[-14,2.0],[-9,2.6],[-3,2.6],
    [2,2.4],[6,2.0],[8,1.4],[10,0.6]
  ];
  if (z<=pts[0][0]) return pts[0][1];
  if (z>=pts[pts.length-1][0]) return pts[pts.length-1][1];
  for (let i=0;i<pts.length-1;i++){
    const z1=pts[i][0], r1=pts[i][1], z2=pts[i+1][0], r2=pts[i+1][1];
    if (z>=z1 && z<=z2){
      return lerp(r1, r2, (z-z1)/(z2-z1));
    }
  }
  return 1;
}

function materialAt(z){
  if (z<=-17) return BRICK;   // red nose cone
  if (z<=-14) return SNOW;    // white transition band
  if (z<=6) return COBBLE;    // main grey hull
  return STONE;               // aft taper
}

function fillDiskZ(z, cx, cy, r, id){
  const ir = Math.ceil(r);
  for (let dx=-ir; dx<=ir; dx++){
    for (let dy=-ir; dy<=ir; dy++){
      if (dx*dx+dy*dy <= r*r+0.3){
        block(cx+dx, cy+dy, z, id);
      }
    }
  }
}

function ringDiskZ(z, cx, cy, rOuter, rInner, id){
  const ir = Math.ceil(rOuter);
  for (let dx=-ir; dx<=ir; dx++){
    for (let dy=-ir; dy<=ir; dy++){
      const d2 = dx*dx+dy*dy;
      if (d2 <= rOuter*rOuter+0.3 && d2 >= rInner*rInner){
        block(cx+dx, cy+dy, z, id);
      }
    }
  }
}

// ================= FUSELAGE =================
for (let z=-20; z<=10; z++){
  const r = radiusAt(z);
  if (r<=0) continue;
  fillDiskZ(z, 0, centerY, r, materialAt(z));
}
block(0, centerY, -20, BRICK); // nose tip cap

// squadron stripe rings
ringDiskZ(-13, 0, centerY, 2.1, 1.6, BRICK);
ringDiskZ(4, 0, centerY, 2.5, 2.0, BRICK);

// proton torpedo tubes under nose
cube(-1, centerY-3, -16, -1, centerY-2, -12, STONE);
cube(1, centerY-3, -16, 1, centerY-2, -12, STONE);
block(-1, centerY-3, -16, COBBLE);
block(1, centerY-3, -16, COBBLE);

// nose sensor antenna
line(0, centerY+2, -18, 0, centerY+5, -19, COBBLE);

// ================= COCKPIT =================
sphere(0, centerY+3, -7, 2, GLASS);
line(-2, centerY+3, -7, 2, centerY+3, -7, STONE);   // canopy cross-brace
line(0, centerY+1, -9, 0, centerY+5, -5, STONE);    // canopy cross-brace
ringDiskZ(-9, 0, centerY, 2.6, 2.3, COBBLE);         // canopy base collar

// astromech droid dome behind cockpit
sphere(0, centerY+4, -3, 1.4, ICE);
ringDiskZ(-2, 0, centerY+2, 2.0, 1.5, COBBLE);
block(0, centerY+5, -3, SNOW);

// ================= WINGS (S-foils in X config) =================
function buildWing(signX, signY){
  const rootX = signX*1;
  const tipX = signX*15;
  const rootY = centerY;
  const tipY = centerY + signY*9;
  const steps = Math.abs(tipX-rootX);

  for (let s=0; s<=steps; s++){
    const t = s/steps;
    const x = rootX + signX*s;
    const y = Math.round(lerp(rootY, tipY, t));
    const zFront = Math.round(lerp(-3, -1, t));
    const zBack = Math.round(lerp(6, 12, t));
    const mat = (s > steps-3) ? BRICK : COBBLE; // red wingtip accent stripe
    cube(x, y-1, zFront, x, y+1, zBack, mat);
  }

  const tx = tipX, ty = tipY;
  const tipZFront = -1, tipZBack = 12;

  // engine nacelle behind wingtip
  for (let z=tipZBack-2; z<=tipZBack+7; z++){
    fillDiskZ(z, tx, ty, 1.6, STONE);
  }
  fillDiskZ(tipZBack+8, tx, ty, 1.2, BRICK); // engine glow

  // forward laser cannon barrel, past the nose
  for (let z=-22; z<=tipZFront; z++){
    fillDiskZ(z, tx, ty, 0.6, COBBLE);
  }
  block(tx, ty, -22, BRICK); // cannon muzzle tip
}

buildWing(1, 1);
buildWing(1, -1);
buildWing(-1, 1);
buildWing(-1, -1);

// ================= LANDING STRUTS =================
function leg(x,z){
  line(x, 1, z, x, centerY-3, z, STONE);
  block(x, 1, z, COBBLE);
}
leg(-2, -1); leg(2, -1); leg(-2, 5); leg(2, 5);
```
