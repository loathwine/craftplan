// forge-fable — prompt:
// a blacksmith's forge...

const X0=-14,X1=14,Z0=-8,Z1=14;
const WX0=-9,WX1=9,WZ0=-1,WZ1=11,WH=5;

// clear trees/terrain in the yard only
cube(X0,0,Z0,X1,12,Z1,AIR);

// ground: grass yard, dirt fill in the dips
cube(X0,-1,Z0,X1,-1,Z1,GRASS);
cube(-7,-2,-8,7,-2,-3,DIRT);
cube(4,-2,4,14,-2,14,DIRT);
cube(-14,-2,-3,-8,-2,3,DIRT);

// cobble path to the front bay
for(let x=-3;x<=3;x++)for(let z=-8;z<=-2;z++)block(x,-1,z,((x*7+z*13)&3)==0?STONE:COBBLE);
// smithy floor
for(let x=WX0;x<=WX1;x++)for(let z=WZ0;z<=WZ1;z++)block(x,-1,z,((x*5+z*11)&5)==0?STONE:COBBLE);

// walls with cobble/stone variation
function wallBlk(x,y,z){ block(x,y,z, ((x*31+y*17+z*7)%5==0)?STONE:COBBLE); }
for(let y=0;y<=WH;y++){
  for(let x=WX0;x<=WX1;x++){ wallBlk(x,y,WZ0); wallBlk(x,y,WZ1); }
  for(let z=WZ0;z<=WZ1;z++){ wallBlk(WX0,y,z); wallBlk(WX1,y,z); }
}
// timber corners + top plate
cube(WX0,0,WZ0,WX0,WH,WZ0,OAK_LOG); cube(WX1,0,WZ0,WX1,WH,WZ0,OAK_LOG);
cube(WX0,0,WZ1,WX0,WH,WZ1,OAK_LOG); cube(WX1,0,WZ1,WX1,WH,WZ1,OAK_LOG);
cube(WX0,WH,WZ0,WX1,WH,WZ0,OAK_LOG); cube(WX0,WH,WZ1,WX1,WH,WZ1,OAK_LOG);
cube(WX0,WH,WZ0,WX0,WH,WZ1,OAK_LOG); cube(WX1,WH,WZ0,WX1,WH,WZ1,OAK_LOG);

// front open bay (north) with log posts and lintel
cube(-3,0,WZ0,3,4,WZ0,AIR);
cube(-4,0,WZ0,-4,WH,WZ0,OAK_LOG); cube(4,0,WZ0,4,WH,WZ0,OAK_LOG);
cube(-4,WH,WZ0,4,WH,WZ0,OAK_LOG);
block(-3,4,WZ0,OAK_LOG); block(3,4,WZ0,OAK_LOG);

// windows
cube(-7,2,WZ0,-6,3,WZ0,GLASS); cube(6,2,WZ0,7,3,WZ0,GLASS);
cube(WX0,2,3,WX0,3,4,GLASS); cube(WX0,2,7,WX0,3,8,GLASS);
cube(WX1,2,3,WX1,3,4,GLASS);
// back door (south)
cube(2,0,WZ1,3,3,WZ1,AIR); cube(2,0,WZ1,3,3,WZ1,PLANKS); block(3,2,WZ1,IRON);

// gable roof, ridge along Z, slopes east/west
for(let i=0;i<=9;i++){
  const y=6+i, e=9-i;
  const m = (i%3==2)?PLANKS:BROWN;
  cube(-e-1,y,WZ0-1,-e,y,WZ1+1,m);
  cube(e,y,WZ0-1,e+1,y,WZ1+1,m);
  if(e>=1){
    cube(-e+1,y,WZ0,e-1,y,WZ0,BRICK);
    cube(-e+1,y,WZ1,e-1,y,WZ1,BRICK);
  }
}
cube(0,15,WZ0-1,0,15,WZ1+1,OAK_LOG);
// gable window + hanging anvil sign on a beam
cube(-1,8,WZ0,1,9,WZ0,GLASS);
cube(0,11,WZ0-3,0,11,WZ0,OAK_LOG);
block(0,10,WZ0-3,IRON);
cube(-1,9,WZ0-3,1,9,WZ0-3,IRON); block(2,9,WZ0-3,IRON); block(0,8,WZ0-3,OBSIDIAN);

// ceiling joists + hanging lanterns
cube(-8,WH,2,8,WH,2,OAK_LOG); cube(-8,WH,6,8,WH,6,OAK_LOG);
block(-4,4,2,GLOWSTONE); block(4,4,2,GLOWSTONE); block(0,4,6,GLOWSTONE);

// hearth / forge against the back wall
cube(-7,0,8,-3,2,10,BRICK);
cube(-7,3,7,-3,3,10,STONE);
cube(-6,1,8,-4,2,9,AIR);
cube(-6,1,8,-4,1,9,BLACK);
block(-5,1,9,LAVA); block(-4,1,8,LAVA); block(-6,1,9,LAVA);
block(-5,2,9,FIRE);
// chimney through the roof
cube(-6,4,9,-4,19,11,BRICK);
cube(-5,4,10,-5,20,10,AIR);
cube(-7,20,8,-3,20,12,STONE); block(-5,20,10,AIR);
block(-5,20,10,FIRE);
block(-5,18,10,FIRE);

// bellows
block(-2,1,9,BROWN); block(-1,1,9,BROWN); block(-1,1,10,BROWN); block(-2,1,10,PLANKS);
block(0,2,10,OAK_LOG); block(0,1,10,OAK_LOG);

// anvil on a stump
cube(0,0,4,0,0,5,OAK_LOG);
cube(-1,1,4,1,1,5,IRON); block(2,1,4,IRON); block(-2,1,5,IRON);
block(1,2,5,IRON); block(1,2,6,OAK_LOG);

// quench trough
cube(3,0,7,6,1,10,PLANKS);
cube(4,1,8,5,1,9,WATER);
block(3,2,10,IRON);

// workbench on the east wall
cube(7,1,2,8,1,6,PLANKS);
block(7,0,2,OAK_LOG); block(8,0,6,OAK_LOG); block(7,0,6,OAK_LOG); block(8,0,2,OAK_LOG);
block(7,2,3,IRON); block(8,2,5,IRON); block(7,2,5,GOLD); block(8,2,3,COPPER);
// tool rack (east wall)
block(8,3,2,IRON); block(8,4,3,IRON); block(8,3,4,IRON); block(8,4,5,IRON); block(8,3,6,COPPER);
// weapon rack (west wall)
cube(-8,1,3,-8,4,3,IRON); cube(-8,1,5,-8,3,5,IRON); block(-8,4,5,GOLD);
cube(-8,2,1,-8,3,1,IRON); block(-8,3,1,RED);
cube(-8,1,6,-8,2,6,PLANKS); block(-8,3,6,IRON);
// grinding wheel by the bay
block(5,0,0,OAK_LOG);
block(4,2,0,STONE); block(6,2,0,STONE); block(5,1,0,STONE); block(5,3,0,STONE); block(5,2,0,OBSIDIAN);
// coal bin
cube(6,0,10,8,1,10,BLACK); block(7,2,10,BLACK); block(-2,0,10,BLACK);

// east lean-to with wood pile
cube(10,6,-2,11,6,6,PLANKS); cube(12,5,-2,13,5,6,PLANKS);
cube(13,0,-2,13,4,-2,OAK_LOG); cube(13,0,6,13,4,6,OAK_LOG); cube(13,0,2,13,4,2,OAK_LOG);
cube(10,0,0,12,1,4,OAK_LOG); cube(10,2,1,12,2,3,OAK_LOG); block(11,3,2,OAK_LOG);
block(10,2,-1,IRON); block(11,2,-1,OAK_LOG);

// coal heap west + barrels
sphere(-12,-1,-4,3,BLACK);
block(-12,2,-4,IRON); block(-12,3,-4,OAK_LOG);
cylinder(-11,0,1,1,2,PLANKS); block(-11,2,1,WATER);
cylinder(-12,0,4,1,2,PLANKS); block(-12,2,4,BLACK);

// cart in the yard
cube(9,1,-6,12,1,-3,PLANKS);
cube(9,2,-6,9,2,-3,PLANKS); cube(12,2,-6,12,2,-3,PLANKS); cube(10,2,-6,11,2,-6,PLANKS); cube(10,2,-3,11,2,-3,PLANKS);
cube(10,2,-5,11,2,-4,GRAY); block(10,3,-5,IRON); block(11,3,-4,COPPER);
for(const wx of [8,13]){
  block(wx,1,-4,BROWN); block(wx,0,-4,BLACK); block(wx,2,-4,BLACK); block(wx,1,-5,BLACK); block(wx,1,-3,BLACK);
}
cube(10,1,-7,10,1,-9,OAK_LOG); cube(11,1,-7,11,1,-9,OAK_LOG);

// torches lining the path
for(const tx of [-6,6]){
  cube(tx,0,-7,tx,2,-7,OAK_LOG); block(tx,3,-7,FIRE);
  cube(tx,0,-3,tx,2,-3,OAK_LOG); block(tx,3,-3,FIRE);
}
// sign post
cube(-7,0,-5,-7,4,-5,OAK_LOG); cube(-7,4,-5,-5,4,-5,OAK_LOG);
block(-6,3,-5,PLANKS); block(-5,3,-5,IRON);
// hitching rail + scattered ore rocks
cube(8,0,-1,8,1,-1,OAK_LOG); cube(8,1,-1,12,1,-1,OAK_LOG); cube(12,0,-1,12,1,-1,OAK_LOG);
block(-13,0,7,GRAY); block(-12,0,8,GRAY); block(-13,1,7,IRON); block(13,0,10,GRAY); block(12,0,11,COPPER);