// yeti-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
function r(n){ return Math.round(n); }

function limb(x0,y0,z0,x1,y1,z1,r0,r1,steps,id){
  for(let i=0;i<=steps;i++){
    const t=i/steps;
    const x=x0+(x1-x0)*t, y=y0+(y1-y0)*t, z=z0+(z1-z0)*t;
    const rad=r0+(r1-r0)*t;
    sphere(r(x),r(y),r(z),rad,id);
  }
}

cube(-11,0,-11,11,22,11,AIR);

cylinder(-2,0,1,1.8,5,SNOW);
cylinder(2,0,1,1.8,5,SNOW);
sphere(-2,1,1,2.0,SNOW);
sphere(2,1,1,2.0,SNOW);

cube(-4,0,-3,-1,1,1,SNOW);
cube(1,0,-3,4,1,1,SNOW);
block(-4,0,-4,STONE); block(-3,0,-4,STONE); block(-2,0,-4,STONE);
block(1,0,-4,STONE);  block(2,0,-4,STONE);  block(3,0,-4,STONE);

const profile = [
  [5, 4.0,  0.0],
  [6, 4.5,  0.0],
  [7, 5.0, -0.2],
  [8, 5.3, -0.3],
  [9, 5.5, -0.3],
  [10,5.3, -0.4],
  [11,4.6, -0.5],
  [12,3.2, -0.8],
  [13,3.8, -1.0],
  [14,4.3, -1.0],
  [15,4.0, -0.9],
  [16,3.2, -0.7],
  [17,2.0, -0.5],
  [18,1.0, -0.3],
];
for (const [y, rad, dz] of profile) disk(0, y, r(dz), rad, SNOW);

const tufts = [
  [-4,7,-1],[4,7,-1],[-5,9,-1],[5,9,-1],[-4,11,-2],[4,11,-2],
  [0,6,4.5],[-3,5,3.5],[3,5,3.5],[-2,13,-4],[2,13,-4],[0,10,5]
];
for (const [x,y,z] of tufts) sphere(r(x),y,r(z),1.3,SNOW);

limb(-5,10,-1, -6,13,-2, 0.9,0.3,4,ICE);
limb(5,10,-1, 6,13,-2, 0.9,0.3,4,ICE);

cube(-2,14,-5,-1,15,-4,AIR);
cube(1,14,-5,2,15,-4,AIR);
block(-2,14,-5,COBBLE); block(-1,14,-5,COBBLE);
block(1,14,-5,COBBLE);  block(2,14,-5,COBBLE);
cube(-3,15,-5,3,15,-5,SNOW);

sphere(0,13,-5,1.4,SNOW);
block(0,13,-6,STONE);

cube(-2,11,-6,2,12,-4,AIR);
cube(-2,11,-5,2,11,-5,BRICK);
for (const x of [-2,-1,0,1,2]) { block(x,12,-5,STONE); block(x,11,-5,STONE); }

limb(0,18,-1, 0,21,-2, 1.0,0.2,4,SNOW);
limb(-1,17,-2,-2,20,-3,0.8,0.2,3,ICE);
limb(1,17,-2, 2,20,-3, 0.8,0.2,3,ICE);

limb(-5.5,10,-1, -7,6,-3, 1.7,1.3,6,SNOW);
limb(-7,6,-3, -8,3,-4, 1.3,1.0,4,SNOW);
line(-9,3,-5,-9,3,-7,STONE);
line(-8,2,-5,-8,2,-7,STONE);
block(-9,3,-6,STONE); block(-8,2,-6,STONE); block(-7,2,-6,STONE);

limb(5.5,10,-1, 7,14,-3, 1.7,1.3,6,SNOW);
limb(7,14,-3, 8,17,-5, 1.3,0.9,5,SNOW);
line(8,17,-5,9,19,-6,STONE);
line(8,17,-5,10,18,-5,STONE);
line(8,17,-5,9,18,-7,STONE);
line(8,17,-5,7,19,-5,STONE);

sphere(0,12,-8,1.1,SNOW);
sphere(-1,13,-10,0.8,SNOW);
sphere(1,11,-11,0.6,SNOW);

disk(0,0,0,7,SNOW);
disk(-1,0,-2,3,SNOW);

limb(6,0,3,6,3,2,0.9,0.1,3,ICE);
limb(-7,0,4,-7,2,3,0.7,0.1,3,ICE);
sphere(7,0,5,1.2,STONE);
sphere(-6,0,6,1.0,STONE);
sphere(5,0,-6,1.0,STONE);

cube(-10,0,8,10,4,10,STONE);
for (const x of [-9,-6,-3,0,3,6,9]) {
  sphere(x,4,9,1.6,SNOW);
}
limb(-8,4,9,-8,8,8,1.0,0.2,3,ICE);
limb(0,4,9,0,9,8,1.1,0.2,4,ICE);
limb(8,4,9,8,7,8,0.9,0.2,3,ICE);

const bx = 9, bz = 4;

cylinder(bx-1,0,bz+1,0.9,2,SNOW);
cylinder(bx+1,0,bz+1,0.9,2,SNOW);
cube(bx-2,0,bz-1,bx-1,0,bz,SNOW);
cube(bx+1,0,bz-1,bx+2,0,bz,SNOW);

const babyProfile = [
  [2, 2.0, 0],
  [3, 2.4, 0],
  [4, 2.5, -0.1],
  [5, 2.1, -0.2],
  [6, 1.4, -0.3],
  [7, 1.8, -0.4],
  [8, 1.6, -0.3],
];
for (const [y, rad, dz] of babyProfile) disk(bx, y, r(bz+dz), rad, SNOW);

block(bx-1,7,bz-2,COBBLE);
block(bx+1,7,bz-2,COBBLE);
sphere(bx,6,bz-2,0.8,SNOW);

limb(bx-2,5,bz, bx-3,7,bz-1,0.7,0.3,3,SNOW);
limb(bx+2,5,bz, bx+3,7,bz-1,0.7,0.3,3,SNOW);

disk(bx,0,bz,3,SNOW);
