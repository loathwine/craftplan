// clockwork-spider-fable — prompt:
// a giant clockwork spider...

const BODY=COPPER, FRAME=IRON, TRIM=GOLD, DARK=OBSIDIAN;

// ---------- helpers ----------
function thickLine(x1,y1,z1,x2,y2,z2,id,t){
  for(let dx=0;dx<t;dx++)for(let dy=0;dy<t;dy++)for(let dz=0;dz<t;dz++)
    line(x1+dx,y1+dy,z1+dz,x2+dx,y2+dy,z2+dz,id);
}
// gear ring in a vertical plane. axis 'x' => ring lies in YZ plane; axis 'z' => ring in XY plane
function gear(cx,cy,cz,r,axis,id,teethId){
  const n=Math.max(12,Math.round(r*6));
  for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2;
    const u=Math.round(Math.cos(a)*r), v=Math.round(Math.sin(a)*r);
    const ut=Math.round(Math.cos(a)*(r+1)), vt=Math.round(Math.sin(a)*(r+1));
    if(axis==='x'){ block(cx,cy+v,cz+u,id); if(i%3===0) block(cx,cy+vt,cz+ut,teethId); }
    else { block(cx+u,cy+v,cz,id); if(i%3===0) block(cx+ut,cy+vt,cz,teethId); }
  }
  // spokes + hub
  if(axis==='x'){ line(cx,cy-r+1,cz,cx,cy+r-1,cz,id); line(cx,cy,cz-r+1,cx,cy,cz+r-1,id); block(cx,cy,cz,TRIM); }
  else { line(cx-r+1,cy,cz,cx+r-1,cy,cz,id); line(cx,cy-r+1,cz,cx,cy+r-1,cz,id); block(cx,cy,cz,TRIM); }
}
// flat gear on the ground (XZ plane)
function flatGear(cx,cy,cz,r,id,teethId){
  disk(cx,cy,cz,r,id);
  const n=Math.round(r*5);
  for(let i=0;i<n;i++){ const a=i/n*Math.PI*2;
    if(i%2===0) block(cx+Math.round(Math.cos(a)*(r+1)),cy,cz+Math.round(Math.sin(a)*(r+1)),teethId); }
  block(cx,cy,cz,DARK);
}

// ---------- site prep: clear trees under the footprint ----------
cube(-12,0,-12,12,9,14,AIR);

// ---------- abdomen (big brass boiler with glass porthole) ----------
const AX=0, AY=10, AZ=7, AR=6;
hollowSphere(AX,AY,AZ,AR,BODY);
// riveted iron bands
for(let a=0;a<Math.PI*2;a+=0.12){
  const x=Math.round(Math.cos(a)*AR), y=Math.round(Math.sin(a)*AR);
  block(AX+x,AY+y,AZ-2,FRAME); block(AX+x,AY+y,AZ+2,FRAME);
}
for(let a=0;a<Math.PI*2;a+=0.5){ const x=Math.round(Math.cos(a)*AR), z=Math.round(Math.sin(a)*AR); block(AX+x,AY,AZ+z,TRIM); }
// glass window on top showing gears inside
cube(AX-2,AY+AR-1,AZ-2,AX+2,AY+AR,AZ+2,GLASS);
cube(AX-3,AY+AR-1,AZ-3,AX+3,AY+AR-1,AZ+3,AIR); cube(AX-3,AY+AR,AZ-3,AX+3,AY+AR,AZ+3,AIR);
hollowCube(AX-3,AY+AR-1,AZ-3,AX+3,AY+AR,AZ+3,TRIM);
cube(AX-2,AY+AR-1,AZ-2,AX+2,AY+AR,AZ+2,GLASS);
gear(AX,AY+2,AZ,3,'z',FRAME,TRIM);
gear(AX,AY+1,AZ-1,2,'x',TRIM,FRAME);
block(AX,AY+3,AZ,ELECTRIC); block(AX,AY+1,AZ+1,ELECTRIC);
// smokestacks on abdomen rear
for(const [sx,sz] of [[-3,10],[3,10],[0,12]]){
  hollowCylinder(AX+sx,AY+3,AZ+sz-1,1,5,FRAME);
  block(AX+sx,AY+8,AZ+sz-1,TRIM);
  block(AX+sx,AY+9,AZ+sz-1,STEAM);
}
// spinnerets
cylinder(AX,AY-3,AZ+6,1,2,FRAME);
block(AX,AY-4,AZ+7,DARK);
// side gears bolted onto abdomen
gear(AX-AR,AY,AZ+1,4,'x',TRIM,FRAME);
gear(AX+AR,AY,AZ+1,4,'x',TRIM,FRAME);
gear(AX-AR-1,AY-2,AZ+5,2,'x',FRAME,TRIM);
gear(AX+AR+1,AY-2,AZ+5,2,'x',FRAME,TRIM);
// pistons along the belly
for(let i=0;i<3;i++){ cylinder(AX-2+i*2,AY-AR-1,AZ-1+i*2,0,2,FRAME); }

// ---------- cephalothorax (armored head) ----------
const HX=0, HY=9, HZ=-3, HR=4;
hollowSphere(HX,HY,HZ,HR,FRAME);
cube(HX-1,HY-HR+1,HZ-1,HX+1,HY+HR-1,HZ+1,BODY);
// brass plating stripes on top of head
for(let x=-3;x<=3;x+=2) line(HX+x,HY+HR-1,HZ-2,HX+x,HY+HR-1,HZ+2,TRIM);
// neck joint connecting head and abdomen
cube(HX-2,HY-1,HZ+3,HX+2,HY+2,AZ-AR+1,DARK);
gear(HX,HY+1,HZ+3,2,'z',TRIM,FRAME);
// face plate
cube(HX-3,HY-2,HZ-HR,HX+3,HY+2,HZ-HR,DARK);
hollowCube(HX-3,HY-2,HZ-HR,HX+3,HY+2,HZ-HR,BODY);
// eyes: two large front lenses + six small ones
block(HX-2,HY+1,HZ-HR-1,GOLD); block(HX+2,HY+1,HZ-HR-1,GOLD);
block(HX-2,HY+1,HZ-HR-2,NEON_RED); block(HX+2,HY+1,HZ-HR-2,NEON_RED);
block(HX-1,HY+2,HZ-HR-1,NEON_RED); block(HX+1,HY+2,HZ-HR-1,NEON_RED);
block(HX-3,HY+2,HZ-HR,NEON_RED); block(HX+3,HY+2,HZ-HR,NEON_RED);
block(HX-3,HY,HZ-HR,NEON_RED); block(HX+3,HY,HZ-HR,NEON_RED);
// fangs (chelicerae): downward hooks
for(const s of [-1,1]){
  line(HX+s*2,HY-1,HZ-HR,HX+s*2,HY-4,HZ-HR-1,FRAME);
  line(HX+s*2,HY-4,HZ-HR-1,HX+s*1,HY-6,HZ-HR-2,TRIM);
  block(HX+s*1,HY-6,HZ-HR-3,GOLD);
}
// pedipalps: small front limbs with claws
for(const s of [-1,1]){
  line(HX+s*3,HY-1,HZ-2,HX+s*6,HY+1,HZ-6,FRAME);
  line(HX+s*6,HY+1,HZ-6,HX+s*5,HY-2,HZ-9,FRAME);
  block(HX+s*5,HY-3,HZ-9,TRIM); block(HX+s*4,HY-3,HZ-10,TRIM);
}

// ---------- eight legs ----------
// each: shoulder(hip) -> knee (high) -> ankle -> foot on ground
const legs=[
  // [side, hipZ, kneeX, kneeY, kneeZ, footX, footZ]
  [ -1, -5, -10, 17, -11, -16, -17],
  [ -1, -3, -12, 18,  -4, -20,  -8],
  [ -1, -1, -12, 18,   3, -20,   5],
  [ -1,  1, -10, 17,   9, -16,  16],
  [  1, -5,  10, 17, -11,  16, -17],
  [  1, -3,  12, 18,  -4,  20,  -8],
  [  1, -1,  12, 18,   3,  20,   5],
  [  1,  1,  10, 17,   9,  16,  16],
];
for(const [s,hz,kx,ky,kz,fx,fz] of legs){
  const hx=s*4, hy=HY+1;
  // hip joint block + gear
  cube(hx-1,hy-1,hz-1,hx+1,hy+1,hz+1,DARK);
  block(hx+s*2,hy,hz,TRIM);
  // femur: hip to knee (2 thick)
  thickLine(hx+s,hy,hz,kx,ky,kz,BODY,2);
  line(hx+s,hy+2,hz,kx,ky+2,kz,FRAME); // top strut
  // knee joint
  sphere(kx,ky,kz,1,DARK);
  gear(kx+s,ky,kz,2,'x',TRIM,FRAME);
  // tibia: knee to ankle (mid height)
  const ax=Math.round((kx+fx)/2)+s, ay=7, az=Math.round((kz+fz)/2);
  thickLine(kx,ky,kz,ax,ay,az,FRAME,2);
  line(kx+s,ky-1,kz,ax+s,ay-1,az,BODY); // piston rod under
  // ankle
  cube(ax-1,ay-1,az-1,ax+1,ay+1,az+1,DARK);
  // tarsus: ankle to foot
  thickLine(ax,ay,az,fx,0,fz,BODY,2);
  // foot: claw + brass plate on ground
  cube(fx-1,0,fz-1,fx+1,0,fz+1,FRAME);
  block(fx,1,fz,DARK);
  block(fx+s,0,fz,TRIM);
  // tiny steam vent at knee
  if(hz===-3||hz===1) block(kx,ky+2,kz,STEAM);
}

// ---------- ground: discarded cogs, clockwork debris, oil ----------
flatGear(-7,0,-14,3,TRIM,FRAME);
flatGear(8,0,-12,2,FRAME,TRIM);
flatGear(10,0,14,3,COPPER,TRIM);
flatGear(-9,0,13,2,FRAME,TRIM);
gear(3,2,-15,2,'z',COPPER,TRIM); // propped-up cog
// spring / coil pile
for(let i=0;i<10;i++){ const a=i*0.7; block(Math.round(-4+Math.cos(a)*2),i<5?0:1,Math.round(-13+Math.sin(a)*2),FRAME); }
// oil puddle under the body
disk(0,-1,2,3,DARK);
cube(-2,-1,0,2,-1,4,WATER);
cube(-2,0,0,2,0,4,AIR);
// a few loose brass bolts
block(5,0,-8,TRIM); block(-6,0,-7,TRIM); block(4,0,10,TRIM); block(-5,0,9,TRIM);
// dripping lava-like forge glow in the neck vent
block(HX,HY-3,HZ+4,LAVA);