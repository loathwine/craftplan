// pirate-ship-4x-opus — prompt:
// pirate-ship...

// ===== PIRATE SHIP — broadside facing NORTH (-Z), bow toward east (+X) =====
// Fantasy galleon: curved hull, three masts, camera-facing billowing sails,
// Jolly Roger emblem, sterncastle cabin, forecastle prow, cannons, rigging.

const S = -16, B = 17;                 // stern (west) .. bow (east)
const CX = -2;                          // widest amidships
function halfZAt(x){ let f = 1 - Math.pow((x-CX)/19, 2); if(f<0) f=0; return Math.round(4*Math.sqrt(f)); }
function bottomY(x){ return Math.round(-3 + 4*Math.pow((x-CX)/19, 2)); }
function region(x){ if(x>=11) return 'fore'; if(x<=-9) return 'aft'; return 'main'; }
function deckFloorY(x){ return region(x)==='main' ? 5 : 7; }
function topRailY(x){ return region(x)==='main' ? 6 : 9; }

// ---------- 1. WATER ----------
cube(-20, 0, -9, 20, 0, 9, GLASS);
cube(-20, -1, -6, 20, -1, 6, GLASS);   // a little depth near the hull

// ---------- 2. HULL ----------
for (let x = S; x <= B; x++){
  const hz = halfZAt(x);
  if (hz <= 0) continue;
  const by = bottomY(x);
  const tr = topRailY(x);
  const df = deckFloorY(x);

  // port & starboard walls
  for (const z of [-hz, hz]){
    cube(x, by, z, x, tr-1, z, PLANKS);
    block(x, tr, z, OAK_LOG);          // gunwale rail cap
    block(x, df-1, z, OAK_LOG);        // upper wale stripe
    block(x, 2, z, BRICK);             // red waterline stripe (pirate)
  }
  // hull bottom (rounded keel)
  cube(x, by, -hz, x, by, hz, PLANKS);
  // second bottom row inward for a fuller belly
  if (hz >= 2) cube(x, by+1, -(hz-1), x, by+1, hz-1, PLANKS);

  // deck floor
  cube(x, df, -(hz-1), x, df, hz-1, PLANKS);
}

// flat transom stern cap
{
  const hz = halfZAt(S);
  cube(S-1, bottomY(S), -hz, S-1, topRailY(S)-1, hz, PLANKS);
  cube(S-1, topRailY(S), -hz, S-1, topRailY(S), hz, OAK_LOG);
  // gilded stern windows
  cube(S-1, 8, -1, S-1, 9, 1, GLASS);
}

// pointed prow / stem rising from the bow
line(B, 5, 0, B+2, 10, 0, OAK_LOG);
line(B, 6, 0, B+1, 9, 0, OAK_LOG);
block(B, 7, 0, OAK_LOG); block(B, 8, 0, OAK_LOG);
// simple figurehead (light-catching, angled east)
block(B+2, 10, 0, SNOW); block(B+3, 10, 0, SNOW); block(B+2, 11, 0, SNOW);

// ---------- 3. CANNONS + GUNPORTS (front side, faces camera) ----------
for (const gx of [-6, -2, 2, 6]){
  const hz = halfZAt(gx);
  // gunport frame
  hollowCube(gx-1, 3, -hz-1, gx+1, 5, -hz-1, OAK_LOG);
  block(gx, 4, -hz, AIR);
  // barrel poking out
  cube(gx, 4, -hz, gx, 4, -hz-2, STONE);
  block(gx, 4, -hz-3, AIR);            // muzzle
}

// ---------- 4. STERNCASTLE CABIN + WHEEL ----------
cube(-15, 8, -3, -9, 11, 3, PLANKS);   // cabin box on the aft raised deck
hollowCube(-15, 8, -3, -9, 11, 3, OAK_LOG);
// windows facing camera (north)
cube(-14, 9, -4, -10, 10, -4, GLASS);
// door
block(-12, 8, -4, OAK_LOG); block(-12, 9, -4, AIR);
// cabin roof + rail
cube(-15, 12, -3, -9, 12, 3, OAK_LOG);
block(-12, 13, -3, OAK_LOG);
// ship's wheel (faces camera), just fore of the cabin
for (let a = 0; a < 8; a++){
  const wx = Math.round(-8 + 1.6*Math.cos(a*Math.PI/4));
  const wy = Math.round(9  + 1.6*Math.sin(a*Math.PI/4));
  block(wx, wy, -2, OAK_LOG);
}
block(-8, 9, -2, OAK_LOG);             // hub

// ---------- 5. BOWSPRIT + JIB SAIL ----------
line(15, 8, 0, 22, 13, 0, OAK_LOG);
for (let i = 0; i <= 5; i++){          // triangular jib below the bowsprit
  const jx = 16 + i;
  const top = Math.round(9 + i*0.9);
  for (let jy = 7; jy <= top; jy++) block(jx, jy, -1, SNOW);
}

// ---------- 6. MASTS ----------
function mast(x, top){ cube(x, deckFloorY(x)+1, 0, x, top, 0, OAK_LOG); }
mast(13, 22);     // foremast
mast(0, 27);      // mainmast
mast(-11, 19);    // mizzenmast

// ---------- 7. YARDS + BILLOWING SAILS (face NORTH toward camera) ----------
function yard(x1, x2, y){ line(x1-1, y, 0, x2+1, y, 0, OAK_LOG); }
function sail(x1, x2, yBot, yTop, maxBow){
  const cx = (x1+x2)/2, hw = Math.max((x2-x1)/2, 1), hh = Math.max(yTop-yBot, 1);
  for (let x = x1; x <= x2; x++){
    for (let y = yBot; y <= yTop; y++){
      const fx = (x-cx)/hw;                 // -1..1
      const fyTop = (yTop-y)/hh;            // 0 top .. 1 bottom
      const bow = maxBow*(1-fx*fx)*(0.4 + 0.6*fyTop);
      block(x, y, -Math.round(bow), SNOW);  // negative z = toward camera
    }
  }
}
// mainmast: course + topsail
yard(-6, 6, 21);  sail(-6, 6, 14, 20, 3);
yard(-4, 4, 27);  sail(-4, 4, 22, 26, 2);
// foremast
yard(9, 17, 18);  sail(9, 17, 12, 17, 2);
yard(10, 16, 22); sail(10, 16, 19, 21, 1);
// mizzenmast
yard(-15, -7, 17); sail(-15, -7, 11, 16, 2);

// ---------- Jolly Roger emblem on the mainsail (Z=-3, in front of billow) ----------
const EZ = -3;
line(-4, 15, EZ, 4, 19, EZ, STONE);       // crossbones
line(-4, 19, EZ, 4, 15, EZ, STONE);
cube(-2, 16, EZ, 2, 19, EZ, STONE);        // skull
block(-2,19,EZ,AIR); block(2,19,EZ,AIR); block(-2,16,EZ,AIR); block(2,16,EZ,AIR); // round corners
block(-1, 18, EZ, SNOW); block(1, 18, EZ, SNOW);  // eyes
block(0, 16, EZ, SNOW);                    // jaw gap

// ---------- 8. CROW'S NEST (mainmast) ----------
disk(0, 23, 0, 2, OAK_LOG);
hollowCylinder(0, 24, 0, 2, 2, OAK_LOG);

// ---------- 9. RIGGING (fore/back stays, X-Y plane against sky) ----------
line(0, 27, 0, B+1, 9, 0, OAK_LOG);        // main forestay to bow
line(0, 27, 0, S-1, 12, 0, OAK_LOG);       // main backstay to stern
line(13, 22, 0, B+1, 9, 0, OAK_LOG);       // foremast stay
line(-11, 19, 0, S-1, 12, 0, OAK_LOG);     // mizzen stay
// side shrouds (visible at hull edges)
for (const z of [-3, 3]){
  line(0, 26, 0, 4, topRailY(4), z, OAK_LOG);
  line(0, 26, 0, -6, topRailY(-6), z, OAK_LOG);
}

// ---------- 10. FLAGS (skull pennants, face camera) ----------
function flag(x0, y0){
  cube(x0, y0, -1, x0+3, y0+2, -1, BRICK);
  block(x0+1, y0+1, -1, SNOW); block(x0+2, y0+1, -1, SNOW); // skull eyes
  block(x0+1, y0,   -1, SNOW);
}
flag(1, 25);      // mainmast top
flag(14, 20);     // foremast top
flag(-10, 17);    // mizzenmast top

// ---------- 11. DECK PROPS ----------
// barrels
cylinder(-4, 6, 2, 1, 2, OAK_LOG);
cylinder(-2, 6, -2, 1, 2, OAK_LOG);
cylinder(7, 8, 1, 1, 2, OAK_LOG);
// crates
cube(4, 6, 1, 5, 7, 2, PLANKS);
cube(-6, 6, -1, -5, 7, 0, PLANKS);
// open treasure chest (gold = SAND)
cube(9, 8, -1, 11, 9, 1, OAK_LOG);
cube(9, 10, -1, 11, 10, 1, SAND);
// cannonball pyramid
block(3, 6, -2, STONE); block(4, 6, -2, STONE); block(3, 6, -3, STONE); block(3, 7, -2, STONE);

// ---------- 12. FOAM / WAKE at the waterline ----------
for (let x = S; x <= B; x += 2){
  const hz = halfZAt(x);
  if (hz > 0){ block(x, 1, -hz-1, SNOW); block(x, 1, hz+1, SNOW); }
}
block(B+2, 1, 0, SNOW); block(B+3, 1, 1, SNOW); block(B+1, 1, -1, SNOW); // bow splash