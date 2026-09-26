// dragon-fx-opus — prompt:
// a fire-breathing dragon...

const RED_=RED, BELLY=ORANGE, SPIKE=BLACK, MEMB=ORANGE, EYE=NEON_RED;

function dist(a,b){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2];return Math.sqrt(dx*dx+dy*dy+dz*dz);}
function lerp(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}

// tapered tube of spheres between two [x,y,z] with radii r1->r2
function tube(a,b,r1,r2,id){
  const len=dist(a,b);
  const steps=Math.max(1,Math.ceil(len*1.3));
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const c=lerp(a,b,t);
    sphere(c[0],c[1],c[2],r1+(r2-r1)*t,id);
  }
}
// filled triangle membrane using line fan
function fillTri(A,B,C,id){
  const steps=Math.max(1,Math.ceil(dist(B,C)));
  for(let i=0;i<=steps;i++){
    const P=lerp(B,C,i/steps);
    line(A[0],A[1],A[2],P[0],P[1],P[2],id);
  }
}

// ---- BODY SPINE (head at -Z front, tail curling +Z) ----
// [x, y, z, radius]
const spine=[
  [0,20,-13, 2.6],   // 0 head front
  [0,19.6,-11, 3.0], // 1 head
  [0,19.2,-9.3,2.7], // 2 head back
  [0.4,17.2,-8, 2.2],// 3 neck upper
  [1,15,-6, 1.9],    // 4 neck
  [1,12.8,-4, 2.4],  // 5 neck low
  [0,11,-1, 3.2],    // 6 shoulders
  [0,9.6,2, 3.6],    // 7 chest
  [0,8.6,5, 3.6],    // 8 belly
  [0,8.6,8, 3.2],    // 9 hips
  [1,8,11, 2.6],     //10 tail1
  [2.6,7,14, 2.0],   //11 tail2
  [4.6,6.2,17, 1.4], //12 tail3
  [6,5.6,19, 0.9],   //13 tail4
  [6.2,5.2,21, 0.5]  //14 tail tip
];
for(let i=0;i<spine.length-1;i++){
  const a=spine[i], b=spine[i+1];
  tube([a[0],a[1],a[2]],[b[0],b[1],b[2]],a[3],b[3],RED_);
}

// ---- BELLY / CHEST PLATING (orange, on the -Z front & underside) ----
for(let i=3;i<=9;i++){
  const s=spine[i];
  const r=s[3];
  // front-facing chest plate
  sphere(s[0],s[1]-0.6,s[2]-(r-1.1),Math.min(2.1,r-1.0),BELLY);
}
// underside belly scutes torso
for(let z=-1;z<=10;z++){
  const t=(z+1)/11;
  const by=9.4-t*1.2-0.0;
  const bot=by-3.2;
  const w= z<9?2:1;
  const id=(z%2===0)?BELLY:YELLOW;
  cube(-w,bot,z, w,bot,z, id);
  cube(-w+1,bot+1,z, w-1,bot+1,z, BELLY);
}

// ---- BACK SPIKES (crest) ----
for(let i=2;i<=13;i++){
  const s=spine[i];
  const top=s[1]+s[3]-0.3;
  let h=3.2-Math.abs(i-6)*0.18;
  if(i>=10) h=2.4-(i-10)*0.5;
  if(h<1) h=1;
  const bx=s[0], bz=s[2];
  // tapering leaning-back spike
  for(let k=0;k<=Math.round(h);k++){
    const tt=k/Math.max(1,Math.round(h));
    block(bx, top+k, bz+tt*0.8, SPIKE);
    if(k===0) block(bx, top, bz-0.6, SPIKE); // base widen
  }
}

// ---- HEAD DETAIL ----
sphere(0,19.6,-11,3.0,RED_);              // skull
sphere(0,19.4,-14.2,1.5,RED_);            // upper snout/muzzle
sphere(0,18.1,-13.6,1.8,RED_);            // lower jaw
tube([0,18.0,-15],[0,18.2,-12.5],1.2,1.5,RED_); // jaw length
// brow ridges
cube(-2,21,-12, -1,21,-11, RED_);
cube(1,21,-12, 2,21,-11, RED_);
// eyes (glowing) + dark sockets
block(-1.7,20.1,-12.6,SPIKE); block(1.7,20.1,-12.6,SPIKE);
block(-1.7,20,-12.9,EYE);  block(-1.6,20,-13,EYE);
block(1.7,20,-12.9,EYE);   block(1.6,20,-13,EYE);
// nostrils (smoking)
block(-0.8,19.6,-15,SPIKE); block(0.8,19.6,-15,SPIKE);
block(-0.8,20,-15,FIRE); block(0.8,20,-15,FIRE);
// horns sweeping up & back
tube([-1.4,21.5,-10],[-2.4,24,-7.5],0.8,0.4,SPIKE);
tube([-2.4,24,-7.5],[-3.2,26,-4.5],0.5,0.2,SPIKE);
tube([1.4,21.5,-10],[2.4,24,-7.5],0.8,0.4,SPIKE);
tube([2.4,24,-7.5],[3.2,26,-4.5],0.5,0.2,SPIKE);
// cheek frills
tube([-2.6,19,-9],[-4,21,-8],0.5,0.3,SPIKE);
tube([2.6,19,-9],[4,21,-8],0.5,0.3,SPIKE);

// open the mouth (carve) and add teeth
cube(-1.4,18.5,-15.5, 1.4,19.1,-13, AIR);
// upper teeth
block(-1.2,19,-15,WHITE); block(0,19,-15.2,WHITE); block(1.2,19,-15,WHITE);
block(-0.6,19,-15.1,WHITE); block(0.6,19,-15.1,WHITE);
// lower teeth
block(-1,18.5,-14.8,WHITE); block(0,18.5,-14.9,WHITE); block(1,18.5,-14.8,WHITE);

// ---- LEGS (quadruped, standing) ----
function leg(hip, knee, foot, r0){
  tube(hip,knee,r0,r0*0.7,RED_);
  tube(knee,foot,r0*0.7,0.9,RED_);
  // foot
  cube(foot[0]-1,0,foot[2]-1, foot[0]+1,0,foot[2]+1, RED_);
  // claws pointing forward/out (black)
  block(foot[0], -0.0, foot[2]-2, SPIKE);
  block(foot[0]-1,0,foot[2]-2,SPIKE);
  block(foot[0]+1,0,foot[2]-2,SPIKE);
  block(foot[0]+ (foot[0]>0?2: -2),0,foot[2],SPIKE);
}
// front legs (shoulders ~ z -1)
leg([2.6,10,-1],[4,5,-2],[5,0,-3],1.7);
leg([-2.6,10,-1],[-4,5,-2],[-5,0,-3],1.7);
// back legs (haunches ~ z 8, bigger)
sphere(3.4,8.5,8,2.6,RED_); sphere(-3.4,8.5,8,2.6,RED_); // thighs
leg([3.6,7.5,8],[5.5,4,7],[6,0,5],1.9);
leg([-3.6,7.5,8],[-5.5,4,7],[-6,0,5],1.9);

// ---- WINGS (bat, spread wide, slightly back) ----
function wing(s){
  const S=[2.2*s,11,-1];      // shoulder
  const K=[11*s,18,3];        // main knuckle
  const arc=[
    [6*s,22.5,-2],
    [13*s,23.5,1],
    [18*s,22,4],
    [20*s,18,6],
    [17*s,13,7],
    [9*s,10.5,7],
    [3*s,9,6]                 // trailing to body (Fb)
  ];
  // membrane
  for(let j=0;j<arc.length-1;j++) fillTri(K,arc[j],arc[j+1],MEMB);
  fillTri(S,K,arc[arc.length-1],MEMB);
  fillTri(S,K,arc[0],MEMB);
  // bones over membrane
  tube(S,K,1.3,0.8,SPIKE);              // upper arm
  for(let j=0;j<arc.length-1;j++) tube(K,arc[j],0.6,0.25,SPIKE); // fingers
  tube(K,arc[arc.length-1],0.6,0.3,SPIKE);
  // claw at wing thumb
  block(arc[0][0],arc[0][1]+1,arc[0][2],SPIKE);
}
wing(1);
wing(-1);

// ---- FIRE BREATH (jets forward -Z, arcs down to ground) ----
const M=[0,18.9,-15]; // mouth
const N=16;
for(let i=0;i<=N;i++){
  const t=i/N;
  const z=M[2]-t*7;
  const y=M[1]-t*t*18.6;
  const cx=0;
  const rad=0.7+t*3.2;
  block(cx,Math.max(0.2,y),z,FIRE);
  // flare ring
  const rr=Math.max(0,Math.round(rad));
  for(let a=0;a<8;a++){
    const ang=a/8*Math.PI*2;
    const px=cx+Math.cos(ang)*rad*0.8;
    const py=Math.max(0.2,y)+Math.sin(ang)*rad*0.5;
    block(px,py,z,FIRE);
  }
  // molten core near mouth
  if(t<0.45){ block(cx,y,z,LAVA); }
  if(i%3===0) block(cx+ (i%2?1:-1), Math.max(0.4,y), z, GLOWSTONE);
}

// ---- SCORCHED / BURNING GROUND in front ----
for(let x=-6;x<=6;x++){
  for(let z=-22;z<=-16;z++){
    const d=Math.sqrt(x*x+(z+19)*(z+19));
    if(d<6){
      block(x,0,z, d<2.2?LAVA:(d<4?ORANGE:BLACK));
      if(d<4.5 && ((x+z)%2===0)) block(x,1,z,FIRE);
    }
  }
}
// a couple of burning rocks foreground
sphere(-8,0,-18,1.6,STONE); block(-8,2,-18,FIRE);
sphere(9,0,-20,1.8,STONE); block(9,2,-20,FIRE);
sphere(5,0,-17,1.3,COBBLE); block(5,2,-17,FIRE);