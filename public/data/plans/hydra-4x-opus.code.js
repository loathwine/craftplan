// hydra-4x-opus — prompt:
// a three-headed hydra...

const R = Math.round;
function lerp(a,b,t){return a+(b-a)*t;}
function bez(p0,p1,p2,t){
  const u=1-t;
  return [
    u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0],
    u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1],
    u*u*p0[2]+2*u*t*p1[2]+t*t*p2[2]
  ];
}

// ---- rocky lair base / foreground boulders ----
disk(0,0,10,7,COBBLE);
disk(0,-1,10,8,STONE);
sphere(-9,0,3,3,COBBLE);
sphere(10,0,5,3,COBBLE);
sphere(-6,0,-4,2,COBBLE);
sphere(7,0,-3,2,STONE);
sphere(-12,0,10,3,STONE);
sphere(12,0,12,3,COBBLE);

// ---- serpentine body / torso ----
sphere(0,4,11,5,LEAVES);      // hindquarters
sphere(0,5,7,5,LEAVES);       // barrel chest
sphere(0,5,3,4,LEAVES);       // upper chest rising to necks
sphere(0,3,15,4,LEAVES);      // rump
// tan underbelly plating
sphere(0,1,11,3,SAND);
sphere(0,2,7,3,SAND);
cube(-2,1,3,2,2,14,SAND);

// back-ridge spikes down the spine
for(let z=1;z<=15;z+=2){
  const h=3-Math.abs(z-8)*0.12;
  line(0,8,z,0,8+Math.max(1,R(h)),z,STONE);
}

// ---- legs with claws ----
function leg(x,z,front){
  sphere(x,4,z,2,LEAVES);          // haunch
  cylinder(x,0,z,1,4,LEAVES);      // shin
  const zc = front? z-2 : z-1;
  block(x-1,0,zc,STONE);block(x,0,zc,STONE);block(x+1,0,zc,STONE); // 3 claws
  block(x-1,0,zc-1,STONE);block(x+1,0,zc-1,STONE);
}
leg(-5,5,true); leg(5,5,true);
leg(-5,14,false); leg(5,14,false);

// ---- neck tube (green) + belly plate (sand) ----
function neck(p0,p1,p2,r0,r1,steps){
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const [x,y,z]=bez(p0,p1,p2,t);
    const r=Math.max(1,lerp(r0,r1,t));
    sphere(R(x),R(y),R(z),R(r),LEAVES);
    // tan belly stripe on the front(-Z)/underside
    sphere(R(x),R(y-r*0.5),R(z-r*0.55),Math.max(1,R(r-1.3)),SAND);
    // dorsal spikes every few segments
    if(i%3===0 && i>1){
      line(R(x),R(y+r),R(z+1),R(x),R(y+r+2),R(z+2),STONE);
    }
  }
}

// three splayed necks (bases fan out of the chest, heads reach toward camera -Z)
neck([0,7,4],[0,17,3],[1,22,-8], 3.2,1.6, 18);      // center, tallest
neck([-3,7,6],[-11,13,2],[-12,17,-8], 3.0,1.5, 17); // left
neck([3,7,6],[11,13,2],[12,17,-8], 3.0,1.5, 17);    // right

// ---- serpent head (snout points -Z / down toward camera) ----
function head(cx,cy,cz){
  // skull
  sphere(cx,cy,cz,3,LEAVES);
  // upper snout: 4 blocks, sloping down and forward (-Z)
  for(let i=0;i<4;i++){
    const z=cz-2-i;
    const y=cy-R(i*0.6);
    cube(cx-2,y,z,cx+2,y+1,z,LEAVES);
    // upper teeth (white) along the lip
    if(i>=1){ block(cx-2,y-1,z,SNOW); block(cx+2,y-1,z,SNOW); block(cx,y-1,z,SNOW);}
  }
  // open mouth interior (red maw + tongue)
  cube(cx-1,cy-2,cz-4,cx+1,cy-1,cz-2,BRICK);
  // lower jaw dropped and forward
  for(let i=0;i<3;i++){
    const z=cz-2-i;
    cube(cx-2,cy-3,z,cx+2,cy-3,z,LEAVES);
    block(cx-2,cy-2,z,SNOW); block(cx+2,cy-2,z,SNOW); // lower fangs
  }
  // glowing eyes with stone brows
  block(cx-2,cy+1,cz-1,BRICK); block(cx+2,cy+1,cz-1,BRICK);
  block(cx-3,cy+2,cz-1,STONE); block(cx+3,cy+2,cz-1,STONE);
  block(cx-3,cy+2,cz,STONE);   block(cx+3,cy+2,cz,STONE);
  // nostrils
  block(cx-1,cy-1,cz-5,STONE); block(cx+1,cy-1,cz-5,STONE);
  // horns swept back
  line(cx-2,cy+3,cz+1,cx-3,cy+6,cz+3,STONE);
  line(cx+2,cy+3,cz+1,cx+3,cy+6,cz+3,STONE);
  line(cx,cy+3,cz+1,cx,cy+6,cz+3,STONE);
  // spiky frill/crest around the back of the skull
  for(let a=-3;a<=3;a++){
    line(cx+a,cy+2,cz+2,cx+a,cy+3+Math.max(0,2-Math.abs(a)),cz+3,LEAVES);
  }
}

head(1,22,-8);    // center head
head(-12,17,-8);  // left head
head(12,17,-8);   // right head

// ---- tail curling back and up (+Z) with barbs ----
(function tail(){
  const p0=[0,4,15],p1=[2,7,20],p2=[-1,11,22];
  for(let i=0;i<=12;i++){
    const t=i/12;
    const [x,y,z]=bez(p0,p1,p2,t);
    const r=Math.max(1,lerp(3,0.8,t));
    sphere(R(x),R(y),R(z),R(r),LEAVES);
    sphere(R(x),R(y-r*0.5),R(z),Math.max(1,R(r-1.5)),SAND);
    if(i%2===0) line(R(x),R(y+r),R(z),R(x),R(y+r+2),R(z+1),STONE);
  }
})();