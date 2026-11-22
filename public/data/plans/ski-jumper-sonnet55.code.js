// ski-jumper-sonnet55 — prompt:
// a ski jumper flying off a ski jump...

const J = 2;
const ty = x => { const t = x + 16; return Math.round(24 - (0.9*t - 0.3*t*t/19)); };
const hh = x => Math.round(10*Math.pow(1-(Math.max(x,4)-4)/19,1.4));
const thick = (x1,y1,z1,x2,y2,z2,id,h,w)=>{ for(let a=0;a<h;a++)for(let b=0;b<w;b++) line(x1,y1+a,z1+b,x2,y2+a,z2+b,id); };

// ---- clear trees in footprints
cube(-22,0,-5,4,12,5,AIR);
cube(3,0,-12,22,9,9,AIR);

// ---- jumper (V-style) -- placed early so budget never clips the hero
thick(4,13+J,-2,19,17+J,-6,BLUE,1,2);
thick(4,13+J,1,19,17+J,5,BLUE,1,2);
cube(20,20,-6,20,20,-5,BLUE); cube(20,20,5,20,20,6,BLUE);
cube(6,16,-3,8,18,-2,BLACK); cube(6,16,2,8,18,3,BLACK);
thick(7,18,-3,10,20,-1,RED,2,2);
thick(7,18,2,10,20,0,RED,2,2);
cube(9,19,-1,13,21,1,RED);
cube(14,18,-2,15,20,2,RED);
cube(16,18,-1,16,19,1,RED);
cube(9,21,0,13,21,0,WHITE);
thick(15,19,-2,11,19,-2,RED,2,1);
thick(15,19,2,11,19,2,RED,2,1);
cube(9,19,-2,10,20,-2,WHITE); cube(9,19,2,10,20,2,WHITE);
sphere(17,19,0,2,WHITE);
cube(18,19,-1,19,19,1,LIGHT_BLUE);
cube(16,19,-2,17,19,-2,BLACK); cube(16,19,2,17,19,2,BLACK);
cube(18,18,-1,19,18,1,PINK);
cube(16,20,0,18,20,0,RED); block(17,21,0,RED);
// snow spray off the lip
for (const [x,y,z] of [[2,15,-1],[1,16,2],[0,15,0],[3,16,-2],[-1,17,1],[5,13,-4],[-3,16,-1],[6,12,4]]) block(x,y,z,SNOW);

// ---- start tower
for (const px of [-21,-16]) for (const pz of [-3,3]) {
  cube(px-1,-1,pz-1,px+1,-1,pz+1,COBBLE);
  cube(px,0,pz,px,21,pz,IRON);
}
for (const y of [6,12,18]) {
  line(-21,y,-3,-16,y,-3,IRON); line(-21,y,3,-16,y,3,IRON);
  line(-21,y,-3,-21,y,3,IRON); line(-16,y,-3,-16,y,3,IRON);
}
const lv=[1,6,12,18,21];
for (let i=0;i<lv.length-1;i++){
  const a=lv[i], b=lv[i+1];
  for (const z of [-3,3]) { line(-21,a,z,-16,b,z,IRON); line(-16,a,z,-21,b,z,IRON); }
}
cube(-22,22,-4,-15,23,4,PLANKS);
hollowCube(-22,24,-3,-18,28,3,PLANKS);
cube(-21,25,-3,-19,27,-3,GLASS);
cube(-21,25,3,-19,27,3,GLASS);
cube(-18,24,-1,-18,26,1,AIR);
cube(-22,29,-4,-17,29,4,RED);
cube(-21,30,-2,-18,30,2,RED);
cube(-20,31,0,-20,33,0,IRON);
cube(-19,32,0,-16,33,0,RED);
cube(-19,31,0,-17,31,0,WHITE);
for (const [x,z] of [[-15,-4],[-15,4],[-22,-4],[-22,4]]) { cube(x,24,z,x,25,z,IRON); block(x,26,z,GLOWSTONE); }
line(-17,24,-4,-15,24,-4,IRON); line(-17,24,4,-15,24,4,IRON);
line(-17,25,-4,-15,25,-4,IRON); line(-17,25,4,-15,25,4,IRON);
cube(-17,24,-1,-17,24,1,RED);

// ---- inrun track
for (let x=-16;x<=3;x++){
  const t=ty(x);
  cube(x,t-2,-3,x,t-1,3,PLANKS);
  for (let z=-2;z<=2;z++) block(x,t,z,(z===-1||z===1)?ICE:SNOW);
  cube(x,t,-3,x,t+1,-3,IRON);
  cube(x,t,3,x,t+1,3,IRON);
}
cube(3,ty(3),-2,3,ty(3),2,RED);

// ---- trestle bents
const bents=[-13,-9,-5,-1,2];
for (const bx of bents){
  const top=ty(bx)-3;
  for (const sz of [-3,3]){
    cube(bx-1,-1,sz-1,bx+1,-1,sz+1,COBBLE);
    cube(bx,0,sz,bx,top,sz,IRON);
  }
  line(bx,top,-3,bx,top,3,IRON);
  const mid=Math.round(top/2);
  line(bx,mid,-3,bx,mid,3,IRON);
  line(bx,1,-3,bx,mid,3,IRON); line(bx,1,3,bx,mid,-3,IRON);
  line(bx,mid,-3,bx,top,3,IRON); line(bx,mid,3,bx,top,-3,IRON);
}
for (let i=0;i<bents.length-1;i++){
  const a=bents[i], b=bents[i+1];
  for (const sz of [-3,3]){
    line(a,1,sz,b,ty(b)-4,sz,IRON);
    line(b,1,sz,a,ty(a)-4,sz,IRON);
    const ym=Math.round(ty(b)/2);
    line(a,ym,sz,b,ym,sz,IRON);
  }
}

// ---- landing hill
for (let x=3;x<=22;x++){
  const h=hh(x), top=Math.max(h,0);
  if (top-2>=-1) cube(x,-1,-4,x,top-2,4,STONE);
  cube(x,Math.max(top-1,-1),-4,x,top,4,SNOW);
  for (const s of [-1,1]){
    cube(x,-1,s*5,x,Math.max(0,h-3),s*5,SNOW);
    cube(x,-1,s*6,x,Math.max(0,h-6),s*6,SNOW);
  }
}
for (const [x,id] of [[9,BLUE],[13,RED],[17,BLUE]]) cube(x,hh(x),-4,x,hh(x),4,id);
// K-line gate arch
for (const s of [-1,1]) cube(13,0,s*6,13,9,s*6,IRON);
for (let z=-6;z<=6;z++){ block(13,8,z,z%2?RED:WHITE); block(13,9,z,z%2?WHITE:RED); }
// barrier + spectators
line(5,0,-8,21,0,-8,PLANKS);
const cols=[RED,BLUE,YELLOW,GREEN,ORANGE,MAGENTA,CYAN,PURPLE];
let ci=0;
for (const x of [6,8,10,11,13,15,16,18,20]){
  const c=cols[ci++%cols.length];
  cube(x,0,-9,x,1,-9,c); block(x,2,-9,PINK);
  if(ci%3===0){ cube(x+1,0,-9,x+1,3,-9,PLANKS); block(x+1,4,-9,c); block(x+2,4,-9,WHITE);}
}

// ---- mountain ridge behind
for (let x=-22;x<=22;x++){
  const h=Math.round(3+3*Math.sin(x*0.28+1)+2*Math.sin(x*0.71+2));
  if(h<0) continue;
  cube(x,-1,12,x,Math.max(h-2,-1),13,STONE);
  cube(x,Math.max(h-1,-1),12,x,h,13,h>=4?SNOW:STONE);
}

// ---- pines
const pine=(x,z,pat)=>{ cube(x,0,z,x,2,z,OAK_LOG); pat.forEach((r,i)=>{ if(r>0) disk(x,3+i,z,r,LEAVES); else block(x,3+i,z,LEAVES); }); };
pine(-12,8,[2,2,1,1,0]); pine(-5,9,[3,2,2,1,0]); pine(6,10,[2,2,1,0]); pine(21,8,[2,2,1,1,0]); pine(-19,9,[2,2,1,0]);

// ---- clouds
const cloud=(cx,cy,cz)=>{ cube(cx-3,cy,cz-1,cx+3,cy,cz+1,WHITE); cube(cx-2,cy+1,cz-1,cx+2,cy+1,cz+1,WHITE); cube(cx-1,cy+2,cz,cx+1,cy+2,cz,WHITE); };
cloud(-8,29,14); cloud(10,28,14); cloud(20,24,14);