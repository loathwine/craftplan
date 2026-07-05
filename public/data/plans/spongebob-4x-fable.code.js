// spongebob-4x-fable — prompt:
// SpongeBob SquarePants...

disk(0,0,0,9,SAND);
disk(14,0,-8,4,SAND);
disk(-15,0,16,6,SAND);
cube(-17,0,-13,18,9,10,AIR);
cube(-20,0,10,-8,9,21,AIR);
disk(0,0,0,9,SAND);
disk(14,0,-8,4,SAND);
disk(-15,0,16,6,SAND);

// ---- SpongeBob: legs & shoes ----
function legAt(x1,x2){
  cube(x1,1,-4,x2,1,0,STONE);      // shoe sole + toe
  cube(x1,2,-1,x2,2,0,STONE);      // shoe heel
  cube(x1,3,-1,x2,3,0,SNOW);       // sock
  cube(x1,4,-1,x2,4,0,BRICK);      // red stripe
  cube(x1,5,-1,x2,5,0,SNOW);       // sock
  cube(x1,6,-1,x2,9,0,SAND);       // skinny yellow leg
}
legAt(-5,-4);
legAt(4,5);

// ---- pants / shirt / sponge body ----
cube(-8,10,-3,8,12,3,OAK_LOG);     // brown square pants
cube(-8,13,-3,8,14,3,SNOW);        // white shirt band
cube(-8,15,-3,8,31,-3,SAND);       // front wall
cube(-8,15,3,8,31,3,SAND);         // back wall
cube(-8,15,-2,-8,31,2,SAND);       // left wall
cube(8,15,-2,8,31,2,SAND);         // right wall
cube(-8,32,-3,8,32,3,SAND);        // top slab

// ---- face ----
function eye(cx){
  for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){
    if(dx*dx+dy*dy<=5.5) block(cx+dx,27+dy,-4,SNOW);
  }
  block(cx,25,-5,ICE); block(cx,27,-5,ICE);
  block(cx-1,26,-5,ICE); block(cx+1,26,-5,ICE);
  block(cx,26,-5,STONE);
  block(cx-2,30,-4,STONE); block(cx,30,-4,STONE);
  block(cx,31,-4,STONE); block(cx+2,30,-4,STONE);
}
eye(-4);
eye(4);

// droopy nose
block(0,24,-4,SAND); block(0,24,-5,SAND);
block(0,23,-5,SAND); block(0,23,-6,SAND); block(0,22,-6,SAND);

// smile carved into hollow front (dark interior = mouth)
for(let x=-6;x<=6;x++){ block(x,19+Math.floor(x*x/10),-3,AIR); }
for(let x=-3;x<=3;x++) block(x,18,-3,AIR);
for(let x=-2;x<=2;x++) block(x,17,-3,AIR);
// buck teeth
cube(-2,16,-4,-1,18,-4,SNOW);
cube(1,16,-4,2,18,-4,SNOW);

// freckles
block(-7,23,-3,BRICK); block(-6,24,-3,BRICK); block(-5,23,-3,BRICK);
block(7,23,-3,BRICK); block(6,24,-3,BRICK); block(5,23,-3,BRICK);

// ---- sponge pores ----
function poreZ(x,y,z,deep){
  block(x-1,y,z,DIRT); block(x+1,y,z,DIRT);
  block(x,y-1,z,DIRT); block(x,y+1,z,DIRT);
  block(x,y,z,deep?AIR:DIRT);
}
function poreX(x,y,z,deep){
  block(x,y,z-1,DIRT); block(x,y,z+1,DIRT);
  block(x,y-1,z,DIRT); block(x,y+1,z,DIRT);
  block(x,y,z,deep?AIR:DIRT);
}
function poreY(x,y,z,deep){
  block(x-1,y,z,DIRT); block(x+1,y,z,DIRT);
  block(x,y,z-1,DIRT); block(x,y,z+1,DIRT);
  block(x,y,z,deep?AIR:DIRT);
}
poreZ(-7,17,-3,true); poreZ(7,17,-3,false);
poreZ(-7,30,-3,false); poreZ(7,29,-3,true);
poreX(-8,18,0,true); poreX(-8,24,1,false); poreX(-8,28,-1,true);
block(-8,31,1,DIRT); block(-8,21,-2,DIRT);
poreX(8,17,-1,false); poreX(8,22,1,true); poreX(8,27,-1,false);
block(8,30,2,DIRT);
poreZ(-5,17,3,false); poreZ(1,19,3,true); poreZ(6,23,3,false);
poreZ(-4,26,3,true); poreZ(2,29,3,false);
poreY(-5,32,0,true); poreY(1,32,2,false); poreY(4,32,-1,true);

// wavy irregular top edge
block(-8,33,-3,SAND); block(-6,33,2,SAND); block(-3,33,-1,SAND);
block(0,33,3,SAND); block(2,33,-3,SAND); block(5,33,1,SAND);
block(7,33,3,SAND); block(8,33,-1,SAND);
// lumpy sides
block(-9,19,0,SAND); block(-9,29,1,SAND);
block(9,26,-1,SAND); block(9,17,1,SAND);
block(-3,20,4,SAND); block(4,28,4,SAND);

// ---- arms ----
// right arm hanging
cube(9,13,-1,10,14,0,SNOW);        // sleeve
cube(10,9,-1,10,12,0,SAND);
cube(10,7,-1,11,8,0,SAND);         // hand
block(11,6,-1,SAND); block(10,6,0,SAND);
// left arm raised, waving at the jellyfish
cube(-10,13,-1,-9,14,0,SNOW);      // sleeve
cube(-11,14,-1,-11,16,0,SAND);
cube(-12,17,-1,-12,19,0,SAND);
cube(-13,20,-1,-12,21,0,SAND);     // hand
block(-13,22,-1,SAND); block(-12,22,0,SAND); block(-14,21,-1,SAND);

// ---- red tie ----
block(0,14,-4,BRICK);
cube(-1,13,-4,1,13,-4,BRICK);
block(0,12,-4,BRICK); block(0,11,-4,BRICK);

// ---- Gary the snail ----
cube(10,1,-9,16,1,-7,ICE);
block(17,1,-8,ICE);
cube(10,2,-9,11,2,-7,ICE);
line(10,3,-9,10,5,-9,ICE); line(10,3,-7,10,5,-7,ICE);
block(10,6,-9,SNOW); block(10,6,-7,SNOW);
block(9,6,-9,BRICK); block(9,6,-7,BRICK);
sphere(14,4,-8,3,BRICK);
block(14,7,-8,SNOW); block(11,4,-8,SNOW);
block(14,4,-5,SNOW); block(14,4,-11,SNOW);

// ---- pineapple house (background) ----
hollowCylinder(-15,1,16,4,10,BRICK);
disk(-15,11,16,3,BRICK);
disk(-15,12,16,2,BRICK);
disk(-15,13,16,1,BRICK);
cube(-15,14,13,-15,19,19,LEAVES);
cube(-18,14,16,-12,18,16,LEAVES);
line(-17,14,14,-13,19,18,LEAVES);
line(-13,14,14,-17,19,18,LEAVES);
cube(-16,1,12,-14,3,12,AIR);       // door opening
cube(-16,4,12,-14,4,12,OAK_LOG);   // lintel
cube(-19,5,15,-19,6,16,GLASS);     // porthole window
cube(-11,6,16,-11,7,17,GLASS);

// ---- jellyfish ----
disk(-14,21,-6,2,BRICK);
disk(-14,22,-6,1,BRICK);
block(-14,23,-6,BRICK);
line(-15,18,-7,-15,20,-7,BRICK);
line(-13,18,-5,-13,20,-5,BRICK);
line(-13,19,-7,-13,20,-7,BRICK);
line(-15,19,-5,-15,20,-5,BRICK);
disk(10,26,7,1,BRICK);
block(10,27,7,BRICK);
block(9,25,7,BRICK); block(11,25,7,BRICK); block(10,24,8,BRICK);

// ---- bubbles ----
block(14,9,-8,GLASS); block(15,12,-7,GLASS); block(13,15,-8,GLASS);
block(2,29,-9,GLASS); block(-2,31,-10,GLASS); block(12,20,6,GLASS);