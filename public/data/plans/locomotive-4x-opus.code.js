// locomotive-4x-opus — prompt:
// a steam locomotive...

const meta = undefined; // (ignored by sandbox)

// ===================================================================
//  STEAM LOCOMOTIVE  —  side profile, visible face toward NORTH (-Z)
//  Front of the engine (smokestack / cowcatcher) points EAST (+X)
//  so it catches the light; the train runs along the X axis.
// ===================================================================

const AXY = 10;          // boiler axis height
const AZ  = 0;           // boiler axis Z (centre)
const R   = 4;           // boiler radius

// ---- helpers -------------------------------------------------------
function rnd(v){ return Math.round(v); }

// horizontal cylinder along X (filled)
function tube(x1,x2,cy,cz,r,id){
  for(let x=x1;x<=x2;x++)
    for(let y=-Math.ceil(r);y<=Math.ceil(r);y++)
      for(let z=-Math.ceil(r);z<=Math.ceil(r);z++)
        if(Math.sqrt(y*y+z*z)<=r+0.35) block(x,cy+y,cz+z,id);
}
// single cross-section ring (surface shell) at given X
function ring(x,cy,cz,r,id){
  for(let y=-Math.ceil(r);y<=Math.ceil(r);y++)
    for(let z=-Math.ceil(r);z<=Math.ceil(r);z++){
      const d=Math.sqrt(y*y+z*z);
      if(d<=r+0.35 && d>r-1) block(x,cy+y,cz+z,id);
    }
}
// vertical wheel (disk in the X-Y plane) with rim/hub/spokes
function wheel(cx,cy,r,z1,z2){
  const R2=Math.ceil(r);
  for(let x=-R2;x<=R2;x++)
    for(let y=-R2;y<=R2;y++){
      const d=Math.sqrt(x*x+y*y);
      if(d<=r+0.35){
        let id=STONE;
        if(d>r-0.85) id=COBBLE;      // steel tyre
        if(d<1.4)    id=BRICK;       // red hub
        for(let z=z1;z<=z2;z++) block(cx+x,cy+y,z,id);
      }
    }
  // spokes
  for(let a=0;a<8;a++){
    const dx=Math.cos(a*Math.PI/4), dy=Math.sin(a*Math.PI/4);
    for(let t=1;t<r-0.4;t++)
      block(rnd(cx+dx*t),rnd(cy+dy*t),z1,COBBLE);
  }
}

// ---- 0. clear the build envelope of forest foliage ----------------
cube(-22,1,-7,18,26,7,AIR);

// ---- 1. road-bed & track ------------------------------------------
cube(-22,0,-6,18,0,6,COBBLE);                 // ballast slab
for(let x=-22;x<=18;x+=3)                      // wooden sleepers
  cube(x,1,-6,x,1,6,OAK_LOG);
line(-22,2,-5,18,2,-5,STONE);                  // north rail
line(-22,2, 5,18,2, 5,STONE);                  // south rail

// ---- 2. boiler -----------------------------------------------------
tube(-6,12,AXY,AZ,R,STONE);                    // main barrel
ring(-3,AXY,AZ,R+0.15,COBBLE);                 // boiler bands
ring( 2,AXY,AZ,R+0.15,COBBLE);
ring( 8,AXY,AZ,R+0.15,COBBLE);
tube(11,13,AXY,AZ,R+0.4,STONE);                // smokebox (a touch fatter)
// smokebox door on the east face
for(let y=-4;y<=4;y++)
  for(let z=-4;z<=4;z++){
    const d=Math.sqrt(y*y+z*z);
    if(d<=4.35){
      let id=STONE;
      if(d>3) id=COBBLE;
      if(d<1) id=BRICK;
      block(13,AXY+y,AZ+z,id);
    }
  }
// hinge strap + dogs on the door
line(13,AXY-3,AZ,13,AXY+3,AZ,COBBLE);
line(13,AXY,AZ-3,13,AXY,AZ+3,COBBLE);

// ---- 3. running boards & handrails --------------------------------
cube(-6,8,-6,13,8,-5,PLANKS);                  // north footplate
cube(-6,8, 5,13,8, 6,PLANKS);                  // south footplate
line(-6,11,-6,12,11,-6,OAK_LOG);               // north handrail
line(-6,11, 6,12,11, 6,OAK_LOG);
for(let x=-6;x<=12;x+=4){                       // rail stanchions
  line(x,9,-6,x,11,-6,OAK_LOG);
  line(x,9, 6,x,11, 6,OAK_LOG);
}

// ---- 4. domes, stack, fittings on top -----------------------------
// steam dome
hollowSphere(2,14,AZ,2,COBBLE); cube(2,13,-1,2,13,1,COBBLE);
sphere(2,14,AZ,1,BRICK);
// sand dome
hollowSphere(6,14,AZ,2,COBBLE); sphere(6,14,AZ,1,STONE);
// safety valve / whistle
line(-1,14,AZ,-1,16,AZ,COBBLE); block(-1,17,AZ,BRICK);
// smokestack (flared)
cylinder(9,14,AZ,1,4,STONE);
disk(9,18,AZ,2,COBBLE);
disk(9,19,AZ,2,STONE);
hollowCylinder(9,19,AZ,2,1,COBBLE);

// ---- 5. driving gear (wheels + rods) ------------------------------
const dw=[-4,1,6];                             // driving-wheel centres (X)
for(const cx of dw){
  wheel(cx,6,3,-6,-4);                         // north (visible) wheel
  wheel(cx,6,3, 4, 6);                         // south wheel
}
wheel(9,4,1.5,-6,-4); wheel(9,4,1.5,4,6);      // leading pony truck
wheel(-10,4,1.5,-6,-4); wheel(-10,4,1.5,4,6);  // trailing truck
// coupling & connecting rods on the north face
cube(-4,4,-7,6,4,-7,BRICK);                    // main coupling rod
for(const cx of dw) block(cx,4,-8,STONE);      // crank pins
line(9,4,-7,6,4,-7,COBBLE);                    // main rod to piston
cube(10,6,-7,12,7,-7,STONE);                   // cylinder / valve chest
block(9,4,-8,BRICK);

// ---- 6. cowcatcher (pilot) ----------------------------------------
for(let x=13;x<=17;x++){
  const t=x-13;
  const zt=Math.max(0,4-t);
  const top=Math.max(3,7-t);
  for(let z=-zt;z<=zt;z++)
    line(x,3,z,x,top,z,(z===-zt||z===zt)?BRICK:STONE);
}
block(13,10,AZ,SNOW); block(13,10,AZ-1,GLASS); // headlight on smokebox

// ---- 7. cab --------------------------------------------------------
cube(-14,6,-5,-6,14,5,BRICK);                  // solid shell
cube(-13,7,-4,-6,13,4,AIR);                    // hollow (open toward boiler)
cube(-12,10,-5,-8,13,-5,GLASS);                // north windows
cube(-12,10, 5,-8,13, 5,GLASS);                // south windows
cube(-14,10,-4,-14,13,4,AIR); cube(-14,10,-4,-14,12,4,GLASS); // rear window
cube(-15,15,-6,-5,15,6,STONE);                 // overhanging roof
cube(-14,16,-5,-6,16,5,COBBLE);                // roof ridge

// ---- 8. tender (coal car) -----------------------------------------
cube(-22,3,-5,-15,9,5,STONE);                  // body
cube(-21,9,-4,-16,9,4,AIR);                    // open coal bunker
cube(-21,9,-4,-16,11,4,COBBLE);                // heaped coal
cube(-22,8,-5,-15,8,5,PLANKS);                 // top trim rail
line(-15,5,AZ,-14,5,AZ,OAK_LOG);               // drawbar to cab
wheel(-17,4,1.5,-6,-4); wheel(-17,4,1.5,4,6);
wheel(-20,4,1.5,-6,-4); wheel(-20,4,1.5,4,6);

// ---- 9. billowing smoke -------------------------------------------
const puffs=[[9,21,1],[8,22,1],[6,23,2],[3,24,2],[0,25,2],[-3,25,1]];
for(const [px,py,pr] of puffs) sphere(px,py,AZ,pr,SNOW);

// ---- 10. trackside scenery (foreground / background) --------------
// railway signal (north side, foreground)
line(-19,1,-7,-19,9,-7,OAK_LOG);
cube(-19,7,-7,-18,8,-7,STONE);
block(-18,8,-7,BRICK);                         // red aspect
block(-18,6,-7,LEAVES);                        // green aspect
// telegraph poles (south side, background)
for(const px of [-8,10]){
  line(px,1,7,px,12,7,OAK_LOG);
  line(px-2,11,7,px+2,11,7,OAK_LOG);           // cross-arm
  block(px-2,12,7,GLASS); block(px+2,12,7,GLASS);
}