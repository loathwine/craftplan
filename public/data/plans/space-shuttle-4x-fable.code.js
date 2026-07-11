// space-shuttle-4x-fable — prompt:
// the Space Shuttle on its launchpad...

cube(-11,1,-8,16,9,9,AIR);
cube(-18,1,0,-10,13,8,AIR);
cube(-21,0,-17,-14,8,-9,AIR);
cube(-6,1,-13,8,9,-7,AIR);

// launch pad deck
cube(-10,0,-6,15,1,8,COBBLE);
cube(-10,1,-6,15,1,-6,SAND);
cube(-10,1,8,15,1,8,SAND);
cube(-10,1,-6,-10,1,8,SAND);
cube(15,1,-6,15,1,8,SAND);

// flame trench (opens toward camera) with brick lining + deflector
cube(-4,-3,-6,6,0,2,AIR);
cube(-5,-4,-6,7,-4,3,BRICK);
cube(-5,-3,-6,-5,0,3,BRICK);
cube(7,-3,-6,7,0,3,BRICK);
cube(-4,-3,3,6,0,3,BRICK);
cube(-1,-3,0,3,-3,2,BRICK);
cube(0,-2,1,2,-2,1,BRICK);
cube(-1,0,-1,3,1,3,AIR);
cube(0,0,-5,2,1,-3,AIR);

// external tank (orange -> brick)
disk(1,3,1,2,BRICK);
cylinder(1,4,1,3,23,BRICK);
hollowCylinder(1,16,1,3,1,OAK_LOG);
disk(1,27,1,2,BRICK);
disk(1,28,1,1,BRICK);
block(1,29,1,BRICK);

// solid rocket boosters
for (const sx of [-5,7]) {
  hollowCylinder(sx,2,1,2,1,STONE);
  cylinder(sx,3,1,2,22,SNOW);
  hollowCylinder(sx,8,1,2,1,STONE);
  hollowCylinder(sx,14,1,2,1,STONE);
  hollowCylinder(sx,20,1,2,1,STONE);
  disk(sx,25,1,1,SNOW);
  block(sx,26,1,SNOW);
  block(sx,27,1,STONE);
}

// orbiter, belly to tank, dorsal side facing camera
cylinder(1,4,-4,2,20,SNOW);
disk(1,24,-4,1,SNOW);
block(1,25,-4,STONE);
block(1,24,-5,STONE);
block(1,23,-6,STONE);
block(0,22,-5,GLASS);
block(2,22,-5,GLASS);
block(1,22,-6,GLASS);
block(1,21,-6,GLASS);
line(1,6,-6,1,18,-6,STONE);

// delta wings
for (let i=0;i<10;i++){
  const y=4+i, s=7-Math.round(i*0.55);
  cube(1-s,y,-3,1+s,y,-3,SNOW);
  block(1-s,y,-3,STONE);
  block(1+s,y,-3,STONE);
}
cube(-6,4,-3,8,4,-3,STONE);
cube(-5,4,-4,7,4,-4,SNOW);

// vertical stabilizer
for (let y=4;y<=12;y++){
  const d=Math.min(4,Math.max(1,Math.round((13-y)*0.5)));
  cube(1,y,-7,1,y,-6-d,SNOW);
}

// OMS pods + main engines + body flap
cube(-1,4,-6,-1,6,-5,SNOW);
cube(3,4,-6,3,6,-5,SNOW);
block(0,3,-4,STONE);
block(2,3,-4,STONE);
block(1,3,-5,STONE);
cube(0,3,-3,2,3,-2,SNOW);

// tail service masts
cube(-2,2,-5,-2,5,-4,COBBLE);
cube(4,2,-5,4,5,-4,COBBLE);

// fixed service structure (east side)
for (const p of [[11,-1],[11,2],[14,-1],[14,2]]) cube(p[0],2,p[1],p[0],29,p[1],COBBLE);
for (let y=6;y<=26;y+=4){
  line(11,y,-1,14,y,-1,STONE);
  line(11,y,2,14,y,2,STONE);
  line(11,y,-1,11,y,2,STONE);
  line(14,y,-1,14,y,2,STONE);
}
for (let y=2;y<26;y+=8){
  line(11,y,-1,14,y+4,-1,STONE);
  line(14,y+4,-1,11,y+8,-1,STONE);
}
cube(11,30,-1,14,30,2,STONE);
line(12,31,0,12,31,-6,STONE);
block(12,30,-6,COBBLE);
block(12,29,-6,COBBLE);
line(12,31,0,12,33,0,SNOW);

// GOX vent arm + beanie cap over tank tip
line(10,30,1,3,30,1,COBBLE);
cube(0,30,0,2,30,2,SNOW);

// crew access arm + white room
line(11,20,-1,6,20,-3,COBBLE);
cube(4,19,-3,5,21,-2,SNOW);
block(3,20,-3,COBBLE);

// water tower (sound suppression)
cube(-16,0,2,-16,6,2,OAK_LOG);
cube(-12,0,2,-12,6,2,OAK_LOG);
cube(-16,0,6,-16,6,6,OAK_LOG);
cube(-12,0,6,-12,6,6,OAK_LOG);
sphere(-14,9,4,3,SNOW);

// observation bunker (north-west, facing camera)
cube(-19,-1,-14,-15,-1,-11,COBBLE);
cube(-19,0,-14,-15,2,-11,COBBLE);
cube(-18,0,-13,-16,2,-12,AIR);
cube(-19,3,-14,-15,3,-11,STONE);
cube(-17,0,-14,-17,1,-14,AIR);
block(-18,1,-14,GLASS);
block(-16,1,-14,GLASS);
line(-19,4,-11,-19,7,-11,OAK_LOG);
block(-19,8,-11,GLASS);

// flag
line(-9,2,-5,-9,10,-5,OAK_LOG);
cube(-8,8,-5,-4,8,-5,BRICK);
cube(-8,9,-5,-4,9,-5,SNOW);
cube(-8,10,-5,-4,10,-5,BRICK);
cube(-8,10,-5,-7,10,-5,GLASS);

// perimeter floodlights
for (const p of [[-10,8],[15,8],[15,-6]]) {
  cube(p[0],2,p[1],p[0],6,p[1],OAK_LOG);
  block(p[0],7,p[1],GLASS);
}

// steam at trench exit
sphere(0,-1,-10,2,SNOW);
sphere(4,0,-11,2,SNOW);
sphere(-3,0,-9,1,SNOW);