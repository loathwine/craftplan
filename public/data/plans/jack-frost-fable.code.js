// jack-frost-fable — prompt:
// Jack Frost...

const M=new Map();let n=0;const CAP=3950;
const K=(x,y,z)=>x+','+y+','+z;
function rnd(x,y,z){const v=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return v-Math.floor(v);}
function put(x,y,z,id,soft){
  x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;
  if(typeof id==='function')id=id(x,y,z);
  const k=K(x,y,z),c=M.get(k);
  if(c){if(!soft)c.id=id;return;}
  if(n>=CAP)return;
  M.set(k,{x:x,y:y,z:z,id:id});n++;
}
function ell(cx,cy,cz,rx,ry,rz,id,soft){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const d=((x-cx)/rx)**2+((y-cy)/ry)**2+((z-cz)/rz)**2;
    if(d<=1)put(x,y,z,id,soft);
  }
}
function limb(a,b,r,id){
  const m=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2])*2);
  for(let i=0;i<=m;i++){const t=i/m;ell(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,r,r,r,id);}
}
function ln(a,b,id,soft){
  const m=Math.max(1,Math.ceil(Math.max(Math.abs(b[0]-a[0]),Math.abs(b[1]-a[1]),Math.abs(b[2]-a[2]))));
  for(let i=0;i<=m;i++){const t=i/m;put(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,id,soft);}
}
function dsk(cx,y,cz,r,id,soft){
  for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)
  for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++)
    if((x-cx)**2+(z-cz)**2<=r*r)put(x,y,z,id,soft);
}
function front(x,y,id,z0,z1){
  for(let z=z0;z<=z1;z++){const c=M.get(K(x,y,z));if(c){c.id=id;return z;}}
  return null;
}
function spike(cx,cz,y0,h,r,lx,lz){
  for(let i=0;i<=h;i++){
    const rr=r*(1-i/h),ox=cx+lx*i,oz=cz+lz*i,q=Math.ceil(rr);
    for(let dx=-q;dx<=q;dx++)for(let dz=-q;dz<=q;dz++){
      if(dx*dx+dz*dz<=rr*rr+0.3){
        const X=Math.round(ox)+dx,Z=Math.round(oz)+dz,v=rnd(X,y0+i,Z);
        put(X,y0+i,Z,i>=h-1?WHITE:(v<0.22?LIGHT_BLUE:(v<0.3?WHITE:ICE)),true);
      }
    }
  }
}
function flake(x,y,z){
  put(x,y,z,ICE,true);put(x+1,y,z,WHITE,true);put(x-1,y,z,WHITE,true);put(x,y+1,z,WHITE,true);put(x,y-1,z,WHITE,true);
}

// ---------- JACK FROST ----------
const pants=(x,y,z)=>y<=3?SAND:(y<=6?(((x+y+z)&1)?PLANKS:BROWN):BROWN);
// legs
limb([-2,12,0],[-3,7,-1],1.7,pants);
limb([-3,7,-1],[-3,2,0],1.5,pants);
ell(-3,1.3,-1.5,1.6,0.9,2.4,SAND);
limb([2,12,0],[4,7,-1],1.7,pants);
limb([4,7,-1],[4,2,1],1.5,pants);
ell(4.3,1.3,-0.5,1.6,0.9,2.4,SAND);

// hoodie torso
const hoodie=(x,y,z)=>{
  const v=rnd(x,y,z);
  if(y>=20)return v<0.45?WHITE:(v<0.72?LIGHT_BLUE:BLUE);
  if(y>=18)return v<0.18?LIGHT_BLUE:(v<0.27?WHITE:BLUE);
  if(y<=11)return v<0.45?LIGHT_BLUE:BLUE;
  return v<0.04?LIGHT_BLUE:BLUE;
};
ell(0,16.5,0,4.6,5.6,3.1,hoodie);
ell(0,21,3,3.4,2,2,hoodie);
for(let x=-2;x<=2;x++)front(x,14,LIGHT_BLUE,-6,0);
front(-3,13,LIGHT_BLUE,-6,0);front(3,13,LIGHT_BLUE,-6,0);
front(-1,19,WHITE,-6,0);front(-1,18,WHITE,-6,0);front(-1,17,WHITE,-6,0);
front(1,19,WHITE,-6,0);front(1,18,WHITE,-6,0);
// neck
for(let x=-1;x<=1;x++)for(let z=-2;z<=1;z++){put(x,21,z,SAND);put(x,22,z,SAND);}

// staff (drawn before the hand)
ln([13,1,-3],[12,29,-3],OAK_LOG);
[[12,30],[11,31],[10,32],[9,32],[8,31],[8,30],[9,29]].forEach(p=>put(p[0],p[1],-3,OAK_LOG));
put(13,1,-2,OAK_LOG);put(13,2,-2,OAK_LOG);
put(10,30,-3,NEON_BLUE);
put(10,31,-3,ELECTRIC);
put(12,30,-4,ICE,true);put(8,31,-4,ICE,true);put(10,33,-3,ICE,true);put(9,33,-3,WHITE,true);put(7,30,-3,ICE,true);
for(let t=0;t<16;t++){
  const a=t*0.95,y=3+t*0.9,sx=13-(y/28);
  put(sx+2*Math.cos(a),y,-3+2*Math.sin(a),t%3===0?ICE:(t%3===1?WHITE:LIGHT_BLUE),true);
}

// arms
const slvR=(x,y,z)=>{const v=rnd(x,y,z);if(x>=11)return v<0.5?WHITE:LIGHT_BLUE;if(y>=20&&x<=6)return v<0.4?WHITE:(v<0.7?LIGHT_BLUE:BLUE);return v<0.06?LIGHT_BLUE:BLUE;};
const slvL=(x,y,z)=>{const v=rnd(x,y,z);if(x<=-11)return v<0.5?WHITE:LIGHT_BLUE;if(y>=21&&x>=-6)return v<0.4?WHITE:(v<0.7?LIGHT_BLUE:BLUE);return v<0.06?LIGHT_BLUE:BLUE;};
limb([5,20,0],[9,16,-1],1.5,slvR);
limb([9,16,-1],[11.6,18.6,-3],1.3,slvR);
ell(12.3,19.5,-3,1.3,1.3,1.3,SAND);
limb([-5,20,0],[-9,19,-2],1.5,slvL);
limb([-9,19,-2],[-12,22,-5],1.3,slvL);
ell(-12.6,22.8,-5.5,1.3,1.3,1.3,SAND);

// head
ell(0,26,-0.5,4.2,4.2,4.0,SAND);
for(let x=-6;x<=6;x++)for(let y=20;y<=32;y++)for(let z=-6;z<=5;z++){
  const dy=y-26,dz=z+0.5;
  if((x/5.1)**2+(dy/5.1)**2+(dz/4.9)**2>1)continue;
  let ok;
  if(dz<-1.5)ok=dy>=(Math.abs(x)>=3?0:2);
  else if(dz<1.5)ok=dy>=-1;
  else ok=dy>=-3;
  if(ok){const v=rnd(x,y,z);put(x,y,z,v<0.12?LIGHT_GRAY:(v<0.5?WHITE:SNOW));}
}
// hair spikes
[[[0,31,-1],[1,33,-3]],[[-2,31,0],[-4,33,-1]],[[3,30,0],[5,33,1]],[[-4,29,0],[-7,31,0]],
 [[4,29,1],[7,30,2]],[[0,31,2],[0,33,4]],[[-2,30,-3],[-3,31,-6]],[[2,30,-3],[4,31,-5]],
 [[0,28,4],[0,29,6]],[[-3,28,3],[-5,29,5]],[[3,28,3],[5,30,5]],[[0,30,-4],[-1,29,-6]]
].forEach(s=>{ln(s[0],s[1],SNOW);put(s[1][0],s[1][1],s[1][2],ICE);});
// face
front(-1,27,BROWN,-7,0);front(-2,27,BROWN,-7,0);front(1,27,BROWN,-7,0);front(2,27,BROWN,-7,0);
front(-2,26,NEON_BLUE,-7,0);front(-2,25,NEON_BLUE,-7,0);
front(2,26,NEON_BLUE,-7,0);front(2,25,NEON_BLUE,-7,0);
{const zf=front(0,24,SAND,-7,0);if(zf!==null)put(0,24,zf-1,SAND);}
front(-1,23,WHITE,-7,0);front(0,23,WHITE,-7,0);front(1,23,WHITE,-7,0);front(2,23,BROWN,-7,0);

// frost orb in the casting hand
put(-13,25,-6,NEON_BLUE);
put(-14,25,-6,WHITE,true);put(-12,25,-6,WHITE,true);put(-13,26,-6,WHITE,true);
put(-14,26,-6,ICE,true);put(-12,26,-6,ICE,true);put(-14,24,-6,ICE,true);
put(-13,27,-6,ELECTRIC,true);
put(-15,25,-7,ELECTRIC,true);

// ---------- GIANT SNOWFLAKE HALO (behind) ----------
{
  const cx=0,cy=19;
  for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(dx*dx+dy*dy<=6){put(cx+dx,cy+dy,8,ICE,true);put(cx+dx,cy+dy,9,LIGHT_BLUE,true);}
  for(let k=0;k<6;k++){
    const a=(90+60*k)*Math.PI/180,ux=Math.cos(a),uy=Math.sin(a);
    for(let d=2;d<=13;d++){
      const px=cx+ux*d,py=cy+uy*d;
      put(px,py,8,d===13?NEON_BLUE:WHITE,true);
      put(px,py,9,ICE,true);
      if(d<=4){put(px-uy,py+ux,8,ICE,true);put(px+uy,py-ux,8,ICE,true);}
    }
    [[5,4],[8,3],[11,2]].forEach(br=>{
      for(const sgn of [-1,1]){
        const b=a+sgn*Math.PI/3,bx=Math.cos(b),by=Math.sin(b);
        for(let s=1;s<=br[1];s++){
          const px=cx+ux*br[0]+bx*s,py=cy+uy*br[0]+by*s;
          put(px,py,8,s===br[1]?WHITE:ICE,true);
          put(px,py,9,LIGHT_BLUE,true);
        }
      }
    });
  }
}

// ---------- GROUND ----------
for(let x=-13;x<=13;x++)for(let z=-13;z<=13;z++){
  const r=11.3+rnd(x,0,z)*1.4;
  if(x*x+z*z<=r*r)put(x,0,z,rnd(x,5,z)<0.12?WHITE:SNOW,true);
}
for(let x=-2;x<=6;x++)for(let z=-8;z<=1;z++)put(x,-1,z,SNOW,true);
for(let x=5;x<=9;x++)for(let z=5;z<=10;z++)put(x,-1,z,SNOW,true);
dsk(9,0,-9,4.2,SNOW,true);
// frozen pond
for(let x=-8;x<=2;x++)for(let z=-13;z<=-3;z++){
  const d=(x+3)**2+(z+8)**2;
  if(d<=20){const v=rnd(x,1,z);put(x,0,z,v<0.12?WHITE:(v<0.3?LIGHT_BLUE:ICE));}
}
ln([-6,0,-10],[-1,0,-6],WHITE);ln([-4,0,-11],[-2,0,-8],WHITE);
// drifts
ell(-8,0.3,5,3,1.2,2.5,SNOW,true);
ell(6,0.3,4,2.5,1.2,2,SNOW,true);
ell(-9,0.3,-3,2,1.2,2,SNOW,true);
ell(4,0.3,-12,2.5,1.2,1.8,SNOW,true);

// ---------- SNOWMAN ----------
{
  const sx=9,sz=-9;
  ell(sx,3,sz,2.8,2.6,2.8,SNOW,true);
  ell(sx,6.8,sz,2.1,2,2.1,SNOW,true);
  ell(sx,10,sz,1.9,1.9,1.9,SNOW,true);
  for(let x=sx-3;x<=sx+3;x++)for(let z=sz-3;z<=sz+3;z++){
    const d=Math.hypot(x-sx,z-sz);
    if(d<=2.4){if(M.has(K(x,9,z)))M.get(K(x,9,z)).id=RED;else put(x,9,z,RED,true);}
    if(d<=2.1)put(x,12,z,BLACK,true);
  }
  for(let x=sx-1;x<=sx+1;x++)for(let z=sz-1;z<=sz+1;z++){put(x,13,z,RED);put(x,14,z,BLACK);put(x,12,z,BLACK);}
  front(sx-1,11,BLACK,sz-5,sz);front(sx+1,11,BLACK,sz-5,sz);
  {const zf=front(sx,10,ORANGE,sz-5,sz);if(zf!==null){put(sx,10,zf-1,ORANGE);put(sx,10,zf-2,ORANGE);}}
  front(sx,7,BLACK,sz-5,sz);front(sx,6,BLACK,sz-5,sz);front(sx,4,BLACK,sz-5,sz);
  front(sx+1,8,RED,sz-5,sz);front(sx+1,7,RED,sz-5,sz);
  ln([sx+2,7,sz],[sx+5,9,sz-1],OAK_LOG,true);put(sx+5,10,sz-1,OAK_LOG,true);put(sx+6,9,sz-1,OAK_LOG,true);
  ln([sx-2,7,sz],[sx-4,9,sz-1],OAK_LOG,true);put(sx-4,10,sz-1,OAK_LOG,true);
}

// ---------- ICE SPIKES ----------
// A: where the frost lands (front-left)
spike(-15,-11,0,11,2.2,-0.1,-0.1);
spike(-17,-8,0,7,1.6,-0.25,0.05);
spike(-12,-12,0,6,1.5,0.15,-0.25);
spike(-18,-13,0,5,1.3,-0.3,-0.2);
spike(-12,-8,0,4,1.2,0.1,0);
spike(-15,-15,0,8,1.6,-0.05,-0.3);
// B: back-right
spike(15,6,0,13,2.4,0.1,0.05);
spike(17,4,0,8,1.7,0.3,-0.1);
spike(13,8,0,7,1.6,-0.15,0.2);
spike(18,8,0,5,1.3,0.3,0.2);
spike(12,4,0,4,1.2,0,0);
// C: back-left
spike(-12,9,0,10,2,-0.15,0.1);
spike(-14,7,0,6,1.5,-0.3,0);
spike(-10,11,0,5,1.3,0.1,0.3);
// D: pedestal under the snowflake
spike(0,8,1,6,2.5,0,0);
spike(-3,9,1,4,1.5,-0.2,0);
spike(3,9,1,4,1.5,0.2,0);
// E: small shards
spike(-7,-3,1,3,1,-0.2,-0.1);
spike(6,5,1,4,1.2,0.15,0.1);
spike(-5,6,1,3,1,-0.1,0.2);

// ---------- SNOWY PINE ----------
{
  const px=-14,pz=3;
  put(px,1,pz,OAK_LOG,true);put(px,2,pz,OAK_LOG,true);
  [[3,3.2,0],[4,2.2,1],[5,2.6,0],[6,1.6,1],[7,2,0],[8,1.1,1],[9,1.1,0]].forEach(L=>{
    for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
      if(dx*dx+dz*dz<=L[1]*L[1]){
        const v=rnd(px+dx,L[0],pz+dz);
        put(px+dx,L[0],pz+dz,(L[2]?v<0.75:v<0.3)?SNOW:GREEN,true);
      }
    }
  });
  put(px,10,pz,SNOW,true);put(px,11,pz,WHITE,true);
}

// ---------- FROST STREAM from hand to the spikes ----------
for(let i=1;i<=11;i++){
  const t=i/12,s=Math.sin(Math.PI*t);
  const x=-15+(-1.5)*t-2.5*s,y=25-14*t+2*s,z=-7-5*t-1.5*s;
  const j=rnd(i,7,3);
  put(x+(j-0.5),y,z,i%3===0?ICE:(i%3===1?WHITE:LIGHT_BLUE),true);
  if(i%2===0)put(x+1,y+1,z-1+(j<0.5?0:1),WHITE,true);
}
put(-16,11,-12,ELECTRIC,true);

// ---------- FLOATING SNOWFLAKES + SNOWFALL ----------
flake(-17,17,2);flake(16,24,0);flake(18,14,-6);flake(-18,29,4);flake(5,13,-13);flake(-6,10,-14);flake(17,30,5);flake(-9,14,-9);
for(let i=0;i<34;i++){
  const x=Math.floor(rnd(i,1,2)*41)-20,y=6+Math.floor(rnd(i,3,4)*27),z=Math.floor(rnd(i,5,6)*26)-15;
  if(Math.abs(x)<8&&z>-7&&z<7)continue;
  put(x,y,z,rnd(i,9,9)<0.3?ICE:WHITE,true);
}

// ---------- EMIT ----------
for(const c of M.values())block(c.x,c.y,c.z,c.id);
{
  const boxes=[[-19,1,-14,10,7,10],[11,1,-2,18,7,10],[-8,2,-22,9,8,-15]];
  const seen=new Set();
  for(const b of boxes)
    for(let x=b[0];x<=b[3];x++)for(let y=b[1];y<=b[4];y++)for(let z=b[2];z<=b[5];z++){
      const k=K(x,y,z);
      if(M.has(k)||seen.has(k))continue;
      seen.add(k);
      block(x,y,z,AIR);
    }
}