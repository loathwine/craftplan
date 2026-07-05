// shark-4x-fable — prompt:
// a great white shark...

const vox=new Map();
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;vox.set(x+','+y+','+z,id);}
function rnd(n){const s=Math.sin(n*127.1+43.7)*43758.5453;return s-Math.floor(s);}

// ---- great white breaching: spine from tail (-16,2) up to nose (11,20) ----
const RP=[[0,0.7],[0.06,1.1],[0.2,2.6],[0.4,3.9],[0.55,4.25],[0.7,3.85],[0.82,3.0],[0.9,2.2],[0.97,1.35],[1,0.75]];
function rad(t){for(let i=0;i<RP.length-1;i++){const a=RP[i],b=RP[i+1];if(t<=b[0])return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}return 0.75;}
function sx(t){return -16+27*t;}
function sy(t){return 2+18*t+2.2*Math.sin(Math.PI*t);}
function cutAt(t,wy){return t>0.84?-wy*(1-0.95*(t-0.84)/0.16):-99;}

// clear tree canopy over the lagoon (AIR is free)
for(let y=2;y<=9;y++)disk(0,y,0,22,AIR);

// ocean surface + sand shore + foam ring, ripples, whitecaps
for(let x=-22;x<=22;x++)for(let z=-22;z<=22;z++){
  const d=Math.hypot(x,z);
  if(d<=19.2){
    let id=GLASS;
    const d2=Math.hypot(x+17,z);
    if(d2<5.5&&rnd(x*17+z*29)<0.75)id=SNOW;
    else if(d2<7.5&&rnd(x*13+z*31)<0.3)id=SNOW;
    else if(Math.abs(d2-10)<0.6&&rnd(x*7+z*11)<0.55)id=SNOW;
    else if(Math.abs(d2-14.5)<0.6&&rnd(x*5+z*23)<0.4)id=SNOW;
    else if(rnd(x*37+z*41)<0.025)id=SNOW;
    put(x,1,z,id);
  } else if(d<=21.8) put(x,1,z,SAND);
}

// splash eruption where the tail left the water
for(let i=0;i<34;i++){
  const a=i/34*Math.PI*2;
  const rr=2.2+rnd(i*3+1)*5;
  const px=-16+Math.cos(a)*rr*1.15, pz=Math.sin(a)*rr;
  const h=Math.max(1,Math.round(6-rr*0.6+rnd(i*7+2)*3));
  const col=rnd(i*5+9)<0.3?ICE:GLASS;
  for(let y=2;y<=1+h;y++)put(px,y,pz,y===1+h?SNOW:col);
}
// trailing droplets under the arc of the body
for(let i=0;i<16;i++){
  const t=0.08+i*0.028;
  const px=sx(t)+rnd(i*11+3)*4-2;
  const py=2+rnd(i*5+3)*(sy(t)-3);
  const pz=rnd(i*13+7)*7-3.5;
  put(px,py,pz,rnd(i*3+1)<0.5?GLASS:ICE);
}

// ---- body: elliptical cross-sections, gray back / white belly, gaping mouth ----
const N=135;
for(let i=0;i<=N;i++){
  const t=i/N, r=rad(t), cx=sx(t), cy=sy(t);
  const wz=Math.max(0.55,r*0.82), wy=Math.max(0.55,r*1.05);
  const cut=cutAt(t,wy);
  const zr=Math.ceil(wz+0.45), yr=Math.ceil(wy+0.45);
  for(let z=-zr;z<=zr;z++)for(let dy=-yr;dy<=yr;dy++){
    if((z/(wz+0.45))**2+(dy/(wy+0.45))**2>1)continue;
    if(dy<cut)continue;
    let id;
    if(cut>-90&&t>0.845&&t<0.965&&dy<cut+1.6&&Math.abs(z)<wz*0.85)id=BRICK;
    else if(dy<-0.18*wy)id=SNOW;
    else{id=STONE;if(dy>0.55*wy&&rnd(Math.round(cx)*7+z*13+Math.round(cy+dy)*3)<0.13)id=COBBLE;}
    put(cx,cy+dy,z,id);
  }
}

// lower jaw, hinged open — white outside, red mouth floor
const hx=sx(0.85), hy=sy(0.85)-rad(0.85)*1.05*0.5;
for(let i=2;i<=12;i++){
  const s=i/12, jx=hx+6.4*s, jy=hy-3.1*s;
  const rj=1.7*(1-s)+0.55;
  const wzj=Math.max(0.5,rj), wyj=Math.max(0.5,rj*0.68);
  const zr=Math.ceil(wzj+0.4), yr=Math.ceil(wyj+0.4);
  for(let z=-zr;z<=zr;z++)for(let dy=-yr;dy<=yr;dy++){
    if((z/(wzj+0.4))**2+(dy/(wyj+0.4))**2>1)continue;
    put(jx,jy+dy,z,dy>=wyj*0.25?BRICK:SNOW);
  }
}
// teeth — upper rows hang from the roof, lower rows point up
for(const t of[0.9,0.925,0.95,0.972]){
  const wy=rad(t)*1.05, wz=rad(t)*0.82, cut=cutAt(t,wy);
  const ry=Math.round(sy(t)+cut), zw=Math.max(1,Math.round(wz*0.7));
  for(let z=-zw;z<=zw;z++)if((z+zw)%2===0)put(sx(t),ry-1,z,SNOW);
}
for(const s of[0.4,0.6,0.8]){
  const jx=hx+6.4*s, jy=hy-3.1*s, rj=1.7*(1-s)+0.55;
  const ty=Math.round(jy+Math.max(0.5,rj*0.68));
  const zw=Math.max(1,Math.round(rj*0.6));
  for(let z=-zw;z<=zw;z++)if((z+zw)%2===0)put(jx,ty+1,z,SNOW);
}

// eyes + nostrils
put(8,19,2,OAK_LOG);put(8,19,-2,OAK_LOG);
put(10,20,1,COBBLE);put(10,20,-1,COBBLE);

// gill slits, 5 per side
for(let g=0;g<5;g++){
  const t=0.725+g*0.025, r=rad(t), wz2=r*0.82, wy2=r*1.05;
  for(let dy=-1;dy<=2;dy++){
    const zs=Math.round((wz2+0.3)*Math.sqrt(Math.max(0,1-(dy/wy2)**2)));
    put(sx(t)+dy*0.35,sy(t)+dy,zs,COBBLE);
    put(sx(t)+dy*0.35,sy(t)+dy,-zs,COBBLE);
  }
}

// dorsal fin — swept-back triangle
function triXY(ax,ay,bx,by,cx,cy,id){
  const minx=Math.floor(Math.min(ax,bx,cx)),maxx=Math.ceil(Math.max(ax,bx,cx));
  const miny=Math.floor(Math.min(ay,by,cy)),maxy=Math.ceil(Math.max(ay,by,cy));
  for(let x=minx;x<=maxx;x++)for(let y=miny;y<=maxy;y++){
    const d1=(x-bx)*(ay-by)-(ax-bx)*(y-by);
    const d2=(x-cx)*(by-cy)-(bx-cx)*(y-cy);
    const d3=(x-ax)*(cy-ay)-(cx-ax)*(y-ay);
    const neg=d1<-0.01||d2<-0.01||d3<-0.01, pos=d1>0.01||d2>0.01||d3>0.01;
    if(!(neg&&pos))put(x,y,0,id);
  }
}
triXY(1.5,19.5,-5,15.5,-6.5,25.5,STONE);
// second dorsal + anal fin
for(let h=0;h<3;h++)for(let k=h;k<3;k++)put(-11-k,8+h,0,STONE);
for(let h=0;h<2;h++)for(let k=h;k<2;k++)put(-11-k,3-h,0,STONE);

// pectoral fins, angled down-back-out, white tipped
for(const side of[1,-1])for(let s=0;s<8;s++){
  const px=-0.3-0.85*s, py=12.4-0.85*s, pz=side*(2+1.05*s);
  const w=Math.max(1,Math.round(2.6*(1-s/8.5)));
  const id=s>=6?SNOW:STONE;
  for(let dx=-w;dx<=w;dx++)put(px+dx,py,pz,id);
}
// pelvic fins
for(const side of[1,-1])for(let s=0;s<3;s++)for(let dx=0;dx<2;dx++)
  put(-7-s+dx,Math.round(6-0.7*s),side*(2+s),STONE);

// caudal fin — tall upper lobe, short lower lobe dipping into the sea
for(let y=2;y<=13;y++){
  const q=(y-2)/11, lead=-16-6*Math.pow(q,0.85);
  const w=Math.max(1,Math.round(3.4*(1-q)+0.8));
  for(let k=0;k<=w;k++)put(lead+k,y,0,STONE);
}
for(let y=1;y>=-2;y--){
  const q=(1-y)/3, lead=-16-3.8*q;
  const w=Math.max(1,Math.round(2.4*(1-q)+0.6));
  for(let k=0;k<=w;k++)put(lead+k,y,0,STONE);
}

// the seal it's lunging at, flung just ahead of the jaws
for(let dx=-2;dx<=2;dx++)for(let dy=-1;dy<=1;dy++)for(let dz=-1;dz<=1;dz++)
  if((dx/2.4)**2+(dy/1.3)**2+(dz/1.3)**2<=1)put(15+dx,23+dy,dz,OAK_LOG);
put(17,24,0,OAK_LOG);put(18,24,0,OAK_LOG);
put(12,23,0,OAK_LOG);put(12,24,0,OAK_LOG);

// baitfish scattering from the splash
function fish(x,y,z,dir){put(x,y,z,COBBLE);put(x+dir,y+1,z,COBBLE);put(x+2*dir,y+1,z,COBBLE);put(x+3*dir,y,z,SNOW);}
fish(-11,3,7,1);fish(-13,2,-6,-1);fish(-8,4,4,1);

// gulls overhead
function gull(x,y,z){put(x-1,y+1,z,SNOW);put(x,y,z,SNOW);put(x+1,y+1,z,SNOW);}
gull(2,28,7);gull(-7,30,-5);gull(12,27,-4);

// flush deduped voxels
for(const [k,id] of vox){const p=k.split(',');block(+p[0],+p[1],+p[2],id);}