// helicopter-4x-opus — prompt:
// an attack helicopter...

const STONE_=STONE, COBBLE_=COBBLE;

// ---------- helpers ----------
function tube(x0,x1,y0,y1,z0,z1,id){
  const cx=(x0+x1)/2, cy=(y0+y1)/2;
  const rx=(x1-x0)/2+0.6, ry=(y1-y0)/2+0.6;
  for(let z=z0;z<=z1;z++)
    for(let x=x0;x<=x1;x++)
      for(let y=y0;y<=y1;y++){
        const dx=(x-cx)/rx, dy=(y-cy)/ry;
        if(dx*dx+dy*dy<=1.0) block(x,y,z,id);
      }
}
function shell(x0,x1,y0,y1,z0,z1,id){ // ring outline over a z-range (armor seam)
  const cx=(x0+x1)/2, cy=(y0+y1)/2;
  const rx=(x1-x0)/2+0.6, ry=(y1-y0)/2+0.6;
  for(let z=z0;z<=z1;z++)
    for(let x=x0;x<=x1;x++)
      for(let y=y0;y<=y1;y++){
        const dx=(x-cx)/rx, dy=(y-cy)/ry, d=dx*dx+dy*dy;
        if(d<=1.0 && d>0.68) block(x,y,z,id);
      }
}
function hellfire(x,y,ztip){
  block(x,y,ztip,BRICK);                 // seeker head
  cube(x,y,ztip+1,x,y,ztip+5,STONE);     // body
  block(x,y,ztip+6,COBBLE);              // motor nozzle
  block(x,y+1,ztip+5,COBBLE);            // tail fins
  block(x,y-1,ztip+5,COBBLE);
}

// ---------- clear the flight volume of foliage ----------
cube(-11,4,-19, 11,12, 21, AIR);
cube(-18,12,-20, 18,14, 21, AIR);   // main rotor plane (above tree line)

// =========================================================
//  FUSELAGE  (nose at -Z / NORTH = the camera front)
// =========================================================
tube(-2,2, 5,10, -13, 7, STONE);        // main pod
tube(-2,2, 6, 9, -15,-13, STONE);       // nose shoulder
tube(-1,1, 7, 9, -17,-15, STONE);       // nose tip
// belly keel / flat underside
cube(-2,4,-11, 2,5, 6, COBBLE);
tube(-2,2, 5,10, 6, 7, COBBLE);         // rear bulkhead cap

// armor plating seams down the flanks (asymmetric weathering)
shell(-2,2,5,10,-9,-9,COBBLE);
shell(-2,2,5,10,-3,-3,COBBLE);
shell(-2,2,5,10, 3, 3,COBBLE);
// side avionics blister (port only — asymmetry)
cube(-3,7,-6,-3,9,-2,COBBLE);
block(-3,8,-4,STONE);

// =========================================================
//  TANDEM COCKPIT  (gunner front-low, pilot rear-high)
// =========================================================
cube(-1, 8,-13, 1, 9, -8, GLASS);       // gunner canopy
cube(-1, 9, -8, 1,10, -2, GLASS);       // pilot canopy (stepped up)
// canopy framing / mullions
line(-2,8,-13,-2,9,-2,COBBLE);
line( 2,8,-13, 2,9,-2,COBBLE);
line(-1,9,-8, 1,9,-8,COBBLE);
line(-1,10,-2,1,10,-2,COBBLE);
block(0,9,-13,COBBLE);
// windscreen brow
cube(-1,10,-9,1,10,-3,STONE);

// =========================================================
//  NOSE SENSOR TURRETS  (PNVS over TADS)
// =========================================================
sphere(0, 8,-16, 1, COBBLE);            // PNVS (upper)
block(0,8,-17,GLASS);
sphere(0, 6,-16, 1, COBBLE);            // TADS (lower)
block(0,6,-17,GLASS);

// =========================================================
//  CHIN CANNON  (30mm, points NORTH)
// =========================================================
cube(-1,3,-14, 1,5,-12, COBBLE);        // turret
cube(0,4,-19, 0,4,-14, STONE);          // barrel
block(0,4,-20,COBBLE);                  // muzzle
block(-1,4,-13,COBBLE); block(1,4,-13,COBBLE);

// =========================================================
//  STUB WINGS  + weapon pylons
// =========================================================
cube(-9,7,-1, -3,8, 3, STONE);          // port wing
cube( 3,7,-1,  9,8, 3, STONE);          // stbd wing
// wingtip nav lights
block(-9,8,1,BRICK); block(9,8,1,ICE);
// pylons
cube(-8,6,0,-8,7,1,COBBLE); cube(-5,6,0,-5,7,1,COBBLE);
cube( 8,6,0, 8,7,1,COBBLE); cube( 5,6,0, 5,7,1,COBBLE);
// rocket pods (inner)
cube(-6,5,-3,-4,6,2,COBBLE);  block(-5,6,-4,BRICK); block(-5,5,-4,BRICK);
cube( 4,5,-3, 6,6,2,COBBLE);  block( 5,6,-4,BRICK); block( 5,5,-4,BRICK);
// Hellfire racks (outer)
hellfire(-9,5,-3); hellfire(-8,5,-3);
hellfire( 9,5,-3); hellfire( 8,5,-3);

// =========================================================
//  ENGINE NACELLES + EXHAUST  (behind rotor mast)
// =========================================================
cube(-3, 9, 0, -2,11, 5, COBBLE);
cube( 2, 9, 0,  3,11, 5, COBBLE);
block(-3,10,6,BRICK); block(3,10,6,BRICK);   // hot exhaust
block(-2,11,3,STONE); block(2,11,3,STONE);   // intake screens

// =========================================================
//  MAIN ROTOR  (mast + hub + 4 blades)
// =========================================================
cylinder(0,10,-3, 1, 4, COBBLE);        // mast
cube(-1,13,-4, 1,14,-2, COBBLE);        // hub
block(0,14,-3,STONE);                   // pitot / cap
// blades (droop 1 at tips), 3 wide
cube( 1,13,-4, 16,13,-2, COBBLE);  block(17,12,-3,COBBLE); block(17,12,-3,SNOW);
cube(-16,13,-4,-1,13,-2, COBBLE);  block(-17,12,-3,SNOW);
cube(-1,13, 4, 1,13, 18, COBBLE);  block(0,12,19,SNOW);
cube(-1,13,-19,1,13, -4, COBBLE);  block(0,12,-20,SNOW);

// =========================================================
//  TAIL BOOM  ->  fin + stabilizer + tail rotor
// =========================================================
tube(-1,1, 7, 9, 7, 18, STONE);         // boom
shell(-1,1,7,9,12,12,COBBLE);           // boom seam
// vertical stabilizer (swept)
cube(-1,9,16, 0,13,19, STONE);
cube(-1,13,17,0,15,19, STONE);
// horizontal stabilizer
cube(-4,8,15, 4,8,17, STONE);
block(-4,8,16,COBBLE); block(4,8,16,COBBLE);
// tail rotor on port face (disc in Y-Z plane)
cube(-2,11,17,-2,13,19,COBBLE);         // gearbox hub
cube(-3,12,17,-3,17,18,COBBLE);         // blade up
cube(-3,7,17, -3,12,18,COBBLE);         // blade down
cube(-3,12,13,-3,12,17,COBBLE);         // blade fore
cube(-3,12,18,-3,12,22,COBBLE);         // blade aft
block(-3,17,18,SNOW); block(-3,7,18,SNOW);
block(-3,12,13,SNOW); block(-3,12,22,SNOW);
// tail nav light
block(0,15,19,BRICK);

// =========================================================
//  LANDING GEAR  (two main wheels on sponsons + tail wheel)
// =========================================================
function wheel(x,z){
  cube(x,1,z, x,4,z, COBBLE);           // strut
  block(x,4,z,STONE);
  disk(x,0,z,1,STONE);                  // tire
  block(x,1,z,COBBLE);
}
wheel(-2, 3); wheel( 2, 3);             // mains
cube(0,6,14, 0,7,14, COBBLE);           // tail-wheel strut
block(0,5,14,STONE);

// =========================================================
//  MARKINGS
// =========================================================
block(-3,8,0,SNOW); block(-3,7,1,SNOW); // port roundel patch
block(3,8,0,BRICK);                     // star point stbd
line(0,7,10,0,7,13,SNOW);               // boom tail number stripe
block(-1,8,2,BRICK);                    // fuselage warning tri