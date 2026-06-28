// minas-tirith — prompt:
// Minas Tirith, the white city of Gondor from Lord of the Rings - a great tiered mountain city. SHAPE IS KEY: concentric rings of white SNOW walls rising in 6-7 stacked circular tiers up a conical mount...

const AIR=0,GRASS=1,DIRT=2,STONE=3,OAK_LOG=4,LEAVES=5,SAND=6,PLANKS=7,COBBLE=8,BRICK=10,GLASS=11,SNOW=12,ICE=13;
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
function P(x,y,z,id){x=Math.round(x);y=Math.round(y);z=Math.round(z);if(x<-22||x>22||z<-22||z>22||y<-8||y>33)return;block(x,y,z,id);}

// circular wall centered at origin
function wall(R,y0,y1,id,t){
  const band=(t<=1)?0.7:(t/2+0.15);
  const lim=Math.ceil(R+band)+1;
  for(let x=-lim;x<=lim;x++)for(let z=-lim;z<=lim;z++){
    const d=Math.sqrt(x*x+z*z);
    if(d>=R-band&&d<=R+band){for(let y=y0;y<=y1;y++)P(x,y,z,id);}
  }
}
// filled annulus (disk if Ri<=0)
function ring(y,Ro,Ri,id){
  const lim=Math.ceil(Ro)+1;
  for(let x=-lim;x<=lim;x++)for(let z=-lim;z<=lim;z++){
    const d=Math.sqrt(x*x+z*z);
    if(d<=Ro+0.5&&d>=Ri-0.5)P(x,y,z,id);
  }
}
function crenel(R,y,id){
  const n=cl(Math.round(2*Math.PI*R/2.0),8,80);
  for(let k=0;k<n;k++){const a=k/n*2*Math.PI;P(Math.cos(a)*R,y,Math.sin(a)*R,id);}
}
function inFront(deg){return deg>247&&deg<293;}
function turretAt(x,z,y0,h){for(let y=y0;y<y0+h;y++)P(x,y,z,SNOW);P(x,y0+h,z,SAND);}
function houseAt(x,z,y){
  cube(x,y,z,x+1,y+1,z+1,SNOW);
  cube(x,y+2,z,x+1,y+2,z+1,SNOW);
  P(x,y+3,z,SAND);
  P(x+1,y+1,z+1,GLASS);
}

// 0) clear forest in build footprint
for(let y=1;y<=9;y++)disk(0,y,0,21,AIR);

// tier table
const R=[20,17,14,11,8.5,6,4];
const TOP=[2,5,8,11,14,17,20];
const BASE=[-1,3,6,9,12,15,18];
const TH=[2,2,1,1,1,1,1];

// 1) tiered ring walls (white over a cobble base ring)
for(let i=0;i<7;i++){
  wall(R[i],BASE[i],TOP[i]+1,(i===0?COBBLE:SNOW),TH[i]);
}

// 2) citadel cap + 3) white tower with gold spire
ring(20,4,0,SNOW);
ring(20,3.2,0,STONE);
cylinder(0,21,0,2,9,SNOW);
for(let y=21;y<=29;y++){P(2,y,0,STONE);P(-2,y,0,STONE);P(0,y,2,STONE);P(0,y,-2,STONE);}
P(0,24,-2,GLASS);P(0,27,-2,GLASS);P(-2,25,0,GLASS);P(2,25,0,GLASS);
crenel(2,30,SNOW);
disk(0,30,0,2,SAND);disk(0,31,0,1,SAND);P(0,32,0,SAND);P(0,33,0,SAND);

// 4) walkway platforms
for(let i=0;i<7;i++){
  const inner=(i<6)?R[i+1]:0;
  ring(TOP[i],R[i],inner,SNOW);
}
// 5) crenellated parapets
for(let i=0;i<7;i++){crenel(R[i],TOP[i]+2,SNOW);}

// 6) rocky base skirt + outcrops
ring(0,21,17,COBBLE);
ring(-1,21,16,COBBLE);
for(let k=0;k<10;k++){const a=k/10*2*Math.PI;const rx=Math.cos(a)*21;const rz=Math.sin(a)*21;P(rx,0,rz,COBBLE);P(rx,1,rz,COBBLE);}

// 7) the great stone spur / prow, jutting toward the viewer (-Z)
for(let d=1;d<=21;d++){
  const z=-d;
  const yTop=Math.round(20-d*0.78);
  if(yTop<0)break;
  const hw=Math.max(0,Math.round((21-d)/21*2.3));
  for(let x=-hw;x<=hw;x++)for(let y=0;y<=yTop;y++)P(x,y,z,STONE);
  for(let x=-hw-1;x<=hw+1;x++)P(x,-1,z,COBBLE);
}
P(0,4,-21,SNOW);P(0,5,-20,SNOW);P(0,6,-18,SNOW);

// 8) the Great Gate at the prow base
for(let zz=-21;zz<=-18;zz++)for(let x=-1;x<=1;x++)for(let y=1;y<=2;y++)P(x,y,zz,AIR);
for(let x=-2;x<=2;x++)P(x,3,-19,STONE);
P(-2,1,-18,STONE);P(2,1,-18,STONE);P(-2,2,-18,STONE);P(2,2,-18,STONE);
turretAt(-3,-18,0,6);turretAt(3,-18,0,6);

// 9) little towers and houses on every ring
for(let i=0;i<7;i++){
  const nT=cl(Math.round(2*Math.PI*R[i]/6),5,12);
  for(let k=0;k<nT;k++){
    const a=k/nT*2*Math.PI;const deg=(a*180/Math.PI)%360;
    if(inFront(deg))continue;
    turretAt(Math.cos(a)*R[i],Math.sin(a)*R[i],TOP[i],4);
  }
  if(i<6){
    const inner=R[i+1];const rb=(R[i]+inner)/2;
    const nH=cl(Math.round(2*Math.PI*rb/8),3,8);
    for(let k=0;k<nH;k++){
      const a=(k+0.5)/nH*2*Math.PI;const deg=(a*180/Math.PI)%360;
      if(inFront(deg))continue;
      houseAt(Math.round(Math.cos(a)*rb),Math.round(Math.sin(a)*rb),TOP[i]);
    }
  }
}

// 10) a little glass scattered in the lower walls
for(let i=0;i<4;i++){
  const ww=cl(Math.round(2*Math.PI*R[i]/9),4,8);
  for(let k=0;k<ww;k++){
    const a=k/ww*2*Math.PI;const deg=(a*180/Math.PI)%360;
    if(inFront(deg))continue;
    const yy=Math.max(BASE[i]+1,TOP[i]-1);
    P(Math.cos(a)*R[i],yy,Math.sin(a)*R[i],GLASS);
  }
}