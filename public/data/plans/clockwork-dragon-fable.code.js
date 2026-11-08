// clockwork-dragon-fable — prompt:
// a clockwork dragon made of brass gears...

let gearCount=0;
function brass(i){return (i%3===0)?COPPER:GOLD;}
// Gear in a vertical plane. axis: 'x' (plane YZ) or 'z' (plane XY) or 'y' (flat)
function gear(cx,cy,cz,r,axis,id,teeth){
  teeth=teeth||Math.max(6,Math.round(r*2));
  for(let a=0;a<360;a+=6){
    const t=a*Math.PI/180,u=Math.round(Math.cos(t)*r),v=Math.round(Math.sin(t)*r);
    if(axis==='x')block(cx,cy+v,cz+u,id);
    else if(axis==='z')block(cx+u,cy+v,cz,id);
    else block(cx+u,cy,cz+v,id);
  }
  for(let k=0;k<teeth;k++){
    const t=k*2*Math.PI/teeth,u=Math.round(Math.cos(t)*(r+1)),v=Math.round(Math.sin(t)*(r+1));
    if(axis==='x')block(cx,cy+v,cz+u,IRON);
    else if(axis==='z')block(cx+u,cy+v,cz,IRON);
    else block(cx+u,cy,cz+v,IRON);
  }
  // spokes + hub
  for(let s=-r+2;s<=r-2;s++){
    if(axis==='x'){block(cx,cy+s,cz,IRON);block(cx,cy,cz+s,IRON);}
    else if(axis==='z'){block(cx+s,cy,cz,IRON);block(cx,cy+s,cz,IRON);}
    else{block(cx+s,cy,cz,IRON);block(cx,cy,cz+s,IRON);}
  }
  block(cx,cy,cz,OBSIDIAN);
}
// plating: hollow sphere with brass stripes
function plate(cx,cy,cz,r){
  hollowSphere(cx,cy,cz,r,GOLD);
  for(let a=0;a<360;a+=40){
    const t=a*Math.PI/180;
    for(let y=-r;y<=r;y++){
      const rr=Math.sqrt(Math.max(0,r*r-y*y));
      block(cx+Math.round(Math.cos(t)*rr),cy+y,cz+Math.round(Math.sin(t)*rr),COPPER);
    }
  }
}

// ---------- clear a little space ----------
cube(-16,0,-18,16,14,18,AIR);

// ---------- pedestal / base ----------
disk(0,-1,0,13,COBBLE);
disk(0,0,0,12,STONE);
hollowCylinder(0,0,0,12,1,IRON);
for(let a=0;a<360;a+=45){const t=a*Math.PI/180;block(Math.round(Math.cos(t)*12),1,Math.round(Math.sin(t)*12),GOLD);}

// ---------- legs ----------
function leg(x,z,h){
  cylinder(x,1,z,1,h,IRON);
  gear(x,Math.floor(h*0.6),z,2,'x',GOLD,6);
  // claw foot
  block(x-1,1,z-1,COPPER);block(x+1,1,z-1,COPPER);block(x,1,z-2,COPPER);block(x,1,z+1,COPPER);
}
leg(-4,-4,7);leg(4,-4,7);leg(-4,6,6);leg(4,6,6);

// ---------- body (segmented, plated) ----------
plate(0,9,-3,4);
plate(0,9,2,5);
plate(0,8,7,4);
// chest exposed clockwork
cube(-2,7,-7,2,11,-5,AIR);
gear(0,9,-6,2,'z',COPPER,6);
gear(0,9,-6,3,'z',COPPER,8);
// interior boiler + exposed mechanism in flank
cube(-3,7,0,3,11,4,AIR);
cube(-5,7,2,5,11,2,AIR);
gear(0,9,2,4,'x',COPPER,10);
gear(0,9,2,2,'x',GOLD,6);
block(0,9,2,NEON_BLUE);
// side ribs
for(let z=-5;z<=9;z+=2){
  for(let y=6;y<=12;y++){block(5,y,z,BROWN);block(-5,y,z,BROWN);}
}
// back spine ridge with small gears
for(let z=-6;z<=10;z+=3){
  gear(0,14,z,2,'z',GOLD,6);
}
// stack vents on back
for(const z of [-4,0,4]){
  cylinder(2,13,z,0,3,IRON);cylinder(-2,13,z,0,3,IRON);
  block(2,16,z,STEAM);block(-2,16,z,STEAM);
}

// ---------- neck ----------
let nx=0,ny=11,nz=-7;
for(let i=0;i<7;i++){
  const yy=ny+i,zz=nz-i;
  hollowCylinder(0,yy,zz,2,1,i%2?COPPER:GOLD);
  block(0,yy,zz,IRON);
}
gear(0,14,-9,3,'x',COPPER,8);
gear(0,17,-12,3,'x',COPPER,8);

// ---------- head (facing north / -Z) ----------
const hx=0,hy=18,hz=-16;
plate(hx,hy,hz,3);
// snout
hollowCube(-2,hy-1,hz-7,2,hy+1,hz-3,GOLD);
cube(-1,hy,hz-6,1,hy,hz-3,AIR);
// jaw
cube(-2,hy-2,hz-7,2,hy-2,hz-3,COPPER);
// teeth
for(let x=-2;x<=2;x+=2){block(x,hy-1,hz-7,IRON);}
// eyes
block(-2,hy+1,hz-3,NEON_RED);block(2,hy+1,hz-3,NEON_RED);
block(-2,hy+1,hz-2,BLACK);block(2,hy+1,hz-2,BLACK);
// horns (gear spikes)
line(-2,hy+2,hz,-5,hy+6,hz+4,IRON);
line(2,hy+2,hz,5,hy+6,hz+4,IRON);
gear(-5,hy+6,hz+4,2,'x',GOLD,6);
gear(5,hy+6,hz+4,2,'x',GOLD,6);
// cranial gear on top
gear(0,hy+3,hz,2,'z',COPPER,6);
// fire breath
block(0,hy,hz-9,FIRE);block(0,hy-1,hz-10,FIRE);block(1,hy,hz-11,FIRE);block(-1,hy-1,hz-12,FIRE);
block(0,hy,hz-13,FIRE);block(0,hy+1,hz-14,FIRE);
// steam from nostrils
block(-1,hy+1,hz-8,STEAM);block(1,hy+1,hz-8,STEAM);

// ---------- wings (gear-frame armatures) ----------
function wing(dir){
  const sx=dir*5;
  // shoulder gear
  gear(sx,12,0,3,'z',COPPER,8);
  // main spar rising outward
  line(sx,12,0,sx+dir*9,20,2,IRON);
  line(sx+dir*9,20,2,sx+dir*16,26,4,IRON);
  // elbow gear
  gear(sx+dir*9,20,2,3,'z',GOLD,8);
  gear(sx+dir*16,26,4,2,'z',COPPER,6);
  // fingers fanning back (+Z)
  const tips=[[sx+dir*17,24,13],[sx+dir*15,19,15],[sx+dir*12,14,16],[sx+dir*9,12,14]];
  tips.forEach(t=>line(sx+dir*9,20,2,t[0],t[1],t[2],IRON));
  line(sx+dir*16,26,4,sx+dir*17,24,13,IRON);
  // membrane: copper lattice between fingers (sparse mesh)
  for(let i=0;i<tips.length-1;i++){
    const a=tips[i],b=tips[i+1];
    for(let k=1;k<4;k++){
      const f=k/4;
      const px=Math.round(a[0]+(b[0]-a[0])*f),py=Math.round(a[1]+(b[1]-a[1])*f),pz=Math.round(a[2]+(b[2]-a[2])*f);
      line(sx+dir*9,20,2,px,py,pz,k%2?COPPER:GOLD);
    }
    line(a[0],a[1],a[2],b[0],b[1],b[2],COPPER);
  }
  // small gears along wing
  gear(sx+dir*13,17,10,2,'z',GOLD,6);
  gear(sx+dir*10,13,9,2,'z',COPPER,6);
  // claw at wrist
  block(sx+dir*17,27,4,IRON);block(sx+dir*17,27,3,IRON);
}
wing(1);wing(-1);

// ---------- tail ----------
const tail=[[0,8,11],[0,7,14],[1,7,17],[3,8,19],[6,9,20],[9,11,20],[11,14,19],[12,17,17]];
for(let i=0;i<tail.length;i++){
  const p=tail[i],r=i<3?2:1;
  if(i<tail.length-1){const q=tail[i+1];line(p[0],p[1],p[2],q[0],q[1],q[2],IRON);}
  hollowSphere(p[0],p[1],p[2],r,i%2?GOLD:COPPER);
  if(i%2===0)gear(p[0],p[1]+r+1,p[2],1,'z',IRON,4);
}
// tail blade
gear(12,17,17,3,'x',GOLD,10);
line(12,17,17,13,21,15,IRON);line(12,17,17,11,21,19,IRON);

// ---------- loose gears / workshop clutter around base ----------
gear(-10,3,-6,3,'z',COPPER,8);
gear(10,2,8,2,'x',GOLD,6);
gear(-9,0,9,4,'y',COPPER,10);
gear(9,0,-9,3,'y',GOLD,8);
cube(-11,1,5,-9,2,7,PLANKS);
block(-10,3,6,GLOWSTONE);
cube(9,1,-5,11,1,-3,PLANKS);
block(10,2,-4,COPPER);block(10,3,-4,ELECTRIC);
// lanterns on pedestal rim
for(const [x,z] of [[-12,0],[12,0],[0,-12],[0,12]]){
  cylinder(x,1,z,0,4,IRON);block(x,5,z,GLOWSTONE);
}
// key in the back (wind-up)
cylinder(0,12,9,0,4,IRON);
hollowCube(-3,16,9,3,19,9,GOLD);
block(0,17,9,IRON);block(0,18,9,IRON);
block(0,20,9,ELECTRIC);