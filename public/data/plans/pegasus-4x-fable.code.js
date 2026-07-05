// pegasus-4x-fable — prompt:
// Pegasus...

// PEGASUS — white winged horse in a flying gallop, launching off a snow-capped
// stone crag. Below: the Hippocrene spring with ruined Greek columns.
// Golden mane/tail (SAND), stone hooves, glass eyes, clouds all around.

function ell(cx,cy,cz,rx,ry,rz,id){
  for(let x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++)
  for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)
  for(let z=Math.floor(cz-rz);z<=Math.ceil(cz+rz);z++){
    const dx=(x-cx)/rx,dy=(y-cy)/ry,dz=(z-cz)/rz;
    if(dx*dx+dy*dy+dz*dz<=1.08)block(x,y,z,id);
  }
}
function h2(x,z){const s=Math.sin(x*12.9898+z*78.233)*43758.5453;return s-Math.floor(s);}

// ---- targeted site clearing (AIR is free) ----
cube(-18,1,-8,-3,10,8,AIR);      // trees over crag footprint
cube(8,1,6,19,8,17,AIR);         // canopy over the spring/ruins
cube(-21,1,-17,-15,8,-11,AIR);   // background spire site
block(12,0,11,AIR);              // old trunk stub in the pool

// ---- main crag (launch rock) ----
for(let y=-3;y<=10;y++){
  const t=(y+3)/13, r=7.0-5.2*t;
  for(let x=-18;x<=-2;x++)for(let z=-8;z<=8;z++){
    const d=Math.hypot(x+10,z), w=h2(x*2+y*7,z*3-y)*1.3;
    if(d<=r+w-0.4){
      const m=h2(x*5+y,z*7+y*3);
      let id=m<0.28?COBBLE:STONE;
      if(y>=7&&d>r+w-2.0&&m>0.62)id=SNOW;    // snow dusting near the top
      block(x,y,z,id);
    }
  }
}
disk(-13,4,3,2,STONE); disk(-7,6,-3,2,STONE);   // jutting ledges
disk(-10,10,0,2,SNOW);                          // snowy launch cap
ell(-15,1,4,1.6,1.2,1.6,LEAVES); ell(-4,0,6,1.4,1.1,1.4,LEAVES); ell(-5,0,-7,1.5,1.1,1.5,LEAVES);
ell(-2,0,9,1.5,1.1,1.5,STONE); ell(4,0,-9,1.3,1.0,1.3,COBBLE);   // boulders

// ---- background spire ----
for(let y=-2;y<=7;y++){
  const t=(y+2)/9, r=3.4-2.6*t;
  for(let x=-21;x<=-15;x++)for(let z=-17;z<=-11;z++){
    const d=Math.hypot(x+18,z+14), w=h2(x*3-y,z*2+y*5)*0.9;
    if(d<=r+w-0.3)block(x,y,z, y>=6?SNOW:(h2(x,z*9+y)<0.3?COBBLE:STONE));
  }
}

// ---- Hippocrene spring + ruined temple columns ----
disk(12,-1,12,4,SAND);
disk(12,-1,12,3,GLASS);
block(12,0,12,SNOW); block(13,0,11,SNOW);       // foam where the hoof struck
function column(x,z,hgt,broken){
  disk(x,-1,z,2,SNOW);
  cylinder(x,0,z,1,hgt,SNOW);
  if(broken){block(x+1,hgt,z,SNOW);block(x,hgt,z-1,SNOW);}
  else{disk(x,hgt,z,2,SNOW);}
}
column(8,8,8,false);
cube(6,9,6,10,9,10,SNOW);                       // abacus slab on the intact column
column(17,8,6,true);
column(17,15,3,true);
cube(11,0,15,14,1,16,SNOW); block(15,0,16,SNOW); block(10,0,16,SNOW);  // fallen drums
block(9,0,8,LEAVES); block(9,1,8,LEAVES); block(8,2,9,LEAVES);         // ivy
block(16,0,9,LEAVES); block(16,1,8,LEAVES);

// ---- PEGASUS body ----
ell(-1,15,0,5.4,2.7,2.4,SNOW);                  // barrel
ell(3,15.6,0,2.6,2.4,2.2,SNOW);                 // chest
ell(-4.5,15.2,1.9,1.8,2.0,1.2,SNOW);            // haunches
ell(-4.5,15.2,-1.9,1.8,2.0,1.2,SNOW);
ell(1.6,16.4,2.2,1.8,1.5,0.9,SNOW);             // wing-root fairings
ell(1.6,16.4,-2.2,1.8,1.5,0.9,SNOW);
// arched neck
ell(4.2,16.4,0,1.8,1.8,1.6,SNOW);
ell(5.0,17.4,0,1.7,1.7,1.5,SNOW);
ell(5.7,18.5,0,1.6,1.6,1.4,SNOW);
ell(6.3,19.6,0,1.5,1.5,1.3,SNOW);
ell(6.9,20.6,0,1.4,1.4,1.2,SNOW);
// head + muzzle
ell(7.8,21.2,0,2.0,1.6,1.7,SNOW);
cube(9,20,-1,11,21,1,SNOW);
block(11,20,-1,AIR); block(11,20,1,AIR);        // taper the muzzle
block(7,23,1,SNOW); block(7,24,1,SNOW);         // ears
block(7,23,-1,SNOW); block(7,24,-1,SNOW);
block(8,22,1,GLASS); block(8,22,-1,GLASS);      // eyes

// legs — flying gallop, stone hooves; hind hooves kick off the snow cap
line(3,14,1,6,12,1,SNOW); line(6,12,1,8,11,1,SNOW); line(3,13,1,5,12,1,SNOW);
block(9,11,1,STONE);
line(3,14,-1,5,12,-1,SNOW); line(5,12,-1,3,11,-1,SNOW); line(4,13,-1,5,12,-1,SNOW);
block(2,11,-1,STONE);
line(-4,14,1,-7,12,1,SNOW); line(-7,12,1,-9,11,1,SNOW); line(-4,13,1,-6,12,1,SNOW);
block(-10,11,1,STONE);
line(-4,14,-1,-6,12,-1,SNOW); line(-6,12,-1,-8,10,-1,SNOW); line(-4,13,-1,-6,11,-1,SNOW);
block(-9,10,-1,STONE);

// ---- wings: swept, dihedral, notched trailing edge with long primaries ----
for(const S of [1,-1]){
  for(let i=0;i<=19;i++){
    const z=S*(2+i);
    const y=Math.round(16+0.30*i+0.018*i*i);
    const xf=5-Math.round(i*0.35);
    const chord=Math.max(3,9-Math.round(i*0.33));
    const xb=xf-chord;
    cube(xb,y,z,xf,y,z,SNOW);                   // main feather row
    cube(xf-1,y+1,z,xf,y+1,z,SNOW);             // thick leading-edge ridge
    if(i<9) cube(xb+2,y+1,z,xf-2,y+1,z,SNOW);   // covert layer near root
    if(i<7) cube(xb+1,y-1,z,xf-1,y-1,z,SNOW);   // full underside at root
    else if(i<13) cube(xf-Math.ceil(chord/2),y-1,z,xf-1,y-1,z,SNOW);
    if(i>=3&&i%2===1){                          // staggered primaries
      const fl=2+Math.floor(i/3);
      cube(xb-fl,y,z,xb-1,y,z,SNOW);
      block(xb-fl,y-1,z,SNOW);                  // drooping tip
    }
  }
}

// ---- golden mane, streaming in the wind ----
line(4,18,0,7,22,0,SAND);
line(3,17,0,6,21,0,SAND);
line(6,22,0,2,24,0,SAND);
line(2,24,0,-2,23,0,SAND);
line(5,21,1,1,22,1,SAND); line(1,22,1,-2,21,1,SAND);
line(5,20,-1,1,21,-1,SAND); line(1,21,-1,-1,20,-1,SAND);
block(8,23,0,SAND); block(9,22,0,SAND);         // forelock

// ---- golden tail, upswept banner ----
const tp=[[-6,16],[-7,17],[-8,17.6],[-9,17.9],[-10,17.6],[-11,16.9],[-12,15.8],[-13,14.4],[-14,12.8]];
for(let k=0;k<tp.length;k++){
  const x=tp[k][0], y=Math.round(tp[k][1]);
  block(x,y,0,SAND); block(x,y-1,0,SAND);
  if(k<5){block(x,y,1,SAND); block(x,y-1,-1,SAND);}
}
block(-15,11,0,SAND); block(-16,10,0,SAND);     // trailing wisps

// ---- clouds ----
function cloud(cx,cy,cz,r){
  disk(cx,cy,cz,r,SNOW);
  disk(cx+1,cy+1,cz-1,Math.max(1,r-1),SNOW);
  disk(cx-2,cy+1,cz+1,Math.max(1,r-2),SNOW);
}
cloud(16,18,-13,4);
cloud(-16,22,13,3);
cloud(17,25,9,3);
cloud(-18,17,-13,3);
cloud(12,28,-16,2);
cloud(-13,29,4,2);
cloud(2,30,-14,2);