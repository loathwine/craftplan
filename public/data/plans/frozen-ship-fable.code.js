// frozen-ship-fable — prompt:
// a ship trapped in Arctic pack ice...

const M=new Map(),K=(x,y,z)=>x+','+y+','+z;
const OPQ=id=>!(id===ICE||id===GLASS||id===WATER||id===FIRE||id===STEAM||id===ELECTRIC||id===AIR);
let P=2;
function put(x,y,z,id,p){x=Math.round(x);y=Math.round(y);z=Math.round(z);
  if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;
  M.set(K(x,y,z),[x,y,z,id,p===undefined?P:p]);}
const has=(x,y,z)=>M.has(K(x,y,z));
const h=(a,b,s)=>{const n=Math.sin(a*127.1+b*311.7+(s||0)*74.7)*43758.5453;return n-Math.floor(n);};
function ln(x1,y1,z1,x2,y2,z2,f){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1))));
  for(let i=0;i<=n;i++){const t=i/n;f(Math.round(x1+(x2-x1)*t),Math.round(y1+(y2-y1)*t),Math.round(z1+(z2-z1)*t));}}

// ---------- PACK ICE FIELD (Voronoi floes, water cracks) ----------
const inField=(x,z)=>x*x/462+(z+3)*(z+3)/210+(h(x,z,1)-0.5)*0.1<=1;
const seeds=[];for(let i=0;i<22;i++)seeds.push([-21+h(i,3,2)*42,-17+h(i,7,5)*28,h(i,1,9)]);
for(let x=-22;x<=22;x++)for(let z=-18;z<=12;z++){
  if(!inField(x,z))continue;
  let d1=1e9,d2=1e9,s=seeds[0];
  for(const sd of seeds){const dx=x-sd[0]+(h(x,z,4)-0.5)*0.9,dz=z-sd[1]+(h(z,x,8)-0.5)*0.9,d=Math.sqrt(dx*dx+dz*dz);
    if(d<d1){d2=d1;d1=d;s=sd;}else if(d<d2)d2=d;}
  const r=h(x,z,3),col=r<0.05?LIGHT_BLUE:((s[2]*7)%1<0.5?SNOW:WHITE);
  if(d2-d1<0.8&&h(x>>1,z>>1,6)<0.8){put(x,0,z,WATER,1);continue;}
  const raised=s[2]<0.32&&!(s[1]<-5&&Math.abs(s[0])<15);
  put(x,0,z,col,1);
  if(raised)put(x,1,z,(d2-d1<1.7&&r<0.5)?LIGHT_BLUE:col,1);
}
// open lead of dark water running to the foreground
ln(7,0,-5,17,0,-17,(x,y,z)=>{for(let o=0;o<2;o++)if(inField(x+o,z)){put(x+o,0,z,WATER,1);M.delete(K(x+o,1,z));}});

// ---------- ICE FORMATIONS ----------
function col(x,z,t,s){for(let y=1;y<=t;y++){const q=h(x+y*3,z-y,s);
  put(x,y,z,y===t?SNOW:q<0.15?ICE:q<0.5?LIGHT_BLUE:q<0.56?CYAN:WHITE);}}
function berg(cx,cz,r,H,s,sq){for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){
  const d=Math.sqrt(dx*dx+dz*dz*(sq||1.6))/r;if(d>=1)continue;
  col(cx+dx,cz+dz,Math.round(H*Math.pow(1-d,0.75)+(h(cx+dx,cz+dz,s)-0.5)*2.5),s+1);}}
function ridge(x1,z1,x2,z2,H,s){ln(x1,0,z1,x2,0,z2,(x,y,z)=>{for(let o=-1;o<=1;o++)
  col(x,z+o,Math.round(H*(o?0.4:1)*(0.35+h(x,z+o,s)*0.9)),s+1);});}
P=3;
berg(-16,9,5,13,11);berg(-8,10,3,6,21);berg(14,9,5,11,31);berg(20,2,3,6,41);
berg(4,11,3,5,51);berg(-21,-2,3,5,61);berg(9,12,3,7,55);
ridge(-21,-8,-16,-13,3,71);
for(let i=0;i<16;i++){const x=Math.round(-20+h(i,1,7)*40),z=Math.round(-15+h(i,2,7)*24);
  if((z>-5||Math.abs(x)>17)&&inField(x,z))col(x,z,1+Math.floor(h(i,3,7)*2.5),77);}

// ---------- SHIP TRANSFORM (heeled to north, bow lifted) ----------
const SX=-2,SY=1,SZ=3;
function S(u,v,w,id,soft){u=Math.round(u);v=Math.round(v);w=Math.round(w);
  const zl=w-Math.round(v*0.27),x=SX+u,y=SY+v+Math.round(zl*0.25+u*0.06),z=SZ+zl-Math.round(u*0.1);
  if(y<0)return;if(soft&&has(x,y,z))return;put(x,y,z,id,0);}
function L(u1,v1,w1,u2,v2,w2,id,soft){ln(u1,v1,w1,u2,v2,w2,(a,b,c)=>S(a,b,c,id,soft));}

// pressure ice crushed up against the hull
for(let u=-18;u<=18;u++){const x=SX+u,zn=SZ-3-Math.round(u*0.1),zs=SZ+3-Math.round(u*0.1);
  const big=(u===-13||u===-5||u===6||u===11)?2:0;
  col(x,zn-1,1,81);
  col(x,zn-2,1+Math.floor(h(u,2,82)*3)+big,81);
  col(x,zn-3,Math.floor(h(u,3,82)*2.6)+big/2,81);
  col(x,zn-4,Math.floor(h(u,4,82)*1.6),81);
  col(x,zs,2,83);
  col(x,zs+1,2+Math.floor(h(u,5,82)*3),83);
  col(x,zs+2,Math.floor(h(u,6,82)*2.4),83);
}
berg(15,-1,3,5,85);

// ---------- HULL ----------
const deckV=u=>5+(u>=10?1:0)+(u<=-11?1:0);
function inHull(u,v,w){if(v<-2||v>deckV(u))return false;
  let ue=u;if(u>6)ue=u+Math.max(0,4-v)*0.5;else if(u<-9)ue=u-Math.max(0,3-v)*0.5;
  if(ue>16||ue<-16)return false;
  let hw=3.4;if(ue>9)hw=3.4-(ue-9)*0.52;else if(ue<-12)hw=3.4-(-12-ue)*0.35;
  if(v<=-1)hw-=1;if(v<=-2)hw-=0.8;
  return Math.abs(w)<=hw;}
for(let u=-16;u<=15;u++){const dk=deckV(u);
  for(let v=-2;v<=dk;v++)for(let w=-4;w<=4;w++){
    if(!inHull(u,v,w))continue;
    const top=!inHull(u,v+1,w),sw=!inHull(u,v,w-1)||!inHull(u,v,w+1),se=!inHull(u-1,v,w)||!inHull(u+1,v,w);
    if(!top&&!sw&&!se)continue;
    let id;
    if(top){if(sw||u>=15||u<=-16){id=BLACK;S(u,v+1,w,BROWN);}else id=h(u,w,91)<0.25?SNOW:PLANKS;}
    else if(v<=0)id=BRICK;
    else if(v===3&&Math.abs(w)===3&&((u%4)+4)%4===0&&u>=-8&&u<=8)id=GLOWSTONE;
    else if(v===4)id=WHITE;
    else id=(v===1&&h(u,w,92)<0.3)?SNOW:BLACK;
    S(u,v,w,id);
  }}
S(-16,1,0,BROWN);S(-16,2,0,BROWN);

// ---------- DECK FITTINGS ----------
for(let u=-8;u<=-2;u++)for(let w=-1;w<=1;w++){S(u,8,w,SNOW);
  for(let v=6;v<=7;v++){if(!(Math.abs(w)===1||u===-8||u===-2))continue;
    S(u,v,w,(v===7&&Math.abs(w)===1&&(u===-7||u===-5||u===-3))?GLOWSTONE:(u===-2&&w===0&&v===6?BROWN:PLANKS));}}
for(let u=-5;u<=-4;u++)for(let w=-1;w<=0;w++)for(let v=9;v<=13;v++)S(u,v,w,v===13?BLACK:YELLOW);
S(-5,15,0,STEAM);S(-4,16,-1,STEAM);
for(let u=3;u<=5;u++)for(let w=-1;w<=1;w++)S(u,6,w,(u===4&&w===0)?SNOW:BROWN);
S(12,7,0,IRON);S(12,7,1,IRON);S(13,5,-2,IRON);S(13,4,-2,IRON);
S(-13,7,0,BROWN);S(-13,8,0,BROWN);S(-12,7,0,GOLD);
for(let u=-8;u<=-5;u++){S(u,7,3,WHITE);S(u,8,3,BROWN);}
for(const w of [-3,3])for(const u of [-9,-4]){S(u,7,w,IRON);S(u,8,w,IRON);S(u,9,w,IRON);}
S(2,6,-1,BLACK);S(2,7,-1,BLUE);S(2,8,-1,PINK);

// ---------- MASTS, YARDS, SAILS ----------
for(const m of [[7,25],[0,27],[-10,21]])for(let v=6;v<=m[1];v++)S(m[0],v,0,v<16?OAK_LOG:BROWN);
function yard(mu,v,n){for(let i=-n;i<=n;i++){const u=mu+Math.round(i*0.8),w=Math.round(i*0.6);
  S(u,v,w,BROWN);if(i&&Math.abs(i)<n)S(u,v+1,w,WHITE);if(i&&h(mu+i,v,95)<0.2)S(u,v-1,w,ICE);}}
yard(7,11,5);yard(7,16,4);yard(7,21,3);
yard(0,12,5);yard(0,17,4);yard(0,22,3);yard(0,25,2);
for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;S(7+a,14,b,PLANKS);S(a,20,b,BROWN);}
L(-11,9,0,-16,9,0,BROWN);L(-11,10,0,-15,10,0,WHITE);
L(-11,17,0,-15,19,0,BROWN);L(-11,16,0,-14,17,0,WHITE);
L(15,7,0,21,10,0,BROWN);S(17,7,0,ICE);S(19,8,0,ICE);S(20,8,0,ICE);
S(-1,27,0,RED);S(-2,27,0,RED);S(-1,26,0,RED);

// ---------- RIGGING ----------
L(7,25,0,21,10,0,GRAY,1);L(7,17,0,17,8,0,GRAY,1);
L(0,27,0,7,17,0,GRAY,1);L(-10,21,0,0,13,0,GRAY,1);L(-10,21,0,-16,8,0,GRAY,1);
for(const m of [[7,14],[0,15],[-10,13]])for(const w of [-3,3]){
  L(m[0],m[1],0,m[0]-2,7,w,GRAY,1);L(m[0],m[1],0,m[0]+1,7,w,GRAY,1);}

// ---------- GANGWAY + CAMP ON THE ICE ----------
P=0;
for(let i=0;i<5;i++)for(const x of [2,3])put(x,5-i,-3-i,PLANKS);
const top=(x,z)=>{let y=1;while(has(x,y,z))y++;return y;};
function man(x,z,coat){const y=top(x,z);put(x,0,z,SNOW,1);put(x,y,z,BLACK);put(x,y+1,z,coat);put(x,y+2,z,PINK);}
function tent(cx,cz,c){for(let d=0;d<4;d++){const z=cz+d,e=d===0||d===3;
  for(let dx=-2;dx<=2;dx++){put(cx+dx,0,z,SNOW,1);const ht=3-Math.abs(dx);
    for(let y=1;y<=3;y++){if(y>ht)M.delete(K(cx+dx,y,z));else if(y===ht||e)put(cx+dx,y,z,c);}}}
  put(cx,1,cz,BLACK);put(cx,2,cz,BLACK);}
tent(-9,-12,GREEN);tent(-14,-10,GREEN);tent(3,-14,ORANGE);
// campfire
put(-10,1,-15,COBBLE);put(-8,1,-15,COBBLE);put(-9,1,-16,COBBLE);put(-9,1,-14,COBBLE);
put(-9,0,-15,SNOW,1);put(-9,1,-15,OAK_LOG);put(-9,2,-15,FIRE);
man(-11,-14,BROWN);man(-7,-15,BLUE);
// lifeboat being hauled toward the lead
for(let x=-4;x<=1;x++)for(const z of [-10,-9]){put(x,0,z,SNOW,1);
  if(x>-4&&x<1)put(x,1,z,WHITE);else M.delete(K(x,1,z));
  put(x,2,z,(x===-4||x===1)?WHITE:PLANKS);}
man(3,-10,BROWN);man(5,-9,GRAY);man(7,-10,BLUE);
ln(2,2,-10,7,2,-10,(x,y,z)=>{if(!has(x,y,z))put(x,y,z,GRAY);});
// dog sled
function dog(x,z,c){const y=top(x,z);put(x,y,z,c);put(x+1,y,z,c);put(x+1,y+1,z,c===GRAY?WHITE:c);}
ln(-15,1,-5,-6,1,-5,(x,y,z)=>{if(!has(x,y,z))put(x,y,z,GRAY);});
dog(-13,-5,GRAY);dog(-10,-5,BROWN);dog(-7,-5,GRAY);
for(let x=-18;x<=-16;x++){put(x,0,-5,SNOW,1);put(x,1,-5,PLANKS);}
put(-17,2,-5,BROWN);put(-18,2,-5,PLANKS);man(-19,-5,BROWN);
// stores, lantern, flag
put(5,1,-7,PLANKS);put(6,1,-7,BROWN);put(5,2,-7,BROWN);put(6,1,-6,PLANKS);put(4,1,-8,PLANKS);put(6,2,-6,SNOW);
put(1,1,-7,BROWN);put(1,2,-7,BROWN);put(1,3,-7,GLOWSTONE);
for(let y=1;y<=6;y++)put(-6,y,-8,IRON);
put(-5,6,-8,RED);put(-4,6,-8,RED);put(-5,5,-8,RED);put(-4,5,-8,WHITE);
// polar bear on a blue hummock, watching the men across the lead
for(let x=14;x<=19;x++)for(let z=-10;z<=-6;z++){
  if((x===14||x===19)&&(z===-10||z===-6))continue;
  put(x,1,z,h(x,z,97)<0.55?LIGHT_BLUE:WHITE);}
for(const x of [15,18])for(const z of [-9,-7])put(x,2,z,WHITE);
for(let x=15;x<=18;x++)for(let y=3;y<=4;y++)for(let z=-9;z<=-7;z++)put(x,y,z,WHITE);
put(14,4,-8,WHITE);put(14,5,-8,WHITE);put(15,5,-9,WHITE);put(15,5,-7,WHITE);put(13,4,-8,BLACK);

// ---------- EMIT: drop hidden cells, cap budget, then clear trees ----------
const solid=(x,y,z)=>{const c=M.get(K(x,y,z));return !!c&&OPQ(c[3]);};
let out=[...M.values()].filter(c=>{const x=c[0],y=c[1],z=c[2];
  if(!OPQ(c[3])||c[3]===GLOWSTONE)return true;
  return !(solid(x+1,y,z)&&solid(x-1,y,z)&&solid(x,y+1,z)&&solid(x,y,z+1)&&solid(x,y,z-1)&&(y<=0||solid(x,y-1,z)));});
out.sort((a,b)=>a[4]-b[4]);
out=out.slice(0,3980);
for(const c of out)block(c[0],c[1],c[2],c[3]);
for(let x=-22;x<=22;x++)for(let z=-20;z<=14;z++){const f=inField(x,z);
  if(!f&&x*x/560+(z+3)*(z+3)/280>1)continue;
  for(let y=f?1:2;y<=8;y++)if(!has(x,y,z))block(x,y,z,AIR);}