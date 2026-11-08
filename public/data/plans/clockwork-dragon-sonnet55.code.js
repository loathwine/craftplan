// clockwork-dragon-sonnet55 — prompt:
// a clockwork dragon made of brass gears...

cube(-12,1,-11,12,6,12,AIR);

const V=new Map();
const K=(x,y,z)=>((x+40)*100+(y+20))*100+(z+40);
function put(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||y<-8||y>33||z<-22||z>22)return;
  if(id===AIR){V.delete(K(x,y,z));return;}
  V.set(K(x,y,z),[x,y,z,id]);}
function ellipsoid(cx,cy,cz,rx,ry,rz,id,hollow){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const e=Math.sqrt(((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2);
    if(e<=1&&(!hollow||e>1-1.2/Math.min(rx,ry,rz)))put(x,y,z,id);}
}
function box(x1,y1,z1,x2,y2,z2,id){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)put(x,y,z,id);}
function cr(a,b,c,d,t){return 0.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);}
function dense(p,step){
  const o=[];
  for(let i=0;i<p.length-1;i++){
    const p0=p[Math.max(0,i-1)],p1=p[i],p2=p[i+1],p3=p[Math.min(p.length-1,i+2)];
    const len=Math.hypot(p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]);
    const n=Math.max(1,Math.ceil(len/step));
    for(let k=0;k<n;k++){const t=k/n;
      o.push([cr(p0[0],p1[0],p2[0],p3[0],t),cr(p0[1],p1[1],p2[1],p3[1],t),cr(p0[2],p1[2],p2[2],p3[2],t),p1[3]+(p2[3]-p1[3])*t]);}
  }
  o.push(p[p.length-1].slice());
  return o;
}
function tube(pts,mats,solid,seg){
  seg=seg||1.5;
  const d=dense(pts,0.5);let s=0;
  for(let i=0;i<d.length;i++){
    const a=d[i],b=d[Math.min(d.length-1,i+1)],c=d[Math.max(0,i-1)];
    let tx=b[0]-c[0],ty=b[1]-c[1],tz=b[2]-c[2];const tl=Math.hypot(tx,ty,tz)||1;tx/=tl;ty/=tl;tz/=tl;
    if(i>0)s+=Math.hypot(a[0]-d[i-1][0],a[1]-d[i-1][1],a[2]-d[i-1][2]);
    const m=mats[Math.floor(s/seg)%mats.length];
    const r=a[3],R=Math.ceil(r+1);
    for(let x=Math.floor(a[0])-R;x<=Math.ceil(a[0])+R;x++)for(let y=Math.floor(a[1])-R;y<=Math.ceil(a[1])+R;y++)for(let z=Math.floor(a[2])-R;z<=Math.ceil(a[2])+R;z++){
      const dx=x-a[0],dy=y-a[1],dz=z-a[2];const dot=dx*tx+dy*ty+dz*tz;
      if(Math.abs(dot)>0.6)continue;
      const rad=Math.sqrt(Math.max(0,dx*dx+dy*dy+dz*dz-dot*dot));
      if(rad<=r&&(solid||rad>r-1.2))put(x,y,z,m);}
  }
}
function gear(pl,cx,cy,cz,R,t,teeth,o){
  o=o||{};
  const ringW=o.ringW||1.5,hubR=o.hubR===undefined?1.5:o.hubR,spk=o.spokes===undefined?6:o.spokes,rot=o.rot||0;
  const ringM=o.ring||GOLD,toothM=o.tooth||ringM,L=Math.ceil(R+2);
  for(let du=-L;du<=L;du++)for(let dv=-L;dv<=L;dv++){
    const d=Math.hypot(du,dv);if(d>R+1.4)continue;
    const a=Math.atan2(dv,du)+rot;let m=null,fill=null;
    if(d<=hubR)m=o.hub||IRON;
    else if(d<=R&&d>R-ringW)m=ringM;
    else if(d>R){if(teeth&&Math.cos(teeth*a)>0.15)m=toothM;}
    else if(spk){const s=((a*spk/(2*Math.PI))%1+1)%1;const dist=Math.min(s,1-s)*2*Math.PI*d/spk;
      if(dist<0.75)m=o.spoke||COPPER;else if(o.fill)fill=o.fill;}
    if(!m&&!fill)continue;
    for(let k=0;k<t;k++){
      const mm=m||(k===0?fill:null);if(!mm)continue;
      if(pl==='XY')put(cx+du,cy+dv,cz+k,mm);else if(pl==='XZ')put(cx+du,cy+k,cz+dv,mm);else put(cx+k,cy+du,cz+dv,mm);}
  }
}

// ---------- plinth: great gear floor ----------
const PZ=1;
gear('XZ',0,0,PZ,11,1,18,{ring:GOLD,tooth:IRON,ringW:2,hubR:0,spokes:0,rot:0.1});
for(let x=-11;x<=11;x++)for(let z=-11;z<=11;z++){
  const d=Math.hypot(x,z);
  if(d<=9.2)put(x,0,PZ+z,OBSIDIAN);
}
for(let x=-11;x<=11;x++)for(let z=-11;z<=11;z++){
  const d=Math.hypot(x,z);
  if(d>7.6&&d<=8.6)put(x,0,PZ+z,COPPER);
  else if(d>5.2&&d<=5.9)put(x,0,PZ+z,GOLD);
}
for(let i=0;i<12;i++){const a=i*Math.PI/6;put(Math.cos(a)*9.8,0,PZ+Math.sin(a)*9.8,IRON);}
// satellite gears meshing with the plinth
gear('XZ',-15,0,5,4,1,9,{ring:COPPER,tooth:GOLD,ringW:1.5,hubR:1,hub:IRON,spokes:4,rot:0.3});
gear('XZ',15,0,-3,4,1,9,{ring:COPPER,tooth:GOLD,ringW:1.5,hubR:1,hub:IRON,spokes:4,rot:0.9});
gear('XZ',-4,0,-14,4,1,9,{ring:COPPER,tooth:GOLD,ringW:1.5,hubR:1,hub:IRON,spokes:4,rot:0.6});

// ---------- torso: ringed hull ----------
function prof(z){
  let r,cy=9;
  if(z<=-4){const u=(z+9)/5;r=2.5+(4.7-2.5)*Math.sin(u*Math.PI/2);}
  else if(z<=4)r=4.7;
  else{const u=(z-4)/9;r=4.7-1.7*Math.pow(u,1.2);cy=9-1.3*u;}
  return [cy,r,r*0.95];
}
for(let z=-9;z<=13;z++){
  const [cy,rx,ry]=prof(z);
  const collar=(z%4===0);
  const R1=rx+(collar?0.6:0),R2=ry+(collar?0.6:0);
  for(let x=-6;x<=6;x++)for(let y=Math.floor(cy-R2-1);y<=Math.ceil(cy+R2+1);y++){
    const nx=x/R1,ny=(y-cy)/R2,e=Math.sqrt(nx*nx+ny*ny);
    const cap=(z===-9);
    if(e<=1&&(cap||e>1-1.25/Math.min(R1,R2))){
      let m=GOLD;if(collar)m=COPPER;else if(ny<-0.55)m=IRON;
      put(x,y,z,m);}
  }
}
// hip cap
for(let x=-4;x<=4;x++)for(let y=3;y<=11;y++){const [cy,rx,ry]=prof(13);const e=Math.hypot(x/rx,(y-cy)/ry);if(e<=1)put(x,y,14,COPPER);}
// chest heart gear
gear('XY',0,9,-10,3,2,8,{ring:GOLD,tooth:IRON,spoke:COPPER,hub:GLOWSTONE,hubR:1.4,spokes:6,ringW:1.3,rot:0.2});
put(0,9,-11,GLOWSTONE);
// flank gears
for(const s of [1,-1]){
  gear('YZ',s*5,8,2,3.5,1,10,{ring:GOLD,tooth:COPPER,spoke:IRON,hub:GLOWSTONE,hubR:0.9,spokes:5,ringW:1.4,rot:s*0.4});
  gear('YZ',s*5,6.5,-3.5,2,1,6,{ring:COPPER,tooth:GOLD,hub:IRON,hubR:0.8,spokes:0,ringW:1.2});
}
// spine cogs
gear('YZ',0,14,1,2.2,1,8,{ring:COPPER,tooth:GOLD,hub:IRON,hubR:0.8,spokes:4});
gear('YZ',0,14,5,2.4,1,8,{ring:GOLD,tooth:COPPER,hub:IRON,hubR:0.8,spokes:4,rot:0.4});
gear('YZ',0,13,9,2,1,7,{ring:COPPER,tooth:GOLD,hub:IRON,hubR:0.8,spokes:0});
// smokestacks
for(const s of [1,-1]){
  tube([[s*2.6,11,10,1.3],[s*2.6,17,10,1.1],[s*2.6,19,10,1.1]],[IRON,COPPER],true,2);
  put(s*2.6,20,10,STEAM);
}

// ---------- neck ----------
tube([[0,11,-3,2.9],[0,14,-5,2.6],[0,17.5,-6.8,2.3],[0,20,-9,2.2],[0,19.5,-11,2.3]],[GOLD,GOLD,COPPER],false,1.5);
// halo gear behind head
gear('XY',0,20,-3,5,2,16,{ring:GOLD,tooth:IRON,spoke:COPPER,hub:IRON,hubR:1.5,spokes:8,ringW:1.4,fill:GLASS,rot:0.15});
put(0,20,-4,GLOWSTONE);

// ---------- head ----------
ellipsoid(0,18,-12.5,3,2.7,3.3,GOLD,true);
ellipsoid(0,17.4,-16.5,2.1,1.7,3.2,GOLD,false);
ellipsoid(0,13.8,-16,1.8,0.95,3.2,COPPER,false);
box(-1,13,-12,1,15,-12,COPPER);
for(let z=-19;z<=-15;z++){put(0,15,z,LAVA);}
for(let z=-19;z<=-14;z++)if(z%2!==0){put(-1,15,z,IRON);put(1,15,z,IRON);}
for(let z=-18;z<=-14;z++)put(0,19,z,IRON);
for(const s of [1,-1]){
  put(s*2,19,-14,GLOWSTONE);put(s*2,19,-15,GLOWSTONE);
  box(s*2,20,-16,s*3,20,-13,IRON);
  gear('YZ',s*3,17,-12,2,1,6,{ring:COPPER,tooth:IRON,hub:GLOWSTONE,hubR:0.6,spokes:0,ringW:1.2});
  put(s*1,20,-19,STEAM);
  tube([[s*2,20,-11,0.9],[s*3.5,22.5,-8.5,0.8],[s*5.5,25,-5.5,0.4]],[COPPER,GOLD],true,2);
  tube([[s*3,16.5,-11,0.8],[s*4.5,16,-9,0.6],[s*6,15.5,-7.5,0.3]],[IRON],true,2);
}
for(const [x,y,z] of [[0,15,-20],[0,15,-21],[1,16,-21],[-1,14,-21],[0,15,-22],[0,17,-22]])put(x,y,z,FIRE);

// ---------- legs ----------
function foot(x,z0){
  box(x-1,1,z0-2,x+1,1,z0,GOLD);
  put(x-1,1,z0-3,IRON);put(x,1,z0-4,IRON);put(x+1,1,z0-3,IRON);put(x,1,z0-3,IRON);
}
for(const s of [1,-1]){
  tube([[s*5.3,8,-3,1.9],[s*5.6,4.8,-4.5,1.5],[s*5.2,2.2,-5.8,1.3]],[COPPER,GOLD],true,2);
  tube([[s*6.9,7,-3,0.5],[s*6.9,3,-5.5,0.5]],[IRON],true,2);
  foot(Math.round(s*5.2),-5);
  ellipsoid(s*5,7.5,8.5,3,3.3,3.3,GOLD,true);
  gear('YZ',s*8,8,8.5,3.2,1,10,{ring:COPPER,tooth:GOLD,hub:GLOWSTONE,hubR:0.8,spoke:IRON,spokes:5,ringW:1.4,rot:s});
  tube([[s*5.5,6,8,2.2],[s*6,3.8,6.5,1.7],[s*5.8,2.3,9.5,1.4]],[COPPER,GOLD],true,2);
  tube([[s*7.4,5.5,8,0.5],[s*7.4,2,9.5,0.5]],[IRON],true,2);
  foot(Math.round(s*5.8),11);
}

// ---------- wings ----------
for(const s of [1,-1]){
  const dy=s<0?-2:0;
  tube([[s*4,12,0.5,1.3],[s*8,15.5,0.5,1.1],[s*11,19,0.5,1.0]],[IRON,COPPER],true,2);
  tube([[s*11,19,0.5,0.9],[s*14,22,0.5,0.9],[s*17,25+dy,0.5,0.9]],[IRON,COPPER],true,2);
  tube([[s*11,19,0.5,0.9],[s*9.5,23,0.5,0.9],[s*8,27+dy,0.5,0.9]],[IRON,COPPER],true,2);
  tube([[s*11,19,0.5,0.9],[s*14,16,0.5,0.9],[s*17,13+dy,0.5,0.9]],[IRON,COPPER],true,2);
  gear('XY',s*11,19,0,6,2,14,{ring:GOLD,tooth:COPPER,spoke:IRON,hub:IRON,hubR:2,spokes:7,ringW:1.6,fill:GLASS,rot:s*0.2});
  put(s*11,19,-1,GLOWSTONE);
  gear('XY',s*17,25+dy,0,3,2,9,{ring:COPPER,tooth:GOLD,spoke:IRON,hub:GOLD,hubR:1,spokes:5,ringW:1.4,fill:GLASS,rot:s*0.5});
  gear('XY',s*8,27+dy,0,3,2,10,{ring:GOLD,tooth:IRON,spoke:COPPER,hub:IRON,hubR:1,spokes:5,ringW:1.4,fill:GLASS,rot:s*0.1});
  gear('XY',s*17,13+dy,0,3,2,9,{ring:GOLD,tooth:COPPER,spoke:IRON,hub:COPPER,hubR:1,spokes:5,ringW:1.4,fill:GLASS,rot:s*0.8});
  tube([[s*17,25+dy,0.5,1.0],[s*19.5,29+dy,0.5,0.8],[s*21,32+dy,0.5,0.3]],[COPPER,GOLD],true,2);
  tube([[s*8,27+dy,0.5,1.0],[s*7,30+dy,0.5,0.8],[s*5.5,32+dy,0.5,0.3]],[COPPER,GOLD],true,2);
  tube([[s*17,13+dy,0.5,1.0],[s*20,11+dy,0.5,0.8],[s*21.5,9+dy,0.5,0.3]],[COPPER,GOLD],true,2);
}

// ---------- tail ----------
const tail=[[0,8,11.5,3],[0,7.5,14,2.7],[1,7,16.5,2.4],[3.5,7,18.5,2.1],[7,8,19.2,1.9],[10.5,10,18.8,1.6],[13,13,17.5,1.3],[14.5,16.5,15.5,1.0]];
tube(tail,[GOLD,GOLD,COPPER],false,1.5);
gear('XY',15,20,15,3.5,2,10,{ring:GOLD,tooth:IRON,spoke:COPPER,hub:GLOWSTONE,hubR:1,spokes:4,ringW:1.4,rot:0.3});

// ---------- emit (plinth floor last so any budget overflow trims it first) ----------
const list=[...V.values()].filter(b=>b[1]!==0).concat([...V.values()].filter(b=>b[1]===0));
let n=0;
for(const [x,y,z,id] of list){if(n>=3990)break;block(x,y,z,id);n++;}