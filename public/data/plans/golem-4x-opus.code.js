// golem-4x-opus — prompt:
// a stone golem...

function hsh(x,y,z){
  let n = (x*374761393 + y*668265263 + z*2147483647) ^ (x*y*13 + z*7);
  n = (n ^ (n >>> 13)) >>> 0;
  return (n % 1000) / 1000;
}
// textured mass: mostly STONE, speckled COBBLE for weathered rock
function rock(x1,y1,z1,x2,y2,z2,altFreq){
  const xa=Math.min(x1,x2),xb=Math.max(x1,x2);
  const ya=Math.min(y1,y2),yb=Math.max(y1,y2);
  const za=Math.min(z1,z2),zb=Math.max(z1,z2);
  for(let x=xa;x<=xb;x++)for(let y=ya;y<=yb;y++)for(let z=za;z<=zb;z++){
    const r=hsh(x,y,z);
    block(x,y,z, r<altFreq ? COBBLE : STONE);
  }
}
// moss overlay on a thin surface slab
function moss(x1,y1,z1,x2,y2,z2,freq){
  const xa=Math.min(x1,x2),xb=Math.max(x1,x2);
  const ya=Math.min(y1,y2),yb=Math.max(y1,y2);
  const za=Math.min(z1,z2),zb=Math.max(z1,z2);
  for(let x=xa;x<=xb;x++)for(let y=ya;y<=yb;y++)for(let z=za;z<=zb;z++){
    if(hsh(x+11,y-3,z+5) < freq) block(x,y,z,LEAVES);
  }
}

// ---- FOUNDATION / RUBBLE (front is -Z, viewer's side) ----
cube(-8,-1,-5,8,-1,4,COBBLE);
// scattered broken rocks around the feet
const rubble=[[-9,0,-3],[-10,0,0],[9,0,-2],[10,0,2],[-8,0,4],[8,0,-4],[7,0,5],[-7,0,-6],[0,0,-6],[4,0,6]];
for(const [rx,rz] of rubble.map(p=>[p[0],p[2]])){}
for(const p of rubble){ block(p[0],0,p[2],COBBLE); if(hsh(p[0],1,p[2])<0.5) block(p[0],1,p[2],STONE); }

// ---- FEET ----
rock(-6,0,-4,-1,1,2,0.3);   // left foot (viewer-left), juts forward
rock(1,0,-4,6,1,2,0.3);     // right foot
// toe cracks
block(-4,0,-4,AIR); block(-2,1,-3,AIR);
block(3,0,-4,AIR);  block(5,1,-3,AIR);

// ---- LEGS ----
rock(-5,2,-1,-2,9,2,0.28);  // left leg
rock(2,2,-1,5,9,2,0.28);    // right leg
// knee ridge (protrudes front)
rock(-5,5,-2,-2,6,-2,0.2);
rock(2,5,-2,5,6,-2,0.2);
// leg cracks
line(-4,3,-1,-3,8,-1,AIR);
line(4,8,-1,3,3,-1,AIR);

// ---- PELVIS ----
rock(-6,10,-2,6,11,3,0.3);

// ---- TORSO ----
rock(-6,11,-3,6,20,4,0.32);
// slightly hollow the back to lighten & give depth
cube(-4,13,3,4,18,4,AIR);
rock(-6,13,4,6,18,4,0.4); // back plate re-skin

// chest bevel: narrow the upper chest front
rock(-5,17,-4,5,20,-4,0.25); // pectoral slab forward
// glowing core set into the chest
cube(-2,14,-4,2,17,-3,STONE);
cube(-1,15,-4,1,16,-4,BRICK);   // core face
block(0,16,-5,BRICK);           // core juts out
// radiating cracks from the core (carved dark seams)
line(-1,17,-3,-4,20,-3,AIR);
line(1,17,-3,4,20,-3,AIR);
line(-1,14,-3,-4,12,-3,AIR);
line(1,14,-3,4,12,-3,AIR);
line(0,17,-3,0,19,-3,AIR);

// ---- SHOULDERS (broad, boulder-like) ----
rock(-12,17,-2,-6,20,3,0.35);
rock(6,17,-2,12,20,3,0.35);
// shoulder boulders on top
rock(-12,20,-1,-9,22,2,0.4);
rock(9,20,-1,12,22,2,0.4);

// ---- ARMS (heavy, hanging) ----
rock(-12,5,-1,-9,19,3,0.3);   // left arm
rock(9,5,-1,12,19,3,0.3);     // right arm
// forearm plates jut forward
rock(-12,8,-2,-9,12,-2,0.25);
rock(9,8,-2,12,12,-2,0.25);
// ---- FISTS (oversized) ----
rock(-13,4,-2,-8,8,3,0.35);
rock(8,4,-2,13,8,3,0.35);
// knuckle bumps on fronts
block(-12,7,-3,STONE); block(-10,7,-3,STONE); block(-9,7,-3,COBBLE);
block(9,7,-3,STONE);   block(11,7,-3,STONE);  block(12,7,-3,COBBLE);
// arm seam cracks
line(-11,17,3,-11,7,3,AIR);
line(11,7,3,11,17,3,AIR);

// ---- NECK ----
rock(-3,20,-2,3,21,2,0.25);

// ---- HEAD ----
rock(-5,21,-3,5,26,3,0.3);
// brow ridge juts forward (-Z), casts shadow over eyes
rock(-5,24,-4,5,24,-4,0.2);
block(-5,25,-4,STONE); block(5,25,-4,STONE);
// deep-set glowing eyes
cube(-3,23,-4,-2,23,-3,ICE);
cube(2,23,-4,3,23,-3,ICE);
block(-3,23,-5,ICE); block(2,23,-5,ICE); // slight glow forward
// carved mouth grimace
line(-3,22,-3,3,22,-3,AIR);
block(-2,21,-3,AIR); block(2,21,-3,AIR);
// forehead crack
line(0,26,-3,-2,24,-3,AIR);
// jaw/cheek bevels
rock(-5,21,-3,-4,22,-3,0.4);
rock(4,21,-3,5,22,-3,0.4);

// ---- MOSS / WEATHERING (grown-over ancient stone) ----
moss(-12,20,-1,-9,22,2,0.5);   // left shoulder boulder
moss(9,20,-1,12,22,2,0.5);     // right shoulder boulder
moss(-5,26,-3,5,26,3,0.35);    // head crown
moss(-6,19,-3,6,20,-3,0.25);   // upper chest
moss(-6,10,-2,6,11,3,0.3);     // pelvis
moss(-13,4,-2,-8,5,3,0.4);     // left fist top
moss(8,4,-2,13,5,3,0.4);       // right fist top
// hanging vines from shoulders
line(-11,19,2,-11,15,2,LEAVES);
line(10,19,2,10,16,2,LEAVES);
line(-4,20,-3,-4,17,-3,LEAVES);
block(-4,16,-3,LEAVES);