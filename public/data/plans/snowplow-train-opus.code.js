// snowplow-train-opus — prompt:
// a steam train with a snowplow...

cube(-12,1,-22,12,12,22,AIR);
cube(-6,0,-22,6,0,22,AIR);
let seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
const A=Math.abs;
function hcyl(cx,cy,z1,z2,r,id,shell){const n=Math.ceil(r);for(let z=z1;z<=z2;z++)for(let dx=-n;dx<=n;dx++)for(let dy=-n;dy<=n;dy++){const d=Math.sqrt(dx*dx+dy*dy);if(d<=r+0.25&&(!shell||d>r-1.2))block(cx+dx,cy+dy,z,id);}}
function wheel(x,cy,cz,r){const n=Math.ceil(r);for(let dy=-n;dy<=n;dy++)for(let dz=-n;dz<=n;dz++){const d=Math.sqrt(dy*dy+dz*dz);if(d<=r+0.3)block(x,cy+dy,cz+dz,d>r-0.7?IRON:(d<0.7?BLACK:RED));}}
// track bed, sleepers, rails
for(let z=-22;z<=22;z++){
  for(let x=-5;x<=5;x++)block(x,0,z,(A(x)===5||((x*7+z*13)%3+3)%3===0)?COBBLE:GRAY);
  if(z%2===0)cube(-4,0,z,4,0,z,BROWN);
  block(-3,1,z,IRON);block(3,1,z,IRON);
}
// snow banks thrown aside by the plow
for(let z=-13;z<=22;z++)for(const s of[-1,1])for(let k=0;k<3;k++){
  const top=[0,1,1][k]+(rnd()<0.3?1:0)-(k===2&&rnd()<0.4?1:0);
  for(let y=0;y<=top;y++)block(s*(6+k),y,z,SNOW);
}
// untouched drift ahead of the plow
for(let x=-11;x<=11;x++)for(let z=-22;z<=-21;z++){
  if(z===-21&&A(x)<2)continue;
  const top=1+(A(x)<=6?1:0)+(rnd()<0.4?1:0);
  for(let y=0;y<=top;y++)block(x,y,z,SNOW);
}
// buffer beam
cube(-5,5,-15,5,6,-15,RED);
// wedge snowplow with chevron hazard stripes
for(let y=1;y<=9;y++)for(let x=-6;x<=6;x++){
  const zs=Math.ceil(-20+A(x)+(y-1)*0.5-0.01);
  if(zs>-15)continue;
  for(let z=zs;z<=-15;z++){
    let id=BLACK;
    if(z===zs)id=(y===1)?IRON:((y+A(x))%4<2?YELLOW:BLACK);
    block(x,y,z,id);
  }
  if(y<=2&&A(x)<=5&&(y===1||rnd()<0.5))block(x,y,zs-1,SNOW);
}
// frame
cube(-2,3,-14,-2,6,6,BLACK);cube(2,3,-14,2,6,6,BLACK);
// cylinders
for(const s of[-1,1]){cube(s*4,3,-14,s*5,5,-12,GRAY);cube(s*4,3,-14,s*5,5,-14,IRON);}
// running boards + red valance
cube(-5,7,-13,-4,7,-1,BLACK);cube(4,7,-13,5,7,-1,BLACK);
cube(-5,6,-11,-5,6,-1,RED);cube(5,6,-11,5,6,-1,RED);
// wheels + rods
for(const s of[-1,1]){
  for(const z of[-10,-5,0])wheel(s*3,4,z,2.2);
  wheel(s*3,3,-13,1.2);wheel(s*3,3,4,1.3);
  line(s*4,4,-10,s*4,4,0,IRON);
  line(s*5,4,-12,s*5,5,-5,IRON);
}
// smokebox + door
hcyl(0,10,-14,-12,3,OBSIDIAN,false);
for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const d=Math.sqrt(dx*dx+dy*dy);if(d<=2.2)block(dx,10+dy,-15,d>1.3?IRON:BLACK);}
block(0,10,-16,GOLD);
// headlamp
cube(-1,13,-15,1,15,-14,BLACK);block(0,14,-15,GLOWSTONE);block(0,16,-15,BLACK);
// boiler + brass bands
hcyl(0,10,-11,-1,3,GREEN,true);
for(const z of[-11,-7,-3])hcyl(0,10,z,z,3,GOLD,true);
// smokestack
cylinder(0,13,-12,1.5,5,BLACK);
disk(0,18,-12,2.2,BLACK);disk(0,19,-12,2.2,COPPER);disk(0,19,-12,1.2,AIR);
// domes, bell
sphere(0,13,-6,1.6,GOLD);
sphere(0,13,-2,1.3,GREEN);block(0,15,-2,GOLD);
cube(0,14,-9,0,15,-9,GOLD);block(-1,15,-9,BLACK);block(1,15,-9,BLACK);
// snow dusting on boiler
for(let z=-11;z<=-1;z++){
  if(z===-6||z===-7||z===-5||z===-2||z===-9||z===-3)continue;
  for(let x=-1;x<=1;x++)if(rnd()<0.65)block(x,14,z,SNOW);
  for(const s of[-1,1])if(rnd()<0.4)block(s*2,13,z,SNOW);
}
// cab
cube(-4,6,0,4,17,0,GREEN);
cube(-3,13,0,-2,15,0,GLASS);cube(2,13,0,3,15,0,GLASS);
for(const s of[-1,1]){
  cube(s*4,6,0,s*4,17,6,GREEN);
  cube(s*4,12,1,s*4,15,4,AIR);
  line(s*4,11,1,s*4,11,4,GOLD);line(s*4,16,1,s*4,16,4,GOLD);
  line(s*4,8,0,s*4,8,6,GOLD);
  cube(s*3,6,6,s*3,17,6,GREEN);
}
cube(-2,15,6,2,17,6,GREEN);
line(-4,8,0,4,8,0,GOLD);
cube(-3,7,1,3,7,5,PLANKS);
cube(-5,18,-1,5,18,7,BLACK);cube(-3,19,-1,3,19,7,BLACK);
cube(-3,20,0,3,20,6,SNOW);
for(let z=-1;z<=7;z++)for(const s of[-1,1])if(rnd()<0.5)block(s*4,19,z,SNOW);
// whistle
cube(1,14,-1,1,16,-1,GOLD);
// backhead + firebox glow
cube(-1,8,1,1,10,1,BLACK);block(0,9,1,LAVA);block(-1,12,1,GOLD);block(1,12,1,GOLD);
// engineer leaning at the east window
cube(3,8,2,3,12,2,BLUE);block(3,13,2,SAND);block(3,14,2,BLUE);block(4,12,3,BLUE);block(4,12,2,SAND);
// fireman with shovel
cube(-2,8,3,-2,11,3,BROWN);block(-2,12,3,SAND);block(-2,13,3,BLACK);line(-1,10,3,0,9,2,OAK_LOG);block(0,9,2,IRON);
// couplers
block(0,5,7,IRON);block(0,5,18,IRON);
// tender
cube(-2,4,8,2,4,17,BLACK);
cube(-4,5,8,-4,11,17,GREEN);cube(4,5,8,4,11,17,GREEN);
cube(-4,5,8,4,11,8,GREEN);cube(-4,5,17,4,11,17,GREEN);
cube(-2,9,8,2,11,8,BLACK);
for(const s of[-1,1]){
  line(s*4,6,9,s*4,6,16,GOLD);line(s*4,10,9,s*4,10,16,GOLD);
  line(s*4,6,9,s*4,10,9,GOLD);line(s*4,6,16,s*4,10,16,GOLD);
  cube(s*4,12,8,s*4,12,13,BLACK);
  for(const z of[9,12,15])wheel(s*3,3,z,1.3);
}
cube(-4,12,8,4,12,8,BLACK);cube(-4,12,13,4,12,13,BLACK);
cube(-3,11,14,3,11,16,GREEN);
cube(-1,12,14,1,12,15,BLACK);block(0,13,15,GOLD);
for(let x=-3;x<=3;x++)if(rnd()<0.3)block(x,12,16,SNOW);
// coal heap with snow
for(let z=9;z<=12;z++)for(let x=-3;x<=3;x++){
  const h=11+Math.max(0,Math.round(2.4-A(x)*0.6-A(z-10.5)*0.5+(rnd()-0.5)*0.8));
  for(let y=11;y<=h;y++)block(x,y,z,(y===h&&rnd()<0.3)?OBSIDIAN:BLACK);
  if(rnd()<0.45)block(x,h+1,z,SNOW);
}
// caboose
cube(-2,4,19,2,4,22,BLACK);
cube(-3,5,19,-3,11,22,RED);cube(3,5,19,3,11,22,RED);
cube(-3,5,19,3,11,19,RED);cube(-3,5,22,3,11,22,RED);
cube(-1,5,19,1,9,19,BROWN);block(0,7,19,GOLD);
for(const s of[-1,1]){
  block(s*3,9,20,GLOWSTONE);block(s*3,9,21,GLOWSTONE);
  line(s*3,6,19,s*3,6,22,WHITE);
  wheel(s*3,3,20,1.2);
  block(s*2,8,19,GLASS);
}
cube(-4,12,18,4,12,22,BLACK);
cube(-3,13,19,3,13,22,SNOW);
cube(-2,13,20,2,15,21,RED);
for(const s of[-1,1]){block(s*2,14,20,GLOWSTONE);block(s*2,14,21,GLOWSTONE);}
cube(-3,16,19,3,16,22,BLACK);cube(-2,17,20,2,17,21,SNOW);
cube(2,13,22,2,15,22,GRAY);
// snow spray arcing off the plow wings
for(const s of[-1,1]){
  for(let i=0;i<60;i++){
    const t=rnd();
    const x=s*Math.round(6+t*10+(rnd()-0.5)*1.5);
    const y=Math.round(2+8*Math.sin(Math.PI*Math.min(t*1.05,1))*(1-0.3*t)+(rnd()-0.5)*2);
    const z=Math.round(-18+t*7+(rnd()-0.5)*3);
    if(A(x)<=22&&y>=1)block(x,y,z,SNOW);
  }
  for(let x=13;x<=17;x++)for(let z=-12;z<=-7;z++){
    const top=Math.round(1.5-A(x-15)*0.6-A(z+9.5)*0.4+rnd()*0.6);
    for(let y=0;y<=top;y++)block(s*x,y,z,SNOW);
  }
}
for(let i=0;i<14;i++)block(Math.round((rnd()-0.5)*7),Math.round(10+rnd()*4),Math.round(-20+rnd()*3),SNOW);
// steam
block(0,19,-12,STEAM);block(1,19,-12,STEAM);block(-1,19,-12,STEAM);block(0,19,-11,STEAM);block(0,19,-13,STEAM);
block(0,22,-10,STEAM);block(0,23,-7,STEAM);block(1,24,-4,STEAM);block(0,25,-1,STEAM);
block(-6,2,-13,STEAM);block(6,2,-13,STEAM);
block(1,17,-1,STEAM);
block(2,16,22,STEAM);