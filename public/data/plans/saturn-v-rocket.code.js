// saturn-v-rocket — prompt:
// A giant Saturn V moon rocket standing on its launch pad, ready to launch. A tall white SNOW cylindrical rocket body in stacked stages, narrowing slightly toward the top, capped by a pointed cone nose ...

// ===== SATURN V MOON ROCKET ON ITS LAUNCH PAD =====
// Hero rocket dead-center (X0,Z0), tall +Y. Front faces the viewer (-Z).
const cx = 0, cz = 0;

// ---------- 0. CLEAR intruding foliage (targeted, not a full-site wipe) ----------
cylinder(cx, 1, cz, 8, 13, AIR);        // around lower/mid rocket
cube(9, 1, -4, 17, 31, 4, AIR);         // keep gantry lattice open
cube(-12, 1, -14, 14, 6, 15, AIR);      // low billow zone

// ---------- 1. STONE LAUNCH PLATFORM ----------
cube(-8, -1, -8, 16, 0, 8, STONE);          // pad (Y-1 base, Y0 top), raised over grass
hollowCube(-8, 0, -8, 16, 0, 8, COBBLE);    // pad rim
hollowCylinder(cx, 1, cz, 6, 2, COBBLE);    // blast-deflector ring around base (Y1-2)
for (const [mx,mz] of [[4,4],[4,-4],[-4,4],[-4,-4]]) cube(mx,1,mz,mx,2,mz,COBBLE); // holddown posts

// ---------- 2. ROCKET BODY (SNOW) — stacked stages, narrowing upward ----------
cylinder(cx, 0, cz, 4.4, 11, SNOW);     // S-IC first stage   Y0..10
disk(cx, 11, cz, 4.0, SNOW);            // interstage taper
cylinder(cx, 12, cz, 3.6, 8, SNOW);     // S-II second stage  Y12..19
disk(cx, 20, cz, 3.1, SNOW);            // taper
cylinder(cx, 21, cz, 2.7, 6, SNOW);     // S-IVB third stage  Y21..26
disk(cx, 27, cz, 2.2, SNOW);            // taper
cylinder(cx, 28, cz, 1.9, 2, SNOW);     // instrument unit + service module Y28..29
disk(cx, 30, cz, 1.6, SNOW);            // command-module cone
disk(cx, 31, cz, 1.0, SNOW);
block(cx, 32, cz, COBBLE);              // escape-tower neck
block(cx, 33, cz, BRICK);               // escape-tower tip

// ---------- 3. BLACK COBBLE BANDS + ROLL PATTERN ----------
hollowCylinder(cx, 0, cz, 4.4, 2, COBBLE);   // dark engine skirt   Y0-1
hollowCylinder(cx, 9, cz, 4.4, 2, COBBLE);   // top of S-IC         Y9-10
hollowCylinder(cx,12, cz, 3.6, 1, COBBLE);   // base S-II
hollowCylinder(cx,19, cz, 3.6, 1, COBBLE);   // top S-II
hollowCylinder(cx,21, cz, 2.7, 1, COBBLE);   // base S-IVB
hollowCylinder(cx,26, cz, 2.7, 1, COBBLE);   // top S-IVB
for (const sx of [-3,3]) for (const sz of [-3,3]) cube(sx,2,sz,sx,8,sz,COBBLE); // roll markings

// ---------- 4. FLAG PATCH + WINDOWS on the front (-Z) ----------
// flag: x=-1..1, Y14..17 on S-II front surface (z=-3); GLASS canton, BRICK/SNOW stripes
block(-1,17,-3,GLASS); block(0,17,-3,GLASS); block(1,17,-3,BRICK);
block(-1,16,-3,GLASS); block(0,16,-3,GLASS); block(1,16,-3,SNOW);
block(-1,15,-3,BRICK); block(0,15,-3,SNOW);  block(1,15,-3,BRICK);
block(-1,14,-3,SNOW);  block(0,14,-3,BRICK); block(1,14,-3,SNOW);
// capsule & porthole windows
block(0,30,-1,GLASS); block(0,29,-1,GLASS); block(0,24,-2,GLASS); block(0,5,-4,GLASS);

// ---------- 5. FOUR FINS at the base (SNOW + COBBLE leading edge) ----------
function fin(dirx, dirz){
  for (let d=1; d<=4; d++){
    const top = 6 - d;                 // 5,4,3,2
    if (dirx!==0){
      const px = cx + dirx*(4+d);
      cube(px,0,cz-1,px,top,cz+1,SNOW);
      block(px,top,cz,COBBLE);
      block(px,0,cz,COBBLE);
    } else {
      const pz = cz + dirz*(4+d);
      cube(cx-1,0,pz,cx+1,top,pz,SNOW);
      block(cx,top,pz,COBBLE);
      block(cx,0,pz,COBBLE);
    }
  }
}
fin(1,0); fin(-1,0); fin(0,1); fin(0,-1);
for (const [ex,ez] of [[0,0],[-2,-2],[2,-2],[-2,2],[2,2]]) block(cx+ex,-1,cz+ez,COBBLE); // engine bells

// ---------- 6. LAUNCH GANTRY TOWER (COBBLE/STONE + OAK_LOG girders) ----------
const gx1=10,gx2=14,gz1=-2,gz2=2,gTop=30;
for (const [colx,colz] of [[gx1,gz1],[gx2,gz1],[gx1,gz2],[gx2,gz2]])
  cube(colx,0,colz,colx,gTop,colz,COBBLE);          // corner columns
for (let y=0;y<=gTop;y+=3){                          // horizontal girder rings
  line(gx1,y,gz1,gx2,y,gz1,OAK_LOG);
  line(gx1,y,gz2,gx2,y,gz2,OAK_LOG);
  line(gx1,y,gz1,gx1,y,gz2,OAK_LOG);
  line(gx2,y,gz1,gx2,y,gz2,OAK_LOG);
}
for (let y=0;y<gTop;y+=6){                           // diagonal cross-braces
  line(gx1,y,gz1,gx1,y+3,gz2,OAK_LOG);
  line(gx1,y+3,gz1,gx1,y,gz2,OAK_LOG);
  line(gx2,y,gz1,gx2,y+3,gz2,OAK_LOG);
  line(gx2,y+3,gz1,gx2,y,gz2,OAK_LOG);
}
for (const ay of [7,14,21]){                         // access / swing arms to the rocket
  line(3,ay,0,gx1,ay,0,OAK_LOG);
  line(4,ay,-1,gx1,ay,-1,OAK_LOG);
}
cube(gx1,gTop,gz1,gx2,gTop+1,gz2,COBBLE);            // machinery house
line(gx1,gTop,0,3,gTop,0,OAK_LOG);                   // crane jib over rocket
line(gx2,gTop,0,gx2+3,gTop,0,OAK_LOG);               // counter-jib
block(3,gTop-1,0,COBBLE);                            // hook

// ---------- 7. EXHAUST SMOKE (SNOW + GLASS billowing clouds) ----------
hollowCylinder(cx,1,cz,5,3,SNOW);                    // collar hugging the base...
hollowCylinder(cx,1,cz,7,2,SNOW);                    // ...spreading + lowering outward
hollowCylinder(cx,1,cz,9,1,SNOW);
const RING=14;                                       // ring of big billows
for (let i=0;i<RING;i++){
  const ang=(i/RING)*Math.PI*2;
  const rad=7+(i%3)*2;
  const px=cx+Math.round(Math.cos(ang)*rad);
  const pz=cz+Math.round(Math.sin(ang)*rad);
  sphere(px,1+(i%2),pz,2+(i%3),(i%4===0)?GLASS:SNOW);
}
for (let i=0;i<10;i++){                               // rising secondary puffs
  const ang=(i/10)*Math.PI*2+0.5;
  const rad=4+(i%3);
  const px=cx+Math.round(Math.cos(ang)*rad);
  const pz=cz+Math.round(Math.sin(ang)*rad);
  sphere(px,3+(i%2),pz,2,(i%3===0)?GLASS:SNOW);
}
// dramatic billows toward the viewer (-Z) and outward (mixed SNOW + GLASS)
sphere(cx-4,2,cz-9,4,SNOW);
sphere(cx+3,2,cz-10,3,GLASS);
sphere(cx+6,2,cz-7,3,SNOW);
sphere(cx-9,2,cz-4,4,SNOW);
sphere(cx-11,1,cz+2,3,GLASS);
sphere(cx+9,2,cz-2,3,SNOW);
sphere(cx+11,1,cz+4,3,SNOW);
sphere(cx-6,1,cz+9,3,SNOW);
sphere(cx+4,1,cz+10,3,GLASS);
sphere(cx,1,cz+12,4,SNOW);
sphere(cx-2,4,cz-6,3,SNOW);
sphere(cx+2,4,cz-5,2,GLASS);