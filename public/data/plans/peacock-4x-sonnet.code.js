// peacock-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
const GRASS=1, DIRT=2, STONE=3, OAK_LOG=4, LEAVES=5, SAND=6, PLANKS=7, COBBLE=8, BRICK=10, GLASS=11, SNOW=12, ICE=13, AIR=0;

function r(n){ return Math.round(n); }

// ---------- LEGS & FEET ----------
line(-1,0,0, -1,2,0, STONE);
line(1,0,0, 1,2,0, STONE);
cube(-2,0,-1, 0,0,1, STONE);
cube(0,0,-1, 2,0,1, STONE);

// ---------- BODY ----------
sphere(0,5,0,3,GLASS);
sphere(0,5,-2,2,ICE);        // bright turquoise chest, faces viewer
sphere(-3,5,1,1,LEAVES);     // folded wing bulge, left
sphere(3,5,1,1,LEAVES);      // folded wing bulge, right
sphere(-3,5,1,1,GLASS);      // wing sheen highlight (partial overwrite)
sphere(3,5,1,1,GLASS);

// ---------- NECK ----------
line(0,8,-1, 0,9,-2, GLASS);
line(0,9,-2, 0,10,-3, GLASS);
line(0,10,-3, 0,11,-4, GLASS);
line(-1,9,-1, -1,10,-2, ICE);
line(1,9,-1, 1,10,-2, ICE);

// ---------- HEAD ----------
sphere(0,12,-5,1,GLASS);
block(0,12,-6,STONE);         // beak
block(0,11,-6,STONE);         // lower beak
block(-1,12,-5,SNOW);         // left eye
block(1,12,-5,SNOW);
block(-1,12,-5,STONE);        // pupil overwrite... keep simple, skip double

// crest (fan of small head feathers)
line(0,13,-5, 0,15,-6, LEAVES);
block(0,16,-6,SAND);
line(-1,13,-5, -1,14,-5, LEAVES);
block(-1,15,-5,SAND);
line(1,13,-5, 1,14,-5, LEAVES);
block(1,15,-5,SAND);

// ---------- TAIL FAN ----------
const baseX=0, baseY=7, baseZ=2;

for (let deg=-80; deg<=80; deg+=5) {
  const idx = (deg+80)/5;
  const th = deg*Math.PI/180;
  const R = 9 + 7*Math.cos(th*0.9);
  const tipX = r(baseX + R*Math.sin(th));
  const tipY = r(baseY + R*Math.cos(th));
  const tipZ = r(baseZ + 2*(1 - Math.cos(th)));

  line(baseX, baseY, baseZ, tipX, tipY, tipZ, LEAVES);
  // widen the blade partway out
  const midX = r(baseX + (tipX-baseX)*0.6);
  const midY = r(baseY + (tipY-baseY)*0.6);
  const midZ = r(baseZ + (tipZ-baseZ)*0.6);
  line(midX+1, midY, midZ, tipX+1, tipY, tipZ, GLASS);
  line(midX-1, midY, midZ, tipX-1, tipY, tipZ, GLASS);

  // eye ornament (ocellus) at tip, alternating palette
  if (idx % 2 === 0) {
    sphere(tipX,tipY,tipZ,2,SAND);
    sphere(tipX,tipY,tipZ,1,ICE);
  } else {
    sphere(tipX,tipY,tipZ,2,ICE);
    sphere(tipX,tipY,tipZ,1,SAND);
  }
  block(tipX,tipY,tipZ,STONE);

  // secondary background layer, every other feather, deeper & taller for density
  if (idx % 2 === 0) {
    const R2 = R + 4;
    const tipX2 = r(baseX + R2*Math.sin(th));
    const tipY2 = r(baseY + R2*Math.cos(th));
    const tipZ2 = tipZ + 2;
    line(baseX, baseY, baseZ+1, tipX2, tipY2, tipZ2, GLASS);
    sphere(tipX2,tipY2,tipZ2,1,ICE);
    block(tipX2,tipY2,tipZ2,STONE);
  }
}

// ---------- SHORT COVERT FEATHERS (fill base of fan, in front of long ones) ----------
for (let deg=-70; deg<=70; deg+=10) {
  const th = deg*Math.PI/180;
  const R = 5 + 2*Math.cos(th*0.8);
  const tipX = r(baseX + R*Math.sin(th));
  const tipY = r(baseY + R*Math.cos(th));
  const tipZ = baseZ - 1;
  line(baseX, baseY-1, baseZ-1, tipX, tipY, tipZ, LEAVES);
}
