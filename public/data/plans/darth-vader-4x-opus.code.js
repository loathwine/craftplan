// darth-vader-4x-opus — prompt:
// Darth Vader...

cube(-3,16,-3,3,21,3,COBBLE);

// ============================================================
// DARTH VADER — towering statue, red saber raised, cape flared
// front faces -Z (toward viewer).  black armor = COBBLE,
// shadows/recesses = STONE, red = BRICK, lit accents = SNOW/GLASS/ICE
// ============================================================

const BLACK = COBBLE;
const SHADE = STONE;

// ---------- FOUNDATION / PEDESTAL ----------
disk(0,-1,0,8, STONE);
disk(0,0,0,7, COBBLE);
hollowCylinder(0,0,0,8,1, STONE);

// ---------- CAPE (big flared sheet behind, 2 thick) ----------
for (let y=0; y<=22; y++){
  const t=(22-y)/22;                 // 0 top, 1 bottom
  const hw=Math.round(6 + t*7);      // half-width 6 -> 13
  const zc=4 + Math.round(t*4);      // slides back lower down
  cube(-hw,y,zc,hw,y,zc+1, STONE);
  // torn/wavy bottom hem + edge fold detail
  if (y<3){ cube(-hw,y,zc-1,-hw+1,y,zc-1,STONE); cube(hw-1,y,zc-1,hw,y,zc-1,STONE); }
}
// cape collar sweeping up behind the head
for (let y=22; y<=27; y++){
  const hw=Math.max(3, 6-(y-22));
  cube(-hw,y,4,hw,y,5, STONE);
}

// ---------- BOOTS ----------
cube(-5,0,-4,-1,3,1, COBBLE);        // left boot (toe -z)
cube(1,0,-4,5,3,1, COBBLE);          // right boot
cube(-5,0,-4,-1,0,-4, STONE);        // toe caps
cube(1,0,-4,5,0,-4, STONE);

// ---------- ROBE (flaring lower body) ----------
for (let y=3; y<=15; y++){
  const t=(15-y)/(15-3);             // 0 top waist, 1 bottom hem
  const hw=Math.round(4 + t*4);      // 4 -> 8
  const z1=-3;
  const z2=3 + Math.round(t*2);
  cube(-hw,y,z1,hw,y,z2, COBBLE);
  // central robe fold (vertical shadow line)
  block(0,y,z1, STONE);
  if (t>0.3){ block(-hw,y,0,STONE); block(hw,y,0,STONE); } // side folds
}

// ---------- BELT ----------
cube(-6,14,-4,6,15,3, STONE);
block(-3,14,-4,SNOW); block(0,14,-4,SNOW); block(3,14,-4,SNOW); // belt boxes
cube(-1,14,-4,1,15,-4, COBBLE);      // central buckle

// ---------- TORSO ----------
cube(-4,16,-3,4,21,3, COBBLE);
// chest control box (raised)
cube(-3,17,-4,3,20,-4, STONE);
// colored buttons / switches
block(-2,19,-5,BRICK); block(-1,19,-5,GLASS); block(1,19,-5,ICE); block(2,19,-5,SNOW);
block(-2,18,-5,SNOW);  block(0,18,-5,GLASS);  block(2,18,-5,BRICK);
block(-1,17,-5,SNOW);  block(1,17,-5,SNOW);   // two silver switches
// upper chest vents
cube(-4,20,-4,-2,21,-4, STONE);
cube(2,20,-4,4,21,-4, STONE);

// ---------- SHOULDER MANTLE (pointed armor over shoulders) ----------
cube(-7,21,-2,7,23,3, STONE);
// taper the mantle into points at the sides
cube(-8,22,-1,-7,23,2, STONE);
cube(7,22,-1,8,23,2, STONE);
block(-8,23,0,STONE); block(8,23,0,STONE);
// front lip of mantle
cube(-6,21,-3,6,21,-3, COBBLE);

// ---------- ARMS ----------
cube(-7,10,-3,-5,20,2, COBBLE);      // left arm
cube(5,10,-3,7,20,2, COBBLE);        // right arm
// gauntlet detail
cube(-7,10,-3,-5,11,2, STONE);
cube(5,10,-3,7,11,2, STONE);

// ---------- LIGHTSABER (raised in right hand) ----------
cube(7,8,-4,7,14,-4, STONE);         // hilt
block(7,11,-4, SNOW);                 // hilt ring
cube(7,15,-4,7,32,-4, BRICK);        // red blade
block(7,33,-4, SNOW);                 // white-hot tip

// ---------- NECK ----------
cube(-2,22,-2,2,23,2, COBBLE);

// ============================================================
// HELMET  (the icon — centered x=0, y 24..34)
// ============================================================
// neck flare / bell collar
cube(-4,23,-4,4,25,3, COBBLE);
cube(-5,23,-3,5,23,2, COBBLE);       // widest at very bottom
cube(-4,24,-4,4,24,-4, STONE);       // shadow under chin

// main helmet body
cube(-3,26,-4,3,31,3, COBBLE);
// angled cheek panels (Vader's flat cheeks)
cube(-4,26,-3,-3,29,2, COBBLE);
cube(3,26,-3,4,29,2, COBBLE);

// dome (rounding in toward top)
cube(-3,32,-3,3,32,2, COBBLE);
cube(-2,33,-2,2,33,1, COBBLE);
block(-1,34,0,COBBLE); block(0,34,0,COBBLE); block(1,34,0,COBBLE);
block(0,34,-1,COBBLE);

// ---- FACE (front plane z=-4) ----
// brow ridge (protruding, casts shadow over eyes)
cube(-3,30,-5,3,30,-5, COBBLE);
block(-4,30,-4,COBBLE); block(4,30,-4,COBBLE);

// central triangular nose/mask ridge (protruding)
cube(0,26,-5,0,29,-5, COBBLE);
block(-1,28,-5,COBBLE); block(1,28,-5,COBBLE);
block(-1,27,-5,COBBLE); block(1,27,-5,COBBLE);

// eye lenses — recessed sockets (carve), dark angled lens behind
block(-2,29,-4,AIR); block(-3,29,-4,AIR);
block(2,29,-4,AIR);  block(3,29,-4,AIR);
block(-2,28,-4,AIR); block(3,28,-4,AIR);
block(-2,29,-3,SHADE); block(-3,29,-3,SHADE); block(-2,28,-3,SHADE); // left lens
block(2,29,-3,SHADE);  block(3,29,-3,SHADE);  block(3,28,-3,SHADE);  // right lens

// cheek "tusk" lines running down from eyes to jaw
line(-3,28,-5,-2,26,-5, STONE);
line(3,28,-5,2,26,-5, STONE);

// mouth / breathing grille (vertical slats)
for (let x=-2; x<=2; x++){
  block(x,26,-5, (x%2===0)?SHADE:COBBLE);   // alternating grille bars
  block(x,27,-4, SHADE);
}
block(-3,26,-4,STONE); block(3,26,-4,STONE); // grille frame
block(0,25,-4,SHADE);                        // chin vent

// ---------- ATMOSPHERE: dark background pillars for depth ----------
hollowCylinder(-14,0,10,2,20, STONE);
hollowCylinder(14,0,10,2,20, STONE);
cube(-14,20,10,-14,20,10, COBBLE);
cube(14,20,10,14,20,10, COBBLE);
// faint red floor glow at the feet
disk(0,-1,-6,3, BRICK);