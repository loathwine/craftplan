// godzilla-4x-opus — prompt:
// Godzilla...

cube(3,-1,-4,9,-1,4,STONE);
cube(-9,-1,-4,-3,-1,4,STONE);

// ---------- FEET ----------
function foot(cx){
  cube(cx-3,0,-4,cx+3,1,4,COBBLE);      // sole
  cube(cx-3,2,-1,cx+3,3,3,STONE);       // ankle rise
  // three forward claws
  for(let t=-2;t<=2;t+=2){
    block(cx+t,0,-5,SNOW);
    block(cx+t,1,-5,SNOW);
  }
  // heel spur
  block(cx,0,5,SNOW);
}
foot(6);
foot(-6);

// ---------- LEGS ----------
cylinder(6,1,1,3,10,STONE);    // right thigh/shin
cylinder(-6,1,1,3,10,STONE);   // left thigh/shin
// knee bulges
sphere(6,7,0,3,STONE);
sphere(-6,7,0,3,STONE);

// ---------- TORSO (hollow masses, hidden interior) ----------
hollowSphere(0,14,2,6,STONE);   // belly
hollowSphere(0,20,-1,5,STONE);  // chest
hollowSphere(0,21,5,4,STONE);   // back hump (spine muscle)
// plug obvious seams so no see-through
cube(-4,17,-2,4,20,4,STONE);
cube(-3,10,-2,3,14,4,STONE);

// segmented lighter underbelly (front, -Z)
for(let y=9;y<=19;y+=2){
  let w = 4 - Math.abs(y-14)/3;
  w = Math.max(1,Math.round(w));
  cube(-w,y,-5,w,y,-5,COBBLE);
}

// ---------- NECK ----------
sphere(0,24,-3,3,STONE);
cube(-2,22,-4,2,25,-1,STONE);

// ---------- HEAD ----------
sphere(0,27,-5,4,STONE);          // skull
cube(-2,26,-11,2,28,-5,STONE);    // upper snout
cube(-2,24,-11,2,24,-5,STONE);    // lower jaw
// open mouth glow (atomic charge)
cube(-1,25,-9,1,25,-6,ICE);
// teeth
for(let x=-2;x<=2;x++){
  if(x%2===0) block(x,25,-10,SNOW);   // upper
  else block(x,25,-11,SNOW);          // lower/front
}
block(-2,24,-11,SNOW); block(2,24,-11,SNOW);
// eyes
block(-3,28,-8,ICE);
block(3,28,-8,ICE);
// brow ridge + head bumps
cube(-4,30,-7,4,30,-4,STONE);
block(-3,31,-3,STONE);
block(3,31,-3,STONE);
block(0,31,-2,STONE);

// ---------- ARMS ----------
function arm(sx,dir){
  sphere(sx,21,-1,2,STONE);            // shoulder
  cube(sx,14,-5,sx+2*dir,19,-2,STONE); // forearm (thin)
  // claws
  for(let t=0;t<=2;t++) block(sx+t*dir,13,-5+t,SNOW);
}
arm(7,1);
arm(-7,-1);

// ---------- TAIL ----------
sphere(0,12,8,4,STONE);
sphere(1,11,12,3,STONE);
sphere(2,10,15,3,STONE);
sphere(3,7,18,2,STONE);
sphere(4,4,20,2,STONE);
sphere(5,2,22,2,STONE);
// tail underside meets ground
block(5,0,22,COBBLE);

// ---------- DORSAL SPINES (atomic glow, ICE) ----------
function spine(bx,by,bz,h){
  for(let i=0;i<h;i++){
    let w=Math.floor((h-i)/2);
    cube(bx-w,by+i,bz,bx+w,by+i,bz,ICE);
  }
  block(bx,by+h,bz,SNOW); // bright tip
}
// ridge from head-back down spine and along tail
spine(0,27,-1,3);
spine(0,26,1,4);
spine(0,25,3,6);
spine(0,24,5,6);
spine(0,22,7,5);
spine(0,19,8,5);
spine(1,16,9,4);
spine(1,14,11,4);
spine(2,12,13,3);
spine(3,10,16,3);
spine(4,7,18,2);
spine(5,4,20,2);

// faint ground scorch / rubble at the feet
for(let a=0;a<8;a++){
  let ang=a*Math.PI/4;
  let rx=Math.round(Math.cos(ang)*11);
  let rz=Math.round(Math.sin(ang)*11);
  block(rx,0,rz,COBBLE);
}