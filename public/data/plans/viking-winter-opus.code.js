// viking-winter-opus — prompt:
// a Viking warrior in a snowstorm...

function h(x,y,z){ const n=Math.sin(x*127.1+y*269.5+z*311.7)*43758.5453; return n-Math.floor(n); }
function put(x,y,z,id){ block(x,y,z, typeof id==='function'? id(x,y,z): id); }
function shell(x1,y1,z1,x2,y2,z2,id){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)
    if(x===x1||x===x2||y===y1||y===y2||z===z1||z===z2) put(x,y,z,id);
}
function vdisk(cx,cy,z,r,fn){
  for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++){
    const dx=x-cx, dy=y-cy, d=Math.sqrt(dx*dx+dy*dy);
    if(d<=r){ const id=fn(dx,dy,d); if(id!==null) block(x,y,z,id); }
  }
}
function thick(x1,y1,z1,x2,y2,z2,id,offs){ for(const o of offs) line(x1+o[0],y1+o[1],z1+o[2],x2+o[0],y2+o[1],z2+o[2],id); }

// ---- clear old trees from the site
cube(-19,1,-19,19,9,19,AIR);

// ---- snowfield
for(let x=-19;x<=19;x++)for(let z=-19;z<=19;z++){
  const d=Math.sqrt(x*x+z*z);
  if(d<=15+h(x,0,z)*2.5) block(x,0,z,SNOW);
}
// wind-blown drifts (wind from the west)
const drifts=[[-6,-11,4,2],[7,-13,5,2],[-15,5,3,2],[4,9,4,2],[-2,-16,4,1.5]];
for(const [cx,cz,rx,rz] of drifts){
  for(let x=cx-rx;x<=cx+rx;x++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const e=((x-cx)/rx)**2+((z-cz)/rz)**2;
    if(e<=1){ block(x,1,z,SNOW); if(e<0.3) block(x,2,z,SNOW); }
  }
}

// ================= VIKING WARRIOR =================
// boots + fur cuffs
cube(-4,1,0,-2,3,4,BROWN); cube(2,1,0,4,3,4,BROWN);
cube(-5,3,1,-1,3,5,LIGHT_GRAY); cube(1,3,1,5,3,5,LIGHT_GRAY);
block(-3,4,0,SNOW); block(3,4,0,SNOW);
// legs with wraps
cube(-4,4,2,-2,7,4,GRAY); cube(2,4,2,4,7,4,GRAY);
for(let y=4;y<=5;y++){ block(-4+(y%3),y,2,BROWN); block(2+(y%3),y,2,BROWN); }
// tunic skirt
shell(-5,6,1,5,9,5,BLUE);
for(let x=-5;x<=5;x++) block(x,6,1,(x&1)?GOLD:RED);
// belt + buckle + pouch
line(-5,10,1,5,10,1,BROWN); line(-5,10,5,5,10,5,BROWN); line(-5,10,1,-5,10,5,BROWN); line(5,10,1,5,10,5,BROWN);
cube(-1,10,0,1,10,0,GOLD);
cube(3,8,0,4,9,0,BROWN); block(3,9,0,GOLD);
// chainmail torso
shell(-4,11,1,4,16,5,(x,y,z)=>h(x,y,z)<0.25?GRAY:IRON);
line(-4,16,0,4,11,0,BROWN); // baldric
// cape streaming east in the wind
for(let y=17;y>=3;y--){
  const t=(17-y)/14;
  const sx=Math.round(t*t*7);
  const x1=-5+sx, x2=5+sx+Math.round(t*2);
  for(let x=x1;x<=x2;x++){
    if(y<=4 && h(x,y,9)<0.35) continue;
    const z=6+Math.round(t*2.5+Math.sin(x*0.9+y*0.4)*0.6*t);
    block(x,y,z,(x===x2&&y<16)?GOLD:RED);
  }
}
// bear-fur mantle with snow on the windward side
for(let y=16;y<=18;y++){
  const rx=y===18?4.8:6.5, rz=y===18?2.8:3.6;
  for(let x=-7;x<=7;x++)for(let z=-1;z<=7;z++){
    const e=(x/rx)**2+((z-3)/rz)**2;
    if(e>1) continue;
    if(y===16 && e<0.5) continue;
    const e18=(x/4.8)**2+((z-3)/2.8)**2;
    if(y===17 && e18<=1) continue;
    if(y===18 && x>=-2&&x<=2&&z>=0&&z<=4) continue;
    let id=h(x,y,z)<0.3?GRAY:BROWN;
    if(y===18 && h(x,9,z)<0.45) id=SNOW;
    if(y===17 && x<0 && h(x,9,z)<0.4) id=SNOW;
    block(x,y,z,id);
  }
}
block(-3,17,-1,GOLD); block(3,17,-1,GOLD); // cloak brooches
// head
shell(-2,18,0,2,23,4,SAND);
block(-1,21,0,LIGHT_BLUE); block(1,21,0,LIGHT_BLUE);
for(const s of [-2,2]) for(let y=18;y<=21;y++) for(let z=0;z<=2;z++) if(!(y===21&&z===0)) block(s,y,z,ORANGE);
// nose, moustache, war-cry mouth
block(0,20,-1,SAND);
block(-2,20,-1,ORANGE); block(-1,20,-1,ORANGE); block(1,20,-1,ORANGE); block(2,20,-1,ORANGE);
block(-2,19,-1,ORANGE); block(-1,19,-1,ORANGE); block(0,19,-1,BLACK); block(1,19,-1,ORANGE); block(2,19,-1,ORANGE);
// beard
cube(-2,15,-1,2,18,-1,ORANGE); cube(-1,15,-2,1,18,-2,ORANGE); cube(-1,14,-1,1,14,-1,ORANGE);
block(0,18,-2,BLACK);
for(const s of [-1,1]){ line(s,11,0,s,13,0,ORANGE); block(s,11,0,GOLD); }
block(-2,16,-1,WHITE); block(1,17,-2,WHITE); block(0,15,-2,WHITE); // frost in the beard
// hair at back
cube(-2,17,5,2,22,5,ORANGE); line(0,16,6,0,13,6,ORANGE);
// frozen breath
block(0,19,-3,STEAM);
// helmet: gold band, iron dome, spectacle guard
for(let x=-3;x<=3;x++)for(let z=-1;z<=5;z++) if(x===-3||x===3||z===-1||z===5){ block(x,22,z,GOLD); block(x,23,z,IRON); }
for(let x=-2;x<=2;x++)for(let z=0;z<=4;z++) if(!((x===-2||x===2)&&(z===0||z===4))) block(x,24,z,IRON);
cube(-1,25,1,1,25,3,IRON); line(0,25,0,0,25,4,GOLD); block(0,26,2,GOLD);
block(-1,25,1,SNOW); block(-1,25,2,SNOW); block(-2,24,1,SNOW); block(-2,24,2,SNOW); block(-3,23,1,SNOW);
block(0,21,-1,IRON); block(-2,21,-1,IRON); block(2,21,-1,IRON); block(0,22,-1,IRON);
// horns
const horn=[[4,23,2,WHITE],[4,24,2,WHITE],[5,24,2,WHITE],[5,25,2,SAND],[6,25,1,SAND],[6,26,1,SAND],[6,27,0,BROWN],[5,28,0,BLACK]];
for(const s of [-1,1]) for(const [x,y,z,id] of horn) block(s*x,y,z,id);
block(-4,23,1,WHITE); block(4,23,1,WHITE);
// left arm -> round shield
thick(-5,16,2,-6,12,2,IRON,[[0,0,0],[-1,0,0],[0,0,1],[-1,0,1]]);
thick(-6,12,2,-6,12,-1,BROWN,[[0,0,0],[-1,0,0],[0,-1,0],[-1,-1,0]]);
cube(-7,11,-2,-6,12,-2,SAND);
vdisk(-7,11,-3,4.5,(dx,dy,d)=>{
  if(d>3.55) return (dx<-3 && dy>1 && dy<3)?null:IRON;
  if(d<1.2) return GOLD;
  const a=Math.atan2(dy,dx)+d*0.45;
  const seg=Math.floor((a+Math.PI*4)/(Math.PI/3))%2;
  return seg?RED:WHITE;
});
block(-7,11,-4,GOLD);
for(let x=-8;x<=-6;x++) block(x,16,-3,SNOW);
// right arm raised, axe aloft
thick(5,15,2,8,20,2,IRON,[[0,0,0],[1,0,0],[0,0,1],[1,0,1]]);
cube(8,20,2,9,23,3,BROWN);
block(8,22,1,GOLD); block(9,22,1,GOLD);
for(let y=24;y<=25;y++){ block(8,y,2,SAND); block(10,y,2,SAND); block(9,y,1,SAND); block(9,y,3,SAND); }
line(9,24,2,9,32,2,OAK_LOG); block(9,33,2,GOLD);
const axe=[[10,29,31],[11,29,31],[12,28,32],[13,27,33],[14,26,33]];
for(const [x,y1,y2] of axe) for(let y=y1;y<=y2;y++) block(x,y,2,x===14?MARBLE:IRON);
cube(10,29,1,10,31,3,IRON); block(11,30,2,GOLD);
block(8,30,2,IRON); block(8,31,2,IRON); block(7,30,2,IRON);
block(15,31,2,ELECTRIC); block(15,27,2,ELECTRIC);

// ================= WOLF COMPANION (howling) =================
sphere(12,2,4,2,GRAY);
cube(11,1,1,13,6,3,GRAY);
cube(11,3,0,13,6,0,LIGHT_GRAY);
cube(10,6,0,14,6,3,LIGHT_GRAY);
cube(11,1,0,11,2,0,GRAY); cube(13,1,0,13,2,0,GRAY);
block(11,1,-1,GRAY); block(13,1,-1,GRAY);
cube(11,7,0,13,9,2,GRAY);
block(12,7,-1,BLACK); block(12,8,-1,LIGHT_GRAY); block(12,9,-1,LIGHT_GRAY); block(12,10,-1,BLACK);
block(11,9,0,YELLOW); block(13,9,0,YELLOW);
block(11,10,2,GRAY); block(13,10,2,GRAY);
line(14,1,6,16,1,3,GRAY); block(16,1,2,WHITE);
block(12,10,1,SNOW); block(12,5,5,SNOW);

// ================= RUNE STONE =================
cube(15,1,-9,17,8,-8,STONE); line(16,9,-9,16,9,-8,STONE);
block(15,9,-9,SNOW); block(15,9,-8,SNOW); block(17,9,-9,SNOW); block(17,9,-8,SNOW); block(16,10,-9,SNOW); block(16,10,-8,SNOW);
block(16,7,-9,NEON_BLUE); block(16,4,-9,NEON_BLUE);
block(15,6,-9,LIGHT_BLUE); block(17,6,-9,LIGHT_BLUE); block(15,3,-9,LIGHT_BLUE); block(17,3,-9,LIGHT_BLUE); block(16,5,-9,LIGHT_BLUE);

// ================= CAMPFIRE =================
for(let x=-16;x<=-10;x++)for(let z=-9;z<=-3;z++){ const d=Math.hypot(x+13,z+6); if(d>1.4&&d<2.3) block(x,1,z,h(x,1,z)<0.5?COBBLE:STONE); }
line(-14,1,-7,-12,1,-5,OAK_LOG); line(-14,1,-5,-12,1,-7,OAK_LOG);
block(-13,1,-6,LAVA);
block(-13,2,-6,FIRE); block(-12,2,-6,FIRE);
line(-17,1,-8,-17,1,-4,OAK_LOG); line(-17,2,-7,-17,2,-5,SNOW);

// ================= RAVEN BANNER =================
line(-14,1,8,-14,20,8,OAK_LOG); block(-14,21,8,GOLD);
const raven=new Set(["-12,20","-11,19","-10,19","-9,19","-8,20","-10,18","-11,18","-11,17"]);
for(let y=14;y<=20;y++){
  const L=y-13;
  for(let x=-13;x<=-13+L-1;x++){
    const z=8+Math.round(Math.sin((x+14)*1.1+y*0.2)*0.7);
    block(x,y,z, x===-13+L-1?RED:(raven.has(x+","+y)?BLACK:WHITE));
  }
}

// ================= SNOWY PINES =================
function rAt(y,H){ if(y>H) return -1; const k=(y-3)%3; return ((H-y)*0.3+1.2)*(1-k*0.28); }
function pine(px,pz,H){
  line(px,1,pz,px,H,pz,OAK_LOG);
  for(let y=3;y<=H;y++){
    const r=rAt(y,H), rn=rAt(y+1,H), R=Math.ceil(r);
    for(let x=-R;x<=R;x++)for(let z=-R;z<=R;z++){
      const d=Math.sqrt(x*x+z*z); if(d>r) continue;
      const top=d>rn;
      block(px+x,y,pz+z, top&&h(px+x,y,pz+z)<0.75?SNOW:(h(x,y,z)<0.5?GREEN:LEAVES));
    }
  }
  block(px,H+1,pz,SNOW);
}
pine(-18,3,14); pine(18,1,13);

// ================= BEACHED LONGSHIP =================
const W=[0,1,2,3,3];
for(let x=-15;x<=13;x++){
  const t=Math.min(1,(x+16)/4,(14-x)/4);
  for(let y=1;y<=4;y++){
    const w=Math.max(0,Math.round(W[y]*t));
    if(y===1){ for(let z=15-w;z<=15+w;z++) block(x,y,z,BROWN); }
    else { const id=y===4?OAK_LOG:(y%2?BROWN:PLANKS); block(x,y,15-w,id); block(x,y,15+w,id); }
    if(y===3 && w>=2) for(let z=15-w+1;z<=15+w-1;z++) block(x,y,z,SNOW);
  }
  if(h(x,2,11)<0.7){ block(x,1,13,SNOW); block(x,1,12,SNOW); }
  if(h(x,3,11)<0.4) block(x,2,12,SNOW);
}
const cols=[RED,YELLOW,BLUE,WHITE,RED];
[-12,-8,-4,4,8].forEach((cx,i)=>vdisk(cx,4,11,1.5,(dx,dy,d)=>d<0.5?IRON:cols[i]));
const neck=[[14,4],[15,5],[15,6],[16,7],[16,8],[16,9],[16,10]];
for(const [x,y] of neck) block(x,y,15,OAK_LOG);
cube(16,11,14,18,12,16,BROWN);
block(19,11,15,BROWN); block(20,11,15,BROWN); block(20,10,15,WHITE); block(19,10,15,WHITE);
block(15,12,15,GOLD); block(16,13,15,GOLD); block(17,13,15,GOLD);
block(18,12,14,NEON_RED);
const stern=[[-16,4],[-17,5],[-17,6],[-17,7],[-16,8],[-15,8],[-15,7]];
for(const [x,y] of stern) block(x,y,15,OAK_LOG);