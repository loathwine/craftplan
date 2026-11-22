// ice-dragon-fable — prompt:
// an ice dragon...

// Ice dragon — sandbox test run was blocked, so this is the hand-checked script emitted directly (self-dedupes, hollows, clamps and caps at 3980 solid blocks).
const V=new Map(),SPK=[];
const R=Math.round,sin=Math.sin,cos=Math.cos,PI=Math.PI;
const TRANS=new Set([ICE,GLASS,WATER,FIRE,ELECTRIC,STEAM,AIR]);
function S(x,y,z,id){x=R(x);y=R(y);z=R(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;V.set(x+','+y+','+z,[x,y,z,id]);}
function G(x,y,z,id){if(!V.has(R(x)+','+R(y)+','+R(z)))S(x,y,z,id);}
function hs(x,y,z){const s=sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);}
function ell(cx,cy,cz,rx,ry,rz,col){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const dx=(x-cx)/rx,dy=(y-cy)/ry,dz=(z-cz)/rz;
    if(dx*dx+dy*dy+dz*dz<=1){const id=typeof col==='function'?col(x,y,z,x-cx,y-cy,z-cz):col;if(id!=null)S(x,y,z,id);}
  }
}
function lineS(a,b,col){const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])*2));for(let i=0;i<=n;i++){const t=i/n;S(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,typeof col==='function'?col(t):col);}}
// scaled skin: white plated belly, dark blue ridge, frosty flanks
function skin(b,r,glow){return (x,y,z,dx,dy,dz)=>{
  const d=(dx*b[0]+dy*b[1]+dz*b[2])/r,h=hs(x,y,z),m=((y%2)+2)%2;
  if(d>0.5){if(glow&&d>0.85&&((y%5)+5)%5===0)return NEON_BLUE;return m?WHITE:MARBLE;}
  if(d<-0.72)return h<0.45?BLUE:CYAN;
  return h<0.14?CYAN:h<0.23?WHITE:h<0.29?BLUE:LIGHT_BLUE;
};}
function cr(p,t){const n=p.length-1,i=Math.min(Math.floor(t),n-1),f=t-i;
  const a=p[Math.max(i-1,0)],b=p[i],c=p[i+1],d=p[Math.min(i+2,n)];
  return b.map((_,k)=>0.5*(2*b[k]+(-a[k]+c[k])*f+(2*a[k]-5*b[k]+4*c[k]-d[k])*f*f+(-a[k]+3*b[k]-3*c[k]+d[k])*f*f*f));}
function tube(p,g,step,o){o=o||{};const n=p.length-1;let i=0;
  for(let t=0;t<=n+1e-6;t+=step,i++){
    const q=cr(p,Math.min(t,n)),r=Math.max(q[3],0.6);let col=o.col,b=null;
    if(g){const q2=cr(p,Math.min(t+0.05,n)),q1=cr(p,Math.max(t-0.05,0));
      let T=[q2[0]-q1[0],q2[1]-q1[1],q2[2]-q1[2]];const tl=Math.hypot(T[0],T[1],T[2])||1;T=T.map(v=>v/tl);
      const d=g[0]*T[0]+g[1]*T[1]+g[2]*T[2];b=[g[0]-d*T[0],g[1]-d*T[1],g[2]-d*T[2]];const bl=Math.hypot(b[0],b[1],b[2])||1;b=b.map(v=>v/bl);
      col=skin(b,r,o.glow);}
    ell(q[0],q[1],q[2],r,r,r,col);
    if(r<1)S(q[0],q[1],q[2],typeof col==='function'?col(R(q[0]),R(q[1]),R(q[2]),0,0,0):col);
    if(b&&o.sp&&i%o.sp===0){const L=Math.max(1,R(r*0.8))+((i/o.sp)%2);for(let k=0;k<L;k++)SPK.push([q[0]-b[0]*(r+k),q[1]-b[1]*(r+k),q[2]-b[2]*(r+k),k===0?CYAN:ICE]);}
  }
}

// ================= WINGS (built first so the body overlaps their roots)
function fan(O,A,B,sc,ici){
  for(let i=0;i<=52;i++){const t=i/52,E=[0,1,2].map(k=>A[k]+(B[k]-A[k])*t),sm=1-sc*sin(PI*t);let last=null;
    for(let j=3;j<=52;j++){const q=j/52,s=q*sm,x=R(O[0]+(E[0]-O[0])*s),y=R(O[1]+(E[1]-O[1])*s),z=R(O[2]+(E[2]-O[2])*s),h=hs(x,y,z);
      S(x,y,z,q>0.85?ICE:q>0.55?(h<0.3?ICE:h<0.42?WHITE:LIGHT_BLUE):q>0.28?(h<0.25?LIGHT_BLUE:CYAN):(h<0.2?BLUE:CYAN));last=[x,y,z];}
    if(ici&&i%5===2&&last){const L=1+Math.floor(hs(last[0],last[2],i)*3);for(let d=1;d<=L;d++)S(last[0],last[1]-d,last[2],ICE);}
  }
}
function wing(Sh,W,F,B,sg){
  fan(W,F[0],F[1],0.2);fan(W,F[1],F[2],0.22,1);fan(W,F[2],F[3],0.25,1);fan(Sh,W,F[3],0);fan(Sh,F[3],B,0.22,1);
  tube([[Sh[0],Sh[1],Sh[2],1.6],[W[0],W[1],W[2],1.15]],null,0.05,{col:BLUE});
  F.forEach((f,i)=>{const m=[(W[0]+f[0])/2,(W[1]+f[1])/2-0.8+(i===0?1.6:0),(W[2]+f[2])/2+0.7];
    tube([[W[0],W[1],W[2],1.0],[m[0],m[1],m[2],0.85],[f[0],f[1],f[2],0.6]],null,0.04,{col:BLUE});
    S(f[0],f[1],f[2],MARBLE);S(f[0]+sg*(i<2?1:0),f[1]+(i===0?1:i>1?-1:0),f[2],MARBLE);});
  lineS(W,[W[0]+sg*0.5,W[1]+3.5,W[2]-2.5],t=>t>0.3?MARBLE:BLUE);
  ell(W[0],W[1],W[2],1.5,1.5,1.5,BLUE);
}
wing([3,14,5],[10,24,7],[[20,32,6],[22,24,9],[20,15,10],[13,8,9]],[4,7,9],1);
wing([-3,14,5],[-10,25,7],[[-18,32,6],[-22,27,9],[-21,17,10],[-14,9,9]],[-4,7,9],-1);

// ================= TAIL (curls round the west flank, tip raised)
tube([[0,4.5,11,3.4],[-3,2.6,15,2.9],[-9,1.9,16.5,2.4],[-15,1.6,13.5,1.9],[-18.5,1.4,8,1.5],[-18.5,3.6,2.5,1.1],[-16.5,7,-1,0.8],[-15,10.5,-2,0.6]],[0,-1,0],0.07,{sp:5});
[[-15,15.5,-2],[-17.5,13,-3],[-12.5,13.5,-1.5],[-15,12.5,-4.5],[-16,13,0.5]].forEach(e=>lineS([-15,11,-2],e,t=>t<0.25?CYAN:ICE));
S(-15,11,-2,NEON_BLUE);

// ================= HIND LEGS
[1,-1].forEach(sg=>{
  ell(sg*5,4.3,8,2.7,3.6,3.9,skin([0,-1,0],3.6));
  ell(sg*5.6,1.4,3.6,1.8,1.1,3.0,(x,y,z)=>hs(x,y,z)<0.2?CYAN:LIGHT_BLUE);
  [-1,0,1].forEach(c=>{S(sg*5.6+c,1,0,MARBLE);S(sg*5.6+c,0,-1,MARBLE);});S(sg*5.6,0,-2,MARBLE);
  lineS([sg*6.5,6.5,10.5],[sg*8.5,8.5,12.5],ICE);
});

// ================= TORSO + NECK
tube([[0,5,8.5,4.4],[0,8.5,5.5,4.6],[0,12,2.5,3.9],[0,13.5,1.8,3.2]],[0,-0.5,-1],0.08,{sp:6,glow:1});
tube([[0,13.5,1.8,3.2],[0,17.5,3.6,2.6],[0.3,22,3.2,2.2],[0.9,25.3,0.3,2.0],[1.5,26.2,-3.2,2.0]],[0,-0.5,-1],0.08,{sp:4,glow:1});

// ================= FRONT LEGS: west planted on a frozen boulder, east raised to strike
ell(-6.5,0.8,-4.6,3.1,2.3,2.9,(x,y,z,dx,dy)=>dy>1.2?SNOW:hs(x,y,z)<0.3?ICE:hs(z,x,y)<0.4?COBBLE:STONE);
tube([[-4,11,1,2.0],[-6.5,7.5,0.5,1.5],[-6.5,4.4,-3.5,1.3]],[0,-0.7,-0.7],0.08);
ell(-6.5,3.9,-4.3,1.7,1.0,1.8,LIGHT_BLUE);
[-1.2,0,1.2].forEach(c=>lineS([-6.5+c,3.6,-5.8],[-6.5+c*1.3,2.2,-6.9],MARBLE));
tube([[4,11,1,2.0],[7.5,9,-1.5,1.5],[8.5,12,-5,1.25]],[0,-0.7,-0.7],0.08);
ell(8.5,12.6,-5.6,1.5,1.4,1.5,(x,y,z)=>hs(x,y,z)<0.25?CYAN:LIGHT_BLUE);
[[7.2,15,-7.8],[8.7,15.6,-7.8],[10.3,15,-7.4],[6.8,12,-8]].forEach(e=>lineS([8.5,13,-6.2],e,t=>t>0.35?MARBLE:LIGHT_BLUE));

// ================= HEAD (yawed east, pitched down, jaws open)
const ya=25*PI/180,pa=25*PI/180;
const fw=[sin(ya)*cos(pa),-sin(pa),-cos(ya)*cos(pa)],rt=[cos(ya),0,sin(ya)];
const up=[rt[1]*fw[2]-rt[2]*fw[1],rt[2]*fw[0]-rt[0]*fw[2],rt[0]*fw[1]-rt[1]*fw[0]];
const Ho=[1.5,26,-4];
const HP=(a,b,c)=>[Ho[0]+rt[0]*a+up[0]*b+fw[0]*c,Ho[1]+rt[1]*a+up[1]*b+fw[1]*c,Ho[2]+rt[2]*a+up[2]*b+fw[2]*c];
function hell(a0,b0,c0,ra,rb,rc,col){for(let a=-ra;a<=ra;a+=0.5)for(let b=-rb;b<=rb;b+=0.5)for(let c=-rc;c<=rc;c+=0.5){
  if((a/ra)*(a/ra)+(b/rb)*(b/rb)+(c/rc)*(c/rc)<=1){const p=HP(a0+a,b0+b,c0+c);S(p[0],p[1],p[2],typeof col==='function'?col(a/ra,b/rb,c/rc,p):col);}}}
function hline(a,b,col){lineS(HP(a[0],a[1],a[2]),HP(b[0],b[1],b[2]),col);}
const hp=(a,b,c,id)=>{const p=HP(a,b,c);S(p[0],p[1],p[2],id);};
const hcol=(na,nb,nc,p)=>{const h=hs(R(p[0]),R(p[1]),R(p[2]));return nb<-0.5?WHITE:nb>0.72?(h<0.5?BLUE:CYAN):h<0.15?CYAN:h<0.22?WHITE:LIGHT_BLUE;};
hell(0,0.3,1.5,2.6,2.2,2.8,hcol);
hell(0,-0.2,5.5,1.7,1.3,3.2,hcol);
hell(0,0.7,7.9,1.1,0.6,0.9,WHITE);
const jb=c=>-2.2-0.33*c;
for(let c=0.5;c<=7.5;c+=0.5)hell(0,jb(c),c,1.45-0.05*c,0.7,0.5,(na,nb)=>nb<-0.3?WHITE:LIGHT_BLUE);
[3.5,5,6.5,8].forEach(c=>{hp(1.25,-1.9,c,MARBLE);hp(-1.25,-1.9,c,MARBLE);});
hp(1,-2.6,7.9,MARBLE);hp(-1,-2.6,7.9,MARBLE);
[4,6,7.3].forEach(c=>{hp(1,jb(c)+1,c,MARBLE);hp(-1,jb(c)+1,c,MARBLE);});
hp(0,-1.9,2.5,NEON_BLUE);hp(0,-2.3,3.6,NEON_BLUE);
[1,-1].forEach(sg=>{
  hline([sg*2.1,1.7,2.3],[sg*2.0,1.6,3.8],BLUE);
  hp(sg*2.0,0.9,3.0,NEON_BLUE);hp(sg*1.9,0.8,3.7,NEON_BLUE);
  hline([sg*1.4,1.8,0.5],[sg*2.6,3.6,-3],MARBLE);hline([sg*1.4,1.2,0.3],[sg*2.5,2.9,-2.6],MARBLE);
  hline([sg*2.6,3.6,-3],[sg*3.2,4.5,-6],t=>t>0.5?ICE:MARBLE);
  hline([sg*2.4,0.2,0],[sg*4.6,0.8,-3.5],t=>t<0.3?WHITE:ICE);
  hline([sg*1.6,-1.6,0.5],[sg*3.5,-2.8,-2],t=>t<0.3?WHITE:ICE);
  hp(sg*0.8,1.5,8.4,STEAM);
});
[-0.5,0.8,2.1,3.4].forEach((c,i)=>{hp(0,2.7,c,CYAN);hp(0,3.5,c-0.4,ICE);if(i%2===0)hp(0,4.3,c-0.8,ICE);});
hline([0,jb(3)-0.8,3],[0,jb(3)-2.6,1.5],ICE);hline([0,jb(5)-0.8,5],[0,jb(5)-2,4],ICE);

// ================= FROST BREATH (sparse widening cone + mist)
for(let k=0;k<=12;k+=0.5){const rr=0.4+0.2*k,cb=-2.7-0.15*k,cc=5.5+k,n=1+Math.floor(rr*2.2);
  for(let i=0;i<n;i++){const an=hs(k*2,i,3)*2*PI,rad=Math.sqrt(hs(i,k*2,9))*rr,h=hs(i,k*2,5);
    hp(cos(an)*rad,cb+sin(an)*rad,cc,h<0.55?ICE:h<0.8?WHITE:h<0.92?SNOW:LIGHT_BLUE);}
  if(k<9&&k%1.5===0)hp(0,cb,cc,NEON_BLUE);
}
[[0,-4.5,18.5],[1.5,-4,18],[-1.5,-5,17.5],[0.5,-3,16.5],[-0.8,-5.5,19]].forEach(a=>hp(a[0],a[1],a[2],STEAM));

// ================= dorsal ice spines
SPK.forEach(s=>S(s[0],s[1],s[2],s[3]));

// ================= FROZEN GROUND: pond in front, snow apron under the body
for(let x=-1;x<=6;x++)for(let z=-8;z<=1;z++)G(x,-1,z,hs(x,0,z)<0.12?WHITE:ICE);
for(let x=-8;x<=8;x++)for(let z=-3;z<=13;z++){const d=x*x+(z-5)*(z-5);if(d<=64&&(d<42||hs(x,1,z)<0.55))G(x,0,z,hs(x,2,z)<0.15?ICE:SNOW);}
[1,-1].forEach(sg=>{for(let x=4;x<=7;x++)for(let z=0;z<=6;z++)G(sg*x,0,z,SNOW);});
for(let x=5;x<=8;x++)for(let z=5;z<=12;z++)if(x*x+(z-5)*(z-5)<=64)G(x,-1,z,SNOW);

// ================= ICE CRYSTALS (most important first; budget cap trims from the end)
function spike(x,y,z,h,r,tx,tz){for(let i=0;i<=h;i++){const rr=r*(1-i/h),cx=x+tx*i,cz=z+tz*i,m=Math.ceil(rr);
  for(let dx=-m;dx<=m;dx++)for(let dz=-m;dz<=m;dz++)if(dx*dx+dz*dz<=rr*rr+0.3){
    const X=R(cx)+dx,Z=R(cz)+dz,hh=hs(X,y+i,Z);G(X,y+i,Z,(dx===0&&dz===0&&i<h*0.5&&rr>=1)?LIGHT_BLUE:hh<0.18?WHITE:ICE);}}}
[[8,-1,-9,8,1.9,0.15,-0.1],[-9,0,-9,7,1.7,-0.2,-0.15],[10,-1,-7,5,1.4,0.25,0],[11,-1,-11,6,1.5,0.25,-0.15],
 [-11,0,-6,4,1.2,-0.3,0],[7,-1,-12,4,1.2,-0.1,-0.25],[-12,0,-10,5,1.3,-0.15,-0.2],[3,0,-6,3,0.9,0.1,-0.1],
 [-1,-1,-9,4,1.1,-0.1,-0.2],[-7,0,-11,3,1,0,-0.25],[13,-1,-8,3,1,0.3,0],[5,-1,-10,2,0.8,0,0],
 [9,-2,9,7,1.5,0.2,0.1],[-21,0,5,5,1.2,-0.1,0],[0,0,19,5,1.3,0,0.2],[-12,0,20,4,1.2,0,0.2]].forEach(a=>spike(a[0],a[1],a[2],a[3],a[4],a[5],a[6]));

// ================= hollow hidden interior, then emit
const N6=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]],del=[];
for(const [k,v] of V){if(TRANS.has(v[3])||v[1]<=0)continue;let ok=true;
  for(const d of N6){const n=V.get((v[0]+d[0])+','+(v[1]+d[1])+','+(v[2]+d[2]));if(!n||TRANS.has(n[3])){ok=false;break;}}
  if(ok)del.push(k);}
del.forEach(k=>V.delete(k));

// targeted tree clearing only: around the body, the front view corridor, and along the tail
cylinder(0,1,4,11,9,AIR);
cube(-13,2,-22,13,9,-5,AIR);
cube(-1,1,-16,13,1,-8,AIR);
cylinder(-10,1,13,8,9,AIR);
cylinder(-15,1,5,8,9,AIR);
let cnt=0;
for(const v of V.values()){if(cnt>=3980)break;block(v[0],v[1],v[2],v[3]);cnt++;}