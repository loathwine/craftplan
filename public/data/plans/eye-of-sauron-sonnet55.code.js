// eye-of-sauron-sonnet55 — prompt:
// the Eye of Sauron on the tower of Barad-dur...

const H=(x,y,z)=>{const n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return n-Math.floor(n);};
const dark=(x,y,z)=>{const h=H(x,y,z);return h<0.4?BLACK:h<0.65?OBSIDIAN:h<0.88?GRAY:STONE;};
const rock=(x,y,z)=>{const h=H(x+3,y,z-5);return h<0.3?STONE:h<0.55?GRAY:h<0.8?BLACK:h<0.93?COBBLE:OBSIDIAN;};
const put=(x,y,z,id)=>block(Math.round(x),Math.round(y),Math.round(z),id);
const dist=(x,z)=>Math.hypot(x,z);
const box=(x1,y1,z1,x2,y2,z2,f)=>{for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)put(x,y,z,f(x,y,z));};
const deg=Math.PI/180;

cylinder(0,0,0,13,9,AIR);
cube(-3,0,-22,3,6,-13,AIR);

for(let x=-18;x<=18;x++)for(let z=-18;z<=18;z++){
  const d=dist(x,z);
  if(d>=14.8&&d<=17.2&&H(x,0,z)<0.88)put(x,-1,z,LAVA);
}

const crag=(y,rout,w)=>{
  for(let x=-14;x<=14;x++)for(let z=-14;z<=14;z++){
    const d=dist(x,z);
    const ro=rout+(H(x,y,z)-0.5)*1.4+Math.sin(Math.atan2(z,x)*3+y)*0.9;
    if(d<=ro&&d>=ro-w)put(x,y,z,rock(x,y,z));
  }
};
crag(-1,12.3,4.5);
crag(0,11,4);
crag(1,9.8,3.6);

[-150,-120,-90,-60,-30,20].forEach(a=>{
  line(Math.round(8.5*Math.cos(a*deg)),1,Math.round(8.5*Math.sin(a*deg)),Math.round(12*Math.cos(a*deg)),-1,Math.round(12*Math.sin(a*deg)),LAVA);
});

const spike=(x,z,h)=>{for(let i=0;i<=h;i++){
  const y=-1+i;
  if(i<h*0.4){for(let dx=0;dx<2;dx++)for(let dz=0;dz<2;dz++)put(x+dx,y,z+dz,rock(x+dx,y,z+dz));}
  else put(x+(i>h*0.7?1:0),y,z,rock(x,y,z));
}};
[[-19,-12,12],[18,-14,10],[-20,-2,8],[19,2,14],[-18,12,10],[16,14,12],[-6,19,9],[8,19,11],[-12,-19,9],[12,-19,8]].forEach(s=>spike(s[0],s[1],s[2]));

const rad={9:6.6,10:6.4,11:6.0,12:5.8,13:5.6,14:5.4,15:5.4,16:5.6,17:6.0,18:6.6,19:7.2,20:7.6,21:7.6};
const prof=y=>y<=8?7.4:rad[y];
const winRows={5:1,6:1,13:1,14:1,20:1};
for(let y=2;y<=21;y++){
  const r=prof(y),R=Math.ceil(r)+1;
  for(let x=-R;x<=R;x++)for(let z=-R;z<=R;z++){
    if(Math.abs(dist(x,z)-r)>0.55)continue;
    const k=((Math.atan2(z,x)/deg)+360)%30;
    let id=dark(x,y,z);
    if(y===10||y===18)id=IRON;
    else if(winRows[y]&&k<7)id=NEON_RED;
    put(x,y,z,id);
  }
}
for(let x=-8;x<=8;x++)for(let z=-8;z<=8;z++)if(dist(x,z)<=7.2)put(x,22,z,dark(x,22,z));
for(let k=0;k<36;k+=2){const a=k*10*deg;put(7.4*Math.cos(a),23,7.4*Math.sin(a),OBSIDIAN);put(7.4*Math.cos(a),24,7.4*Math.sin(a),OBSIDIAN);}
for(let k=0;k<12;k++){const a=(k*30+15)*deg;put(8.5*Math.cos(a),20,8.5*Math.sin(a),OBSIDIAN);put(9.3*Math.cos(a),20,9.3*Math.sin(a),BLACK);}

const turret=(cx,cz,sx,sz,top,fire)=>{
  for(let y=2;y<=top;y++)for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++){
    if(x*x+z*z>4)continue;
    put(cx+x,y,cz+z,y===top-1?IRON:dark(cx+x,y,cz+z));
  }
  put(cx+sx,top-4,cz+sz,NEON_RED);put(cx+sx,top-8,cz+sz,NEON_RED);
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++)put(cx+x,top+1,cz+z,OBSIDIAN);
  [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(o=>put(cx+o[0],top+2,cz+o[1],BLACK));
  for(let i=3;i<=6;i++)put(cx,top+i,cz,OBSIDIAN);
  if(fire)put(cx,top+7,cz,FIRE);
};
turret(-6,-6,-1,-1,13,true);
turret(6,-6,1,-1,13,true);
turret(-6,6,-1,1,17,false);
turret(6,6,1,1,17,false);

box(-4,2,-10,4,8,-8,dark);
cube(-1,2,-11,1,5,-6,AIR);
cube(-2,2,-10,-2,5,-10,IRON);cube(2,2,-10,2,5,-10,IRON);cube(-2,6,-10,2,6,-10,IRON);
for(let x=-4;x<=4;x+=2){put(x,9,-10,OBSIDIAN);put(x,9,-8,OBSIDIAN);}
cube(-1,2,-5,1,4,-5,LAVA);
cube(-2,1,-8,2,1,-3,STONE);
cube(-1,11,-6,1,16,-6,RED);cube(0,12,-6,0,15,-6,BLACK);

for(let z=-20;z<=-14;z++)for(let x=-2;x<=2;x++)put(x,-1,z,dark(x,-1,z));
const tops=[-1,-1,0,0,1];
for(let i=0;i<5;i++)cube(-2,-1,-13+i,2,tops[i],-13+i,STONE);
[-20,-16].forEach(z=>[-3,3].forEach(x=>{cube(x,-1,z,x,2,z,IRON);put(x,3,z,FIRE);}));

[-1,1].forEach(s=>{
  const pts=[[6.5,23],[8.5,26],[11,29],[12,33]];
  for(let i=0;i<3;i++)for(let dz=0;dz<2;dz++)for(let dx=0;dx<2;dx++)
    line(s*pts[i][0]+s*dx,pts[i][1],dz,s*pts[i+1][0]+s*dx,pts[i+1][1],dz,i<1?OBSIDIAN:IRON);
});
for(let k=0;k<12;k++){
  const a=(k*30)*deg,c=Math.cos(a),sn=Math.sin(a);
  if(sn<-0.5){line(7*c,23,7*sn,8*c,26,8*sn,IRON);continue;}
  if(Math.abs(c)>0.95)continue;
  line(7*c,23,7*sn,8.8*c,29+(k%3)*2,8.8*sn,k%2?IRON:OBSIDIAN);
}

for(let x=-10;x<=10;x++)for(let y=23;y<=33;y++){
  const dx=x/10,dy=(y-28)/5;
  const t=(1-dx*dx)-Math.abs(dy);
  if(t<0)continue;
  const hw=1.6*(1-dy*dy);
  const pupil=Math.abs(x)<=hw&&Math.abs(dx)<0.35;
  let id;
  if(t<0.12)id=NEON_RED;
  else if(t<0.35)id=H(x,y,0)<0.25?LAVA:ORANGE;
  else if(t<0.6)id=YELLOW;
  else id=GLOWSTONE;
  for(let z=-1;z<=0;z++)put(x,y,z,pupil?BLACK:id);
  if(pupil)put(x,y,-2,BLACK);
  else if(t<0.12)put(x,y,-2,NEON_RED);
}
[[-11,28,-2],[11,28,-2],[-5,32,-2],[5,32,-2]].forEach(p=>put(p[0],p[1],p[2],FIRE));