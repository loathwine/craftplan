// chimera-4x-opus — prompt:
// a chimera...

const NAME = "chimera";

// ---- palette ----
const BODY = SAND, BELLY = COBBLE, MANE = OAK_LOG;
const GOAT = SNOW, SNAKE = LEAVES, MEMB = STONE;
const RED = BRICK, BONE = OAK_LOG, CLAW = COBBLE;

// ---- helpers ----
function lerp(a,b,t){return a+(b-a)*t;}
function path(pts, r, id, step){
  step = step||0.15;
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i], b=pts[i+1];
    for(let t=0;t<=1;t+=step){
      const x=lerp(a[0],b[0],t), y=lerp(a[1],b[1],t), z=lerp(a[2],b[2],t);
      const rr = (a[3]!==undefined)? lerp(a[3],b[3],t) : r;
      sphere(Math.round(x),Math.round(y),Math.round(z),Math.max(1,Math.round(rr)),id);
    }
  }
}
function leg(fx,fz){
  // tapered lion leg, thicker haunch at top
  cube(fx-1,0,fz-1, fx+1,6,fz+1, BODY);
  sphere(fx,6,fz,2,BODY);          // knee/shoulder joint
  cube(fx-1,0,fz-2, fx+1,1,fz+1, BODY); // paw forward
  // toes / claws
  block(fx-1,0,fz-2,CLAW); block(fx,0,fz-2,CLAW); block(fx+1,0,fz-2,CLAW);
  block(fx,-1,fz,STONE);           // footing
}

// ================= FOUNDATION =================
cube(-6,-1,-6, 6,-1,11, STONE);   // ground pad hidden under body

// ================= LEGS =================
leg(-4,-4); leg(4,-4);            // front legs (north)
leg(-4,8);  leg(4,8);             // rear legs (south)
// rear haunches — powerful hind muscles
sphere(-4,7,8,4,BODY); sphere(4,7,8,4,BODY);

// ================= LION TORSO =================
for(let zc=-4; zc<=8; zc+=2){
  const rr = zc<0 ? 5 : 4;        // deeper chest at front
  sphere(0,9,zc,rr,BODY);
}
// underbelly shading
for(let zc=-3; zc<=8; zc+=2) sphere(0,6,zc,2,BELLY);
// spine ridge
line(0,13,-3, 0,13,9, MANE);

// ================= LION NECK + HEAD (faces -Z / north) =================
path([[0,10,-5,4],[0,12,-7,4],[0,14,-9,4]], 4, BODY); // neck up & forward
sphere(0,14,-10,4,BODY);          // skull
sphere(0,13,-12,3,BODY);          // muzzle protruding north
// jaw
cube(-2,11,-13, 2,12,-11, BODY);
block(-1,11,-13,RED); block(0,11,-13,RED); block(1,11,-13,RED); // open red mouth
// snout + nose
block(0,13,-14,BONE); block(-1,13,-13,BONE); block(1,13,-13,BONE);
// eyes
block(-2,15,-13,RED); block(2,15,-13,RED);
block(-2,15,-12,BONE); block(2,15,-12,BONE); // brow
// ears
block(-3,18,-8,BODY); block(-3,19,-8,BODY);
block(3,18,-8,BODY);  block(3,19,-8,BODY);

// ---- shaggy mane around the lion head ----
for(let a=0; a<360; a+=18){
  const rad = a*Math.PI/180;
  const r = 6 + (a%36===0?1:0);
  const ex = Math.round(Math.cos(rad)*r);
  const ey = 14 + Math.round(Math.sin(rad)*r);
  path([[0,14,-8],[ex,ey,-7]], 1, MANE, 0.25);
}
// extra mane depth over shoulders
for(let zc=-8; zc<=-3; zc++){
  for(let a=0;a<360;a+=30){
    const rad=a*Math.PI/180;
    block(Math.round(Math.cos(rad)*5), 14+Math.round(Math.sin(rad)*5), zc, MANE);
  }
}

// ================= GOAT HEAD (rises from mid-back) =================
const gx=2, gy0=13, gz=2;         // slightly east for light + asymmetry
path([[gx-1,12,gz,2],[gx,16,gz-1,2],[gx,18,gz-2,2]], 2, GOAT); // goat neck
sphere(gx,19,gz-3,3,GOAT);        // goat skull
cube(gx-1,17,gz-5, gx+1,18,gz-4, GOAT); // long goat snout (points north)
block(gx,17,gz-6,GOAT);
// goat eyes + nostrils
block(gx-2,20,gz-5,RED); block(gx+2,20,gz-5,RED);
block(gx-1,17,gz-6,BONE); block(gx+1,17,gz-6,BONE);
// curving goat horns sweeping back (+Z)
path([[gx-2,21,gz-2],[gx-3,23,gz],[gx-2,24,gz+3],[gx-1,24,gz+5]], 1, BONE, 0.25);
path([[gx+2,21,gz-2],[gx+3,23,gz],[gx+2,24,gz+3],[gx+1,24,gz+5]], 1, BONE, 0.25);
// goat beard
line(gx,16,gz-4, gx,14,gz-4, GOAT);

// ================= SERPENT TAIL (rears up behind, arches forward) =================
const spine=[
  [0,11,10,3],[1,14,11,3],[2,17,10,2],[3,20,8,2],
  [3,23,5,2],[2,25,3,2],[1,26,1,2]                // head rears over the lion
];
path(spine, 2, SNAKE, 0.12);
// serpent belly stripes (brown underside)
for(let i=0;i<spine.length-1;i++){
  const a=spine[i];
  block(Math.round(a[0]),Math.round(a[1])-2,Math.round(a[2]),BONE);
}
// snake head at top, facing -Z
sphere(1,27,0,3,SNAKE);
cube(0,27,-2, 2,28,-1, SNAKE);    // snout
block(-1,28,-2,RED); block(3,28,-2,RED); // glowing eyes (red)
// jaws + fangs
block(0,26,-2,SNAKE); block(2,26,-2,SNAKE);
block(0,26,-3,SNOW);  block(2,26,-3,SNOW); // white fangs
// forked flame tongue
line(1,27,-3, 1,27,-6, RED);
block(0,27,-6,RED); block(2,27,-6,RED);

// ================= DRAGON WINGS (spread from shoulders) =================
function wing(sgn){
  const sh=[sgn*3,14,-1];                 // shoulder joint
  const tips=[
    [sgn*15,23,3],[sgn*14,20,5],[sgn*12,17,6],[sgn*9,15,7]
  ];
  // build a dense trailing polyline through the tips
  const poly=[];
  for(let i=0;i<tips.length-1;i++){
    for(let t=0;t<1;t+=0.1){
      poly.push([lerp(tips[i][0],tips[i+1][0],t),
                 lerp(tips[i][1],tips[i+1][1],t),
                 lerp(tips[i][2],tips[i+1][2],t)]);
    }
  }
  poly.push(tips[tips.length-1]);
  // membrane fan from shoulder
  for(const p of poly) line(sh[0],sh[1],sh[2], Math.round(p[0]),Math.round(p[1]),Math.round(p[2]), MEMB);
  // wing bones (fingers) over the membrane
  for(const tp of tips) line(sh[0],sh[1],sh[2], tp[0],tp[1],tp[2], BONE);
  // leading edge claw
  block(tips[0][0],tips[0][1],tips[0][2],CLAW);
}
wing(-1); wing(1);

// ================= GROUND SCATTER (charred detail under the beast) =================
for(let i=0;i<12;i++){
  const a=(i*47)%360, rad=a*Math.PI/180, r=8+(i%4)*3;
  block(Math.round(Math.cos(rad)*r),0,Math.round(Math.sin(rad)*r), (i%3===0)?RED:CLAW);
}