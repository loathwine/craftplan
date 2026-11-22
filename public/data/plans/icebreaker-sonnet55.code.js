// icebreaker-sonnet55 — prompt:
// a red icebreaker ship smashing through sea ice...

// Red icebreaker smashing through sea ice
const H=(a,b,s)=>{const n=Math.sin(a*127.1+b*311.7+(s||0)*74.7)*43758.5453;return n-Math.floor(n);};

// clear forest from the site
cube(-22,0,-22,22,9,22,AIR);

// ---------- SEA ICE + CHANNEL ----------
const Z0=-19,Z1=11;
const half=x=>{ if(x<-16) return 10.5; if(x<=6) return 10; if(x<=14) return 10-(x-6)*0.33; return 0; };
const cwid=(x,s)=> half(x)>0 ? half(x)+(H(x,s,3)-0.5)*2 : 0;
const crack=(x,z)=>{
  if(x<15) return false;
  const dx=x-14.5, az=Math.abs(z);
  for(const k of [0.35,0.9,1.8]){
    if(Math.abs(az-k*dx+(H(x,z,9)-0.5)*0.8)<0.55) return true;
  }
  return az<0.5 && dx>1;
};
const isW=(x,z)=>{
  if(z<Z0||z>Z1||x<-22||x>22) return false;
  if(x<=14 && Math.abs(z)<cwid(x,z<0?-1:1)) return true;
  return crack(x,z);
};
for(let x=-22;x<=22;x++){
  for(let z=Z0;z<=Z1;z++){
    if(isW(x,z)){
      block(x,-1,z,WATER);
    } else {
      const r=H(x,z,1);
      const id=r<0.6?SNOW:r<0.85?ICE:r<0.93?LIGHT_BLUE:WHITE;
      block(x,0,z,id);
      if(isW(x+1,z)||isW(x-1,z)||isW(x,z+1)||isW(x,z-1)) block(x,-1,z,ICE);
    }
  }
}

// ---------- BERGS (backdrop) ----------
function berg(cx,cz,r,h,seed){
  const hm={};
  const get=(x,z)=>hm[x+','+z]||0;
  for(let x=cx-r-1;x<=cx+r+1;x++)for(let z=cz-r-1;z<=cz+r+1;z++){
    const d=Math.hypot(x-cx,(z-cz)*1.1)/r;
    if(d<1) hm[x+','+z]=Math.max(1,Math.round(h*(1-d*d)*(0.75+0.5*H(x,z,seed))));
  }
  for(const k in hm){
    const [x,z]=k.split(',').map(Number);
    const hh=hm[k];
    const nb=Math.min(get(x+1,z),get(x-1,z),get(x,z+1),get(x,z-1));
    for(let y=Math.min(nb,hh);y<=hh;y++){
      block(x,y,z, y==hh?SNOW:(H(x,y,seed+z)<0.65?ICE:WHITE));
    }
  }
}
berg(-15,8,5,9,1);
berg(14,8,5,7,2);
berg(-2,10,3,4,3);

// ---------- FLOES IN THE CHANNEL ----------
for(let i=0;i<26;i++){
  const fx=Math.floor(-22+H(i,3,5)*38);
  let fz;
  if(fx<-17) fz=Math.floor((H(i,4,5)*2-1)*8.5);
  else { const s=H(i,4,5)<0.5?-1:1; fz=s*Math.floor(7+H(i,6,5)*2); }
  const lim=cwid(fx,fz<0?-1:1)-1;
  if(Math.abs(fz)>lim) continue;
  const sx=1+Math.floor(H(i,7,5)*2.5), sz=1+Math.floor(H(i,8,5)*2);
  cube(fx,-1,fz,fx+sx-1,-1,fz+sz-1, H(i,9,5)<0.5?ICE:SNOW);
  if(H(i,10,5)>0.6) cube(fx,0,fz,fx+sx-1,0,fz+sz-1,SNOW);
}

// ---------- BOW RUBBLE + SHARDS + RIDGES ----------
for(let x=14;x<=22;x++){
  for(let z=-8;z<=8;z++){
    if(isW(x,z)) continue;
    const d=Math.hypot((x-15.5)*0.9,z);
    if(d>6.5) continue;
    const h=Math.floor((6.5-d)*0.4+H(x,z,7)*1.4);
    for(let y=1;y<=Math.min(h,3);y++){
      block(x,y,z, H(x,z,y+10)<0.5?ICE:(H(x,z,y)<0.5?SNOW:WHITE));
    }
  }
}
for(let i=0;i<22;i++){
  const x=14+Math.floor(H(i,1,20)*8);
  const z=Math.floor((H(i,2,20)-0.5)*14);
  const y=3+Math.floor(H(i,3,20)*5);
  if(x<=15&&Math.abs(z)<3) continue;
  block(x,y,z,i%3?ICE:WHITE);
  if(i%4==0) block(x+1,y,z,ICE);
}
function ridge(x0,z0,x1,z1){
  const n=Math.max(Math.abs(x1-x0),Math.abs(z1-z0));
  for(let i=0;i<=n;i++){
    const x=Math.round(x0+(x1-x0)*i/n), z=Math.round(z0+(z1-z0)*i/n);
    if(isW(x,z)||x<-22||x>22||z<Z0||z>Z1) continue;
    block(x,1,z,SNOW);
    if(H(x,z,30)<0.5) block(x,2,z,ICE);
  }
}
ridge(18,-14,21,-6);
ridge(-20,-14,-6,-16);
ridge(2,-14,13,-12);
ridge(-20,10,-4,9);
ridge(2,9,12,10);

// ---------- HULL ----------
const L0=-16,L1=15;
const hw=(x,y)=>{
  let b=5;
  if(x>6) b=5-Math.round((x-6)*0.55);
  if(x<-13) b=5-Math.round((-13-x)*0.4);
  if(y>=3) b++;
  if(y<=0) b--;
  return Math.max(b,0);
};
for(let x=L0;x<=L1;x++){
  const bot=x>8?-1+Math.floor((x-8)*0.65):-1;
  for(let y=bot;y<=5;y++){
    const w=hw(x,y);
    if(y==5){
      cube(x,5,-w,x,5,w,GRAY);
      block(x,5,-w,RED); block(x,5,w,RED);
      block(x,6,-w,RED); block(x,6,w,RED);
    } else {
      const c=y<=0?BLACK:RED;
      block(x,y,-w,c); block(x,y,w,c);
      if(y==bot&&x>8) cube(x,y,-w,x,y,w,BLACK);
      if(x==L0) cube(x,y,-w,x,y,w,c);
    }
  }
}
// portholes + hawse pipes
for(let x=-12;x<=8;x+=3){ block(x,3,-hw(x,3),BLACK); block(x,3,hw(x,3),BLACK); }
block(11,3,-hw(11,3),BLACK); block(11,3,hw(11,3),BLACK);
// white ice-belt stripe
for(let x=-15;x<=12;x++){ if(x%2==0) block(x,2,-hw(x,2),WHITE); }

// ---------- SUPERSTRUCTURE ----------
function shell(x1,y1,z1,x2,y2,z2,id,roof){
  cube(x1,y1,z1,x2,y2,z1,id); cube(x1,y1,z2,x2,y2,z2,id);
  cube(x1,y1,z1+1,x1,y2,z2-1,id); cube(x2,y1,z1+1,x2,y2,z2-1,id);
  if(roof) cube(x1,y2+1,z1,x2,y2+1,z2,roof);
}
// main deckhouse
shell(-10,6,-3,0,8,3,WHITE,WHITE);
for(let x=-9;x<=-1;x++){ block(x,7,-3,((x+30)%3==0)?WHITE:GLASS); block(x,7,3,GLASS); }
cube(-5,6,-3,-5,7,-3,GRAY);
cube(0,7,-2,0,7,2,GLASS);
// tier 2
shell(-8,10,-2,-1,11,2,WHITE,WHITE);
cube(-7,11,-2,-2,11,-2,GLASS);
cube(-1,11,-1,-1,11,1,GLASS);
// bridge with overhanging roof
cube(0,12,-3,0,12,3,WHITE);
cube(-5,12,-3,-1,12,-3,WHITE);
cube(-5,12,3,-1,12,3,WHITE);
shell(-5,13,-3,0,14,3,WHITE,null);
cube(-4,13,-3,-1,14,-3,GLASS);
cube(0,13,-2,0,14,2,GLASS);
cube(-6,15,-4,1,15,4,LIGHT_GRAY);
block(0,16,-3,YELLOW); block(0,16,3,YELLOW);
// radar mast
line(-3,16,0,-3,20,0,IRON);
cube(-5,20,0,-1,20,0,LIGHT_GRAY);
block(-3,21,0,GLOWSTONE);
// funnel
cylinder(-7,13,0,1.5,4,RED);
cylinder(-7,17,0,1.5,1,WHITE);
cylinder(-7,18,0,1.5,2,BLACK);
block(-7,20,0,STEAM);
block(-7,22,0,STEAM);

// lifeboats on davits
for(const s of [-5,5]){
  cube(-8,7,s,-4,8,s,ORANGE);
  block(-8,6,s,IRON); block(-4,6,s,IRON);
}

// helideck
cube(-17,8,-5,-11,8,5,GRAY);
for(const px of [-16,-12]) for(const pz of [-4,4]) cube(px,6,pz,px,7,pz,IRON);
cube(-16,8,-2,-16,8,2,YELLOW);
cube(-12,8,-2,-12,8,2,YELLOW);
cube(-16,8,0,-12,8,0,YELLOW);
// helicopter
cube(-15,9,-1,-12,10,1,RED);
cube(-11,9,0,-11,10,0,GLASS);
line(-16,10,0,-18,11,0,RED);
block(-13,11,0,GRAY);
line(-16,12,0,-10,12,0,BLACK);
line(-13,12,-3,-13,12,3,BLACK);

// forward deck: containers
cube(2,6,-3,5,7,-2,ORANGE);
cube(2,6,2,5,7,3,BLUE);
cube(3,8,-3,5,8,-2,YELLOW);
// crane
cube(7,6,-3,7,8,-3,YELLOW);
line(7,9,-3,12,13,-3,YELLOW);
line(7,9,-3,3,12,-3,YELLOW);
line(12,13,-3,12,9,-3,BLACK);
block(12,8,-3,ORANGE);
// foremast
line(10,6,0,10,14,0,IRON);
cube(10,12,-2,10,12,2,IRON);
block(10,15,0,GLOWSTONE);
line(10,14,0,15,6,0,IRON);
// windlass
cube(12,6,-1,13,6,1,GRAY);
// frost on deck
for(let i=0;i<9;i++){
  const x=8+Math.floor(H(i,1,40)*6);
  const z=Math.floor((H(i,2,40)-0.5)*4);
  block(x,6,z,SNOW);
}