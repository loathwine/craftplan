// emperor-penguin-opus — prompt:
// an emperor penguin...

let H=(x,y,z)=>{let h=(x*374761393+y*668265263+z*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967296;};
const ell=(X,Y,Z,cx,cy,cz,a,b,c)=>((X-cx)/a)**2+((Y-cy)/b)**2+((Z-cz)/c)**2;

function voxelize(x1,x2,y1,y2,z1,z2,partAt,colorOf){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++){
    const p=partAt(x,y,z); if(!p) continue;
    if(partAt(x+1,y,z)&&partAt(x-1,y,z)&&partAt(x,y+1,z)&&partAt(x,y-1,z)&&partAt(x,y,z+1)&&partAt(x,y,z-1)) continue;
    const b=colorOf(p,x,y,z); if(b!==null) block(x,y,z,b);
  }
}
function frame(cx,cz,yawDeg,s){
  const th=yawDeg*Math.PI/180, fx=Math.sin(th), fz=-Math.cos(th), rx=Math.cos(th), rz=Math.sin(th);
  return (x,y,z)=>{const dx=x-cx,dz=z-cz;return [(dx*rx+dz*rz)/s, y/s, -(dx*fx+dz*fz)/s];};
}

// ---------- site prep: clear trees, lay an ice-shelf snowfield ----------
cylinder(0,0,0,18,14,AIR);
disk(0,-1,0,17,SNOW);
for(let x=-17;x<=17;x++)for(let z=-17;z<=17;z++){
  const d=Math.hypot(x,z); if(d>16.5) continue;
  if(Math.hypot(x-1,z-2)<8.5) continue;
  if(Math.hypot(x-8,z+5)<4.5) continue;
  const n=Math.sin(x*0.45+z*0.2)*Math.cos(z*0.38-x*0.12)+H(x,7,z)*0.5;
  if(n>0.75) block(x,0,z,SNOW);
}

// ---------- adult emperor penguin ----------
function penguin(cx,cz,yaw,s,headDip){
  const L=frame(cx,cz,yaw,s);
  const hd=headDip||0;
  const part=(x,y,z)=>{
    const [X,Y,Z]=L(x,y,z);
    const ax=0,ay=19.8-hd*0.6,az=-3.2-hd, bx=0,by=18.4-hd*1.2,bz=-9-hd*0.8;
    const vx=bx-ax,vy=by-ay,vz=bz-az, vv=vx*vx+vy*vy+vz*vz;
    const t=((X-ax)*vx+(Y-ay)*vy+(Z-az)*vz)/vv;
    if(t>=-0.05&&t<=1){
      const tc=Math.max(0,t), py=ay+vy*tc-0.25*Math.sin(Math.PI*tc), pz=az+vz*tc;
      const rw=1.05*(1-tc)+0.35*tc, rh=1.3*(1-tc)+0.4*tc;
      if((X/rw)**2+((Y-py)/rh)**2<=1 && Math.abs(Z-pz)<=0.8) return {p:'beak',t:tc,up:Y>=py};
    }
    if(ell(X,Y,Z,0,20-hd*0.5,0.3-hd,3.8,3.9,4.3)<=1) return {p:'head'};
    if(ell(X,Y,Z,0,16.6,0.6-hd*0.5,4.6,3.2,4.6)<=1) return {p:'head'};
    if(ell(X,Y,Z,0,12.5,0.6,5.8,6.2,5.0)<=1) return {p:'body'};
    if(Y>=0.6&&ell(X,Y,Z,0,7.3,0.5,7,7,6)<=1) return {p:'body'};
    for(const sg of [-1,1]){
      const fxc=sg*(6.5+(10.5-Y)*0.13);
      if(ell(X,Y,Z,fxc,10.5,1.4,1.15,6.6,2.5)<=1) return {p:'flip',sg};
      if(Y>=-0.5&&Y<=0.6&&ell(X,0,Z,sg*2.7,0,-2.0,1.9,1,2.8)<=1) return {p:'foot'};
    }
    if(Z>3.5&&ell(X,Y,Z,0,2.2,5.4,2.3,1.3,2.2)<=1) return {p:'tail'};
    return null;
  };
  const color=(o,x,y,z)=>{
    const [X,Y,Z]=L(x,y,z); const ax=Math.abs(X), h=H(x,y,z);
    if(o.p==='foot') return h<0.3?GRAY:BLACK;
    if(o.p==='tail') return BLACK;
    if(o.p==='flip') return (Z<0.2&&Y<14)?GRAY:BLACK;
    if(o.p==='beak'){ if(!o.up&&o.t>0.12&&o.t<0.75) return ORANGE; return BLACK; }
    const ey=21-hd*0.5, ez=-1.6-hd;
    if(o.p==='head'&&ax>2.2&&Math.abs(Y-ey)<=0.9&&Math.abs(Z-ez)<=1.0) return OBSIDIAN;
    if(ax>=2.4&&Y>=15.2&&Y<=20.8&&Z>-2.6&&Z<2.2){
      const e=((Y-18.2)/2.6)**2+((Z+0.1)/2.1)**2;
      if(e<0.4) return ORANGE; if(e<1) return YELLOW;
    }
    const ang=Math.atan2(ax,-(Z-1.4));
    if(ang<1.12&&Y<16.6){
      if(Y>=15.0) return YELLOW;
      if(Y>=13.2) return h<(Y-13.2)/1.8?YELLOW:WHITE;
      return WHITE;
    }
    if(Y>=14&&Y<16.8&&ang<1.45&&ax>1.6) return YELLOW;
    if(Z>2&&Y>5&&Y<18&&h<0.12) return GRAY;
    return BLACK;
  };
  const R=Math.ceil(11*s)+1;
  voxelize(Math.floor(cx-R),Math.ceil(cx+R),0,Math.ceil(25*s),Math.floor(cz-R),Math.ceil(cz+R),part,color);
}

// ---------- fluffy grey chick ----------
function chick(cx,cz,yaw,s){
  const L=frame(cx,cz,yaw,s);
  const part=(x,y,z)=>{
    const [X,Y,Z]=L(x,y,z);
    if(Z<-1.6&&Z>-3.6&&Math.abs(X)<=0.5&&Math.abs(Y-(6.9+(Z+1.6)*0.2))<=0.5) return {p:'beak'};
    if(ell(X,Y,Z,0,7.3,-0.2,2.3,2.2,2.3)<=1) return {p:'head'};
    if(Y>=0.6&&ell(X,Y,Z,0,3.4,0.3,2.9,3.3,2.7)<=1) return {p:'body'};
    for(const sg of [-1,1]){
      if(ell(X,Y,Z,sg*2.9,3.8,0.5,0.8,2.2,1.2)<=1) return {p:'flip'};
      if(Y>=-0.5&&Y<=0.5&&ell(X,0,Z,sg*1.2,0,-0.9,0.8,1,1.3)<=1) return {p:'foot'};
    }
    return null;
  };
  const color=(o,x,y,z)=>{
    const [X,Y,Z]=L(x,y,z), ax=Math.abs(X), h=H(x,y,z);
    if(o.p==='beak'||o.p==='foot') return BLACK;
    if(o.p==='flip') return GRAY;
    if(o.p==='head'){
      if(ax>=0.6&&ax<=1.6&&Math.abs(Y-7.6)<=0.6&&Z<-1.0) return OBSIDIAN;
      const ang=Math.atan2(ax,-(Z-0.6));
      if(Y<8.3&&ang<1.5&&!(ax<0.6&&Y<6.6)) return WHITE;
      return BLACK;
    }
    return h<0.22?WHITE:(h<0.42?GRAY:LIGHT_GRAY);
  };
  const R=Math.ceil(5*s)+1;
  voxelize(Math.floor(cx-R),Math.ceil(cx+R),0,Math.ceil(10*s),Math.floor(cz-R),Math.ceil(cz+R),part,color);
}

// ---------- background ice pressure ridge ----------
for(let x=-17;x<=17;x+=2){
  const zb=12+Math.floor(H(x,1,3)*3);
  const ht=2+Math.floor(H(x,2,5)*6)+(Math.abs(x)>8?1:0);
  const w=H(x,4,1)<0.5?1:2;
  const lean=H(x,9,9)<0.5?-1:1;
  for(let y=0;y<ht;y++){
    const off=Math.floor(y*0.3)*lean;
    const top=(y===ht-1);
    const id=top?SNOW:(y<1?LIGHT_BLUE:(H(x,y,zb)<0.55?ICE:LIGHT_BLUE));
    cube(x+off,y,zb,x+off+w-1,y,zb+1,id);
  }
}
// tumbled ice blocks scattered on the floe
[[-15,10],[18,-6],[-6,15],[6,14],[16,-3],[-16,-2]].forEach(([x,z],i)=>{
  const h=1+(i%3);
  cube(x,0,z,x+1,h-1,z+1,ICE); cube(x,h,z,x+1,h,z+1,SNOW);
});

// ---------- open fishing hole with icy rim (front-left foreground) ----------
for(let x=-14;x<=-4;x++)for(let z=-14;z<=-6;z++){
  const e=((x+9)/4.2)**2+((z+10)/3.0)**2;
  if(e<=1){ block(x,-1,z,WATER); block(x,-2,z,WATER); block(x,0,z,AIR); }
  else if(e<=1.6) block(x,0,z,H(x,0,z)<0.5?ICE:SNOW);
}

// ---------- the colony ----------
penguin(1,2,16,1.0,0);         // hero emperor, facing north, angled east
penguin(-11,7,-30,0.62,1.2);   // mate behind-left, head bowed
penguin(12,8,40,0.5,0);        // distant third adult
chick(8,-5,-12,0.95);          // fluffy chick in front-right