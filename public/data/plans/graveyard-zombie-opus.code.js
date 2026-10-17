// graveyard-zombie-opus — prompt:
// a zombie rising from a graveyard...

const H=(x,y,z)=>{const s=Math.sin(x*12.9898+y*78.233+z*37.719)*43758.5453;return s-Math.floor(s);};
const R=Math.round;
const weathered=(x,y,z,base)=>{const r=H(x,y,z);return r<0.07?GREEN:(r<0.24?COBBLE:base);};
function fill(x1,y1,z1,x2,y2,z2,fn){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)block(x,y,z,fn(x,y,z));}

// ---- clear trees from the graveyard and the camera sightline ----
cube(-22,1,8,21,12,22,AIR);
cube(-16,1,-12,20,12,7,AIR);
cube(-14,1,-22,16,10,-13,AIR);
cube(-12,0,-9,14,0,15,AIR);

// ---- graveyard lawn ----
for(let x=-12;x<=14;x++)for(let z=-9;z<=15;z++){
  if(x>=-5&&x<=5&&z>=-1&&z<=5)continue;
  const r=H(x,-1,z);block(x,-1,z,r<0.1?DIRT:(r<0.14?COBBLE:GRASS));
}
// gravel path to the crypt
function pathSeg(x1,z1,x2,z2){const n=Math.max(Math.abs(x2-x1),Math.abs(z2-z1));for(let i=0;i<=n;i++){const t=i/n;const x=R(x1+(x2-x1)*t),z=R(z1+(z2-z1)*t);for(let dx=0;dx<=1;dx++){block(x+dx,0,z,AIR);block(x+dx,-1,z,H(x+dx,5,z)<0.5?COBBLE:GRAY);}}}
pathSeg(-6,-12,-11,1);pathSeg(-11,1,-17,10);

// ---- the open grave: dark pit + erupting earth ----
for(let x=-5;x<=5;x++)for(let z=-1;z<=5;z++)if(x<-4||x>4||z<0||z>4)block(x,-1,z,BLACK);
for(let x=-8;x<=8;x++)for(let z=-4;z<=8;z++){
  const d=Math.sqrt((x/7)**2+((z-2)/5.5)**2);
  if(d<0.68||d>1.02)continue;
  if(x>=-5&&x<=5&&z>=-1&&z<=5)continue;
  const r=H(x,1,z);if(r>0.82)continue;
  block(x,0,z,r<0.45?DIRT:(r<0.68?GRASS:COBBLE));
  if(r<0.28)block(x,1,z,r<0.14?DIRT:GRASS);
}
// flying clods
block(-6,4,-4,DIRT);block(-7,6,-2,DIRT);block(4,5,-6,GRASS);block(-3,3,-6,DIRT);block(7,4,-3,DIRT);block(2,6,-7,DIRT);block(-5,8,-6,DIRT);

// ---- ZOMBIE: torso leaning forward out of the grave ----
const lean=y=>-Math.floor(Math.max(0,y)/3);
for(let y=-1;y<=9;y++){const zo=lean(y);for(let x=-4;x<=4;x++)for(let z=zo;z<=zo+4;z++){
  const r=H(x,y,z);let id=r<0.2?BLUE:LIGHT_BLUE;
  if(r>0.9&&y>1)id=GREEN;
  if(y<=1)id=r<0.5?BROWN:(r<0.75?DIRT:BLUE);
  block(x,y,z,id);
}}
// torn shirt exposing ribs
for(let y=3;y<=7;y++){const zo=lean(y);for(let x=-3;x<=0;x++){
  if((y===3||y===7)&&(x===-3||x===0))continue;
  block(x,y,zo,y%2===0?WHITE:(H(x,y,9)<0.5?RED:GREEN));
}}
block(-1,9,-3,GREEN);block(0,9,-3,GREEN);block(1,9,-3,GREEN);block(0,8,-2,GREEN);
block(3,4,-1,GREEN);block(2,2,0,GREEN);
// shoulders
fill(-5,7,-2,-5,9,1,(x,y,z)=>H(x,y,z)<0.3?BLUE:LIGHT_BLUE);
fill(5,7,-2,5,9,1,(x,y,z)=>H(x,y,z)<0.3?BLUE:LIGHT_BLUE);
// arms
function limb(x1,y1,z1,x2,y2,z2,sx,fn){const n=Math.max(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1));for(let i=0;i<=n;i++){const t=i/n;const cx=R(x1+(x2-x1)*t),cy=R(y1+(y2-y1)*t),cz=R(z1+(z2-z1)*t);for(let a=0;a<=1;a++)for(let b=0;b<=1;b++){const x=cx+a*sx,y=cy+b;block(x,y,cz,fn(t,x,y,cz));}}}
const armMat=(t,x,y,z)=>{const r=H(x,y,z);if(t<0.3)return r<0.25?BLUE:LIGHT_BLUE;if(t<0.45)return r<0.5?LIGHT_BLUE:GREEN;return r<0.15?LIME:(r<0.22?GRAY:GREEN);};
limb(5,7,-1,6,9,-10,1,armMat);     // right arm reaching straight at the viewer
limb(-5,7,-1,-8,14,-8,-1,armMat);  // left arm clawing at the sky
block(7,9,-7,WHITE);               // bone poking through
// right hand (palm down, claws curling)
cube(4,9,-12,8,10,-11,GREEN);
for(const fx of [4,6,8]){block(fx,10,-13,GREEN);block(fx,10,-14,GREEN);block(fx,9,-15,GREEN);block(fx,8,-15,BLACK);}
block(3,9,-11,GREEN);block(3,9,-12,GREEN);
// left hand (raised claw)
cube(-11,15,-10,-7,16,-9,GREEN);
for(const fx of [-11,-9,-7]){block(fx,17,-10,GREEN);block(fx,18,-10,GREEN);block(fx,19,-11,GREEN);block(fx,19,-12,BLACK);}
block(-6,16,-9,GREEN);block(-5,17,-10,GREEN);

// head
for(let x=-3;x<=3;x++)for(let y=10;y<=16;y++)for(let z=-4;z<=2;z++){
  if(y===16&&(x===-3||x===3)&&(z===-4||z===2))continue;
  const r=H(x,y,z);let id=r<0.16?LIME:(r<0.24?GRAY:GREEN);
  if(((y===16&&z>-4)||(z===2&&y>=13))&&r<0.75)id=r<0.4?BLACK:BROWN;
  block(x,y,z,id);
}
// face (north side z=-4)
block(2,15,-4,RED);block(3,15,-4,WHITE);block(3,15,-3,WHITE);
for(const x of [-2,-1,1,2]){block(x,14,-4,BLACK);block(x,13,-4,NEON_RED);}
block(0,12,-5,GREEN);block(0,13,-5,GREEN);
block(-3,12,-4,GRAY);
block(-2,11,-4,WHITE);block(-1,11,-4,BLACK);block(0,11,-4,WHITE);block(1,11,-4,BLACK);block(2,11,-4,WHITE);
for(let x=-2;x<=2;x++)block(x,10,-4,BLACK);
block(-2,9,-4,GREEN);block(-1,9,-4,WHITE);block(0,9,-4,GREEN);block(1,9,-4,WHITE);block(2,9,-4,GREEN);
block(-4,12,-1,GREEN);block(3,11,-2,RED);

// ---- a second zombie hand bursting from the ground ----
fill(10,-1,-5,11,3,-4,(x,y,z)=>y<=0?PURPLE:(H(x,y,z)<0.2?LIME:GREEN));
cube(8,4,-5,12,5,-4,GREEN);
for(const fx of [8,10,12]){block(fx,6,-5,GREEN);block(fx,7,-5,GREEN);block(fx,8,-6,BLACK);}
block(13,5,-5,GREEN);block(14,6,-5,GREEN);
for(const [x,z] of [[9,-6],[12,-3],[12,-6],[9,-3],[8,-4],[13,-4],[10,-6],[11,-3]])block(x,0,z,H(x,0,z)<0.6?DIRT:GRASS);
block(12,1,-6,GRASS);block(9,1,-3,DIRT);
// skeleton hand
line(-11,-1,-2,-11,2,-2,WHITE);
block(-12,3,-2,WHITE);block(-11,3,-2,WHITE);block(-10,3,-2,WHITE);
block(-12,4,-2,WHITE);block(-12,5,-3,WHITE);block(-11,4,-2,WHITE);block(-11,5,-2,WHITE);block(-11,6,-3,WHITE);block(-10,4,-2,WHITE);block(-10,5,-3,WHITE);block(-9,3,-2,WHITE);

// ---- excavated dirt pile + shovel ----
for(let x=-10;x<=-4;x++)for(let z=2;z<=8;z++){
  const d=Math.sqrt(((x+7)/3)**2+((z-5)/2.6)**2);if(d>=1)continue;
  const h=Math.max(1,R(3*(1-d*d)));
  for(let y=0;y<h;y++){const r=H(x,y,z);block(x,y,z,y===h-1&&r<0.2?GRASS:(r<0.85?DIRT:COBBLE));}
}
cube(-8,2,5,-7,3,5,IRON);
line(-8,4,5,-10,9,6,OAK_LOG);
line(-11,10,6,-9,10,6,PLANKS);

// ---- broken coffin lid flung aside ----
for(let z=1;z<=6;z++){const y=Math.floor((6-z)/2);for(let x=6;x<=8;x++){
  block(x,y,z,(x===7&&z>=2&&z<=5)||(z===3)?GOLD:(x===7?PLANKS:BROWN));
}}

// ---- the zombie's own grave: tall celtic cross ----
fill(-3,-1,7,3,0,9,(x,y,z)=>weathered(x,y,z,COBBLE));
fill(-2,1,7,2,2,9,(x,y,z)=>weathered(x,y,z,STONE));
fill(-1,3,7,1,22,8,(x,y,z)=>weathered(x,y,z,STONE));
fill(-6,16,7,6,18,8,(x,y,z)=>weathered(x,y,z,STONE));
fill(-7,17,7,-7,17,8,(x,y,z)=>weathered(x,y,z,STONE));
fill(7,17,7,7,17,8,(x,y,z)=>weathered(x,y,z,STONE));
for(let x=-5;x<=5;x++)for(let y=12;y<=22;y++){
  const d=Math.hypot(x,y-17);
  if(d>=3.5&&d<4.5&&Math.abs(x)>1&&!(y>=16&&y<=18))block(x,y,7,weathered(x,y,7,STONE));
}
block(0,23,7,STONE);block(0,23,8,STONE);
block(1,20,6,LEAVES);block(1,19,6,LEAVES);block(-1,21,6,LEAVES);block(-2,18,6,LEAVES);
// crow perched on the cross arm
block(5,19,7,BLACK);block(5,19,8,BLACK);block(5,19,9,BLACK);block(5,20,7,BLACK);block(5,20,6,ORANGE);

// ---- tombstones ----
const wf=base=>(x,y,z)=>weathered(x,y,z,base);
function mound(x,z){for(let dx=-1;dx<=1;dx++)for(let dz=1;dz<=3;dz++){const r=H(x+dx,0,z-dz);block(x+dx,0,z-dz,r<0.55?DIRT:(r<0.85?GRASS:COBBLE));}}
function candle(x,z){block(x,1,z,WHITE);block(x,2,z,FIRE);}
function rounded(x,z,h,base,lit){
  mound(x,z);
  fill(x-1,-2,z,x+1,h-2,z,wf(base));
  block(x,h-1,z,weathered(x,h-1,z,base));
  block(x,h-3,z,GRAY);
  if(lit)candle(x+1,z-1);
  else block(x-1,1,z-2,H(x,9,z)<0.5?RED:PURPLE);
}
function crossStone(x,z,h,base){
  mound(x,z);
  fill(x,-2,z,x,h,z,wf(base));
  fill(x-1,h-2,z,x+1,h-2,z,wf(base));
}
function tilted(x,z,h,base){
  mound(x,z);
  for(let y=-2;y<=h-2;y++){const s=y>=1?Math.floor(y/2):0;fill(x-1+s,y,z,x+1+s,y,z,wf(base));}
  block(x+Math.floor((h-1)/2),h-1,z,weathered(x,h,z,base));
}
function broken(x,z,base){
  fill(x-1,-2,z,x+1,1,z,wf(base));
  block(x-1,2,z,weathered(x-1,2,z,base));
  fill(x-1,0,z-3,x+1,0,z-1,wf(base));
  block(x,0,z-4,weathered(x,0,z-4,base));
}
rounded(-13,-5,5,STONE,true);
crossStone(16,-7,6,COBBLE);
tilted(-16,1,6,STONE);
rounded(16,1,4,MARBLE,true);
rounded(-11,11,5,STONE,false);
broken(12,7,STONE);
rounded(-6,13,4,COBBLE,false);
crossStone(6,12,7,STONE);
rounded(11,15,5,STONE,true);
rounded(-1,14,4,MARBLE,false);
rounded(19,-2,4,STONE,false);

// ---- crypt (back-left) ----
const cw=wf(STONE);
fill(-21,-1,11,-13,6,11,cw);fill(-21,-1,19,-13,6,19,cw);
fill(-21,-1,12,-21,6,18,cw);fill(-13,-1,12,-13,6,18,cw);
cube(-20,-1,12,-14,-1,18,COBBLE);
cube(-20,0,12,-14,6,18,AIR);
cube(-22,-1,10,-22,7,10,MARBLE);cube(-12,-1,10,-12,7,10,MARBLE);
cube(-18,0,11,-16,3,11,AIR);block(-17,4,11,AIR);
cube(-19,5,10,-15,5,10,MARBLE);
// iron gate swung open
for(const z of [8,10])line(-19,0,z,-19,3,z,IRON);
block(-19,0,9,IRON);block(-19,3,9,IRON);
// torches
block(-20,3,10,IRON);block(-20,4,10,FIRE);block(-14,3,10,IRON);block(-14,4,10,FIRE);
// open sarcophagus + ghostly glow inside
cube(-19,0,15,-15,1,17,STONE);cube(-18,1,15,-16,1,17,BLACK);
block(-17,4,18,NEON_BLUE);
// gabled roof
const roof=(x,y,z)=>H(x,y,z)<0.25?BLACK:GRAY;
for(let i=0;i<=4;i++){
  fill(-22+i,7+i,10,-22+i,7+i,20,roof);fill(-12-i,7+i,10,-12-i,7+i,20,roof);
  fill(-21+i,7+i,11,-13-i,7+i,11,cw);fill(-21+i,7+i,19,-13-i,7+i,19,cw);
}
fill(-17,12,10,-17,12,20,roof);
line(-17,13,11,-17,16,11,STONE);line(-18,15,11,-16,15,11,STONE);

// ---- wrought iron fence ----
for(let x=-11;x<=21;x++){
  if(x%2===0)fill(x,-1,20,x,2,20,()=>BLACK);else{block(x,0,20,BLACK);block(x,2,20,BLACK);}
  if(x%4===0){block(x,3,20,BLACK);block(x,4,20,IRON);}
}
for(let z=3;z<=19;z++){
  if(z%2===0)fill(21,-1,z,21,2,z,()=>BLACK);else{block(21,0,z,BLACK);block(21,2,z,BLACK);}
  if(z%4===0){block(21,3,z,BLACK);block(21,4,z,IRON);}
}

// ---- dead trees ----
cube(16,-1,14,17,8,15,OAK_LOG);
line(17,8,15,21,12,13,OAK_LOG);line(21,12,13,22,14,12,OAK_LOG);
line(16,8,14,12,11,11,OAK_LOG);line(12,11,11,10,13,10,OAK_LOG);
line(16,7,15,14,12,18,OAK_LOG);line(14,12,18,13,15,19,OAK_LOG);
line(17,9,14,18,15,12,OAK_LOG);line(16,9,15,16,16,16,OAK_LOG);
block(15,0,14,OAK_LOG);block(18,0,15,OAK_LOG);block(17,0,13,OAK_LOG);
block(12,10,11,IRON);block(12,9,11,IRON);block(12,8,11,GLOWSTONE);
line(-15,-1,-8,-15,6,-8,OAK_LOG);
line(-15,4,-8,-18,8,-9,OAK_LOG);line(-15,6,-8,-13,9,-6,OAK_LOG);line(-15,5,-8,-14,8,-11,OAK_LOG);

// ---- lamps ----
function lamp(x,z){cube(x,0,z,x,4,z,BLACK);block(x,5,z,GLOWSTONE);block(x,6,z,IRON);}
lamp(-9,-9);lamp(13,-1);

// ---- jack-o-lanterns ----
function bigPumpkin(x,z){
  for(let dx=-2;dx<=2;dx++)for(let y=0;y<=4;y++)for(let dz=0;dz<=2;dz++){
    if(Math.abs(dx)===2&&(y===0||y===4))continue;
    if(Math.abs(dx)===2&&(dz===0||dz===2)&&(y===1||y===3))continue;
    block(x+dx,y,z+dz,H(x+dx,y,z+dz)<0.2?BROWN:ORANGE);
  }
  block(x,5,z+1,GREEN);block(x+1,6,z+1,GREEN);
  block(x-1,3,z,LAVA);block(x+1,3,z,LAVA);
  block(x-2,2,z+1,LAVA);block(x-1,1,z,LAVA);block(x,1,z,LAVA);block(x+1,1,z,LAVA);block(x+2,2,z+1,LAVA);
  block(x-2,2,z,AIR);block(x+2,2,z,AIR);
}
bigPumpkin(7,-9);
fill(-5,0,-9,-3,2,-8,()=>ORANGE);
block(-4,3,-8,GREEN);block(-5,2,-9,LAVA);block(-3,2,-9,LAVA);block(-4,0,-9,LAVA);

// ---- moon + bats ----
for(let x=6;x<=16;x++)for(let y=22;y<=32;y++){
  const d=Math.hypot(x-11,y-27);if(d<=4.5)block(x,y,22,H(x,y,22)<0.15?LIGHT_GRAY:WHITE);
}
function bat(x,y,z){block(x,y,z,BLACK);block(x-1,y+1,z,BLACK);block(x+1,y+1,z,BLACK);block(x-2,y,z,BLACK);block(x+2,y,z,BLACK);}
bat(4,24,19);bat(17,30,21);bat(-6,22,14);