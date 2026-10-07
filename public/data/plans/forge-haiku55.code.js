// forge-haiku55 — prompt:
// a blacksmith's forge...

function along(x1,z1,x2,z2,fn){
  const n=Math.max(Math.abs(x2-x1),Math.abs(z2-z1));
  const dx=Math.sign(x2-x1), dz=Math.sign(z2-z1);
  for(let i=0;i<=n;i++) fn(x1+dx*i, z1+dz*i, i, n);
}
function ring(x1,z1,x2,z2,y,id){
  for(let x=x1;x<=x2;x++){block(x,y,z1,id);block(x,y,z2,id);}
  for(let z=z1+1;z<z2;z++){block(x1,y,z,id);block(x2,y,z,id);}
}
function shell(x1,y1,z1,x2,y2,z2,id){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)
    if(x===x1||x===x2||y===y1||y===y2||z===z1||z===z2) block(x,y,z,id);
}

cube(-12,0,2,12,20,18,AIR);

for(let x=-12;x<=12;x++)for(let z=2;z<=18;z++) block(x,-1,z,(x+z)%4===0?STONE:COBBLE);

along(-12,2,-2,2,(x,z,i,n)=>{
  if(i%4===0||i===n){for(let y=0;y<=2;y++)block(x,y,z,OAK_LOG);}
  else{block(x,1,z,PLANKS);block(x,2,z,PLANKS);}
});
along(2,2,12,2,(x,z,i,n)=>{
  if(i%4===0||i===n){for(let y=0;y<=2;y++)block(x,y,z,OAK_LOG);}
  else{block(x,1,z,PLANKS);block(x,2,z,PLANKS);}
});
const stoneWall=(x,z,i)=>{
  for(let y=0;y<=2;y++) block(x,y,z,COBBLE);
  if(i%2===0) block(x,3,z,STONE);
};
along(12,2,12,18,(x,z,i)=>stoneWall(x,z,i));
along(12,18,-12,18,(x,z,i)=>stoneWall(x,z,i));
along(-12,18,-12,2,(x,z,i)=>stoneWall(x,z,i));

shell(-6,0,6,6,5,13,COBBLE);
cube(-5,0,7,5,0,12,STONE);
ring(-6,6,6,13,0,STONE);
ring(-6,6,6,13,2,BRICK);
ring(-6,6,6,13,4,BRICK);
for(const [x,z] of [[-6,6],[6,6],[-6,13],[6,13]]) cube(x,0,z,x,5,z,BRICK);
cube(-3,0,6,3,3,6,AIR);
cube(-3,0,5,3,0,5,COBBLE);
block(0,3,6,GLOWSTONE);
cube(6,2,8,6,3,10,GLASS);

cube(-2,1,7,0,1,9,STONE);
block(-1,1,8,LAVA);
ring(-2,7,0,9,2,STONE);
block(-1,2,8,FIRE);
cube(-5,1,8,-4,2,9,OAK_LOG);
block(-3,1,8,IRON);

cube(2,1,8,4,1,10,STONE);
block(3,2,9,STONE);
cube(2,3,8,4,3,10,IRON);
block(1,3,9,IRON);

cube(-4,2,12,-1,2,12,PLANKS);
for(const x of [-4,-3,-2,-1]){block(x,3,12,IRON);block(x,4,12,IRON);}

for(let k=0;k<=6;k++) cube(-7+k,6+k,5,7-k,6+k,14,BROWN);
line(-7,6,5,7,6,5,OAK_LOG);
line(-7,6,14,7,6,14,OAK_LOG);
line(0,12,5,0,12,14,OAK_LOG);

cube(3,0,15,5,17,17,BRICK);
cube(4,8,16,4,17,16,AIR);
ring(3,15,5,17,18,COBBLE);
block(4,18,16,FIRE);

hollowSphere(10,0,12,2,BRICK);
block(10,0,10,AIR);
block(10,0,12,LAVA);

cube(9,0,6,11,0,8,OAK_LOG);
cube(9,1,6,11,1,8,PLANKS);
cube(9,2,6,10,2,7,OAK_LOG);

sphere(9,-1,16,2,BLACK);

shell(7,0,3,10,2,5,COBBLE);
cube(8,2,4,9,2,4,AIR);
cube(8,1,4,9,1,4,WATER);

cylinder(-10,0,4,1,2,OAK_LOG);
cylinder(-8,0,4,1,2,OAK_LOG);

shell(-11,0,6,-7,3,12,OAK_LOG);
cube(-9,1,6,-9,2,6,AIR);
cube(-12,4,5,-7,4,13,BROWN);
cube(-10,1,11,-8,1,11,PLANKS);

line(-9,0,14,-9,4,14,OAK_LOG);
sphere(-9,6,14,2,LEAVES);

for(const x of [-5,5]){
  line(x,0,3,x,2,3,OAK_LOG);
  block(x,3,3,GLOWSTONE);
}