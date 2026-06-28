// at-at-walker — prompt:
// An AT-AT walker, the four-legged Imperial war machine from Star Wars. SHAPE IS KEY: a big boxy armored head/cockpit at the front (with a sloped face and two small chin cannons) on a thick neck, connec...

function arm(x,y,z){
  return (((Math.floor(x/2)+Math.floor(y/2)+Math.floor(z/2))&1)===0)?STONE:COBBLE;
}
function pbox(x1,y1,z1,x2,y2,z2){
  for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)block(x,y,z,arm(x,y,z));
}
function octLayer(cx,cz,y,r){
  for(let x=cx-r;x<=cx+r;x++)for(let z=cz-r;z<=cz+r;z++){
    if(Math.abs(x-cx)===r&&Math.abs(z-cz)===r)continue;
    block(x,y,z,arm(x,y,z));
  }
}

// ---- clear trees/leaves inside the walker volume (targeted, not whole site) ----
cube(-8,1,-18,8,26,17,AIR);

// =========================================================
//  AT-AT WALKER  — faces -Z (toward viewer). Grey armor.
// =========================================================

// ---------- LEGS (four tall straight legs, elephant stance) ----------
function leg(cx,cz){
  // anchor into ground (hidden) so no floating on uneven terrain
  pbox(cx-1,-2,cz-1,cx+1,-1,cz+1);
  // foot pad y0..1 (rounded 5-wide)
  for(let y=0;y<=1;y++)octLayer(cx,cz,y,2);
  // forward toes (point -Z, "striding toward viewer")
  block(cx-1,0,cz-3,COBBLE);block(cx,0,cz-3,COBBLE);block(cx+1,0,cz-3,COBBLE);
  block(cx,1,cz-3,arm(cx,1,cz-3));
  // shin 3x3 (y2..6)
  pbox(cx-1,2,cz-1,cx+1,6,cz+1);
  // segmented KNEE joint — bulge out to 5-wide (y6..9)
  for(let y=6;y<=9;y++)octLayer(cx,cz,y,2);
  // knee actuator nub (front)
  block(cx,7,cz-3,STONE);block(cx,8,cz-3,STONE);
  // thigh 3x3 (y10..12) — narrows again above the knee
  pbox(cx-1,10,cz-1,cx+1,12,cz+1);
  // haunch / shoulder where leg meets hull (y13..14)
  for(let y=13;y<=14;y++)octLayer(cx,cz,y,2);
}
// diagonal mid-stride stagger: front-left + rear-right advanced
leg(-4,-2); leg(4,0); leg(-4,14); leg(4,12);

// ---------- HIP / UNDERBODY (ties the four legs together) ----------
pbox(-5,13,-4,5,14,16);

// ---------- SIDE ARMOR SKIRTS (lower hull over leg joints) ----------
for(let z=-3;z<=15;z++)for(let y=12;y<=15;y++){
  block(-6,y,z,arm(-6,y,z));
  block(6,y,z,arm(6,y,z));
}

// ---------- MAIN BODY (long rectangular armored hull, held high) ----------
pbox(-5,15,-4,5,23,16);

// armor belt seam (COBBLE) around the hull
for(let z=-4;z<=16;z++){block(-5,18,z,COBBLE);block(5,18,z,COBBLE);}
for(let x=-5;x<=5;x++){block(x,18,-4,COBBLE);block(x,18,16,COBBLE);}

// vertical corner trim (COBBLE) — defines the boxy silhouette
for(let y=15;y<=23;y++){
  block(-5,y,-4,COBBLE);block(5,y,-4,COBBLE);
  block(-5,y,16,COBBLE);block(5,y,16,COBBLE);
}

// protruding side panels (greeble plating) along the hull
for(let z=-2;z<=14;z+=4)for(let y=16;y<=22;y++){
  block(-6,y,z,arm(-6,y,z));block(-6,y,z+1,arm(-6,y,z+1));
  block(6,y,z,arm(6,y,z));block(6,y,z+1,arm(6,y,z+1));
}

// ---------- TOP SUPERSTRUCTURE ----------
pbox(-4,24,-2,4,24,14);           // raised dorsal deck
pbox(-3,25,6,3,25,13);            // rear command hump
for(let z=-2;z<=14;z+=3){block(-4,24,z,COBBLE);block(4,24,z,COBBLE);} // vents

// ---------- REAR ENGINES ----------
pbox(-3,17,16,-1,20,17);
pbox(1,17,16,3,20,17);
block(-2,18,17,COBBLE);block(2,18,17,COBBLE);

// ---------- NECK (thick, connects hull front to head) ----------
pbox(-2,16,-8,2,22,-4);

// ---------- HEAD (boxy cockpit, sloped face, held high) ----------
// lower band (chin juts forward, front z=-14)
pbox(-3,16,-14,3,18,-8);
// mid band (face recedes, front z=-13)
pbox(-3,19,-13,3,21,-8);
// upper band (forehead recedes, front z=-12) — top at y25 (>24 tall)
pbox(-3,22,-12,3,25,-8);

// brow ridge over the viewports
for(let x=-3;x<=3;x++)block(x,21,-13,COBBLE);

// two GLASS viewports (the "eyes")
for(let y=19;y<=20;y++){
  block(-2,y,-13,GLASS);block(-1,y,-13,GLASS);
  block(1,y,-13,GLASS);block(2,y,-13,GLASS);
}

// two small BRICK chin cannons (project forward & down)
for(let z=-15;z>=-17;z--){block(-1,16,z,BRICK);block(1,16,z,BRICK);}
block(-1,17,-15,BRICK);block(1,17,-15,BRICK);

// side blaster barrels (STONE) on the head flanks
for(let z=-15;z>=-17;z--){block(-3,18,z,STONE);block(3,18,z,STONE);}

// small antenna/sensor nub on the head crown
block(0,26,-10,STONE);block(0,27,-10,STONE);