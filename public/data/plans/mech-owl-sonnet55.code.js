// mech-owl-sonnet55 — prompt:
// a giant mechanical owl...

cube(-16,0,-14,16,9,14,AIR);

const M = new Map();
const put = (x,y,z,id)=>{ x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33) return; M.set(x+','+y+','+z,[x,y,z,id]); };
const cl = (x1,y1,z1,x2,y2,z2,id)=>{ for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++) put(x,y,z,id); };
const ln = (x1,y1,z1,x2,y2,z2,id)=>{ const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1),1);
  for(let i=0;i<=n;i++){ const t=i/n; put(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id); } };

function ell(cx,cy,cz,a,b,c,fn,t){
  const ia=a-t, ib=b-t, ic=c-t;
  for(let x=Math.floor(cx-a);x<=Math.ceil(cx+a);x++)
  for(let y=Math.floor(cy-b);y<=Math.ceil(cy+b);y++)
  for(let z=Math.floor(cz-c);z<=Math.ceil(cz+c);z++){
    const dx=x-cx,dy=y-cy,dz=z-cz;
    if((dx/a)**2+(dy/b)**2+(dz/c)**2>1) continue;
    if((dx/ia)**2+(dy/ib)**2+(dz/ic)**2<1) continue;
    put(x,y,z,fn(x,y,z));
  }
}
function gear(axis,cx,cy,cz,r,teeth,o){
  const th=o.thick||1, rw=o.ringW||1.3, tt=o.toothH||1.5, ns=o.spokes||0, hr=o.hubR||0;
  const R=Math.ceil(r+tt)+1;
  for(let u=-R;u<=R;u++)for(let v=-R;v<=R;v++){
    const d=Math.hypot(u,v); let id=null;
    if(d<=hr) id=o.hub||o.ring;
    else if(d<=r && d>r-rw) id=o.ring;
    else if(d>r && d<=r+tt && teeth>0){
      const a=(Math.atan2(v,u)+Math.PI)/(2*Math.PI)*teeth*2;
      if(Math.floor(a)%2===0) id=o.tooth||o.ring;
    } else if(d<=r-rw && ns>0){
      const a=Math.atan2(v,u);
      for(let i=0;i<ns;i++){ const g=2*Math.PI*i/ns; if(Math.cos(a-g)>0 && Math.abs(Math.sin(a-g))*d<=0.6) id=o.spoke||o.ring; }
    }
    if(id==null) continue;
    for(let l=0;l<th;l++){
      if(axis==='z') put(cx+u,cy+v,cz+l,id);
      else if(axis==='y') put(cx+u,cy+l,cz+v,id);
      else put(cx+l,cy+u,cz+v,id);
    }
  }
}
function discXY(cx,cy,z,r0,r1,id){
  for(let x=Math.floor(cx-r1);x<=Math.ceil(cx+r1);x++)for(let y=Math.floor(cy-r1);y<=Math.ceil(cy+r1);y++){
    const d=Math.hypot(x-cx,y-cy); if(d>=r0&&d<=r1) put(x,y,z,id);
  }
}

// ---------- BASE: big flat gear ----------
gear('y',0,0,0,10,26,{ring:IRON,tooth:COPPER,hubR:8,hub:GRAY,ringW:1.5,toothH:1.8});
gear('y',0,1,0,8,0,{ring:COPPER,hubR:8,hub:IRON,ringW:2});
gear('y',0,1,0,8.2,0,{ring:GOLD,ringW:1});
for(let i=0;i<10;i++){ const a=i/10*Math.PI*2; put(6*Math.cos(a),1,6*Math.sin(a),BLACK); }

// ---------- BACKGROUND CLOCK GEAR ----------
gear('z',0,17,13,14,30,{ring:COPPER,tooth:IRON,spoke:IRON,spokes:8,hubR:3,hub:GOLD,ringW:1.4,toothH:1.8});
gear('z',0,17,13,8,0,{ring:GOLD,ringW:1});
gear('z',0,17,12,3,0,{ring:BLACK,hubR:2,hub:BLACK});
ln(0,17,12,0,15,6,GOLD); ln(1,17,12,1,15,6,GOLD);

// ---------- LEGS ----------
for(const s of [-1,1]){
  const lo = s>0?3:-4;
  cl(lo,2,-1,lo+1,4,0,IRON);
  cl(lo,3,-1,lo+1,3,0,COPPER);
  cl(lo-1,2,-2,lo+2,3,-2,IRON);
  for(let i=0;i<4;i++){
    const x0=lo-1+i, x1=x0+(i-1.5)*0.9;
    ln(x0,2,-2,x1,2,-5,IRON);
    put(x1,2,-6,GOLD); put(x1,3,-5,GOLD);
  }
  ln(lo,2,1,lo,2,3,IRON); put(lo,2,4,GOLD); ln(lo+1,2,1,lo+1,2,3,IRON); put(lo+1,2,4,GOLD);
}

// ---------- TAIL ----------
for(let i=-4;i<=4;i++){
  const c=(i%2===0)?COPPER:IRON;
  for(let st=0;st<=9;st++){
    const t=st/9;
    const x=i*(0.5+0.9*t), y=9-7*t, z=5.5+5*t;
    const col = st>=8?GOLD:c;
    put(x,y,z,col); put(x,y+1,z,col);
  }
}

// ---------- BODY ----------
function bodyCol(x,y,z){
  if(z<-1.5 && y<20){ return ((y+Math.abs(x))%3===0)?COPPER:MARBLE; }
  if(y%5===0) return COPPER;
  return (((x+(y&1)*2)%4+4)%4<2)?IRON:GRAY;
}
ell(0,12.5,0.5,7,9,6,bodyCol,1.2);
gear('z',0,12,-6,3.6,12,{ring:GOLD,tooth:COPPER,ringW:1.4,toothH:1.5});
for(let z=-6;z<=-4;z++) discXY(0,12,z,0,2.2,GLASS);
sphere(0,12,-1,1,GLOWSTONE);
for(const s of [-1,1]) for(let y=6;y<=18;y+=4){ put(s*5,y,-3,BLACK); }

// ---------- WINGS ----------
for(const s of [-1,1]){
  for(let k=0;k<9;k++){
    const z=-3+k;
    const top=18-Math.round(k*0.4);
    const bot=Math.round(10-k*0.75);
    for(let y=bot;y<=top;y++){
      const hw=7*Math.sqrt(Math.max(0,1-((y-12.5)/9)**2-((z-0.5)/6)**2));
      const x0=Math.max(4,Math.floor(hw)+1)+Math.floor((top-y)/5);
      let col = (k%2)?COPPER:IRON;
      if(y<=bot+1) col=GOLD; else if(y>=top-1) col=GRAY; else if((y+k)%4===0) col=LIGHT_GRAY;
      put(s*x0,y,z,IRON); put(s*(x0+1),y,z,col);
    }
  }
  gear('z',s*6,17,-4,2.4,8,{ring:COPPER,tooth:GOLD,hubR:1,hub:GOLD,ringW:1.2,toothH:1.2,spoke:IRON,spokes:4});
  const lo = s>0?9:-10;
  cl(lo,16,0,lo+1,25,1,IRON);
  cl(lo,18,0,lo+1,18,1,GOLD); cl(lo,22,0,lo+1,22,1,GOLD);
  cl(lo-1,26,-1,lo+2,26,2,COPPER);
  put(lo,27,0,STEAM); put(lo+1,29,1,STEAM);
  gear('x',s*7,24,-1,2,6,{ring:COPPER,tooth:GOLD,ringW:1.3,toothH:1,hubR:1,hub:GOLD});
}

// ---------- HEAD ----------
function headCol(x,y,z){
  if(z<-3.5 && y<28 ){ return (x%3===0&&y%3===0)?IRON:MARBLE; }
  if(y>=27 && (y+Math.abs(x))%3===0) return COPPER;
  return (((x+(y&1)*2)%4+4)%4<2)?IRON:GRAY;
}
ell(0,24,-0.5,7,5.2,6,headCol,1.2);
for(let i=0;i<48;i++){ const a=i/48*Math.PI*2; put(6.1*Math.cos(a),21,-0.5+5.3*Math.sin(a),GOLD); }
gear('y',0,29,-1,2,6,{ring:COPPER,tooth:GOLD,ringW:1.3,toothH:1,hubR:1,hub:GOLD});

// goggle eyes + ear tufts
for(const s of [-1,1]){
  const ex=s*4, ey=25;
  for(let x=ex-4;x<=ex+4;x++)for(let y=ey-4;y<=ey+4;y++){
    const d=Math.hypot(x-ex,y-ey);
    if(d<2.4) put(x,y,-5,IRON);
    if(d>=2.4&&d<=3.3){ put(x,y,-5,COPPER); put(x,y,-6,COPPER); put(x,y,-7,GOLD); put(x,y,-8,GOLD); }
    if(d<2.4){
      put(x,y,-6,d<1.3?BLACK:GLOWSTONE);
      const u=s*(x-ex), dy=y-ey;
      if(d<1.3) put(x,y,-7,BLACK);
      else if(dy>1.5+0.5*u) put(x,y,-7,IRON); else put(x,y,-7,GLASS);
    }
  }
  const tx=s*4;
  ln(tx,28,-1,s*8,32,-1,IRON); ln(tx,28,0,s*8,32,0,IRON);
  ln(tx+s,28,-1,s*8,31,-1,COPPER);
  put(s*8,32,-1,GOLD); put(s*8,33,-1,ELECTRIC);
}
// hooked beak
cl(-1,22,-6,1,24,-6,GOLD);
cl(-1,22,-7,1,23,-7,GOLD); put(0,24,-7,GOLD);
put(0,22,-8,GOLD); put(0,21,-8,GOLD);
put(0,21,-9,GOLD); put(0,20,-9,ORANGE);

// ---------- WIND-UP KEY ON BACK ----------
ln(0,13,7,0,13,11,GOLD);
for(const s of [-1,1]) for(let z=10;z<=11;z++) discXY(s*3,13,z,1.2,2.4,GOLD);
cl(-1,13,10,1,13,11,GOLD);

// ---------- FOREGROUND GEARS ----------
gear('z',-9,5,-9,4,10,{ring:COPPER,tooth:GOLD,spoke:IRON,spokes:4,hubR:1,hub:GOLD,ringW:1.3,toothH:1.4});
gear('z',10,4,-10,3,8,{ring:GOLD,tooth:COPPER,spoke:IRON,spokes:4,hubR:1,hub:IRON,ringW:1.3,toothH:1.3});

// ---------- EMIT ----------
let n=0;
for(const v of M.values()){ if(n>=3980) break; block(v[0],v[1],v[2],v[3]); n++; }