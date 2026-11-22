// stave-church-opus — prompt:
// a Norwegian stave church in the snow...

const H=(x,y,z)=>{let h=(x*374761393+y*668265263+z*1274126177)|0;h=Math.imul(h^(h>>>13),1274126177);h^=h>>>16;return (h>>>0)/4294967296;};
function ring(x1,z1,x2,z2,y,id){for(let x=x1;x<=x2;x++){block(x,y,z1,id);block(x,y,z2,id);}for(let z=z1+1;z<z2;z++){block(x1,y,z,id);block(x2,y,z,id);}}
const WALL=BROWN, ROOF=BLACK, ROOF2=OBSIDIAN;

// ---------- clear old deciduous trees from the site ----------
cube(-16,1,-16,16,7,10,AIR);
cube(17,1,-16,20,7,-2,AIR);
cube(-21,1,3,-17,7,10,AIR);

// ---------- snowy ground ----------
const LOW=[[1,4,-8,-8],[0,0,-7,-1],[2,5,-7,-4],[1,1,-6,0],[6,6,-6,-1],[-1,-1,-6,-2],[-2,-2,-4,-4],[2,3,-3,0],[5,5,-3,0],[4,4,-2,1],[6,6,5,12],[5,5,6,9],[7,9,6,13],[10,11,7,15],[12,12,8,10],[13,13,9,15],[14,14,11,17],[12,12,12,15]];
const isLow=(x,z)=>LOW.some(b=>x>=b[0]&&x<=b[1]&&z>=b[2]&&z<=b[3]);
const isPath=(x,z)=>(z>=-1&&z<=1&&x>=-17&&x<=-14)||((x===-17||x===-16)&&z<=1&&z>=-16);
const inGallery=(x,z)=>x>=-10&&x<=8&&z>=-8&&z<=8;
const inWall=(x,z)=>z===-17&&x>=-20&&x<=20;
for(let x=-21;x<=21;x++)for(let z=-18;z<=10;z++){
  const d=(x/19)**2+((z+4)/13)**2;
  if(d>1.12)continue;
  if(d>0.85&&H(x,0,z)<(d-0.85)/0.27)continue;
  if(inGallery(x,z)||inWall(x,z)||isPath(x,z))continue;
  block(x,0,z,SNOW);
  if(isLow(x,z))block(x,-1,z,SNOW);
}
// trodden cobble path from porch to the churchyard gate
for(let x=-17;x<=-14;x++)for(let z=-1;z<=1;z++)block(x,0,z,COBBLE);
for(let z=-16;z<=-2;z++){block(-17,0,z,COBBLE);block(-16,0,z,COBBLE);}

// ---------- foundation + gallery floor ----------
ring(-10,-8,8,8,0,STONE);
for(let x=1;x<=4;x++)block(x,-1,-8,STONE);
ring(-9,-7,7,7,0,PLANKS);

// ---------- gallery (svalgang) with open arcade ----------
for(let x=-10;x<=8;x++)for(let z=-8;z<=8;z++){
  if(!(x===-10||x===8||z===-8||z===8))continue;
  const door=(x===-10&&z>=-1&&z<=1);
  if(!door)block(x,1,z,WALL);
  const corner=(x===-10||x===8)&&(z===-8||z===8);
  const post=corner||((z===-8||z===8)?(x%2===0):(z%2===0));
  if(post&&!door){block(x,2,z,OAK_LOG);block(x,3,z,OAK_LOG);}
  block(x,4,z,WALL);
}
[[-11,-9,9,9,4],[-10,-8,8,8,5],[-9,-7,7,7,6]].forEach(r=>{ring(r[0],r[1],r[2],r[3],r[4],ROOF);ring(r[0],r[1],r[2],r[3],r[4]+1,SNOW);});
for(let x=-11;x<=9;x++){if(H(x,3,-9)<0.3)block(x,3,-9,ICE);}
for(let z=-8;z<=8;z++){if(H(-11,3,z)<0.2&&(z<-3||z>3))block(-11,3,z,ICE);if(H(9,3,z)<0.2&&(z<-3||z>3))block(9,3,z,ICE);}

// ---------- aisle walls (north face full height, others above gallery roof) ----------
for(let x=-8;x<=6;x++)for(let z=-6;z<=6;z++){
  if(!(x===-8||x===6||z===-6||z===6))continue;
  const y0=(z===-6)?1:8;
  for(let y=y0;y<=11;y++){
    const corner=(x===-8||x===6)&&(z===-6||z===6);
    let id=(corner||(z===-6&&y<8&&x%4===0))?OAK_LOG:WALL;
    if(z===-6&&y>=8&&y<=10){
      if(y===9&&(x===-5||x===-1||x===3))id=GLOWSTONE;
      else if((x===-3||x===1)&&y===9)id=PLANKS;
      else if((x===-4||x===-2||x===0||x===2)&&(y===8||y===10))id=PLANKS;
    }
    if((x===-8||x===6)&&y===9&&z===0)id=GLOWSTONE;
    block(x,y,z,id);
  }
}
[[-9,-7,7,7,11],[-8,-6,6,6,12],[-7,-5,5,5,13]].forEach(r=>{ring(r[0],r[1],r[2],r[3],r[4],ROOF);ring(r[0],r[1],r[2],r[3],r[4]+1,SNOW);});
for(let x=-9;x<=7;x++){if(H(x,10,-7)<0.25)block(x,10,-7,ICE);}
block(-8,2,0,GLOWSTONE);

// ---------- nave clerestory with St Andrew's crosses ----------
for(let x=-6;x<=4;x++)for(let z=-4;z<=4;z++){
  if(!(x===-6||x===4||z===-4||z===4))continue;
  for(let y=14;y<=17;y++){
    const corner=(x===-6||x===4)&&(z===-4||z===4);
    let id=corner?OAK_LOG:WALL;
    if(z===-4&&y>=15){
      if(y===16&&(x===-5||x===-1||x===3))id=GLOWSTONE;
      else if((x===-3||x===1)&&y===16)id=PLANKS;
      else if((x===-4||x===-2||x===0||x===2)&&(y===15||y===17))id=PLANKS;
    }
    block(x,y,z,id);
  }
}

// ---------- steep nave roof, scale shingles, drifted snow ----------
const naveY=dz=>18+(5-dz)*2;
for(let x=-7;x<=5;x++)for(let z=-5;z<=5;z++){
  const dz=Math.abs(z),y=naveY(dz);
  const id=((x+dz)%2===0)?ROOF:ROOF2;
  block(x,y,z,id);block(x,y+1,z,id);
  if(dz>0&&(dz===5||H(x,y+2,z)<0.3))block(x,y+2,z,SNOW);
}
[-6,4].forEach(gx=>{for(let z=-4;z<=4;z++){const dz=Math.abs(z);for(let y=18;y<naveY(dz);y++){
  let id=WALL; if(z===0&&(y===20||y===21))id=GLOWSTONE; else if(dz===0||y%3===0)id=OAK_LOG; block(gx,y,z,id);}}});
for(let x=-6;x<=4;x++){if(x>=-3&&x<=1)continue;if(x%2===0)block(x,30,0,WALL);}

// ---------- ridge turret with bell ----------
for(let y=28;y<=30;y++)for(let x=-2;x<=0;x++)for(let z=-1;z<=1;z++){
  if(x===-1&&z===0)continue;
  const mid=(x===-1||z===0);
  if(y===29&&mid)continue;
  block(x,y,z,(x!==-1&&z!==0)?OAK_LOG:WALL);
}
block(-1,29,0,GOLD);
cube(-3,31,-2,1,31,2,ROOF);ring(-3,-2,1,2,32,SNOW);
cube(-2,32,-1,0,32,1,ROOF2);block(-1,33,0,GOLD);

// ---------- carved dragon heads on the ridge ends ----------
function dragon(x0,d){
  const P=[[1,29],[1,30],[1,31],[2,30],[2,31],[2,32],[3,31],[3,32],[3,33],[4,31],[4,32],[5,31],[5,33]];
  P.forEach(p=>block(x0+d*p[0],p[1],0,WALL));
}
dragon(-7,-1);dragon(5,1);

// ---------- chancel ----------
for(let y=1;y<=12;y++){
  for(let x=7;x<=11;x++){
    if(x<=8&&y<=7)continue;
    const w=(x===10&&y===9)?GLOWSTONE:(x===11||y===12)?OAK_LOG:WALL;
    block(x,y,-3,w);block(x,y,3,(x===11)?OAK_LOG:WALL);
  }
  for(let z=-2;z<=2;z++)block(11,y,z,WALL);
}
const chY=dz=>13+(4-dz)*2;
for(let x=5;x<=12;x++)for(let z=-4;z<=4;z++){
  const dz=Math.abs(z),y=chY(dz);
  const id=((x+dz)%2===0)?ROOF:ROOF2;
  block(x,y,z,id);block(x,y+1,z,id);
  if(dz>0&&x>=7&&(dz===4||H(x,y+2,z)<0.3))block(x,y+2,z,SNOW);
}
for(let z=-3;z<=3;z++){const dz=Math.abs(z);for(let y=13;y<chY(dz);y++)block(11,y,z,(dz===0)?OAK_LOG:WALL);}
block(12,23,0,GOLD);block(12,24,0,GOLD);block(12,25,0,GOLD);block(12,24,-1,GOLD);block(12,24,1,GOLD);

// ---------- round apse with little tower ----------
for(let y=1;y<=9;y++){
  for(let z=-2;z<=2;z++)block(12,y,z,WALL);
  for(let z=-1;z<=1;z++)block(13,y,z,(y===6&&z===0)?GLOWSTONE:WALL);
}
for(let z=-3;z<=3;z++)block(12,10,z,ROOF);
for(let z=-2;z<=2;z++)block(13,10,z,ROOF);
for(let z=-1;z<=1;z++)block(14,10,z,ROOF);
block(12,11,-3,SNOW);block(12,11,3,SNOW);block(13,11,-2,SNOW);block(13,11,2,SNOW);block(14,11,-1,SNOW);block(14,11,0,SNOW);block(14,11,1,SNOW);
for(let z=-2;z<=2;z++)block(12,11,z,ROOF2);
for(let z=-1;z<=1;z++)block(13,11,z,ROOF2);
block(12,12,-2,SNOW);block(12,12,2,SNOW);block(13,12,-1,SNOW);block(13,12,1,SNOW);
for(let z=-1;z<=1;z++)block(12,12,z,ROOF);
block(13,12,0,WALL);block(13,13,0,WALL);block(13,14,0,OAK_LOG);
cube(13,15,-1,14,15,1,ROOF);block(13,16,0,ROOF2);block(13,17,0,GOLD);

// ---------- west porch ----------
for(let y=1;y<=5;y++){
  for(let x=-13;x<=-11;x++){block(x,y,-2,WALL);block(x,y,2,WALL);}
  if(y>3)for(let z=-1;z<=1;z++)block(-13,y,z,(z===0&&y===4)?GOLD:PLANKS);
}
for(let y=1;y<=3;y++){block(-13,y,-2,OAK_LOG);block(-13,y,2,OAK_LOG);}
const poY=dz=>6+(3-dz)*2;
for(let x=-14;x<=-10;x++)for(let z=-3;z<=3;z++){
  const dz=Math.abs(z),y=poY(dz);
  block(x,y,z,ROOF);block(x,y+1,z,ROOF);
  if(dz===3)block(x,y+2,z,SNOW);
}
for(let z=-2;z<=2;z++){const dz=Math.abs(z);for(let y=6;y<poY(dz);y++)block(-13,y,z,dz===0?OAK_LOG:WALL);}
block(-14,14,0,GOLD);block(-14,15,0,GOLD);block(-14,16,0,GOLD);block(-14,15,-1,GOLD);block(-14,15,1,GOLD);
// lantern posts at porch and along the path
[[-15,-3],[-15,3],[-18,-8],[-15,-14]].forEach(p=>{block(p[0],0,p[1],OAK_LOG);block(p[0],1,p[1],OAK_LOG);block(p[0],2,p[1],OAK_LOG);block(p[0],3,p[1],FIRE);});

// ---------- churchyard wall with gate ----------
for(let x=-20;x<=20;x++){
  if(x===-17||x===-16)continue;
  const gate=(x===-18||x===-15);
  block(x,0,-17,COBBLE);block(x,1,-17,(x%5===0)?STONE:COBBLE);
  if(gate){block(x,2,-17,STONE);block(x,3,-17,STONE);block(x,4,-17,SNOW);}
  else block(x,2,-17,SNOW);
}
// snow on the rocky outcrop beyond the wall
[[-15,-2,-22],[-15,-3,-21],[-14,-7,-20],[-5,-3,-20],[-13,-4,-19],[-11,-5,-18]].forEach(r=>{for(let x=r[0];x<=r[1];x++){if((x===-9&&r[2]===-18)||(x===-6&&r[2]===-20))continue;if(H(x,2,r[2])<0.7)block(x,2,r[2],SNOW);}});

// ---------- graves in the snow ----------
function stone(x,z){block(x,1,z,STONE);block(x,2,z,STONE);block(x,3,z,SNOW);block(x+1,1,z,STONE);block(x+1,2,z,SNOW);}
function cross(x,z){block(x,1,z,OAK_LOG);block(x,2,z,OAK_LOG);block(x,3,z,OAK_LOG);block(x-1,2,z,OAK_LOG);block(x+1,2,z,OAK_LOG);block(x,4,z,SNOW);block(x-1,3,z,SNOW);block(x+1,3,z,SNOW);}
stone(-12,-12);cross(-8,-13);stone(-4,-12);cross(1,-13);stone(5,-12);cross(9,-12);
cross(-11,-15);stone(-6,-15);cross(-2,-15);stone(3,-15);cross(7,-15);stone(11,-15);

// ---------- detached bell tower ----------
{const cx=-19,cz=6;
ring(cx-2,cz-2,cx+2,cz+2,0,SNOW);
cube(cx-1,0,cz-1,cx+1,0,cz+1,STONE);
for(let y=1;y<=6;y++)ring(cx-1,cz-1,cx+1,cz+1,y,(y===1||y===6)?OAK_LOG:WALL);
block(cx,1,cz-1,AIR);block(cx,2,cz-1,AIR);
ring(cx-2,cz-2,cx+2,cz+2,6,ROOF);ring(cx-2,cz-2,cx+2,cz+2,7,SNOW);
[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(o=>{block(cx+o[0],7,cz+o[1],OAK_LOG);block(cx+o[0],8,cz+o[1],OAK_LOG);});
block(cx,8,cz,GOLD);block(cx,7,cz,GOLD);
cube(cx-2,9,cz-2,cx+2,9,cz+2,ROOF);ring(cx-2,cz-2,cx+2,cz+2,10,SNOW);
cube(cx-1,10,cz-1,cx+1,10,cz+1,ROOF2);ring(cx-1,cz-1,cx+1,cz+1,11,SNOW);
block(cx,11,cz,ROOF);block(cx,12,cz,ROOF2);block(cx,13,cz,GOLD);}

// ---------- snow-laden spruces ----------
function spruce(cx,cz,big){
  const R=big?[2.6,1.8,2.3,1.5,1.9,1.1,1.4,0.6,0.5]:[2.3,1.5,1.9,1.1,1.4,0.6,0.5];
  const top=3+R.length;
  for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){if(dx*dx+dz*dz<=4)block(cx+dx,0,cz+dz,SNOW);}
  for(let y=0;y<top-1;y++)block(cx,y,cz,OAK_LOG);
  R.forEach((r,i)=>{const y=3+i,rn=R[i+1]||0;
    for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){const q=dx*dx+dz*dz;if(q>r*r)continue;
      if(!(dx===0&&dz===0&&y<top-1))block(cx+dx,y,cz+dz,LEAVES);
      if(q>rn*rn&&H(cx+dx,y,cz+dz)<0.75)block(cx+dx,y+1,cz+dz,SNOW);}
  });
  block(cx,top,cz,SNOW);
}
spruce(15,-12,true);spruce(-14,-8,false);spruce(16,7,true);spruce(-7,12,false);