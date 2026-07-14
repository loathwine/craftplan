// wall-e-4x-fable — prompt:
// Wall-E...

const AIR_=AIR, W=SAND;

// ---- clear vegetation in build zones (targeted, not whole site) ----
cube(-10,0,-12,10,10,8,AIR);
cube(-17,0,-6,-11,10,8,AIR);
cube(9,0,-6,14,9,10,AIR);
cube(-9,0,9,10,7,13,AIR);
cube(11,0,-9,14,4,-5,AIR);
cube(-6,10,-12,8,24,4,AIR); // head/arm airspace

// ---- dusty ground apron ----
disk(0,-1,0,13,SAND);

// ---- tread trails leading away south ----
cube(-8,-1,7,-5,-1,20,DIRT);
cube(5,-1,7,8,-1,20,DIRT);

// ---- trash cube helper: compacted mixed-junk cubes ----
function trash(x1,y1,z1,s){
  const pal=[COBBLE,STONE,OAK_LOG,BRICK,PLANKS,STONE,COBBLE];
  for(let x=x1;x<x1+s;x++)for(let y=y1;y<y1+s;y++)for(let z=z1;z<z1+s;z++){
    let h=(x*374761393+y*668265263+z*1274126177)|0; h=h^(h>>13);
    block(x,y,z,pal[Math.abs(h)%pal.length]);
  }
}

// ---- background trash: wobbly tower west ----
trash(-15,-1,-2,4);
trash(-14,3,-2,3);
trash(-15,6,-1,3);
trash(-14,9,-1,2);
trash(-13,-1,4,3);
trash(-11,-1,6,2);
// east stack
trash(10,-1,6,4);
trash(10,3,7,3);
trash(12,-1,-8,2);
// south wall of compacted cubes (behind Wall-E)
trash(-8,-1,9,3); trash(-4,-1,10,3); trash(0,-1,9,3);
trash(4,-1,10,3); trash(8,-1,9,3);
trash(-6,2,10,3); trash(2,2,10,3); trash(6,2,9,2);
// scattered singles
trash(-10,-1,-6,2); trash(9,-1,-3,2);

// ---- treads ----
function tread(x1,x2,ox){
  cube(x1,0,-5,x2,4,6,COBBLE);
  cube(x1,0,-5,x2,0,6,STONE);            // dark belt bottom
  cube(x1,3,-5,x2,4,-5,AIR); cube(x1,4,-4,x2,4,-4,AIR);   // front slope
  cube(x1,3,6,x2,4,6,AIR);  cube(x1,4,5,x2,4,5,AIR);      // back slope
  for(let z=-5;z<=6;z+=2) block(ox,0,z,STONE);            // tread teeth
  cube(ox,1,-3,ox,2,-2,STONE);           // wheel hubs
  cube(ox,1,0,ox,2,1,STONE);
  cube(ox,1,3,ox,2,4,STONE);
}
tread(-8,-5,-9);
tread(5,8,9);

// ---- body: yellow compactor box ----
cube(-4,5,-3,4,13,5,W);
// side arm-rails
cube(-5,8,-3,-5,9,4,OAK_LOG);
cube(5,8,-3,5,9,4,OAK_LOG);
// front compactor-door frame (protrudes 1)
cube(-3,6,-4,3,6,-4,OAK_LOG);
cube(-3,11,-4,3,11,-4,OAK_LOG);
cube(-3,7,-4,-3,10,-4,OAK_LOG);
cube(3,7,-4,3,10,-4,OAK_LOG);
block(2,10,-4,BRICK);                    // red record/solar button
// hazard chevron bumper strip
for(let x=-4;x<=4;x++) block(x,5,-4,((x+100)%2)?OAK_LOG:BRICK);
// rust patches
block(4,6,2,OAK_LOG); block(4,11,0,BRICK); block(4,10,3,OAK_LOG);
block(-4,6,-1,OAK_LOG); block(-4,9,2,BRICK); block(-2,12,-3,OAK_LOG);
block(-3,13,-2,OAK_LOG); block(2,13,4,BRICK);
// roof: radiator + antenna
cube(-2,14,3,2,14,4,COBBLE);
block(-1,14,3,STONE); block(1,14,3,STONE);
cube(3,14,4,3,16,4,STONE); block(3,17,4,COBBLE);

// ---- neck ----
cube(-1,13,0,1,13,2,COBBLE);             // mount plate
block(0,14,1,COBBLE); block(0,15,1,COBBLE);
block(0,16,0,COBBLE); block(0,17,0,COBBLE);
cube(0,18,-1,0,19,1,COBBLE);             // hinge between eye pods

// ---- binocular head, facing north ----
cube(-4,18,-3,-1,21,2,STONE);
cube(1,18,-3,4,21,2,STONE);
// chamfer top edges for rounded pods
cube(-4,21,-3,4,21,-3,AIR);
cube(-4,21,-3,-4,21,2,AIR);
cube(4,21,-3,4,21,2,AIR);
// west eye rim + lens + pupil
cube(-4,18,-4,-1,18,-4,COBBLE); cube(-4,21,-4,-1,21,-4,COBBLE);
cube(-4,19,-4,-4,20,-4,COBBLE); cube(-1,19,-4,-1,20,-4,COBBLE);
cube(-3,19,-4,-2,20,-4,GLASS);
block(-2,19,-4,OAK_LOG);
// east eye rim + lens + pupil
cube(1,18,-4,4,18,-4,COBBLE); cube(1,21,-4,4,21,-4,COBBLE);
cube(1,19,-4,1,20,-4,COBBLE); cube(4,19,-4,4,20,-4,COBBLE);
cube(2,19,-4,3,20,-4,GLASS);
block(2,19,-4,OAK_LOG);

// ---- right (east) arm reaching toward the plant ----
cube(5,8,-4,6,9,1,COBBLE);
cube(5,7,-6,6,8,-5,COBBLE);
cube(5,6,-8,6,7,-7,COBBLE);
cube(4,5,-10,7,5,-8,STONE);              // shovel palm
block(4,5,-11,STONE); block(6,5,-11,STONE);

// ---- left (west) arm raised in a wave ----
cube(-6,8,-2,-5,9,1,COBBLE);
cube(-6,9,-4,-5,10,-3,COBBLE);
cube(-6,10,-5,-5,10,-5,COBBLE);
cube(-7,11,-5,-5,13,-5,STONE);           // shovel palm, facing camera
block(-7,14,-5,STONE); block(-5,14,-5,STONE);

// ---- the plant in a boot ----
block(2,0,-10,OAK_LOG); block(2,0,-11,OAK_LOG);
block(2,1,-10,OAK_LOG);
block(2,2,-10,LEAVES); block(2,3,-10,LEAVES);