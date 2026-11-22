// stave-church-fable — prompt:
// a Norwegian stave church in the snow...

const S=new Map(),G=new Map(),R=[],gnd=[];
const K=(x,y,z)=>x+','+y+','+z;
const P=(x,y,z,id)=>S.set(K(x,y,z),[x,y,z,id]);
const Q=(x,y,z,id)=>G.set(K(x,y,z),[x,y,z,id]);
const D=(x,y,z)=>S.delete(K(x,y,z));
const hh=(x,y,z)=>{const n=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return n-Math.floor(n);};
const box=(x1,y1,z1,x2,y2,z2,id)=>{for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)P(x,y,z,id);};
const ring=(x1,z1,x2,z2,y,fn)=>{for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++)if(x===x1||x===x2||z===z1||z===z2)fn(x,y,z);};
const roof=(x,y,z,w)=>{P(x,y,z,hh(x,y,z)<0.2?BROWN:BLACK);R.push([x,y,z,w]);};
const rf=w=>(x,y,z)=>roof(x,y,z,w);
const st=(x,y,z)=>P(x,y,z,((x+z)&1)?BROWN:OAK_LOG);

// ---------- site: clear trees, snowy churchyard, stone wall ----------
const yard=(x,z)=>Math.pow(Math.abs(x)/15.5,4)+Math.pow(Math.abs(z)/17.5,4);
for(let x=-17;x<=17;x++)for(let z=-19;z<=19;z++){
  const v=yard(x,z);
  if(v<=1)cube(x,0,z,x,9,z,AIR);
  else if(v<=1.3)cube(x,1,z,x,9,z,AIR);
  if(v>1)continue;
  const inside=(Math.abs(x)<=4&&z>=-4&&z<=8)||(Math.abs(x)<=3&&z>=9&&z<=16);
  if(!inside)gnd.push([v,x,z,(Math.abs(x)<=1&&z<=-11&&hh(x,9,z)<0.65)?COBBLE:SNOW]);
  const edge=yard(x+1,z)>1||yard(x-1,z)>1||yard(x,z+1)>1||yard(x,z-1)>1;
  if(edge&&!(z<0&&Math.abs(x)<=1)){
    Q(x,0,z,hh(x,2,z)<0.3?STONE:COBBLE);
    Q(x,1,z,hh(x,5,z)<0.7?SNOW:COBBLE);
  }
}
cube(-6,0,17,6,14,21,AIR);

// ---------- ambulatory (svalgang) ----------
for(let y=0;y<=2;y++)ring(-7,-7,7,11,y,(x,yy,z)=>{
  if(y===1&&((x+z)&1))return;
  P(x,yy,z,y===2?BROWN:(y===1?OAK_LOG:(((x+z)&1)?BROWN:OAK_LOG)));
});
ring(-8,-8,8,12,3,rf(0.75));
ring(-7,-7,7,11,4,rf(0.7));
ring(-6,-6,6,10,5,rf(0.6));

// ---------- aisle tier ----------
[0,1,2,5,6,7].forEach(y=>ring(-5,-5,5,9,y,st));
ring(-6,-6,6,10,8,rf(0.7));
ring(-5,-5,5,9,9,rf(0.6));
ring(-4,-4,4,8,10,rf(0.5));
[-3,2,7].forEach(z=>{P(5,7,z,GLOWSTONE);P(-5,7,z,GLOWSTONE);});
P(2,7,-5,GLOWSTONE);P(-2,7,-5,GLOWSTONE);

// ---------- nave ----------
for(let y=11;y<=13;y++)ring(-3,-3,3,7,y,st);
[-1,2,5].forEach(z=>{P(3,12,z,GLOWSTONE);P(-3,12,z,GLOWSTONE);});
P(0,12,-3,GLOWSTONE);
const nprof=[[4,14],[3,15],[3,16],[2,17],[2,18],[1,19],[1,20],[0,21]];
for(let z=-4;z<=8;z++)nprof.forEach(([ax,y])=>{
  [ax,-ax].forEach(x=>{
    if(z===-4||z===8)P(x,y,z,BROWN);else roof(x,y,z,0.5);
  });
});
[-3,7].forEach(z=>{
  [[14,3],[15,2],[16,2],[17,1],[18,1],[19,0],[20,0]].forEach(([y,w])=>{
    for(let x=-w;x<=w;x++)st(x,y,z);
  });
});
P(0,16,-3,GLOWSTONE);P(0,18,-3,PLANKS);
for(let z=-3;z<=7;z+=2)if(z<0||z>4)P(0,22,z,BLACK);
[[22,-4],[22,-5],[23,-5],[24,-6],[25,-7],[25,-6],[24,-8]].forEach(([y,z])=>{
  P(0,y,z,BLACK);P(0,y,4-z,BLACK);
});

// ---------- ridge turret + spire ----------
for(let y=21;y<=24;y++)ring(-1,1,1,3,y,st);
D(0,23,1);D(0,23,3);D(1,23,2);D(-1,23,2);
P(0,23,2,GOLD);
ring(-2,0,2,4,25,rf(0.6));
for(let x=-1;x<=1;x++)for(let z=1;z<=3;z++)roof(x,26,z,0.3);
[[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dz])=>{P(dx,27,2+dz,OAK_LOG);P(dx,29,2+dz,BLACK);});
for(let x=-1;x<=1;x++)for(let z=1;z<=3;z++)roof(x,28,z,0.4);
P(0,30,2,BLACK);P(0,31,2,BLACK);
P(0,32,2,IRON);P(1,32,2,IRON);P(-1,32,2,IRON);P(0,33,2,IRON);

// ---------- north porch ----------
for(let x=-1;x<=1;x++)for(let y=0;y<=2;y++)D(x,y,-7);
[-2,2].forEach(x=>{
  box(x,0,-10,x,3,-10,OAK_LOG);
  box(x,0,-8,x,2,-8,OAK_LOG);
  P(x,0,-9,BROWN);
});
const pent=z=>z===-8?3:z===-7?4:z===-6?5:-99;
for(let z=-11;z<=-6;z++)[[3,3],[2,4],[2,5],[1,6],[0,7]].forEach(([ax,y])=>{
  if(y<=pent(z))return;
  [ax,-ax].forEach(x=>{if(z===-11)P(x,y,z,BROWN);else roof(x,y,z,0.6);});
});
for(let x=-1;x<=1;x++){P(x,3,-10,BROWN);P(x,4,-10,PLANKS);P(x,5,-10,PLANKS);}
P(0,6,-10,PLANKS);P(0,5,-10,GLOWSTONE);
P(0,8,-11,PLANKS);P(0,9,-11,PLANKS);P(0,10,-11,PLANKS);P(1,9,-11,PLANKS);P(-1,9,-11,PLANKS);
box(-1,-1,-10,1,-1,-6,PLANKS);
P(0,0,-5,RED);P(0,1,-5,RED);P(0,2,-5,PLANKS);
for(let y=0;y<=2;y++){P(1,y,-5,PLANKS);P(-1,y,-5,PLANKS);}
[-3,3].forEach(x=>{P(x,0,-11,COBBLE);P(x,1,-11,GLOWSTONE);P(x,2,-11,SNOW);});

// ---------- chancel + apse (south) ----------
for(let z=10;z<=17;z++)for(let y=0;y<=6;y++){st(4,y,z);st(-4,y,z);}
[[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,2],[10,1],[11,1],[12,0]].forEach(([y,w])=>{
  for(let x=-w;x<=w;x++)st(x,y,17);
});
const aisleTop=z=>z===8?10:z===9?9:z===10?8:-99;
for(let z=8;z<=18;z++)[[5,6],[4,7],[4,8],[3,9],[2,10],[2,11],[1,12],[0,13]].forEach(([ax,y])=>{
  if(y<=aisleTop(z))return;
  [ax,-ax].forEach(x=>{if(z===18)P(x,y,z,BROWN);else roof(x,y,z,0.6);});
});
P(4,3,14,GLOWSTONE);P(-4,3,14,GLOWSTONE);
for(let z=18;z<=20;z++)for(let x=-3;x<=3;x++){
  const d=Math.sqrt(x*x+(z-17)*(z-17));
  if(Math.round(d)===3)for(let y=0;y<=4;y++)st(x,y,z);
  if(d<=3.5)roof(x,5,z,0.7);
  if(d<=2.5)roof(x,6,z,0.6);
  if(d<=1.5)roof(x,7,z,0.5);
}
P(0,8,18,BLACK);P(0,9,18,BLACK);
P(0,2,20,GLOWSTONE);

// ---------- free-standing belfry (stolpe) ----------
const bx=-10,bz=-12;
for(let y=0;y<=2;y++)ring(bx-2,bz-2,bx+2,bz+2,y,st);
ring(bx-2,bz-2,bx+2,bz+2,3,rf(0.75));
for(let y=3;y<=7;y++)ring(bx-1,bz-1,bx+1,bz+1,y,st);
D(bx,6,bz-1);D(bx,6,bz+1);D(bx-1,6,bz);D(bx+1,6,bz);
P(bx,6,bz,GOLD);
ring(bx-2,bz-2,bx+2,bz+2,8,rf(0.7));
for(let x=bx-1;x<=bx+1;x++)for(let z=bz-1;z<=bz+1;z++)roof(x,9,z,0.5);
P(bx,10,bz,BLACK);P(bx,11,bz,BLACK);P(bx,12,bz,IRON);
P(bx,0,bz-2,AIR);P(bx,1,bz-2,AIR);

// ---------- lychgate ----------
[-2,2].forEach(x=>box(x,0,-17,x,3,-17,OAK_LOG));
for(let x=-3;x<=3;x++){
  P(x,4,-17,BROWN);
  roof(x,4,-18,0.8);roof(x,4,-16,0.8);roof(x,5,-17,0.8);
}
P(0,3,-17,GLOWSTONE);

// ---------- roof snow + icicles ----------
R.forEach(([x,y,z,w])=>{
  if(!S.has(K(x,y+1,z))&&hh(x>>1,3,z>>1)<w)P(x,y+1,z,SNOW);
});
R.forEach(([x,y,z])=>{
  if(y===3&&(Math.abs(x)===8||z===12||z===-8)&&Math.abs(x)>3&&hh(x,1,z)<0.2&&!S.has(K(x,2,z)))P(x,2,z,ICE);
});

// ---------- graves ----------
[[8,-14,0],[10,-14,1],[12,-14,0],[9,-11,1],[11,-11,0],[13,-11,1],[11,-6,0],[13,-3,1],[11,1,0],[13,5,1],[11,8,0],[-11,-4,1],[-13,-1,0],[-11,3,0]].forEach(([x,z,t])=>{
  if(t){
    Q(x,0,z,LIGHT_GRAY);Q(x,1,z,LIGHT_GRAY);Q(x,2,z,LIGHT_GRAY);Q(x-1,1,z,LIGHT_GRAY);Q(x+1,1,z,LIGHT_GRAY);
  }else{
    Q(x,0,z,STONE);Q(x,1,z,hh(x,4,z)<0.6?SNOW:STONE);
  }
});

// ---------- snowy pines ----------
const pine=(cx,cz,n)=>{
  Q(cx,0,cz,OAK_LOG);Q(cx,1,cz,OAK_LOG);
  for(let i=0;i<n;i++){
    const y=2+2*i,r=1+(n-1-i)*0.7;
    for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
      const d=Math.sqrt(dx*dx+dz*dz);
      if(d<=r)Q(cx+dx,y,cz+dz,(d>r-1&&hh(cx+dx,y,cz+dz)<0.45)?SNOW:GREEN);
      if(d<=r-0.9||(dx===0&&dz===0))Q(cx+dx,y+1,cz+dz,SNOW);
    }
  }
  Q(cx,2+2*n,cz,SNOW);
};
pine(13,-15,3);
pine(12,13,4);
pine(-12,13,4);
pine(-13,6,3);
pine(7,-15,3);

// ---------- emit (structure first, scenery, then ground; capped to budget) ----------
let n=0;const MAX=3950;
for(const [x,y,z,id] of S.values()){
  if(id===AIR){block(x,y,z,AIR);continue;}
  if(n<MAX){block(x,y,z,id);n++;}
}
for(const [key,v] of G){
  if(S.has(key))continue;
  if(n<MAX){block(v[0],v[1],v[2],v[3]);n++;}
}
gnd.sort((a,b)=>a[0]-b[0]);
for(const [v,x,z,id] of gnd){
  const key=K(x,-1,z);
  if(S.has(key)||G.has(key))continue;
  if(n<MAX){block(x,-1,z,id);n++;}
}