// orrery-opus — prompt:
// a giant brass orrery of the solar system...

const D=Math.PI/180;
const M=new Map();
function put(x,y,z,id){ if(id===null||id===undefined) return; x=Math.round(x);y=Math.round(y);z=Math.round(z); if(x<-22||x>22||z<-22||z>22||y<-8||y>33) return; M.set(x+','+y+','+z,id); }
function hsh(x,y,z,s){ let h=Math.imul(x|0,73856093)^Math.imul(y|0,19349663)^Math.imul(z|0,83492791)^Math.imul((s|0)+7,668265263); h=Math.imul(h^(h>>>13),1274126177); h^=h>>>16; return (h>>>0)/4294967296; }
function disc(cx,y,cz,r,fn){ cx=Math.round(cx); cz=Math.round(cz); const R=Math.ceil(r); for(let dx=-R;dx<=R;dx++)for(let dz=-R;dz<=R;dz++){ const d=Math.sqrt(dx*dx+dz*dz); if(d<=r){ let a=Math.atan2(dz,dx); if(a<0)a+=2*Math.PI; put(cx+dx,y,cz+dz,fn(dx,dz,d,a)); } } }
function ball(cx,cy,cz,r,fn,shell){ const R=Math.ceil(r); for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++)for(let dz=-R;dz<=R;dz++){ const d=Math.sqrt(dx*dx+dy*dy+dz*dz); if(d<=r&&(!shell||d>r-shell)) put(cx+dx,cy+dy,cz+dz,fn(dx,dy,dz,cx+dx,cy+dy,cz+dz)); } }
function ln(x1,y1,z1,x2,y2,z2,id){ const n=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))*1.5)); for(let i=0;i<=n;i++){ const t=i/n; put(x1+(x2-x1)*t,y1+(y2-y1)*t,z1+(z2-z1)*t,id); } }
function ring(y,R,fn){ const n=Math.ceil(2*Math.PI*R*3); for(let i=0;i<n;i++){ const a=i/n*2*Math.PI; put(R*Math.cos(a),y,R*Math.sin(a),fn(a)); } }
function colR(y){ return y<=10?2.3:y<=14?2.0:y<=18?1.5:1.0; }

// ---------- BASE: stepped obsidian plinth with brass trim + zodiac inlay ----------
for(const y of [-2,-1]) disc(0,y,0,9.5,(dx,dz,d)=>d>8.4?COBBLE:null);
disc(0,0,0,9.5,(dx,dz,d)=>d>8.7?GOLD:OBSIDIAN);
for(let k=0;k<8;k++){ const a=(k*45+22.5)*D, c=Math.cos(a), s=Math.sin(a);
  put(10.2*c,0,10.2*s,GOLD); put(10.2*c,-1,10.2*s,GOLD); put(11*c,-1,11*s,COPPER); }
const GEMS=[RED,ORANGE,YELLOW,LIME,GREEN,CYAN,LIGHT_BLUE,BLUE,PURPLE,MAGENTA,PINK,WHITE];
disc(0,1,0,8.2,(dx,dz,d,a)=>{
  if(d>7.4) return COPPER;
  const deg=a/D;
  if(d>=6.1){ const s=Math.floor(deg/30), off=deg-s*30; if(off>11&&off<19) return GEMS[s%12]; if(off<2.5||off>27.5) return GOLD; return MARBLE; }
  if(d>5.5) return GOLD;
  for(let k=0;k<8;k++){ const ka=k*45*D; const along=dx*Math.cos(ka)+dz*Math.sin(ka); const perp=Math.abs(-dx*Math.sin(ka)+dz*Math.cos(ka)); if(along>0&&perp<0.55) return k%2?BLACK:GOLD; }
  return MARBLE;
});
disc(0,2,0,5.2,(dx,dz,d)=>d>4.5?GOLD:OBSIDIAN);

// ---------- GEARBOX DRUM ----------
for(let y=3;y<=5;y++) disc(0,y,0,3.6,(dx,dz,d,a)=>{ if(d<=2.6) return null; if(y===4) return GOLD; if(y===5){ const m=(a/D)%90; if(m>35&&m<55) return GLOWSTONE; } return COPPER; });
disc(0,6,0,3.6,()=>GOLD);
// big spoked crown gear on top of the drum
disc(0,7,0,5.7,(dx,dz,d,a)=>{ const deg=a/D;
  if(d<=1.6) return GOLD;
  if(d<=4.0){ const m=deg%60; return (m<9||m>51)?GOLD:null; }
  if(d<=4.9) return COPPER;
  return (Math.floor(deg/15)%2===0)?COPPER:null; });
// vertical gear facing the viewer (north face of drum)
function vgear(cx,cy,cz,r,hub,rim,teeth){ const R=Math.ceil(r+0.8);
  for(let u=-R;u<=R;u++)for(let v=-R;v<=R;v++){ const d=Math.hypot(u,v); let a=Math.atan2(v,u); if(a<0)a+=2*Math.PI; const deg=a/D; let id=null;
    if(d<=0.9) id=hub; else if(d<=r-0.8){ const m=deg%90; if(m<14||m>76) id=rim; } else if(d<=r) id=rim; else if(d<=r+0.8&&Math.floor(deg/(360/(teeth*2)))%2===0) id=hub;
    if(id!==null) put(cx+u,cy+v,cz,id); } }
vgear(0,5,-4,2.1,GOLD,COPPER,10);
// crank shaft + handle
ln(0,5,-5,0,5,-9,IRON); ln(0,5,-9,0,7,-9,IRON); put(0,7,-10,GOLD); put(0,7,-11,GOLD);
// small planetary gears lying on the plinth
function fgear(cx,y,cz,r,body){ disc(cx,y,cz,r+0.8,(dx,dz,d,a)=>{ if(d<=0.6) return GOLD; if(d<=r) return body; return Math.floor((a/D)/22.5)%2===0?body:null; }); put(Math.round(cx),y+1,Math.round(cz),GOLD); }
for(const [ang,body] of [[90,IRON],[210,COPPER],[330,IRON]]) fgear(6.6*Math.cos(ang*D),2,6.6*Math.sin(ang*D),1.7,body);
// steam vents at the back
for(const sx of [-5,5]){ ln(sx,2,6,sx,5,6,COPPER); put(sx,6,6,GOLD); put(sx,7,6,STEAM); }

// ---------- TELESCOPING CENTRAL COLUMN ----------
for(let y=8;y<=22;y++){ const r=colR(y), seg=y<=10?0:y<=14?1:y<=18?2:3; disc(0,y,0,r,(dx,dz,d)=>{ if(Math.abs(dx)===Math.abs(dz)&&dx!==0) return seg%2?COPPER:GOLD; return seg%2?GOLD:COPPER; }); }

// ---------- PLANETS ----------
const JB=[ORANGE,BROWN,SAND,ORANGE,WHITE,BROWN,SAND];
const PL=[
 {R:5,   ry:22, r:1.1, a:200, cy:24, c:(dx,dy,dz,x,y,z)=>hsh(x,y,z,1)<.45?GRAY:LIGHT_GRAY},
 {R:7.5, ry:20, r:1.6, a:300, cy:23, c:(dx,dy,dz,x,y,z)=>hsh(x,y,z,2)<.3?SAND:(dy<0?ORANGE:YELLOW)},
 {R:10,  ry:18, r:2.0, a:245, cy:21, c:(dx,dy,dz,x,y,z)=>{ if(Math.abs(dy)===2) return WHITE; const h=hsh(x,y,z,3); return h<.38?GREEN:h<.46?WHITE:BLUE; }},
 {R:12.5,ry:16, r:1.5, a:330, cy:19, c:(dx,dy,dz,x,y,z)=>{ if(dy===1&&dx===0&&dz===0) return WHITE; const h=hsh(x,y,z,4); return h<.3?ORANGE:h<.42?BROWN:RED; }},
 {R:15.5,ry:13, r:3.2, a:215, cy:20, c:(dx,dy,dz)=>(dy===-1&&dz<=-2&&dx>=0&&dx<=1)?RED:JB[dy+3]},
 {R:18.5,ry:11, r:2.4, a:285, cy:15, c:(dx,dy)=>[SAND,YELLOW,SAND,YELLOW,WHITE][dy+2]},
 {R:20.5,ry:10, r:1.7, a:145, cy:14, c:(dx,dy,dz,x,y,z)=>hsh(x,y,z,7)<.3?LIGHT_BLUE:CYAN},
 {R:21,  ry:9,  r:1.6, a:40,  cy:12, c:(dx,dy,dz,x,y,z)=>hsh(x,y,z,8)<.3?LIGHT_BLUE:BLUE},
];
// orbit rings, drive arms, rods, counterweights, collars
PL.forEach((p,i)=>{
  const col=i%2?COPPER:GOLD, alt=i%2?GOLD:COPPER;
  ring(p.ry,p.R,a=>{ const m=((a/D)+22.5)%45-22.5; return Math.abs(m)<1.6?IRON:col; });
  const ca=Math.cos(p.a*D), sa=Math.sin(p.a*D), rc=colR(p.ry)+0.6;
  ln(rc*ca,p.ry,rc*sa,p.R*ca,p.ry,p.R*sa,col);
  p.px=Math.round(p.R*ca); p.pz=Math.round(p.R*sa);
  put(p.px,p.ry,p.pz,IRON);
  for(let y=p.ry+1;y<p.cy-Math.floor(p.r);y++) put(p.px,y,p.pz,IRON);
  const L=rc+Math.min(p.R-rc-2,1.5+p.R*0.25);
  ln(-rc*ca,p.ry,-rc*sa,-L*ca,p.ry,-L*sa,col);
  ball(Math.round(-(L+0.8)*ca),p.ry,Math.round(-(L+0.8)*sa),1,()=>alt);
  disc(0,p.ry,0,colR(p.ry)+1,(dx,dz,d)=>d>colR(p.ry)?IRON:null);
});
// sun cradle
disc(0,22,0,2.6,()=>GOLD);
for(let k=0;k<6;k++){ const a=(k*60+30)*D; ln(2.3*Math.cos(a),22,2.3*Math.sin(a),3.3*Math.cos(a),24,3.3*Math.sin(a),GOLD); }
// asteroid belt
for(let i=0;i<44;i++){ const deg=hsh(i,3,7,9)*360; if(deg>266&&deg<304) continue; const a=deg*D, R=13.4+hsh(i,5,1,2)*1.3, y=14+(hsh(i,1,1,4)<.5?0:1), h=hsh(i,9,9,9);
  put(R*Math.cos(a),y,R*Math.sin(a),h<.4?GRAY:h<.7?STONE:h<.85?BROWN:COBBLE); }
// planet bodies
PL.forEach(p=>ball(p.px,p.cy,p.pz,p.r,p.c));
// Earth's moon on its own little arm
{ const E=PL[2]; ln(E.px,E.ry+1,E.pz,E.px-4,E.ry+1,E.pz-1,IRON); put(E.px-4,E.ry+2,E.pz-1,IRON);
  ball(E.px-4,E.ry+4,E.pz-1,1,(dx,dy,dz,x,y,z)=>hsh(x,y,z,5)<.3?GRAY:LIGHT_GRAY); }
// Jupiter's moons on a fine wire
{ const J=PL[4]; ln(J.px,J.ry+2,J.pz,J.px-1,J.ry+2,J.pz-5,IRON); put(J.px-1,J.ry+3,J.pz-5,WHITE); put(J.px,J.ry+2,J.pz-3,IRON); put(J.px,J.ry+3,J.pz-3,ORANGE); }
// Saturn's rings, tilted toward the viewer
{ const S=PL[5]; for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){ const d=Math.hypot(dx,dz); if(d>=3.1&&d<=4.5) put(S.px+dx,S.cy+Math.round(dz*0.45+dx*0.12),S.pz+dz,d<3.8?SAND:WHITE); } ball(S.px,S.cy,S.pz,S.r,S.c); }
// Uranus' vertical ring
{ const U=PL[6]; for(let u=-3;u<=3;u++)for(let v=-3;v<=3;v++){ const d2=u*u+v*v; if(d2>=4.84&&d2<=9&&!(u===0&&v<0)) put(U.px+u,U.cy+v,U.pz,WHITE); } }
// outer frame: 4 legs holding the Neptune ring, with braces to the plinth
for(let k=0;k<4;k++){ const a=(45+k*90)*D, c=Math.cos(a), s=Math.sin(a), x=Math.round(21*c), z=Math.round(21*s);
  ln(x,-1,z,x,8,z,COPPER); disc(x,-1,z,1.2,()=>OBSIDIAN); put(x,0,z,GOLD);
  ln(21*c,4,21*s,9.8*c,1,9.8*s,GOLD); }

// ---------- THE SUN ----------
ball(0,27,0,4,(dx,dy,dz,x,y,z)=>{ const h=hsh(x,y,z,11); return h<.28?LAVA:h<.38?GLOWSTONE:h<.72?ORANGE:YELLOW; },1.4);
for(let i=0;i<18;i++){ const yv=1-2*(i+0.5)/18; if(yv<-0.2) continue; const rr=Math.sqrt(1-yv*yv), th=i*2.39996;
  const vx=rr*Math.cos(th), vz=rr*Math.sin(th); ln(4.6*vx,27+4.6*yv,4.6*vz,6.3*vx,27+6.3*yv,6.3*vz,GOLD); }
put(1,32,0,FIRE); put(-1,32,1,FIRE); put(0,32,-1,FIRE);

for(const [k,id] of M){ const [x,y,z]=k.split(',').map(Number); block(x,y,z,id); }
// clear the trees around the plinth (only empty cells, so nothing placed above gets erased)
for(let x=-11;x<=11;x++)for(let z=-11;z<=11;z++){ if(x*x+z*z>110) continue; for(let y=1;y<=7;y++) if(!M.has(x+','+y+','+z)) block(x,y,z,AIR); }