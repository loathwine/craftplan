// zeus-fable — prompt:
// Zeus throwing a lightning bolt...

const M = new Map();
function put(x,y,z,id){ M.set(x+','+y+','+z, id); }
function box(x1,y1,z1,x2,y2,z2,id){
  const ax=Math.min(x1,x2),bx=Math.max(x1,x2),ay=Math.min(y1,y2),by=Math.max(y1,y2),az=Math.min(z1,z2),bz=Math.max(z1,z2);
  for(let x=ax;x<=bx;x++)for(let y=ay;y<=by;y++)for(let z=az;z<=bz;z++)put(x,y,z,id);
}
function ball(cx,cy,cz,r,id){ const R=(r+0.5)*(r+0.5);
  for(let x=-r;x<=r;x++)for(let y=-r;y<=r;y++)for(let z=-r;z<=r;z++) if(x*x+y*y+z*z<=R) put(cx+x,cy+y,cz+z,id); }
function dsk(cx,cy,cz,r,id){ const R=(r+0.5)*(r+0.5);
  for(let x=-r;x<=r;x++)for(let z=-r;z<=r;z++) if(x*x+z*z<=R) put(cx+x,cy,cz+z,id); }
function col(cx,cy,cz,r,h,id){ for(let y=0;y<h;y++) dsk(cx,cy+y,cz,r,id); }
function tl(x1,y1,z1,x2,y2,z2,r,id){
  const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1);
  for(let i=0;i<=n;i++){ const t=i/n;
    const x=Math.round(x1+(x2-x1)*t),y=Math.round(y1+(y2-y1)*t),z=Math.round(z1+(z2-z1)*t);
    if(r<=0) put(x,y,z,id); else ball(x,y,z,r,id); }
}
function ring(cx,cy,cz,r,id){ for(let a=0;a<72;a++){ const t=a/72*Math.PI*2; put(cx+Math.round(r*Math.cos(t)),cy,cz+Math.round(r*Math.sin(t)),id);} }

// ---- clear trees / shrubs on site
box(-14,0,-12,14,9,14,AIR);

// ---- Olympus platform (tiered marble with gold inlay)
dsk(0,0,2,11,MARBLE);
dsk(0,1,2,8,MARBLE);
dsk(0,2,2,6,MARBLE);
ring(0,0,2,10,GOLD);
ring(0,1,2,7,GOLD);

// ---- cloud puffs hugging the platform
const puffs=[[-15,-3],[-17,6],[16,-5],[17,3],[-9,-13],[9,-14]];
for(const [px,pz] of puffs){ dsk(px,0,pz,3,WHITE); dsk(px,1,pz,2,WHITE); dsk(px,2,pz,1,WHITE); }

// ---- ruined temple colonnade (background, +Z)
const cols=[[-12,15],[-5,15],[5,8],[12,15]];
for(const [cx,h] of cols){
  box(cx-1,0,10,cx+1,2,12,MARBLE);
  col(cx,3,11,1,h,MARBLE);
  if(h>=15) box(cx-2,18,10,cx+2,18,12,MARBLE);
}
box(-14,19,10,-3,20,12,MARBLE);
box(10,19,10,14,20,12,MARBLE);
box(-14,20,10,-3,20,10,GOLD);
box(10,20,10,14,20,10,GOLD);
// broken pediment on the left
box(-13,21,10,-5,21,12,MARBLE);
box(-12,22,10,-7,22,12,MARBLE);
box(-11,23,10,-9,23,12,MARBLE);
box(-10,24,10,-10,24,12,MARBLE);
// fallen column drum by the broken column
box(7,3,5,9,4,8,MARBLE);
// eagle perched on pediment peak
box(-11,25,10,-9,26,11,BROWN);
box(-14,26,10,-12,27,11,BROWN);
box(-8,26,10,-6,27,11,BROWN);
put(-10,27,10,WHITE); put(-10,27,9,YELLOW);

// ---- fire altars flanking the front
for(const ax of [8,-8]){
  box(ax-1,1,-6,ax+1,3,-4,MARBLE);
  put(ax-1,4,-5,GOLD); put(ax+1,4,-5,GOLD); put(ax,4,-6,GOLD); put(ax,4,-4,GOLD);
  put(ax,4,-5,FIRE);
}

// ---- storm cloud upper left with a stray bolt
ball(-17,27,4,3,GRAY);
ball(-14,28,2,2,GRAY);
ball(-20,26,7,2,LIGHT_GRAY);
ball(-15,25,1,2,LIGHT_GRAY);
put(-17,23,4,ELECTRIC);

// ================= ZEUS (faces north / -Z) =================
// legs: left (-X) forward, right (+X) planted back
box(-5,3,-4,-2,3,-1,BROWN);          // left sandal
box(-5,4,-3,-2,8,-1,SAND);           // left shin
box(-5,9,-2,-2,13,0,SAND);           // left thigh
box(2,3,4,5,3,7,BROWN);              // right sandal
box(2,4,4,5,8,6,SAND);               // right shin
box(2,9,2,5,13,4,SAND);              // right thigh
// sandal straps
for(const [sx,sz] of [[-4,-2],[4,5]]){ put(sx,4,sz-1,BROWN); put(sx,5,sz,BROWN); }

// loincloth + belt
box(-6,12,-1,6,14,5,WHITE);
box(-6,11,-1,6,11,5,GOLD);
for(const fx of [-4,-1,2,5]) box(fx,12,-1,fx,14,-1,LIGHT_GRAY);
box(-6,15,-1,6,15,5,GOLD);
put(0,15,-1,GLOWSTONE);              // belt jewel

// torso
box(-5,16,0,5,21,4,SAND);
box(-5,19,-1,-1,20,-1,SAND);         // pecs
box(1,19,-1,5,20,-1,SAND);
for(const ay of [16,18]){ put(-2,ay,-1,SAND); put(-1,ay,-1,SAND); put(1,ay,-1,SAND); put(2,ay,-1,SAND); }
// toga strap across chest + brooch
tl(-6,21,-1,5,15,-1,1,WHITE);
box(-7,21,-2,-6,22,-1,GOLD);

// shoulders
ball(-7,21,2,2,SAND);
ball(7,21,2,2,SAND);

// cape behind
box(-7,10,5,7,21,5,WHITE);
box(-7,10,5,7,10,5,GOLD);
for(const tx of [-6,-2,3,7]) put(tx,10,5,AIR);
tl(-7,14,6,-13,8,8,1,WHITE);
tl(-7,18,6,-11,14,7,1,WHITE);

// neck + head
box(-1,22,1,1,23,3,SAND);
box(-2,24,0,2,28,4,SAND);
// hair
box(-3,29,0,3,30,5,WHITE);
box(-3,24,2,-3,28,5,WHITE);
box(3,24,2,3,28,5,WHITE);
box(-2,23,5,2,29,5,WHITE);
// laurel wreath
box(-3,29,0,3,29,0,GOLD);
box(-3,29,0,-3,29,5,GOLD);
box(3,29,0,3,29,5,GOLD);
put(-2,29,0,LIME); put(2,29,0,LIME); put(-3,29,3,LIME); put(3,29,3,LIME);
// face
put(-1,27,0,NEON_BLUE); put(1,27,0,NEON_BLUE);
put(0,26,-1,SAND);
put(-2,28,-1,WHITE); put(-1,28,-1,WHITE); put(1,28,-1,WHITE); put(2,28,-1,WHITE);
// beard
box(-2,25,-1,2,25,-1,WHITE);
box(-3,22,-1,3,24,-1,WHITE);
box(-3,23,0,-3,25,0,WHITE);
box(3,23,0,3,25,0,WHITE);
box(-2,19,-2,2,21,-2,WHITE);
box(-1,17,-2,1,18,-2,WHITE);
put(0,16,-2,WHITE);

// right arm raised back holding the bolt
tl(7,21,2,11,25,6,1,SAND);
tl(11,25,6,10,30,2,1,SAND);
box(9,30,0,11,32,2,SAND);
// left arm thrust forward, pointing at the target
tl(-7,21,2,-11,19,-3,1,SAND);
tl(-11,19,-3,-10,17,-9,1,SAND);
box(-11,16,-11,-9,18,-9,SAND);
box(-11,17,-12,-9,17,-12,SAND);
put(-10,17,-13,SAND);
// gold arm bands
ring(-11,19,-3,2,GOLD); ring(11,25,6,2,GOLD);

// ---- the thunderbolt
const pts=[[10,32,6],[10,31,1],[8,30,-2],[11,29,-4],[8,28,-7],[10,27,-10],[9,26,-12]];
for(let i=0;i<pts.length-1;i++){
  const a=pts[i],b=pts[i+1];
  tl(a[0],a[1],a[2],b[0],b[1],b[2],0,GLOWSTONE);
  tl(a[0],a[1]-1,a[2],b[0],b[1]-1,b[2],0,YELLOW);
}
put(9,26,-13,GLOWSTONE);
put(10,33,7,ELECTRIC);
put(9,31,-2,ELECTRIC);
put(10,29,-5,ELECTRIC);
put(9,27,-9,ELECTRIC);
put(10,25,-12,ELECTRIC);

// ---- emit
for(const [k,id] of M){ const p=k.split(',').map(Number); block(p[0],p[1],p[2],id); }