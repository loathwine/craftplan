// lighthouse-4x-opus — prompt:
// a lighthouse on a cliff...

disk(0,0,0,0,AIR); // no-op guard
// ---- "A lighthouse on a cliff" ----
// Camera looks south (-Z is front). Cliff drops toward the viewer, lighthouse on top.

const CX = 3, CZ = 4;            // lighthouse center (slightly east of origin)

function hash(x,y,z){ let s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453; return s-Math.floor(s); }
function ring(cx,cy,cz,r,id){ disk(cx,cy,cz,r,id); if(r>1) disk(cx,cy,cz,r-1,AIR); }

// 0) clear trees/foliage sitting in the build zone (AIR is free)
cube(-14,1,-15, 15,32,15, AIR);

// 1) SEA in front of the cliff (north, low)  ------------------------------------
cube(-13,-2,-13, 13,-1,-3, GLASS);      // two thin layers of water
for(let x=-13;x<=13;x++) for(let z=-13;z<=-3;z++){
  if(hash(x,0,z)>0.82) block(x,0,z,GLASS);   // gentle swell on the surface
  if(hash(x,7,z)>0.93) block(x,0,z,ICE);     // occasional bright glints
}

// 2) THE CLIFF  -----------------------------------------------------------------
// main rocky mass, sheer face toward the camera (north edge at z=-2)
cube(-9,-2,-2, 13,5,13, STONE);
cube(-7,-2, 0, 11,4,13, AIR);          // hollow the hidden core -> stone shell
// taller spur on the east for asymmetry
cube(9,-2,-2, 13,7,6, STONE);
cube(10,-2,-1, 12,6,5, AIR);
// talus / rock rubble sloping into the water at the cliff foot
for(let x=-11;x<=13;x++) for(let z=-6;z<=-2;z++){
  const t=hash(x,3,z);
  if(t>0.5){ const top=Math.floor(-1 + t*3); cube(x,-2,z, x,top,z, t>0.75?COBBLE:STONE); }
}
// texture the sheer north face with cobble patches
for(let x=-9;x<=13;x++) for(let y=-1;y<=5;y++){
  if(hash(x,y,-2)>0.58) block(x,y,-2,COBBLE);
}
// natural cliff top: patchy grass, dirt, a few boulders + tufts
for(let x=-9;x<=13;x++) for(let z=-2;z<=13;z++){
  const t=hash(x,9,z);
  if(t>0.75) block(x,6,z,GRASS);
  else if(t>0.62) block(x,5,z,DIRT);
  if(t>0.95){ block(x,6,z,COBBLE); block(x,7,z,COBBLE); }   // boulders
}
// foam ring where rock meets water
for(let x=-11;x<=13;x++) for(let z=-4;z<=-1;z++){
  if(hash(x,2,z)>0.7) block(x,0,z,SNOW);
}

// sea stacks rising out of the water (classic lighthouse foreground)
cylinder(-9,-2,-9, 2, 8, STONE); block(-9,6,-9,COBBLE); disk(-9,0,-9,3,SNOW);
cylinder(7,-2,-10, 1, 6, COBBLE); disk(7,0,-10,2,SNOW);

// 3) LIGHTHOUSE TOWER  ----------------------------------------------------------
function rad(y){ return y<=14?4:3; }
function band(y){ return (Math.floor((y-6)/3)%2===0)?SNOW:BRICK; }  // white/red bands
for(let y=6;y<=22;y++) ring(CX,y,CZ,rad(y),band(y));

// doorway on the north (camera) side + threshold + frame
cube(CX-1,6,-1, CX+1,8,1, AIR);
block(CX-1,6,CZ-4,COBBLE); block(CX+1,6,CZ-4,COBBLE);
line(CX-1,8,0, CX+1,8,0, COBBLE);            // lintel

// glass windows up the shaft (north, east, west)
block(CX,   13, CZ-4, GLASS);
block(CX,   18, CZ-3, GLASS);
block(CX+4, 11, CZ,   GLASS);
block(CX-4, 16, CZ,   GLASS);
block(CX+3, 20, CZ,   GLASS);

// 4) GALLERY + LANTERN ROOM + ROOF  --------------------------------------------
disk(CX,23,CZ,4,COBBLE);                     // overhanging gallery floor
ring(CX,24,CZ,4,COBBLE);                     // railing
// lantern glass housing
for(let y=24;y<=26;y++) ring(CX,y,CZ,2,GLASS);
// corner mullions
for(const [dx,dz] of [[2,0],[-2,0],[0,2],[0,-2]]) cube(CX+dx,24,CZ+dz, CX+dx,26,CZ+dz, COBBLE);
// the lamp itself (glowing white core)
block(CX,25,CZ,SNOW);
block(CX,24,CZ,SNOW);
// red dome roof
disk(CX,27,CZ,3,BRICK);
disk(CX,28,CZ,2,BRICK);
disk(CX,29,CZ,1,BRICK);
block(CX,30,CZ,OAK_LOG);                     // finial
block(CX,31,CZ,ICE);                         // beacon tip

// faint light beams sweeping out over the sea
line(CX,25,CZ, CX-9,29,CZ-12, ICE);
line(CX,25,CZ, CX+9,27,CZ-11, ICE);

// 5) KEEPER'S COTTAGE (west of the tower) --------------------------------------
const hx1=-8, hx2=-3, hz1=3, hz2=8;
cube(hx1,6,hz1, hx2,6,hz2, PLANKS);          // floor
cube(hx1,6,hz1, hx2,9,hz1, PLANKS);          // north wall (front)
cube(hx1,6,hz2, hx2,9,hz2, PLANKS);          // south wall
cube(hx1,6,hz1, hx1,9,hz2, PLANKS);          // west wall
cube(hx2,6,hz1, hx2,9,hz2, PLANKS);          // east wall
for(const [x,z] of [[hx1,hz1],[hx2,hz1],[hx1,hz2],[hx2,hz2]]) cube(x,6,z,x,9,z,OAK_LOG); // corner posts
// pitched brick roof (stepped)
cube(hx1-1,10,hz1-1, hx2+1,10,hz2+1, BRICK);
cube(hx1,  11,hz1+1, hx2,  11,hz2-1, BRICK);
line(hx1+1,12,4, hx2-1,12,4, BRICK);         // ridge
// door + windows
cube(-6,6,hz1, -5,7,hz1, AIR);
block(hx1,7,5,GLASS); block(hx2,7,6,GLASS); block(-6,8,hz1,GLASS);
// chimney with a snowy smoke puff
cube(hx2-1,10,hz2-1, hx2-1,13,hz2-1, COBBLE);
block(hx2-1,14,hz2-1,SNOW);

// 6) CLIFF-EDGE FENCE + STEPPING PATH  -----------------------------------------
for(let x=-8;x<=12;x+=2){ block(x,6,-1,OAK_LOG); block(x,7,-1,OAK_LOG); }
for(let x=-7;x<=11;x+=2) block(x,7,-1,PLANKS);   // top rail
// path from cottage to the lighthouse door
line(-4,6,4, 1,6,2, COBBLE);
line(1,6,2, CX,6,0, COBBLE);

// 7) scattered boulders + a bit of driftwood in the foreground
sphere(-6,0,-6,2,COBBLE);
sphere(10,0,-7,1,COBBLE);
line(-3,0,-8, 0,0,-7, OAK_LOG);              // driftwood log on the shore