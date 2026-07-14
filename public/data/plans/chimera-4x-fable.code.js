// chimera-4x-fable — prompt:
// a chimera...

const AIR=0,GRASS=1,DIRT=2,STONE=3,OAK_LOG=4,LEAVES=5,SAND=6,PLANKS=7,COBBLE=8,BRICK=10,GLASS=11,SNOW=12,ICE=13;

// ---- helpers ----
function E(cx,cy,cz,rx,ry,rz,id){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const dx=(x-cx)/rx,dy=(y-cy)/ry,dz=(z-cz)/rz;
    if(dx*dx+dy*dy+dz*dz<=1) block(x,y,z,id);
  }
}
function path(pts,r0,r1,id){
  const segs=pts.length-1;
  for(let s=0;s<segs;s++){
    for(let k=0;k<6;k++){
      const f=k/6,t=(s+f)/segs;
      const a=pts[s],b=pts[s+1];
      sphere(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,a[2]+(b[2]-a[2])*f,r0+(r1-r0)*t,id);
    }
  }
  const e=pts[segs];
  sphere(e[0],e[1],e[2],r1,id);
}

// ---- clear forest from footprint + fire corridor ----
cube(-8,1,-14,8,9,15,AIR);
cube(-4,1,-22,4,8,-14,AIR);

// ---- rocky lair floor + scenery ----
E(0,-1,2,6.5,1.6,10,COBBLE);            // crag slab the beast stands on
sphere(7,0,-2,2,STONE);
sphere(-7,-1,6,2.2,COBBLE);
sphere(6,-1,13,1.8,STONE);
// old kill: little skull + bones
cube(5,0,-10,6,1,-9,SNOW);
block(5,1,-10,AIR); block(6,1,-10,AIR);
line(3,0,-8,4,0,-9,SNOW);

// ---- lion body (SAND) ----
cube(-3,-2,-5,-2,5,-4,SAND);  cube(2,-2,-5,3,5,-4,SAND);    // front legs
cube(-3,-2,7,-2,4,8,SAND);    cube(2,-2,7,3,4,8,SAND);      // rear legs
cube(-3,-1,-6,-2,0,-6,SAND);  cube(2,-1,-6,3,0,-6,SAND);    // front paws
cube(-3,-1,6,-2,0,6,SAND);    cube(2,-1,6,3,0,6,SAND);      // rear paws
block(-3,0,-7,SNOW); block(-2,0,-7,SNOW);                   // claws
block(2,0,-7,SNOW);  block(3,0,-7,SNOW);
E(0,7,3,3.6,3.3,7.6,SAND);                                  // torso
sphere(0,8,-3,3.4,SAND);                                    // chest
sphere(0,7,8,3.1,SAND);                                     // hindquarters
sphere(-3,6,8,2.2,SAND); sphere(3,6,8,2.2,SAND);            // haunches
sphere(-3,8,-3,1.8,SAND); sphere(3,8,-3,1.8,SAND);          // shoulders

// ---- mane (OAK_LOG) ----
sphere(0,11,-5,4.4,OAK_LOG);
cube(-1,4,-7,1,8,-5,OAK_LOG);                               // chest bib
for(let i=0;i<14;i++){                                      // ruff fringe behind head
  const a=i/14*Math.PI*2;
  const y=Math.round(11+Math.sin(a)*4.6);
  if(y>6) block(Math.round(Math.cos(a)*4.6),y,-1,OAK_LOG);
}
for(let i=0;i<14;i++){                                      // radial mane spikes
  const a=i/14*Math.PI*2, r2=(i%2?5.3:6.3);
  line(Math.round(Math.cos(a)*3.8),Math.round(11+Math.sin(a)*3.8),-5,
       Math.round(Math.cos(a)*r2),Math.round(11+Math.sin(a)*r2),-5,OAK_LOG);
}

// ---- lion head, facing north ----
sphere(0,11,-8.7,2.7,SAND);
cube(-1,10,-12,1,12,-9,SAND);            // muzzle
cube(-1,8,-12,1,8,-9,SAND);              // lower jaw
cube(-1,9,-12,1,9,-9,AIR);               // open mouth
block(0,9,-9,BRICK);                     // throat glow
block(-1,9,-12,SNOW); block(1,9,-12,SNOW); // fangs
block(0,12,-12,STONE);                   // nose
block(-2,12,-10,ICE); block(2,12,-10,ICE);           // eyes
block(-2,13,-10,OAK_LOG); block(2,13,-10,OAK_LOG);   // brows
block(-3,10,-9,OAK_LOG); block(3,10,-9,OAK_LOG);     // cheek tufts

// ---- goat head rising from the back (SNOW) ----
path([[1,9,5],[2,13,3],[2,16,1]],1.5,1.1,SNOW);      // neck
cube(0,16,-1,3,18,2,SNOW);                           // head
cube(1,15,-3,2,16,-1,SNOW);                          // muzzle
block(0,17,-1,BRICK); block(3,17,-1,BRICK);          // eyes
block(-1,17,2,STONE); block(4,17,2,STONE);           // ears
cube(1,13,-2,2,14,-2,OAK_LOG);                       // beard
for(const hx of [0,3]){                              // curled horns
  block(hx,19,1,COBBLE); block(hx,20,1,COBBLE);
  block(hx,20,2,COBBLE); block(hx,20,3,COBBLE);
  block(hx,19,4,COBBLE); block(hx,18,4,COBBLE);
}

// ---- serpent tail arching over the back (LEAVES) ----
path([[0,6,10],[0,9,13],[-1,12,15],[-2,15,14],[-4,17,11],[-4,17,8]],1.5,0.9,LEAVES);
sphere(-4,17,6,1.7,LEAVES);                          // snake head
block(-5,18,5,BRICK); block(-3,18,5,BRICK);          // eyes
block(-4,17,4,BRICK); block(-4,17,3,BRICK);          // tongue
block(-5,17,2,BRICK); block(-3,17,2,BRICK);          // forked tip

// ---- fire breath from the lion's mouth ----
for(let i=0;i<10;i++){
  const t=i/9;
  sphere(0,9-5.6*t,-13-4.6*t,0.6+1.5*t,BRICK);
}
for(const i of [2,5,8]){
  const t=i/9;
  sphere(0,9-5.6*t,-13-4.6*t,(0.6+1.5*t)*0.45,SAND); // hot yellow core
}
disk(0,0,-17,3,BRICK);                               // burning pool
disk(0,1,-17,2,BRICK);
cube(0,1,-18,0,3,-18,BRICK); block(0,4,-18,SAND);    // licking flames
cube(-2,1,-16,-2,2,-16,BRICK);
cube(2,1,-17,2,2,-17,BRICK); block(2,3,-17,SAND);
block(-1,1,-19,BRICK); block(1,1,-15,BRICK);
for(let i=0;i<10;i++){                               // scorched ring
  const a=i/10*Math.PI*2;
  block(Math.round(Math.cos(a)*4.3),0,Math.round(-17+Math.sin(a)*4.3),COBBLE);
}