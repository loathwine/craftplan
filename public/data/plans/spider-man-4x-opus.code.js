// spider-man-4x-opus — prompt:
// Spider-Man...

cube(-11,-3,-8,11,-1,8,STONE);
cube(-11,-1,-8,11,-1,8,COBBLE);
hollowCube(-11,-3,-8,11,-1,8,COBBLE);

const RED=BRICK, BLUE=GLASS, BLK=STONE, WHT=SNOW;

// ---- background skyline (towers) ----
function tower(x1,x2,z1,z2,yb,yt){
  cube(x1,yb,z1,x2,yt,z1,STONE);
  cube(x1,yb,z2,x2,yt,z2,STONE);
  cube(x1,yb,z1,x1,yt,z2,STONE);
  cube(x2,yb,z1,x2,yt,z2,STONE);
  cube(x1,yt,z1,x2,yt,z2,COBBLE);
  for(let y=yb+2;y<yt;y+=3){
    for(let x=x1+1;x<x2;x+=2){ block(x,y,z1,GLASS); block(x,y,z2,GLASS); }
    for(let z=z1+1;z<z2;z+=2){ block(x1,y,z,GLASS); block(x2,y,z,GLASS); }
  }
}
tower(-21,-14,-21,-14,-3,22);
tower(14,21,-21,-14,-3,27);
tower(-4,3,-22,-16,-3,15);
tower(-13,-8,-22,-18,-3,10);
tower(8,13,-22,-18,-3,12);

// giant web strands across the skyline
line(-14,20,-14, 14,24,-14, BLK);
line(-14,22,-14, 0,18,-14, BLK);
line(0,18,-14, 14,22,-14, BLK);
line(-10,10,-14,-10,22,-14, BLK);
line(11,12,-14,11,26,-14, BLK);

// ================= SPIDER-MAN =================

// ---- legs (blue) ----
cube(-6,0,-2,-3,13,2,BLUE);
cube(3,0,-2,6,13,2,BLUE);
// knee/muscle taper
cube(-6,0,-2,-4,6,2,BLUE);
cube(4,0,-2,6,6,2,BLUE);
// boots (red) with toe
cube(-6,0,-2,-3,3,3,RED);
cube(3,0,-2,6,3,3,RED);
// web lines on legs
line(-5,3,3,-5,12,3,BLK);
line(4,3,3,4,12,3,BLK);

// ---- hips / pelvis ----
cube(-6,13,-2,6,15,2,BLUE);
line(-4,13,3,4,13,3,BLK);

// ---- torso (red front, blue sides) ----
cube(-7,16,-2,7,24,2,RED);
cube(-8,16,-1,-7,22,1,BLUE);
cube(7,16,-1,8,22,1,BLUE);
// broad shoulders
cube(-9,23,-1,9,25,2,RED);
// neck
cube(-2,24,-1,2,25,1,RED);

// ---- black spider emblem on chest (proud z=3) ----
cube(0,17,3,0,21,3,BLK);
block(-1,19,3,BLK); block(1,19,3,BLK);
block(-1,20,3,BLK); block(1,20,3,BLK);
block(-1,18,3,BLK); block(1,18,3,BLK);
line(0,21,3,-3,23,3,BLK); line(0,21,3,3,23,3,BLK);
line(0,20,3,-4,21,3,BLK); line(0,20,3,4,21,3,BLK);
line(0,19,3,-4,18,3,BLK); line(0,19,3,4,18,3,BLK);
line(0,18,3,-3,16,3,BLK); line(0,18,3,3,16,3,BLK);

// subtle chest web lines
line(-6,16,3,-6,23,3,BLK);
line(6,16,3,6,23,3,BLK);
line(-6,22,3,6,22,3,BLK);

// ---- head / mask (red) ----
cube(-3,25,-2,3,31,2,RED);
cube(-2,31,-2,2,32,2,RED); // crown

// white eyes
cube(-3,28,3,-1,29,3,WHT); block(-3,27,3,WHT); block(-2,27,3,WHT);
cube(1,28,3,3,29,3,WHT); block(3,27,3,WHT); block(2,27,3,WHT);
// black eye separators / outline
block(0,29,3,BLK); block(0,28,3,BLK); block(0,27,3,BLK);
block(-3,29,3,BLK); block(3,29,3,BLK);
block(-1,30,3,BLK); block(1,30,3,BLK);

// mask web lines
block(0,31,3,BLK); block(0,32,3,BLK); block(0,26,3,BLK); block(0,25,3,BLK);
block(-3,31,3,BLK); block(3,31,3,BLK);
cube(-3,25,3,-3,26,3,BLK); cube(3,25,3,3,26,3,BLK);
line(-3,31,3,-1,26,3,BLK); line(3,31,3,1,26,3,BLK);

// ---- RIGHT ARM raised (web-shooting up) ----
cube(7,23,-1,9,25,1,RED);
cube(8,26,-1,10,28,1,RED);
cube(9,29,-1,11,31,1,RED);
cube(10,32,-1,12,34>33?33:34,1,RED);
cube(10,32,-1,12,33,1,RED);
// fist
cube(11,32,-2,13,33,2,RED);
// wrist web line
line(9,25,2,11,31,2,BLK);
// web shot to right tower top
line(12,33,0, 16,27,-14, BLK);
line(13,33,1, 17,27,-13, BLK);
line(12,33,-1, 16,27,-15, BLK);

// ---- LEFT ARM reaching forward/down (web-slinging) ----
cube(-9,22,-1,-7,24,1,RED);
cube(-12,20,0,-9,22,2,RED);
cube(-15,18,1,-12,20,3,RED);
// fist / web-shooter
cube(-17,16,2,-15,18,4,RED);
// web line down mask/wrist
line(-11,22,2,-14,19,3,BLK);
// web shot to left tower top
line(-16,17,3, -16,22,-14, BLK);
line(-16,16,4, -15,22,-14, BLK);
line(-17,17,2, -17,22,-14, BLK);
// dangling web strand under reaching hand
line(-16,16,3, -16,-1,3, BLK);
line(-16,8,3,-13,6,3,BLK);

// ---- foreground web netting near feet (rooftop) ----
for(let x=-10;x<=10;x+=4) line(x,-1,-7,x,-1,7,BLK);
for(let z=-7;z<=7;z+=4) line(-10,-1,z,10,-1,z,BLK);