// darth-vader-4x-fable — prompt:
// Darth Vader...

const M = (x1,y1,z1,x2,y2,z2,id) => { cube(x1,y1,z1,x2,y2,z2,id); cube(-x2,y1,z1,-x1,y2,z2,id); };

// ---- clear trees/brush from the build area (AIR is free) ----
cube(-13,1,-13,13,12,13,AIR);
cube(12,0,5,18,13,11,AIR);
cube(-18,0,5,-12,13,11,AIR);

// ---- Death Star landing-pad floor ----
disk(0,0,0,12,STONE);
for (let a=0; a<360; a+=4) {
  const r=12, x=Math.round(r*Math.cos(a*Math.PI/180)), z=Math.round(r*Math.sin(a*Math.PI/180));
  block(x,0,z,COBBLE);
}
for (let a=0; a<360; a+=7) {
  const r=6, x=Math.round(r*Math.cos(a*Math.PI/180)), z=Math.round(r*Math.sin(a*Math.PI/180));
  block(x,0,z,BRICK);
}
for (let i=0; i<8; i++) {
  const a=i*Math.PI/4;
  line(Math.round(8*Math.cos(a)),0,Math.round(8*Math.sin(a)),
       Math.round(11*Math.cos(a)),0,Math.round(11*Math.sin(a)),COBBLE);
}
block(8,0,8,SNOW); block(-8,0,8,SNOW); block(8,0,-8,SNOW); block(-8,0,-8,SNOW);

// ---- cape: flows from shoulders, flares wide, pools at the floor ----
for (let y=23; y>=1; y--) {
  const t=23-y;
  let hw=Math.min(4+Math.round(t*0.5),13);
  if (y%3===0) hw=Math.min(hw+1,13);
  const zc=3+Math.floor(t/9);
  cube(-hw,y,zc,hw,y,zc,COBBLE);
  if (y<=2) cube(-(hw-2),y,zc+1,hw-2,y,zc+1,COBBLE);
}

// ---- boots and legs ----
M(1,1,-3,4,3,2,COBBLE);            // boots
M(1,4,-1,4,10,2,COBBLE);           // legs
cube(-4,11,-1,4,12,2,COBBLE);      // hips
M(1,8,-2,4,9,-2,STONE);            // knee armor plates

// ---- torso ----
cube(-5,13,-2,5,21,2,COBBLE);
cube(-2,9,-2,2,13,-2,COBBLE);      // tabard skirt hanging from belt
// belt with buckle + boxes
line(-5,14,-3,5,14,-3,STONE);
line(-5,14,3,5,14,3,STONE);
line(-5,14,-2,-5,14,2,STONE);
line(5,14,-2,5,14,2,STONE);
block(0,14,-4,SNOW);
block(-3,14,-4,BRICK); block(3,14,-4,BRICK);
// chest control panel
cube(-1,15,-3,1,17,-3,STONE);
block(-1,17,-3,BRICK); block(0,17,-3,SNOW); block(1,17,-3,GLASS);
block(-1,16,-3,GLASS); block(0,16,-3,BRICK); block(1,16,-3,BRICK);
block(-1,15,-3,SNOW); block(1,15,-3,SNOW);

// ---- shoulders / pauldrons ----
cube(-8,21,-2,8,23,2,COBBLE);
M(4,24,-2,8,24,2,COBBLE);          // raised pauldron caps
M(5,24,-1,7,24,1,STONE);           // glint on top
// chain clasps at the collar
block(-3,22,-3,SNOW); block(3,22,-3,SNOW); line(-2,22,-3,2,22,-3,STONE);
// back control pack
cube(-2,16,3,2,19,3,STONE);
block(0,18,4,BRICK);

// ---- left arm: hangs at side ----
cube(-8,14,-2,-6,21,0,COBBLE);
cube(-8,13,-2,-6,14,0,COBBLE);     // glove

// ---- right arm: raised, saber ignited ----
cube(6,18,-2,8,21,0,COBBLE);       // upper arm
cube(7,16,-6,9,18,-3,COBBLE);      // forearm thrust forward
cube(8,16,-7,9,18,-6,COBBLE);      // fist
block(9,19,-6,STONE); block(9,20,-6,STONE);   // hilt
line(9,21,-6,15,33,-6,BRICK);      // blade
line(10,21,-6,16,33,-6,BRICK);     // blade thickness
block(16,33,-6,SNOW);              // hot tip

// ---- helmet ----
cube(-1,22,-2,1,23,0,COBBLE);      // neck
sphere(0,27,-1,4,COBBLE);          // dome
cube(-5,22,-6,5,26,-4,AIR);        // carve lower front so the brow overhangs
cube(-2,23,-3,2,27,1,COBBLE);      // face mask
// eye lenses
block(-2,26,-3,GLASS); block(-1,26,-3,GLASS);
block(1,26,-3,GLASS);  block(2,26,-3,GLASS);
// nose bridge + mouth grill triangle
block(0,25,-3,STONE);
block(-1,24,-3,STONE); block(0,24,-3,STONE); block(1,24,-3,STONE);
block(0,23,-3,STONE);
// cheek vents
block(-2,24,-3,COBBLE); block(2,24,-3,COBBLE);
// helmet ridge down the dome center
line(0,28,-4,0,31,-2,STONE);

// ---- flanking Imperial pylons ----
M(14,-1,7,16,10,9,STONE);
M(15,1,7,15,8,7,BRICK);            // glowing red slit
M(14,11,7,16,11,9,SNOW);           // lit cap

// ---- scorched debris around the pad ----
block(13,0,-4,COBBLE); block(14,0,-3,STONE); block(13,1,-3,COBBLE);
block(-14,0,2,COBBLE); block(-13,0,3,STONE);
block(-13,0,-6,COBBLE); block(-14,1,-6,COBBLE);
block(11,0,10,BRICK); block(-11,0,-11,BRICK); block(-12,0,10,BRICK);
block(5,0,-12,BRICK); block(-6,0,12,COBBLE);