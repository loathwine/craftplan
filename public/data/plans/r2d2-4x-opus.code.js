// r2d2-4x-opus — prompt:
// R2-D2...

cube(-11, 1, -11, 11, 31, 9, AIR);

const R = 6;
const bodyBottom = 7, bodyTop = 22;
const domeCY = 22, domeR = 6;

function frontZ(x){ const v = R*R - x*x; if(v < 0) return null; return -Math.round(Math.sqrt(v)); }
function fb(y, x1, x2, id){ for(let x=x1;x<=x2;x++){ const z=frontZ(x); if(z!==null) block(x,y,z,id);} }
function panel(y1,y2,x1,x2,fill,border){
  for(let y=y1;y<=y2;y++) for(let x=x1;x<=x2;x++){
    const z=frontZ(x); if(z===null) continue;
    const edge=(y===y1||y===y2||x===x1||x===x2);
    block(x,y,z, edge?border:fill);
  }
}
function domeZ(x,y){ const v = domeR*domeR - x*x - (y-domeCY)*(y-domeCY); if(v<0) return null; return -Math.round(Math.sqrt(v)); }
function domePanel(x1,x2,y1,y2,fill,border){
  for(let y=y1;y<=y2;y++) for(let x=x1;x<=x2;x++){
    const z=domeZ(x,y); if(z===null) continue;
    const edge=(y===y1||y===y2||x===x1||x===x2);
    block(x,y,z, edge?border:fill);
  }
}

// ---- main body (white) ----
cylinder(0, bodyBottom, 0, R, bodyTop-bodyBottom+1, SNOW);

// silver neck ring & foot ring
hollowCylinder(0, bodyTop-1, 0, R, 2, STONE);
hollowCylinder(0, bodyBottom, 0, R, 2, STONE);
// a mid silver band
hollowCylinder(0, 15, 0, R, 1, STONE);

// ---- dome (silver-white) ----
sphere(0, domeCY, 0, domeR, SNOW);
// dome cap silver
for(let a=0;a<360;a+=15){}
disk(0, bodyTop+domeR, 0, 2, STONE); // top plate
block(0, bodyTop+domeR+1, 0, STONE);

// ---- front body panels ----
// central data panel (blue, silver frame)
panel(13, 19, -3, 3, GLASS, STONE);
// a smaller inner detail
panel(15, 17, -1, 1, ICE, STONE);
// flanking silver boxes
panel(14, 18, -5, -4, STONE, STONE);
panel(14, 18, 4, 5, STONE, STONE);
// lower vents
fb(10, -4, 4, STONE);
fb(11, -4, 4, STONE);
fb(12, -4, 4, STONE);
// bottom access door
panel(8, 9, -2, 2, STONE, COBBLE);
// octagonal ports (red / blue indicator dots)
[[-3,20,BRICK],[3,20,GLASS],[0,21,ICE],[-4,12,BRICK],[4,12,GLASS],[-2,13,BRICK],[2,19,ICE]]
  .forEach(([x,y,id])=>{ const z=frontZ(x); if(z!==null) block(x,y,z,id); });

// side blue panels (catch light toward camera)
panel(13, 18, -6, -5, GLASS, STONE);

// ---- dome face ----
// main photoreceptor eye
domePanel(-2, 2, 23, 27, STONE, STONE);
domePanel(-1, 1, 24, 26, GLASS, STONE);
// protruding lens bulge
{
  const z=domeZ(0,25);
  if(z!==null){ block(0,25,z-1,GLASS); block(0,25,z-2,ICE); block(0,26,z-1,STONE); block(0,24,z-1,STONE); block(-1,25,z-1,STONE); block(1,25,z-1,STONE); }
}
// front logic display panels (the blinky red/blue below the eye)
domePanel(-3, -1, 22, 23, BRICK, STONE);
domePanel(1, 3, 22, 23, GLASS, STONE);
// small dome sensors
[[-4,24,STONE],[4,24,STONE],[-3,26,BRICK],[3,26,GLASS],[0,27,STONE]]
  .forEach(([x,y,id])=>{ const z=domeZ(x,y); if(z!==null) block(x,y,z,id); });
// dome silver segment lines (a couple of vertical arcs)
for(let y=23;y<=27;y++){ const z=domeZ(-5,y); if(z!==null) block(-5,y,z,STONE); const z2=domeZ(5,y); if(z2!==null) block(5,y,z2,STONE); }

// ---- periscope + gadgets on top ----
line(2, 28, 0, 2, 31, 0, STONE);
block(2, 31, -1, BRICK);
block(2, 32, 0, ICE);
block(-2, 28, -2, STONE);
block(-2, 29, -2, GLASS);
block(1, 28, 2, STONE);

// ---- shoulder hips (connect body to legs) ----
function hip(sx){
  const x1 = sx<0 ? -8 : 6, x2 = sx<0 ? -6 : 8;
  cube(x1, 15, -3, x2, 19, 2, STONE);
  // hub center accent facing outward
  const face = sx<0 ? -8 : 8;
  cube(face, 16, -2, face, 18, 1, GLASS);
  block(face, 17, 0, ICE);
}
hip(-1); hip(1);

// ---- side legs (white with silver front stripe) ----
function leg(sx){
  const x1 = sx<0 ? -8 : 6, x2 = sx<0 ? -6 : 8;
  cube(x1, 2, -3, x2, 15, 2, SNOW);
  // silver front stripe
  cube(x1, 3, -4, x2, 14, -4, STONE);
  // blue accent panel
  cube(x1, 6, -4, x2, 9, -4, GLASS);
}
leg(-1); leg(1);

// ---- feet (metal boots) ----
function foot(cx){
  const x1 = cx-2, x2 = cx+2;
  cube(x1, 0, -4, x2, 2, 3, STONE);
  // rounded toe front
  cube(x1+0, 0, -5, x2-0, 1, -5, STONE);
  // side light strip
  block(cx, 2, -5, GLASS);
  block(x1, 1, -5, BRICK);
  block(x2, 1, -5, GLASS);
  // ankle detail
  cube(x1, 2, -1, x2, 3, 1, COBBLE);
}
foot(-7); foot(7);

// ---- center (3rd) leg + foot, forward ----
cube(-1, 1, -8, 1, 8, -5, SNOW);
cube(-1, 2, -9, 1, 7, -9, STONE);      // silver front face
cube(-1, 3, -9, 1, 5, -9, GLASS);      // blue accent
// center foot
cube(-2, 0, -10, 2, 1, -6, STONE);
block(0, 1, -10, GLASS);
block(-2, 1, -10, BRICK);
block(2, 1, -10, ICE);

// ---- restraining bolt + lower body accents ----
{
  const z=frontZ(-4); if(z!==null){ block(-4,10,z,COBBLE); }
  const z2=frontZ(4); if(z2!==null){ block(4,16,z2,COBBLE); }
}