// dragon-4x-opus — prompt:
// a fire-breathing dragon...

// ===== FIRE-BREATHING DRAGON — reared up, wings spread, torching the sky =====
// palette: BRICK = red scales, COBBLE = horns/claws/bones/smoke,
//          SAND+SNOW = fire, SAND = belly/eyes, SNOW = teeth
function d(a,b){return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2);}

// tapered capsule of spheres (organic limb)
function limb(x1,y1,z1,x2,y2,z2,r1,r2,id){
  const dx=x2-x1,dy=y2-y1,dz=z2-z1;
  const len=Math.sqrt(dx*dx+dy*dy+dz*dz);
  const steps=Math.max(1,Math.ceil(len*1.7));
  for(let i=0;i<=steps;i++){
    const t=i/steps, r=r1+(r2-r1)*t;
    sphere(Math.round(x1+dx*t),Math.round(y1+dy*t),Math.round(z1+dz*t),Math.max(0.6,r),id);
  }
}
// filled triangular sheet (wing membrane)
function tri(a,b,c,id){
  const n=Math.ceil(Math.max(d(a,b),d(b,c),d(a,c))*2);
  for(let i=0;i<=n;i++)for(let j=0;j<=n-i;j++){
    const u=i/n,v=j/n,w=1-u-v;
    block(Math.round(a[0]*w+b[0]*u+c[0]*v),
          Math.round(a[1]*w+b[1]*u+c[1]*v),
          Math.round(a[2]*w+b[2]*u+c[2]*v),id);
  }
}
function chain(pts,id){
  for(let i=0;i<pts.length-1;i++){
    const a=pts[i],b=pts[i+1];
    limb(a[0],a[1],a[2],b[0],b[1],b[2],a[3],b[3],id);
  }
}
function claw(x,y,z,ex,ey,ez){ limb(x,y,z,ex,ey,ez,0.7,0.25,COBBLE); }

// ---- 0. clear trees from the dragon's footprint ----
cube(-8,1,-12,8,10,18,AIR);

// ---- ground: scorched lair + scattered boulders ----
for(const s of [[-3,-13],[2,-11],[0,-9],[4,-12],[-5,-10]]) block(s[0],0,s[1],BRICK);
block(0,0,-11,SAND); block(-2,0,-10,SAND); block(3,0,-12,SAND);
for(const r of [[-7,9,1.4],[7,11,1.6],[-6,-9,1.3],[6,-8,1.5],[8,4,1.4],[-8,3,1.5]])
  sphere(r[0],0,r[1],r[2],COBBLE);
block(0,0,16,BRICK); block(0,0,15,BRICK);
sphere(4.7,0.4,3.7,1.1,BRICK); sphere(-4.7,0.4,3.7,1.1,BRICK);

// ---- 1. spine: tail -> hips -> chest -> neck -> head base ----
const spine=[
 [0,1,16,0.9],   // tail tip on the ground (3rd support point)
 [0,3,13,1.4],
 [1,6,10,2.1],
 [0,9,7,3.0],    // hips
 [0,11,4,3.7],   // lower back
 [0,14,1,4.1],   // chest / wing shoulders (widest)
 [0,17,-2,3.2],  // neck base
 [0,20,-3,2.5],  // neck
 [0,22,-5,2.2],  // upper neck
 [0,24,-7,2.4],  // head base
];
chain(spine,BRICK);
// shoulder muscle so wings blend into the torso
sphere(2.5,14,0.5,2,BRICK); sphere(-2.5,14,0.5,2,BRICK);
// pale tan throat / belly stripe
for(let i=4;i<spine.length;i++){
  const p=spine[i];
  sphere(0,p[1]-1,Math.round(p[2]-p[3]+0.7),1.1,SAND);
}

// ---- 2. dorsal spikes down the whole back ----
for(let i=1;i<spine.length-1;i++){
  const p=spine[i];
  const h=1.5+((i>=3&&i<=6)?1.3:0.6);
  const by=p[1]+p[3]*0.7, bz=p[2]+p[3]*0.4;
  limb(0,by,bz, 0,by+h,bz+0.9, 0.9,0.2, COBBLE);
}
// tail spade fin
tri([0,1,15],[0,7,18.5],[0,1,21],BRICK);
limb(0,7,18.5,0,8.2,19.6,0.5,0.2,COBBLE);

// ---- 3. legs ----
function hindLeg(s){
  limb(2.4*s,9,6, 4.6*s,5,4, 2.5,1.8,BRICK);
  limb(4.6*s,5,4, 4.6*s,1.5,5, 1.8,1.4,BRICK);
  limb(4.6*s,1.5,5, 4.7*s,0.5,3.5, 1.4,1.1,BRICK);
  const fx=4.7*s, fz=3.5;
  claw(fx,0.7,fz, fx-1.3*s,0,fz-2.2);
  claw(fx,0.7,fz, fx,0,fz-2.7);
  claw(fx,0.7,fz, fx+1.3*s,0,fz-2.2);
  claw(fx,0.7,fz+0.6, fx,0,fz+2.2);
}
function frontLeg(s){ // raised, clawing the air
  limb(2.4*s,13,-1, 4.3*s,10,-3, 1.9,1.4,BRICK);
  limb(4.3*s,10,-3, 4.8*s,6.5,-4.5, 1.4,1.1,BRICK);
  const fx=4.8*s, fy=6.2, fz=-4.8;
  claw(fx,fy,fz, fx-1.2*s,fy-2.4,fz-1.2);
  claw(fx,fy,fz, fx,fy-2.8,fz-1.4);
  claw(fx,fy,fz, fx+1.2*s,fy-2.4,fz-1.2);
}
hindLeg(1); hindLeg(-1); frontLeg(1); frontLeg(-1);

// ---- 4. wings ----
function wing(s){
  const S=[2*s,14,0], E=[9*s,20,2], W=[15*s,27,1];
  const F1=[21*s,30,-2], F2=[21*s,25,4], F3=[18*s,20,7], F4=[12*s,15,9], B=[3*s,10,7];
  tri(W,F1,F2,BRICK); tri(W,F2,F3,BRICK); tri(W,F3,F4,BRICK);
  tri(W,F4,B,BRICK);  tri(S,W,B,BRICK);   tri(S,E,W,BRICK);
  limb(S[0],S[1],S[2],E[0],E[1],E[2],1.7,1.2,COBBLE);
  limb(E[0],E[1],E[2],W[0],W[1],W[2],1.2,0.9,COBBLE);
  for(const F of [F1,F2,F3,F4]) limb(W[0],W[1],W[2],F[0],F[1],F[2],1.0,0.4,COBBLE);
  limb(F4[0],F4[1],F4[2],B[0],B[1],B[2],0.7,0.5,COBBLE);
  block(F1[0],F1[1]+1,F1[2],COBBLE); block(F2[0],F2[1]+1,F2[2],COBBLE);
}
wing(1); wing(-1);

// ---- 5. head ----
sphere(0,24,-7,2.5,BRICK);                    // skull
limb(0,24.5,-8,0,24,-11.5,1.9,0.9,BRICK);     // upper jaw / snout
limb(0,22.8,-8,0,21.6,-10.8,1.5,0.8,BRICK);   // lower jaw (mouth open)
block(2,26,-7,COBBLE); block(-2,26,-7,COBBLE);// brow ridges
block(2,25,-8,SAND);  block(-2,25,-8,SAND);   // glowing eyes
block(2,25,-7,BRICK); block(-2,25,-7,BRICK);
limb(1.6,26,-6, 3.2,31,-1, 1.1,0.3, COBBLE);  // big horns
limb(-1.6,26,-6, -3.2,31,-1, 1.1,0.3, COBBLE);
limb(1.3,25,-5, 2.4,27.5,-2, 0.7,0.25, COBBLE);
limb(-1.3,25,-5, -2.4,27.5,-2, 0.7,0.25, COBBLE);
limb(2,23,-8, 3.2,23.5,-9, 0.6,0.2, COBBLE);  // cheek spikes
limb(-2,23,-8, -3.2,23.5,-9, 0.6,0.2, COBBLE);
limb(0,21.4,-10.5, 0,20.2,-11.5, 0.6,0.2, COBBLE); // chin beard
block(1,23,-11,SNOW); block(0,23,-11,SNOW); block(-1,23,-11,SNOW); // upper teeth
block(1,22,-10,SNOW); block(-1,22,-10,SNOW);  // lower teeth

// ---- 6. fire breath (erupting up & forward from the open jaws) ----
const fire=[
 [0,23,-11,1.1],[0,24.5,-13,1.8],[-1,26,-15,2.5],
 [1,27.5,-17,3.1],[0,29,-19,3.3],[0,30.5,-21,2.4],
];
chain(fire,BRICK);                                             // red outer flame
chain(fire.map(p=>[p[0],p[1],p[2],p[3]*0.6]),SAND);            // yellow body
chain(fire.slice(0,3).map(p=>[p[0],p[1],p[2],Math.max(0.8,p[3]*0.35)]),SNOW); // white-hot core
// embers + smoke
for(const e of [[-3,25,-16],[3,24,-14],[-2,22,-18],[2,28,-20],[0,20,-15],[-4,27,-17],[4,26,-19],[-1,18,-16]])
  block(e[0],e[1],e[2],(e[0]+e[2])%2===0?SAND:BRICK);
block(-2,31,-20,COBBLE); block(2,31,-19,COBBLE); block(0,32,-21,COBBLE);