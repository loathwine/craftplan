// frost-phoenix-opus — prompt:
// a frost phoenix...

const H=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
const M=new Map();
const P=(x,y,z,id)=>{x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;M.set(x+','+y+','+z,id);};
const ell=(cx,cy,cz,rx,ry,rz,fn)=>{for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){const d=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;if(d<=1){const id=typeof fn==='function'?fn(x,y,z,d):fn;if(id!=null)P(x,y,z,id);}}};
const Ln=(a,b,c,d,e,f,fn)=>{const n=Math.max(Math.abs(d-a),Math.abs(e-b),Math.abs(f-c),1);for(let i=0;i<=n;i++){const t=i/n;P(a+(d-a)*t,b+(e-b)*t,c+(f-c)*t,typeof fn==='function'?fn(t):fn);}};

const CZ=2;
// clear trees around the site (free)
cylinder(0,0,CZ,13,10,AIR);
cube(-13,0,8,13,9,22,AIR);

// ---- frozen ground ----
for(let x=-14;x<=14;x++)for(let z=CZ-14;z<=CZ+14;z++){
  const d=Math.hypot(x,z-CZ);
  if(d<=11||(d<=13.5&&H(x,7,z)<0.5)){const h=H(x,3,z);P(x,-1,z,h<0.06?ICE:h<0.14?WHITE:SNOW);}
}
// frozen ponds
for(const [px,pz,pr] of [[-7,-6,2.3],[8,-5,1.7]])
  for(let x=Math.floor(px-pr);x<=Math.ceil(px+pr);x++)for(let z=Math.floor(pz-pr);z<=Math.ceil(pz+pr);z++)
    if(Math.hypot(x-px,z-pz)<=pr)P(x,-1,z,ICE);

// ---- ice crag perch ----
for(let y=-1;y<=8;y++){
  const r=Math.max(3.5,7-(y+1)*0.45), rn=Math.max(3.5,7-(y+2)*0.45);
  for(let x=-9;x<=9;x++)for(let z=CZ-9;z<=CZ+9;z++){
    const d=Math.hypot(x,z-CZ);const n=H(x,y>>1,z)*1.4;
    if(d>r+n-0.7)continue;
    const nn=H(x,(y+1)>>1,z)*1.4;
    const top=y===8||d>rn+nn-0.7;
    if(!top&&d<r-2)continue;
    let id;const h=H(x,y,z+7);
    if(top)id=SNOW;
    else if(y<2)id=h<0.4?STONE:h<0.65?COBBLE:h<0.85?SNOW:LIGHT_BLUE;
    else id=h<0.3?ICE:h<0.6?LIGHT_BLUE:h<0.85?WHITE:CYAN;
    P(x,y,z,id);
  }
}

// ---- ice spikes ring ----
const spike=(bx,bz,a,hgt)=>{
  for(let i=0;i<=hgt;i++){
    const w=Math.floor((hgt-i)/3.2);
    const cx=bx+Math.sin(a)*0.3*i, cz=bz+Math.cos(a)*0.3*i;
    const id=i<hgt*0.35?LIGHT_BLUE:i<hgt*0.8?ICE:WHITE;
    for(let dx=-w;dx<=w;dx++)for(let dz=-w;dz<=w;dz++)if(Math.abs(dx)+Math.abs(dz)<=w)P(cx+dx,-1+i,cz+dz,id);
  }
};
for(let k=0;k<9;k++){
  const a=k/9*Math.PI*2+0.3, rr=8.5+H(k,1,1)*2;
  const bx=Math.sin(a)*rr, bz=CZ+Math.cos(a)*rr;
  const front=Math.cos(a)<-0.5;
  const hgt=Math.round(front?4+H(k,2,2)*2:6+H(k,3,3)*4);
  spike(bx,bz,a,hgt);
  spike(bx+Math.cos(a)*1.8,bz-Math.sin(a)*1.8,a+0.4,Math.max(2,Math.round(hgt*0.5)));
}

// ---- legs & talons ----
for(const s of [-1,1]){
  ell(1.8*s,12.5,3,1.4,1.4,1.4,WHITE);
  Ln(2*s,12,3,2*s,9,2,IRON);Ln(1*s,12,3,1*s,10,2,IRON);
  Ln(2*s,9,2,2*s,9,0,IRON);P(2*s,9,-1,OBSIDIAN);
  Ln(2*s,9,2,3*s,9,0,IRON);P(3*s,9,-1,OBSIDIAN);
  Ln(2*s,9,2,1*s,9,0,IRON);P(1*s,9,-1,OBSIDIAN);
  Ln(2*s,9,2,2*s,9,4,IRON);P(2*s,9,5,OBSIDIAN);
}

// ---- tail streamers ----
const dxs=[-11,-5.5,0,5.5,11], lift=[0,2,4,2,0];
for(let k=0;k<5;k++){
  let ex=0,ey=0,ez=0;
  for(let t=0;t<=1.0001;t+=0.025){
    const x=dxs[k]*Math.pow(t,1.1)+Math.sin(t*Math.PI*2+k)*1.2*t;
    const y=12-12*t+(10+lift[k])*t*t;
    const z=5+16*t;
    const r=1.3-0.5*t;
    const id=t<0.3?LIGHT_BLUE:t<0.6?CYAN:t<0.85?BLUE:WHITE;
    ell(x,y,z,r,r,r,id);
    ex=x;ey=y;ez=z;
  }
  ell(ex,ey+0.5,ez,1.7,1.7,1.4,(x,y,z)=>H(x,y,z)<0.45?ICE:WHITE);
  P(ex,ey+2,ez,ICE);P(ex,ey+3,ez,ICE);
  P(ex,ey+0.5,ez-1.4,NEON_BLUE);
}

// ---- body ----
ell(0,16,3,3.5,5.2,3,(x,y,z)=>{
  if(z<=1&&Math.abs(x)<=2&&y>=12&&y<=20)return H(x,y,z)<0.2?LIGHT_BLUE:WHITE;
  if(y<=12)return WHITE;
  if(z>=5&&H(x,y,z)<0.35)return CYAN;
  return LIGHT_BLUE;
});
// neck
for(let t=0;t<=1.0001;t+=0.125){
  const cy=20.5+4*t, cz=2.5-3*t, r=2.5-0.5*t;
  ell(0,cy,cz,r,r,r,(x,y,z)=>z<cz-0.8?WHITE:LIGHT_BLUE);
}
// mane sweeping down the back of the neck
for(let dx=-1;dx<=1;dx++)Ln(dx,26,1,dx*2,20,6.5,t=>t<0.4?LIGHT_BLUE:t<0.8?CYAN:BLUE);
// head
ell(0,26,-1,2.3,2.1,2.7,(x,y,z)=>y>=28?LIGHT_BLUE:(z>0?LIGHT_BLUE:WHITE));
// beak
cube(0,0,0,0,0,0,AIR);
for(let x=-1;x<=1;x++){P(x,25,-4,IRON);P(x,26,-4,IRON);}
P(0,25,-5,IRON);P(0,26,-5,IRON);P(0,25,-6,IRON);P(0,24,-6,IRON);P(0,24,-4,GRAY);
// eyes + brows
for(const s of [-1,1]){P(2*s,27,-2,NEON_BLUE);P(2*s,28,-2,BLUE);P(2*s,28,-1,BLUE);P(2*s,26,-1,CYAN);}
// crest plumes
for(let dx=-2;dx<=2;dx++){
  const ey=33-Math.abs(dx), ez=3+Math.abs(dx)*1.5;
  Ln(dx,28,-1,dx*3,ey,ez,t=>t<0.5?CYAN:t<0.85?BLUE:ICE);
}
P(0,33,3,NEON_BLUE);

// ---- wings ----
for(const s of [-1,1]){
  for(let i=0;i<=18;i++){
    const u=i/18, x=s*(3+i);
    let yTop=Math.round(21+12*Math.sin(u*Math.PI*0.55));
    if(yTop>32)yTop=32;
    if(i>=17)yTop-=(i-16);
    const z0=Math.round(3+2*u-5*u*u);
    let L=Math.round(5+13*u+[2,0,-1][i%3]);
    if(i>=16)L-=(i-15)*2;
    const yBot=yTop-L;
    for(let y=yBot;y<=yTop;y++){
      const d=yTop-y;let id;
      if(d<=1)id=WHITE;
      else if(d<=3)id=(i%2?WHITE:LIGHT_BLUE);
      else if(y-yBot<=1)id=(y===yBot?ICE:BLUE);
      else if(d<=L*0.5)id=LIGHT_BLUE;
      else id=(i%3===0?LIGHT_BLUE:CYAN);
      P(x,y,z0,id);
      if(i<14||d<4)P(x,y,z0+1,d<=3?WHITE:(i%3===0?CYAN:LIGHT_BLUE));
    }
    if(i<16)for(let y=yTop-3;y<=yTop-1;y++)P(x,y,z0-1,y===yTop-3?LIGHT_BLUE:WHITE);
    P(x,yTop+1,z0,i%2?WHITE:MARBLE);
    if(i%4===2){P(x,yTop+2,z0,ICE);if(i%8===6)P(x,yTop+3,z0,ICE);}
    if(i>6&&i%5===3){P(x,yBot-1,z0,ICE);P(x,yBot-2,z0,ICE);}
  }
}

// ---- floating snowflakes ----
const flake=(cx,cy,cz)=>{
  P(cx,cy,cz,WHITE);
  for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){P(cx+a,cy+b,cz,WHITE);P(cx+2*a,cy+2*b,cz,ICE);}
  for(const [a,b] of [[1,1],[-1,1],[1,-1],[-1,-1]])P(cx+a,cy+b,cz,ICE);
};
flake(-15,8,-3);flake(15,7,-5);flake(-19,6,9);flake(19,5,11);

// ---- drifting ice shards ----
for(const [x,y,z] of [[-10,23,-5],[11,26,-4],[-6,31,-2],[7,31,-1],[-13,11,-4],[13,12,-6],[-4,14,-6],[5,20,-6]]){
  P(x,y,z,ICE);P(x,y+1,z,ICE);P(x,y+2,z,WHITE);
}

// ---- cold mist at the crag base ----
for(const [x,z] of [[-6,-5],[6,-5],[-9,4],[9,5],[-4,10],[4,11]])P(x,0,z,STEAM);

for(const [k,id] of M){const [x,y,z]=k.split(',').map(Number);block(x,y,z,id);}