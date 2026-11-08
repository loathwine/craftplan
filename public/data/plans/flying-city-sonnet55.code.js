// flying-city-sonnet55 — prompt:
// a steampunk flying city...

const PI=Math.PI, sq=Math.sqrt;
function hh(x,y,z){let n=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,1274126177);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)%100;}
function shell4(x1,y1,z1,x2,y2,z2,id){cube(x1,y1,z1,x2,y2,z1,id);cube(x1,y1,z2,x2,y2,z2,id);cube(x1,y1,z1,x1,y2,z2,id);cube(x2,y1,z1,x2,y2,z2,id);}
function discXY(cx,cy,z,r,id){const R=Math.ceil(r);for(let dx=-R;dx<=R;dx++)for(let dy=-R;dy<=R;dy++)if(dx*dx+dy*dy<=r*r)block(cx+dx,cy+dy,z,id);}
function gear(cx,cy,z,r,ring,spoke,teeth){
  const N=Math.max(8,Math.round(r*3.2));
  for(let dx=-r-2;dx<=r+2;dx++)for(let dy=-r-2;dy<=r+2;dy++){
    const d=sq(dx*dx+dy*dy);
    if(d<=r&&d>r-1.5)block(cx+dx,cy+dy,z,ring);
    else if(d<=r-1.5&&(dx===0||dy===0||Math.abs(dx)===Math.abs(dy)))block(cx+dx,cy+dy,z,spoke);
    else if(d>r&&d<=r+1.2){const a=Math.atan2(dy,dx)+PI;if(Math.floor(a/(2*PI)*N)%2===0)block(cx+dx,cy+dy,z,teeth);}
  }
  cube(cx-1,cy-1,z,cx+1,cy+1,z,GOLD);
}
function ellShell(cx,cy,cz,a,b,c,t,fn){
  for(let x=Math.floor(cx-a);x<=Math.ceil(cx+a);x++)for(let y=Math.floor(cy-b);y<=Math.ceil(cy+b);y++)for(let z=Math.floor(cz-c);z<=Math.ceil(cz+c);z++){
    const v=((x-cx)/a)**2+((y-cy)/b)**2+((z-cz)/c)**2;
    if(v<=1&&v>=1-t)fn(x,y,z);
  }
}
function pyr(x1,z1,x2,z2,y,id){
  let l=0;
  while(x1+l<=x2-l&&z1+l<=z2-l){
    const a=x1+l,b=x2-l,c=z1+l,e=z2-l,Y=y+l;
    if(b-a<=2||e-c<=2)cube(a,Y,c,b,Y,e,id);
    else{cube(a,Y,c,b,Y,c,id);cube(a,Y,e,b,Y,e,id);cube(a,Y,c+1,a,Y,e-1,id);cube(b,Y,c+1,b,Y,e-1,id);}
    l++;
  }
}
function house(x1,z1,w,d,h,wall,roof,steam){
  const x2=x1+w-1,z2=z1+d-1,top=15+h;
  shell4(x1,16,z1,x2,top,z2,wall);
  for(const [cx,cz] of [[x1,z1],[x2,z1],[x1,z2],[x2,z2]])cube(cx,16,cz,cx,top,cz,OAK_LOG);
  const dx=x1+Math.floor(w/2);
  cube(dx,16,z1,dx,17,z1,BROWN);
  block(dx,18,z1,GLOWSTONE);
  for(const wx of [x1+1,x2-1])cube(wx,top-2,z1,wx,top-1,z1,GLASS);
  const mz=z1+Math.floor(d/2);
  cube(x1,top-2,mz,x1,top-1,mz,GLASS);cube(x2,top-2,mz,x2,top-1,mz,GLASS);
  pyr(x1-1,z1-1,x2+1,z2+1,top+1,roof);
  const cxm=x2-1,czm=z1+1;
  cube(cxm,top+4,czm,cxm,top+6,czm,IRON);
  if(steam)block(cxm,top+7,czm,STEAM);
}
function stack(x,z,h){
  for(let y=0;y<h;y++){cylinder(x,16+y,z,1,1,(y%4===3)?COPPER:IRON);}
  cube(x-1,16+h,z-1,x+1,16+h,z+1,COPPER);
  block(x,17+h,z,STEAM);
}
function lamp(x,z){cube(x,16,z,x,18,z,IRON);block(x,19,z,GLOWSTONE);}

// ---------- main island ----------
for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){
  const d=sq(x*x+z*z);if(d>12)continue;
  const h=hh(x,15,z);
  let id=COBBLE;
  if(h<25)id=STONE;else if(h<32)id=GRAY;
  if(d>10.3&&h<30)id=GRASS;
  if(Math.abs(x)<=1&&z<2)id=LIGHT_GRAY;
  block(x,15,z,id);
}
for(let y=14;y>=6;y--){
  const r=12*Math.pow((y-5)/10,0.8);
  for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){
    const d=sq(x*x+z*z);
    if(d<=r&&(d>r-1.5||y<=8)){
      const h=hh(x,y,z);
      let id=h<40?STONE:h<75?COBBLE:h<90?GRAY:DIRT;
      if(y===12)id=h<50?IRON:COPPER;
      block(x,y,z,id);
    }
  }
}
block(0,5,0,LAVA);block(0,6,0,LAVA);
// rim
for(let a=0;a<360;a+=3){block(Math.round(11.8*Math.cos(a*PI/180)),16,Math.round(11.8*Math.sin(a*PI/180)),IRON);}
for(let a=0;a<360;a+=45){const x=Math.round(11.8*Math.cos(a*PI/180)),z=Math.round(11.8*Math.sin(a*PI/180));block(x,17,z,IRON);block(x,18,z,IRON);block(x,19,z,GLOWSTONE);}
cube(5,16,-12,10,19,-8,AIR);
cube(-13,16,-9,-9,19,-4,AIR);

// ---------- clock tower ----------
shell4(-3,16,2,3,28,8,BRICK);
for(const [cx,cz] of [[-3,2],[3,2],[-3,8],[3,8]])cube(cx,16,cz,cx,28,cz,STONE);
shell4(-3,21,2,3,21,8,IRON);shell4(-3,27,2,3,27,8,IRON);
for(const x of [-3,3]){cube(x,18,5,x,19,5,GLASS);cube(x,24,5,x,25,5,GLASS);}
cube(-1,18,8,1,19,8,GLASS);cube(-1,24,8,1,25,8,GLASS);
cube(-1,16,2,1,17,2,BROWN);cube(-1,18,2,1,18,2,GOLD);
discXY(0,22,1,3.2,GOLD);discXY(0,22,1,2.4,WHITE);
for(const [tx,ty] of [[0,24],[0,20],[2,22],[-2,22]])block(tx,ty,1,BLACK);
line(0,22,0,0,24,0,BLACK);line(0,22,0,2,21,0,BLACK);block(0,22,0,GOLD);
pyr(-4,1,4,9,29,COPPER);
block(0,33,5,GOLD);
for(const [cx,cz] of [[-4,1],[4,1],[-4,9],[4,9]])block(cx,30,cz,IRON);
// gears
gear(-8,25,1,5,COPPER,IRON,COPPER);
gear(7,26,1,3,GOLD,IRON,GOLD);
gear(-14,29,1,3,IRON,COPPER,IRON);
gear(11,22,1,2,IRON,GOLD,IRON);
cube(-8,16,1,-8,19,1,IRON);
line(3,26,1,4,26,1,IRON);

// ---------- town ----------
house(-8,-8,5,5,4,BRICK,COPPER,true);
house(-11,-3,5,4,4,STONE,CYAN,true);
house(3,-9,5,4,5,BRICK,COPPER,false);
house(-7,4,4,4,5,PLANKS,CYAN,false);
// fountain
cube(-1,16,-7,1,16,-5,GRAY);block(0,16,-6,WATER);block(0,17,-6,COPPER);block(0,18,-6,WATER);
lamp(-2,-9);lamp(2,-11);lamp(-2,-2);lamp(2,-2);
// stacks and pipes
stack(-9,6,10);stack(5,10,14);stack(-5,10,15);
line(-5,16,9,5,16,9,COPPER);cube(0,16,9,0,18,9,COPPER);
// tank
for(const [lx,lz] of [[7,5],[9,5],[7,7],[9,7]])cube(lx,16,lz,lx,20,lz,IRON);
cylinder(8,21,6,2,3,COPPER);cylinder(8,22,6,2,1,IRON);cylinder(8,24,6,1,1,COPPER);block(8,25,6,IRON);
// greenhouse dome
(function(){
  const cx=7,cy=16,cz=-1,r=4;
  for(let x=cx-r;x<=cx+r;x++)for(let y=cy;y<=cy+r;y++)for(let z=cz-r;z<=cz+r;z++){
    const d=sq((x-cx)**2+(y-cy)**2+(z-cz)**2);
    if(d<=r&&d>r-1){
      let id=GLASS;
      if(x===cx||z===cz||y===cy||y===cy+2)id=IRON;
      block(x,y,z,id);
    }
  }
  disk(cx,cy,cz,3,GRASS);
  cube(cx,17,cz,cx,17,cz,OAK_LOG);cube(cx,18,cz,cx,18,cz,OAK_LOG);sphere(cx,19,cz,1,LEAVES);
  block(5,17,-2,RED);block(9,17,0,YELLOW);block(6,17,1,MAGENTA);block(9,17,-3,LIME);
})();
// tesla coil
cube(9,16,-7,9,22,-7,IRON);cube(8,18,-8,10,18,-6,COPPER);cube(8,20,-8,10,20,-6,COPPER);
sphere(9,23,-7,1,COPPER);block(9,25,-7,ELECTRIC);block(8,24,-7,ELECTRIC);block(10,24,-7,ELECTRIC);

// ---------- dock + airship ----------
cube(6,15,-16,16,15,-10,PLANKS);
for(let x=6;x<=16;x+=2)block(x,16,-16,IRON);
cube(6,17,-16,16,17,-16,IRON);
for(let z=-16;z<=-10;z+=2)block(16,16,z,IRON);
cube(16,17,-16,16,17,-10,IRON);
cube(13,16,-14,14,17,-13,PLANKS);block(11,16,-14,BROWN);block(11,17,-14,BROWN);
cube(16,16,-16,16,22,-16,IRON);cube(14,20,-16,15,21,-16,RED);
line(14,14,-15,10,10,-10,IRON);line(6,14,-14,8,11,-10,IRON);
// airship envelope
ellShell(13,27,-14,7,2.5,2.5,0.5,(x,y,z)=>{
  let id=COPPER;
  if(x===9||x===13||x===17)id=IRON;
  else if(y>=29&&z===-14)id=GOLD;
  block(x,y,z,id);
});
cube(10,20,-15,16,21,-13,PLANKS);cube(10,22,-15,16,22,-13,IRON);
for(const gx of [11,13,15])block(gx,21,-15,GLASS);
block(9,21,-14,GLOWSTONE);
line(10,22,-15,9,26,-15,IRON);line(16,22,-15,17,26,-15,IRON);line(10,22,-13,9,26,-13,IRON);line(16,22,-13,17,26,-13,IRON);
line(10,20,-13,7,16,-12,IRON);line(16,20,-13,15,16,-12,IRON);
// tail
cube(18,27,-14,20,31,-14,BROWN);cube(18,27,-17,20,27,-11,BROWN);
line(21,27,-17,21,27,-11,IRON);line(21,24,-14,21,30,-14,IRON);block(21,27,-14,GOLD);
// rotors
function rotor(cx,cy,z){
  line(cx-3,cy,z,cx+3,cy,z,COPPER);line(cx,cy-3,z,cx,cy+3,z,COPPER);
  line(cx-2,cy-2,z,cx+2,cy+2,z,COPPER);line(cx-2,cy+2,z,cx+2,cy-2,z,COPPER);
  block(cx,cy,z,GOLD);
}
rotor(9,21,-17);rotor(17,21,-17);
line(10,21,-15,9,21,-16,IRON);line(16,21,-15,17,21,-16,IRON);

// ---------- propeller pods under island ----------
function pod(cx){
  const cy=10;
  for(let z=-8;z<=-3;z++){
    const id=(z%2===0)?IRON:COPPER;
    block(cx,cy,z,id);block(cx+1,cy,z,id);block(cx-1,cy,z,id);block(cx,cy+1,z,id);block(cx,cy-1,z,id);
  }
  block(cx,cy,-9,GOLD);rotor(cx,cy,-10);
}
pod(-6);pod(6);

// ---------- satellite lighthouse island ----------
disk(-17,16,-13,4,COBBLE);disk(-17,16,-13,2,GRASS);
for(let y=15;y>=10;y--){
  const r=4*Math.pow((y-9)/7,0.8);
  for(let x=-22;x<=-12;x++)for(let z=-18;z<=-8;z++){
    const d=sq((x+17)**2+(z+13)**2);
    if(d<=r&&(d>r-1.4||r<2.5)){const h=hh(x,y,z);block(x,y,z,h<45?STONE:h<80?COBBLE:GRAY);}
  }
}
for(let y=17;y<=22;y++)cylinder(-17,y,-13,1,1,(y%2)?WHITE:RED);
cube(-19,22,-15,-15,22,-11,IRON);
cube(-18,23,-14,-16,24,-12,GLASS);block(-17,23,-13,GLOWSTONE);block(-17,24,-13,GLOWSTONE);
cube(-18,25,-14,-16,25,-12,COPPER);block(-17,26,-13,COPPER);block(-17,27,-13,IRON);
// bridge
for(let i=0;i<=20;i++){
  const t=i/20,x=Math.round(-10-4*t),z=Math.round(-6-5*t),y=15+Math.round(t);
  block(x,y,z,PLANKS);block(x+1,y,z,PLANKS);block(x-1,y,z,PLANKS);
  block(x-2,y+1,z,IRON);block(x+2,y+1,z,IRON);
}