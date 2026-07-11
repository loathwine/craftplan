// fighter-jet-4x-fable — prompt:
// a fighter jet...

const STONE_=STONE, HULL=STONE, DARK=COBBLE;

// ---------- fuselage (nose at -Z, camera side) ----------
const S=[];
S.push([-21,0,14,14],[-20,0,13,14],[-19,1,13,15],[-18,1,13,15],[-17,1,12,15],[-16,2,12,15],[-15,2,12,15]);
for(let z=-14;z<=-8;z++) S.push([z,2,12,15]);
for(let z=-7;z<=5;z++)  S.push([z,3,12,16]);
S.push([6,3,12,15],[7,3,12,15],[8,2,12,15],[9,2,12,15]);
for(let z=10;z<=13;z++) S.push([z,1,12,15]);
S.push([14,1,13,14]);
for(const [z,hw,yb,yt] of S) cube(-hw,yb,z,hw,yt,z,HULL);

// radome (dark nose tip)
block(0,14,-21,DARK); cube(0,13,-20,0,14,-20,DARK);

// air intakes flanking the body
cube(3,12,-7,4,14,1,DARK); cube(-4,12,-7,-3,14,1,DARK);

// ---------- canopy ----------
cube(-1,16,-14,1,16,-14,DARK);            // windshield frame
cube(-1,16,-13,1,16,-9,GLASS);
cube(0,17,-12,0,17,-10,GLASS);
cube(-1,16,-8,1,16,-8,HULL);              // fairing into spine

// ---------- delta wings (swept, SNOW leading edge) ----------
for(let x=4;x<=18;x++){
  const zle=-4+Math.round((x-4)*0.8);
  const zte=9-Math.round((x-4)/7);
  cube(x,13,zle,x,13,zte,HULL);  cube(-x,13,zle,-x,13,zte,HULL);
  block(x,13,zle,SNOW);          block(-x,13,zle,SNOW);
  if(x<=9){ cube(x,14,zle+2,x,14,zte-1,HULL); cube(-x,14,zle+2,-x,14,zte-1,HULL); }
}

// ---------- horizontal stabilizers ----------
for(let x=2;x<=9;x++){
  const zle=9+Math.round((x-2)*0.55);
  cube(x,13,zle,x,13,14,HULL);  cube(-x,13,zle,-x,13,14,HULL);
  block(x,13,zle,SNOW);         block(-x,13,zle,SNOW);
}

// ---------- twin vertical fins with red tail band ----------
for(let y=15;y<=21;y++){
  const zle=8+Math.round((y-15)*0.85);
  cube(2,y,zle,2,y,14,HULL);  cube(-2,y,zle,-2,y,14,HULL);
}
cube(2,20,13,2,21,14,BRICK);  cube(-2,20,13,-2,21,14,BRICK);

// ---------- engines + afterburners ----------
for(let z=10;z<=14;z++){ cube(1,13,z,3,15,z,DARK); cube(-3,13,z,-1,15,z,DARK); }
block(2,14,14,AIR); block(-2,14,14,AIR);   // nozzle holes
for(const sx of [2,-2]){
  cube(sx-1,13,15,sx+1,15,15,BRICK);
  block(sx,14,15,GLASS);                   // blue flame core
  block(sx,14,16,BRICK); block(sx-1,14,16,BRICK); block(sx+1,14,16,BRICK);
  block(sx,13,16,BRICK); block(sx,15,16,BRICK);
  block(sx,14,17,BRICK); block(sx,13,17,BRICK);
  block(sx,14,18,BRICK); block(sx,14,19,BRICK); block(sx,14,20,BRICK);
  block(sx,14,21,SNOW);  block(sx,14,22,SNOW); // exhaust smoke
}

// ---------- fuselage cheatline stripe ----------
for(const [z,hw] of S){ if(hw===2 && z>=-16 && z<=9){ block(hw,14,z,SNOW); block(-hw,14,z,SNOW); } }

// ---------- weapons ----------
// wingtip rails + missiles
for(const sx of [19,-19]){
  cube(sx,13,3,sx,13,9,SNOW); block(sx,13,2,BRICK);
  for(let z=10;z<=21;z++){ if(z<15 || z%2) block(sx,13,z,SNOW); } // wingtip contrail
}
// underwing missiles (right pair, left inner)
cube(8,12,0,8,12,6,SNOW);   block(8,12,-1,BRICK);
cube(13,12,4,13,12,9,SNOW); block(13,12,3,BRICK);
cube(-8,12,0,-8,12,6,SNOW); block(-8,12,-1,BRICK);
// FIRED missile off the left outer pylon, streaking ahead
cube(-13,12,-15,-13,12,-9,SNOW);
block(-13,12,-16,BRICK);                   // warhead
block(-13,12,-8,BRICK); block(-13,12,-7,BRICK); // rocket motor flame
for(let z=-5;z<=3;z+=2) block(-13,12,z,SNOW);   // smoke trail back to pylon
block(-13,12,4,DARK);                      // empty launch pylon

// ---------- wingman jet, high and behind-left ----------
function miniJet(mx,my,mz){
  cube(mx,my,mz+1,mx,my+1,mz+8,HULL);
  block(mx,my,mz,HULL); block(mx,my,mz-1,DARK);
  block(mx,my+1,mz+2,GLASS);
  for(let i=1;i<=4;i++){
    cube(mx-i,my,mz+3+i,mx-i,my,mz+6,HULL);
    cube(mx+i,my,mz+3+i,mx+i,my,mz+6,HULL);
  }
  cube(mx,my+2,mz+7,mx,my+3,mz+8,HULL);
  block(mx,my+3,mz+8,BRICK);
  block(mx-1,my,mz+8,HULL); block(mx+1,my,mz+8,HULL);
  block(mx,my,mz+9,BRICK); block(mx,my,mz+10,BRICK);
  for(let z=mz+11;z<=mz+16;z+=2) block(mx,my,z,SNOW);
}
miniJet(-14,21,2);

// ---------- cloud layer below (depth + sky context) ----------
disk(-14,9,-4,5,SNOW); disk(-12,10,-3,3,SNOW); disk(-16,10,-6,2,SNOW);
disk(12,9,-12,5,SNOW); disk(14,10,-11,4,SNOW); disk(9,10,-14,2,SNOW);
disk(2,10,18,4,SNOW);  disk(0,11,17,3,SNOW);
disk(-4,8,-16,3,SNOW); disk(-6,9,-15,2,SNOW);