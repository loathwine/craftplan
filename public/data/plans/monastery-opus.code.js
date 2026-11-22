// monastery-opus — prompt:
// a Tibetan monastery on a snowy peak...

const hash=(x,z,s)=>{const v=Math.sin(x*127.1+z*311.7+s*74.7)*43758.5453;return v-Math.floor(v);};
const sn=(x,z,f,s)=>{const X=x*f,Z=z*f,xi=Math.floor(X),zi=Math.floor(Z),tx=X-xi,tz=Z-zi;
 const a=hash(xi,zi,s),b=hash(xi+1,zi,s),c=hash(xi,zi+1,s),d=hash(xi+1,zi+1,s);
 const u=tx*tx*(3-2*tx),w=tz*tz*(3-2*tz);return a+(b-a)*u+(c-a)*w+(a-b-c+d)*u*w;};
function H(x,z){
  const r=Math.sqrt((x/1.15)**2+(z-4)**2);
  const n=(sn(x,z,0.25,1)-0.5)*2.4+(hash(x,z,2)-0.5)*0.8;
  const h1=r<6.5?12:12-(r-6.5)*1.4+n*Math.min(1,(r-6.5)/2);
  const d2=Math.sqrt((x+8)**2+((z-13)*1.3)**2);
  const h2=32-2.1*d2+n*1.3;
  const d3=Math.sqrt((x-11)**2+((z-15)*1.2)**2);
  const h3=22-2.0*d3+n;
  return Math.min(31,Math.max(-1,Math.round(Math.max(h1,h2,h3))));
}
const inB=(x,z)=>x>=-22&&x<=22&&z>=-22&&z<=22;
const blds=[
  {x1:-8,z1:-6,x2:8,z2:0,top:16},
  {x1:-5,z1:1,x2:5,z2:8,top:24},
  {x1:6,z1:1,x2:10,z2:8,top:18},
  {x1:-11,z1:-1,x2:-6,z2:5,top:17},
];
const interior=(x,z)=>blds.some(b=>x>b.x1&&x<b.x2&&z>b.z1&&z<b.z2);

// clear foreground trees in front of the mountain foot
cube(-12,1,-22,12,8,-12,AIR);

// ---- the snowy mountain (surface shell only)
for(let x=-22;x<=22;x++)for(let z=-22;z<=22;z++){
  const h=H(x,z); if(h<0) continue;
  if(h<8) for(let y=Math.max(1,h+1);y<=8;y++) block(x,y,z,AIR);
  if(interior(x,z)) continue;
  let mn=Math.min(H(x-1,z),H(x+1,z),H(x,z-1),H(x,z+1));
  if(!inB(x+1,z)||!inB(x-1,z)||!inB(x,z+1)) mn=-1;
  const lo=Math.min(h,mn+1);
  const drop=h-mn, rn=hash(x,z,5);
  for(let y=lo;y<=h;y++){
    let id;
    if(y===h){
      if(h>=7) id=(drop>=3&&rn<0.45)?STONE:SNOW;
      else if(h>=4) id=rn<0.55?SNOW:(rn<0.8?STONE:COBBLE);
      else id=rn<0.25?SNOW:(rn<0.6?STONE:(rn<0.8?COBBLE:GRAY));
    } else {
      const v=hash(x,y*3+z,7);
      id=v<0.6?STONE:(v<0.8?GRAY:COBBLE);
      if(y===h-1&&h>=10&&v<0.3) id=SNOW;
    }
    block(x,y,z,id);
  }
}

// ---- building helper: walls rise from the rock surface
function building(b,colorAt,roof,minY){
  for(let x=b.x1;x<=b.x2;x++)for(let z=b.z1;z<=b.z2;z++){
    const edge=x===b.x1||x===b.x2||z===b.z1||z===b.z2;
    if(edge){
      const start=Math.max(H(x,z)+1,minY?minY(x,z):-8);
      for(let y=start;y<=b.top;y++) block(x,y,z,colorAt(y));
    }
    block(x,b.top+1,z,roof);
  }
  for(const [x,z] of [[b.x1,b.z1],[b.x2,b.z1],[b.x1,b.z2],[b.x2,b.z2]]) block(x,b.top+2,z,BROWN);
}
// front White Palace (built down the north face)
building(blds[0],y=>y>=16?BROWN:WHITE,SNOW);
// Red Palace (front face hidden below the white roof is skipped)
building(blds[1],y=>y>=24?BROWN:(y>=19?RED:WHITE),SNOW,(x,z)=>z===1?17:-8);
// east wing
building(blds[2],y=>y>=18?BROWN:WHITE,SNOW);
// west wing
building(blds[3],y=>y>=17?BROWN:WHITE,SNOW);
for(let z=1;z<=8;z++) block(10,17,z,RED);
for(let x=6;x<=10;x++) block(x,17,1,RED);
for(let x=-11;x<=-6;x++) block(x,16,-1,RED);
for(let z=-1;z<=5;z++) block(-11,16,z,RED);

// ---- windows
const win=(x,y,z,lit)=>block(x,y,z,lit?GLOWSTONE:BLACK);
for(const y of [10,12,14]) for(const x of [-7,-5,-3,3,5,7]){
  if(y>H(x,-6)+1) win(x,y,-6,hash(x,y,9)<0.3);
}
for(const y of [11,13]) for(const z of [-4,-2]){ if(y>H(8,z)+1) win(8,y,z,z===-2); if(y>H(-8,z)+1) win(-8,y,z,false);}
for(const y of [20,22]) for(const x of [-4,-2,2,4]) win(x,y,1,(x+y)%4===0);
for(let y=19;y<=22;y++){ block(0,y,1,y===21?GLOWSTONE:BLACK); block(-1,y,1,GOLD); block(1,y,1,GOLD);}
block(0,23,1,GOLD);
for(const z of [3,6]){ win(5,21,z,true); win(-5,21,z,false);}
for(const x of [7,9]) for(const y of [14,16]) if(y>H(x,1)+1) win(x,y,1,x===9&&y===16);
for(const x of [-10,-8]) for(const y of [13,15]) if(y>H(x,-1)+1) win(x,y,-1,x===-8&&y===13);

// ---- grand gate
for(let x=-1;x<=1;x++)for(let y=9;y<=11;y++) block(x,y,-6,x===0&&y===11?GOLD:BROWN);
for(let x=-2;x<=2;x++){ block(x,12,-6,GOLD); block(x,13,-7,RED); }
for(let y=9;y<=12;y++){ block(-2,y,-7,RED); block(2,y,-7,RED); }

// ---- stairway up the north face
for(let z=-16;z<=-7;z++){
  const sy=Math.round((z+16)*8/9);
  for(let x=-1;x<=1;x++){
    for(let y=Math.min(H(x,z)+1,sy);y<sy;y++) block(x,y,z,STONE);
    block(x,sy,z,COBBLE);
    for(let y=sy+1;y<=sy+3;y++) block(x,y,z,AIR);
  }
  for(const x of [-2,2]){
    for(let y=Math.min(H(x,z)+1,sy);y<=sy+1;y++) block(x,y,z,WHITE);
  }
}
// butter lamps
block(-2,9,-8,GOLD);block(2,9,-8,GOLD);block(-2,10,-8,FIRE);block(2,10,-8,FIRE);
block(-2,2,-16,GOLD);block(2,2,-16,GOLD);block(-2,3,-16,FIRE);block(2,3,-16,FIRE);

// ---- Dharma wheel + deer on the front roof
for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]]) block(dx,19+dy,-6,GOLD);
block(0,19,-6,YELLOW);
for(const s of [-1,1]){ block(3*s,18,-6,GOLD); block(2*s,18,-6,GOLD); block(3*s,19,-6,GOLD); }
for(const [x,z] of [[-8,-6],[8,-6]]){ block(x,18,z,GOLD); block(x,19,z,GOLD); }
// victory banners on the Red Palace roof
for(const [x,z] of [[-5,1],[5,1],[-5,8],[5,8]]){ block(x,26,z,BLACK); block(x,27,z,GOLD); block(x,28,z,GOLD); }

// ---- golden pavilion on the Red Palace
for(let x=-2;x<=2;x++)for(let z=3;z<=6;z++){
  if(x===-2||x===2||z===3||z===6){ block(x,26,z,RED); block(x,27,z,RED); }
}
block(0,26,3,BROWN); block(-1,27,3,GLOWSTONE); block(1,27,3,GLOWSTONE);
cube(-3,28,2,3,28,7,GOLD);
cube(-2,29,3,2,29,6,GOLD);
cube(-1,30,4,1,30,5,GOLD);
block(0,31,4,GOLD);block(0,32,4,GOLD);block(0,31,5,GOLD);
for(const [x,z] of [[-3,2],[3,2],[-3,7],[3,7]]) block(x,29,z,GOLD);

// juniper incense burner on the front roof
cube(5,18,-4,6,18,-3,WHITE); block(5,19,-4,STEAM); block(6,19,-3,STEAM);

// ---- chortens (stupas) on the lower slopes
function stupa(cx,cz,big){
  let b=-99; for(let x=cx-2;x<=cx+2;x++)for(let z=cz-2;z<=cz+2;z++) b=Math.max(b,H(x,z));
  b=Math.max(b,-1)+1;
  for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
    for(let y=Math.max(H(x,z)+1,-1);y<b;y++) block(x,y,z,STONE);
    if(Math.abs(x-cx)<=2&&Math.abs(z-cz)<=2){ for(let y=b+1;y<=b+3;y++) block(x,y,z,AIR); block(x,b,z,WHITE);}
  }
  cube(cx-2,b+1,cz-2,cx+2,b+1,cz+2,WHITE);
  cube(cx-1,b+2,cz-1,cx+1,b+2,cz+1,WHITE);
  sphere(cx,b+4,cz,big?2:1.6,WHITE);
  cube(cx-1,b+6,cz-1,cx+1,b+6,cz+1,WHITE);
  block(cx,b+6,cz-1,GOLD);
  for(let y=b+7;y<=b+10;y++) block(cx,y,cz,GOLD);
  for(const [dx,dz] of [[-1,0],[1,0],[0,-1],[0,1]]) block(cx+dx,b+9,cz+dz,GOLD);
  block(cx,b+1,cz-3,GOLD); block(cx,b+2,cz-3,FIRE);
}
stupa(-14,-6,true);
stupa(14,-5,false);

// ---- prayer flags
const cols=[BLUE,WHITE,RED,GREEN,YELLOW];
function pole(x,z,h){const b=Math.max(H(x,z),-1)+1; for(let y=b;y<b+h;y++) block(x,y,z,OAK_LOG); block(x,b+h,z,GOLD); return [x,b+h-1,z];}
function flags(a,c,sag){
  const L=Math.max(Math.abs(c[0]-a[0]),Math.abs(c[1]-a[1]),Math.abs(c[2]-a[2]));
  for(let i=1;i<L;i++){
    const t=i/L;
    const x=Math.round(a[0]+(c[0]-a[0])*t), z=Math.round(a[2]+(c[2]-a[2])*t);
    const y=Math.round(a[1]+(c[1]-a[1])*t-sag*4*t*(1-t));
    const col=cols[i%5];
    block(x,y,z,col);
    if(i%3===0) block(x,y-1,z,col);
  }
}
const p1=pole(-18,-10,8), p2=pole(18,-11,8), p3=pole(-19,6,9), p4=pole(19,8,8);
flags([-5,27,1],p1,3);
flags([5,27,1],p2,3);
flags([-11,19,-1],p3,2);
flags([10,20,8],p4,2);
const pk=H(-8,13);
block(-8,pk+1,13,OAK_LOG); block(-8,Math.min(33,pk+2),13,GOLD);
flags([-5,27,8],[-8,pk+1,13],2);
flags([5,27,8],[11,H(11,15)+1,15],2);