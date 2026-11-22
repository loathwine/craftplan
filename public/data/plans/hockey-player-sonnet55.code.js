// hockey-player-sonnet55 — prompt:
// an ice hockey player taking a slapshot...

const M = new Map();
const put = (x,y,z,id) => {
  if (id == null) return;
  x = Math.round(x); y = Math.round(y); z = Math.round(z);
  if (x < -22 || x > 22 || z < -22 || z > 22 || y < -8 || y > 33) return;
  M.set(x + ',' + y + ',' + z, id);
};
const pick = (id,x,y,z) => typeof id === 'function' ? id(x,y,z) : id;
const box = (x1,y1,z1,x2,y2,z2,id) => {
  for (let x=Math.min(x1,x2); x<=Math.max(x1,x2); x++)
    for (let y=Math.min(y1,y2); y<=Math.max(y1,y2); y++)
      for (let z=Math.min(z1,z2); z<=Math.max(z1,z2); z++)
        put(x,y,z,pick(id,x,y,z));
};
const ball = (cx,cy,cz,r,id) => {
  const R = Math.ceil(r);
  for (let dx=-R; dx<=R; dx++) for (let dy=-R; dy<=R; dy++) for (let dz=-R; dz<=R; dz++)
    if (dx*dx+dy*dy+dz*dz <= r*r+0.3) put(cx+dx,cy+dy,cz+dz,pick(id,cx+dx,cy+dy,cz+dz));
};
const tube = (a,b,r,id) => {
  const [x1,y1,z1]=a, [x2,y2,z2]=b;
  const dx=x2-x1, dy=y2-y1, dz=z2-z1, L2=dx*dx+dy*dy+dz*dz || 1;
  const R = Math.ceil(r);
  for (let x=Math.floor(Math.min(x1,x2))-R; x<=Math.ceil(Math.max(x1,x2))+R; x++)
   for (let y=Math.floor(Math.min(y1,y2))-R; y<=Math.ceil(Math.max(y1,y2))+R; y++)
    for (let z=Math.floor(Math.min(z1,z2))-R; z<=Math.ceil(Math.max(z1,z2))+R; z++) {
      let t = ((x-x1)*dx+(y-y1)*dy+(z-z1)*dz)/L2; t = Math.max(0,Math.min(1,t));
      const qx=x1+t*dx, qy=y1+t*dy, qz=z1+t*dz;
      if ((x-qx)**2+(y-qy)**2+(z-qz)**2 <= r*r) put(x,y,z,pick(id,x,y,z));
    }
};
const hash = (a,b,c=0) => { const s = Math.sin(a*127.1 + b*311.7 + c*74.7) * 43758.5453; return s - Math.floor(s); };

// ================= PLAYER =================
// skates (toes point west)
box(-8,2,-2,-4,3,0,BLACK); box(-9,2,-1,-9,3,-1,BLACK); box(-7,4,-2,-5,4,0,BLACK);
box(-8,3,-1,-7,3,-1,WHITE);
put(-8,1,-1,BLACK); put(-4,1,-1,BLACK); box(-9,0,-1,-3,0,-1,IRON);
box(5,2,0,9,3,2,BLACK); box(4,2,1,4,3,1,BLACK); box(6,4,0,8,4,2,BLACK);
box(5,3,1,6,3,1,WHITE);
put(5,1,1,BLACK); put(9,1,1,BLACK); box(3,0,1,10,0,1,IRON);

// legs
const sock = (x,y,z) => (y % 2 === 1) ? RED : WHITE;
tube([-6,5,-1],[-6,8,-1],1.5,sock);
tube([7,5,1],[5,8,1],1.5,sock);
tube([-6,8,-1],[-2,12,0],1.9,BLUE);
tube([5,8,1],[2,12,0],1.9,BLUE);
ball(-6,8,-2,1.3,WHITE);
ball(5,8,0,1.3,WHITE);
box(-3,10,-2,3,11,2,BLUE);
box(-3,11,-2,3,11,-2,RED);

// torso (jersey)
for (let y=12; y<=16; y++) box(-4,y,-2,4,y,2,(y===12||y===15)?WHITE:RED);
box(-5,17,-2,5,18,2,RED);
box(-3,19,-2,3,19,2,RED);
box(-2,19,-2,0,19,0,WHITE);
// crest
box(-3,16,-3,-1,18,-3,WHITE); put(-2,17,-3,YELLOW);
// shoulder pads
ball(-5,18,-1,2.1,RED); ball(5,18,-1,2.1,RED);
box(-7,19,-1,-3,19,-1,WHITE); box(3,19,-1,7,19,-1,WHITE);

// head + helmet
box(-2,20,-2,0,20,0,PINK);
box(-3,21,-3,1,25,1,(x,y,z)=>{
  const ex = Math.abs(x+1)===2, ez = Math.abs(z+1)===2;
  if (y===25 && (ex||ez)) return null;
  if (y===21 && ex && ez) return null;
  return BLACK;
});
box(-2,21,-3,0,23,-3,PINK);
put(-2,21,-3,BLACK); put(0,21,-3,BLACK); put(-1,21,-3,RED);
put(-2,23,-3,BLACK); put(0,23,-3,BLACK);
box(-2,22,-4,0,24,-4,GLASS);
box(-1,25,-2,-1,25,0,WHITE); put(-1,24,-3,WHITE);
box(-1,22,1,-1,24,1,WHITE);

// stick (wound up high behind the shoulder)
tube([-3,12,-4],[13,28,-4],0.8,(x,y,z)=> x<=-2 ? WHITE : PLANKS);
box(13,27,-4,18,27,-4,BLACK); box(13,28,-4,18,28,-4,WHITE);
put(18,28,-4,BLACK);

// arms + gloves
tube([-5,18,-1],[-6,15,-3],1.5,RED);
ball(-6,15,-3,1.7,BLACK);
tube([-6,15,-3],[-1,14,-4],1.3,RED);
ball(-1,14,-4,1.6,BLACK);
tube([5,18,-1],[8,18,-3],1.5,RED);
ball(8,18,-3,1.7,BLACK);
tube([8,18,-3],[5,20,-4],1.3,RED);
ball(5,20,-4,1.6,BLACK);

// pucks & ice spray
box(-13,0,-4,-12,0,-3,BLACK);
box(-14,0,-9,-13,0,-8,BLACK);
box(11,0,-7,12,0,-6,BLACK); box(11,1,-7,12,1,-6,BLACK);
box(13,0,6,14,0,7,BLACK);
for (let i=0;i<26;i++){
  const x = 10 + hash(i,1)*7, z = -3 + hash(i,2)*8, y = Math.floor(hash(i,3)*hash(i,4)*4);
  put(x,y,z,SNOW);
}
for (let i=0;i<12;i++){
  const x = -15 + hash(i,5)*5, z = -4 + hash(i,6)*6, y = Math.floor(hash(i,7)*2.5);
  put(x,y,z,SNOW);
}

// ================= NET (west end) =================
const NX1=-17, NX2=-20;
const topY = x => Math.round(8 - 4*(NX1-x)/3);
for (let y=0;y<=8;y++){ put(NX1,y,-6,RED); put(NX1,y,6,RED); }
box(NX1,8,-6,NX1,8,6,RED);
for (let y=0;y<=4;y++){ put(NX2,y,-6,RED); put(NX2,y,6,RED); }
box(NX2,4,-6,NX2,4,6,RED);
box(NX2,0,-6,NX1,0,-6,RED); box(NX2,0,6,NX1,0,6,RED);
for (let x=-19;x<=-18;x++){ put(x,topY(x),-6,RED); put(x,topY(x),6,RED); }
const mesh = (x,y,z)=> ((x+y+z)%2===0) ? WHITE : null;
for (let y=0;y<=3;y++) for (let z=-5;z<=5;z++) put(NX2,y,z,mesh(NX2,y,z));
for (let x=-19;x<=-18;x++) for (let z=-5;z<=5;z++) put(x,topY(x),z,mesh(x,topY(x),z));
for (let x=-19;x<=-18;x++) for (let y=1;y<topY(x);y++){ put(x,y,-6,mesh(x,y,-6)); put(x,y,6,mesh(x,y,6)); }

// ================= LIGHT TOWERS =================
for (const sx of [-1,1]) for (const zz of [-14,22]) {
  const x = sx*20;
  box(x,0,zz,x,17,zz,IRON);
  box(x-1,18,zz-1,x+1,19,zz,GLOWSTONE);
  box(x-1,20,zz-1,x+1,20,zz,IRON);
}

// ================= RINK SHAPE =================
const HX=21, HZ=12, CR=5;
const inside = (x,z) => {
  if (Math.abs(x)>HX || Math.abs(z)>HZ) return false;
  const dx = Math.max(Math.abs(x)-(HX-CR),0), dz = Math.max(Math.abs(z)-(HZ-CR),0);
  return dx*dx+dz*dz <= CR*CR;
};
// boards + glass
for (let x=-HX;x<=HX;x++) for (let z=-HZ;z<=HZ;z++) {
  if (!inside(x,z)) continue;
  if (inside(x+1,z)&&inside(x-1,z)&&inside(x,z+1)&&inside(x,z-1)) continue;
  const seg = Math.floor((x+22)/6)%2;
  put(x,0,z, seg ? BLUE : WHITE);
  put(x,1,z, RED);
  if (z > -8) {
    const post = ((x+22)%6===0);
    put(x,2,z,post?IRON:GLASS); put(x,3,z,post?IRON:GLASS);
  }
}

// ================= STANDS (south) =================
const shirts = [RED,BLUE,WHITE,YELLOW,GREEN,ORANGE,PURPLE,RED,LIGHT_BLUE,BLUE];
for (let i=0;i<4;i++){
  const z0 = 14+2*i;
  box(-21,i,z0,21,i,z0+1,(x,y,z)=> (x%7===0)?LIGHT_GRAY:GRAY);
  for (let x=-21;x<=21;x++){
    if (hash(x,i,9) < 0.2) continue;
    const c = shirts[Math.floor(hash(x,i,3)*shirts.length)];
    put(x,i+1,z0+1,c); put(x,i+2,z0+1,c);
    put(x,i+3,z0+1, hash(x,i,5)<0.3 ? BROWN : PINK);
  }
}

// ================= ICE FLOOR =================
for (let x=-HX;x<=HX;x++) for (let z=-HZ;z<=HZ;z++) {
  if (!inside(x,z)) continue;
  let c = MARBLE;
  const d0 = Math.hypot(x,z);
  if (x===0) c = RED;
  if (x===8||x===9||x===-8||x===-9) c = BLUE;
  if (Math.abs(d0-7)<0.6) c = RED;
  if (d0<1.4) c = BLUE;
  if (x===-17||x===17) c = RED;
  if (x>=-17 && Math.hypot(x+17,z)<=5.5) c = LIGHT_BLUE;
  put(x,-1,z,c);
}
for (let k=0;k<3;k++) for (let a=0;a<=1;a+=0.02){
  const x = 18 - 28*a - k*2, z = 5 + 5*Math.sin(a*3.14+k) - k*3;
  if (inside(Math.round(x),Math.round(z)) && Math.round(x)!==0) put(x,-1,z,ICE);
}

// ================= EMIT =================
cube(-22,0,-22,22,9,22,AIR);
let n=0;
for (const [k,id] of M) {
  const [x,y,z]=k.split(',').map(Number);
  if (id===AIR) { block(x,y,z,AIR); continue; }
  if (n>=3990) continue;
  n++; block(x,y,z,id);
}