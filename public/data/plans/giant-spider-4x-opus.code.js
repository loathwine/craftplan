// giant-spider-4x-opus — prompt:
// a giant spider...

// ===== GIANT SPIDER (black-widow style) — front (eyes/fangs) faces NORTH / -Z =====
// Dark STONE/COBBLE body, red BRICK eyes + hourglass, white SNOW fangs, ICE web.

const BODY = STONE, BODY2 = COBBLE, EYE = BRICK, FANG = SNOW, MARK = BRICK, WEB = ICE;

// thick tube between two points (2x2 cross-section), offset in X and Y
function tube(x1,y1,z1,x2,y2,z2,id){
  for(let dx=0;dx<=1;dx++) for(let dy=0;dy<=1;dy++){
    line(x1+dx,y1+dy,z1, x2+dx,y2+dy,z2, id);
  }
}

// ---------- CEPHALOTHORAX (front body, holds head/eyes/legs) ----------
const chx=0, chy=9, chz=-5, chr=4;
sphere(chx, chy, chz, chr, BODY);
// slight flattening / carapace ridge on top
sphere(chx, chy+1, chz-1, 3, BODY);
// texture speckle (deterministic) — mottled carapace
for(let x=-4;x<=4;x++) for(let z=-9;z<=-1;z++) for(let y=6;y<=13;y++){
  if((Math.sin(x*1.7+z*0.9)+Math.cos(y*1.3+z*0.5))>1.35){
    // only recolor where body already exists (on the shell region)
    if((x*x+(y-chy)*(y-chy)+(z-chz)*(z-chz)) <= chr*chr+2 &&
       (x*x+(y-chy)*(y-chy)+(z-chz)*(z-chz)) >= chr*chr-6)
      block(x,y,z,BODY2);
  }
}

// ---------- PEDICEL (narrow waist connecting the two body parts) ----------
sphere(0, 10, 0, 2, BODY);
cube(-1, 9, -1, 1, 11, 1, BODY);

// ---------- ABDOMEN (large rear, teardrop, raised) ----------
sphere(0, 12, 6, 6, BODY);
sphere(0, 12, 9, 5, BODY);
sphere(0, 11, 13, 3, BODY);      // taper toward spinnerets
// spinnerets (little nubs at the rear tip)
cube(-1, 10, 15, 1, 11, 16, BODY2);
block(0, 9, 17, BODY2);
// abdomen speckle
for(let x=-6;x<=6;x++) for(let z=0;z<=15;z++) for(let y=6;y<=18;y++){
  const d = x*x+(y-12)*(y-12)+(z-6)*(z-6);
  if(d<=40 && d>=26 && (Math.sin(x*1.1+z*1.4)+Math.cos(y*0.9+x*0.6))>1.4)
    block(x,y,z,BODY2);
}
// RED HOURGLASS marking on top of abdomen (faces the camera / up)
line(-2,18,4, 2,18,4, MARK);
line(-1,18,5, 1,18,5, MARK);
block(0,18,6, MARK);
line(-1,18,7, 1,18,7, MARK);
line(-2,18,8, 2,18,8, MARK);
// north-facing red badge on abdomen front slope too
cube(-1,13,1, 1,15,1, MARK);

// ---------- EYES (8), on front-top of cephalothorax, facing NORTH ----------
// principal (large) pair
cube(-2,11,-10, -1,12,-10, EYE);
cube( 1,11,-10,  2,12,-10, EYE);
block(-2,12,-11, FANG); block(1,12,-11, FANG);   // white glint
// secondary smaller eyes
block(-3,11,-9, EYE); block(3,11,-9, EYE);
block(-1,13,-9, EYE); block(1,13,-9, EYE);
block(-2,10,-9, EYE); block(2,10,-9, EYE);

// ---------- CHELICERAE / FANGS (front-bottom, pointing down) ----------
for(const s of [-1,1]){
  cube(s*1,6,-9, s*2,8,-9, BODY);       // fang base
  line(s*1,5,-10, s*1,7,-9, BODY);
  block(s*1,4,-10, FANG);               // fang tip
  block(s*2,4,-9, FANG);
}
// pedipalps (short front feelers)
for(const s of [-1,1]){
  tube(s*3,7,-8, s*6,6,-11, BODY);
  tube(s*6,6,-11, s*7,4,-13, BODY);
}

// ---------- EIGHT LEGS (4 per side), bent: up to a high knee then down ----------
// {attachZ, footZ, footX} — front legs reach forward, rear legs sweep back
const legs = [
  {az:-8, fz:-15, fx:16, knz:-10},
  {az:-5, fz:-7,  fx:20, knz:-6},
  {az:-2, fz:3,   fx:21, knz:-1},
  {az: 1, fz:11,  fx:18, knz:3},
];
for(const s of [-1,1]){
  for(const L of legs){
    const ax=s*3, ay=9, az=L.az;             // attach (body)
    const kx=s*12, ky=16, kz=L.knz;          // knee (high point)
    const fx=s*L.fx, fy=-1, fz=L.fz;         // foot (ground)
    // femur (body -> knee)
    tube(ax,ay,az, kx,ky,kz, BODY);
    // tibia (knee -> foot)
    tube(kx,ky,kz, fx,fy,fz, BODY);
    // knee joint bulge
    sphere(kx,ky,kz,2,BODY2);
    // shoulder joint
    sphere(ax,ay,az,1,BODY);
    // foot / claw dug into ground
    block(fx,fy,fz,BODY2);
    block(fx,fy-1,fz,BODY);
    block(fx+(s>0?1:-1),fy,fz, BODY);
    block(fx,fy,fz+ (L.fz>0?1:-1), FANG);    // pale claw tip
    // spiky hairs along the femur (a few nubs)
    tube(ax+(kx-ax)/2|0, ay+3, (az+kz)/2|0, ax+(kx-ax)/2|0, ay+4, (az+kz)/2|0, BODY2);
    block(kx, ky+2, kz, BODY);               // hair above knee
  }
}

// ---------- SPIDER SILK / WEB (foreground detail, north of the spider) ----------
// anchor strands from front legs down to the ground
line(-16,-1,-15, -13,6,-12, WEB);
line( 16,-1,-15,  13,6,-12, WEB);
line(0,4,-13, 0,-1,-18, WEB);
// a small radial orb-web on the ground in front, facing the camera
const wx=0, wz=-19;
for(let a=0;a<8;a++){
  const dx=Math.round(Math.cos(a*Math.PI/4)*5);
  const dz=Math.round(Math.sin(a*Math.PI/4)*3);
  line(wx,-1,wz, wx+dx,-1,wz+dz, WEB);
}
// two concentric web rings
for(let a=0;a<16;a++){
  const dx=Math.round(Math.cos(a*Math.PI/8)*3);
  const dz=Math.round(Math.sin(a*Math.PI/8)*2);
  block(wx+dx,-1,wz+dz, WEB);
}
for(let a=0;a<10;a++){
  const dx=Math.round(Math.cos(a*Math.PI/5)*5);
  const dz=Math.round(Math.sin(a*Math.PI/5)*3);
  block(wx+dx,-1,wz+dz, WEB);
}
// a couple of dangling silk threads from the abdomen
line(0,6,10, 0,-1,10, WEB);
line(-3,7,6, -3,-1,6, WEB);