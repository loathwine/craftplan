// knight-4x-fable — prompt:
// a knight on horseback...

// Knight on horseback — charging knight with lance, caparisoned horse, plinth, banners, quintain

// Clear vegetation above the build footprint (AIR is free)
cube(-14,1,-9,15,12,9,AIR);
cube(14,1,-3,21,10,3,AIR); // around quintain to the east

// ---- Plinth: stone foundation + checkered top + rim ----
cube(-12,-2,-7,13,-1,7,STONE);
for(let x=-12;x<=13;x++)for(let z=-7;z<=7;z++)block(x,0,z,((x+z)&1)===0?STONE:COBBLE);
cube(-12,1,-7,13,1,-7,STONE);
cube(-12,1,7,13,1,7,STONE);
cube(-12,1,-7,-12,1,7,STONE);
cube(13,1,-7,13,1,7,STONE);

// ---- Horse (faces +X) ----
// barrel, chest, rump
cube(-7,9,-3,4,14,3,OAK_LOG);
cube(5,9,-2,6,14,2,OAK_LOG);
cube(-9,10,-2,-8,13,2,OAK_LOG);
// round off barrel edges
cube(-7,14,-3,4,14,-3,AIR); cube(-7,14,3,4,14,3,AIR);
cube(-7,9,-3,4,9,-3,AIR);   cube(-7,9,3,4,9,3,AIR);
// haunches and shoulders
cube(-9,5,1,-6,9,3,OAK_LOG);
cube(-9,5,-3,-6,9,-1,OAK_LOG);
cube(3,6,1,5,9,3,OAK_LOG);
cube(3,6,-3,5,9,-1,OAK_LOG);
// standing legs + dark hooves
cube(4,2,1,5,5,2,OAK_LOG);   cube(4,1,1,5,1,2,COBBLE);    // front right
cube(-7,2,1,-6,4,2,OAK_LOG); cube(-7,1,1,-6,1,2,COBBLE);  // hind right
cube(-7,2,-2,-6,4,-1,OAK_LOG); cube(-7,1,-2,-6,1,-1,COBBLE); // hind left
// raised, pawing front-left leg
cube(6,5,-2,7,6,-1,OAK_LOG);
cube(8,5,-2,8,6,-1,COBBLE);
// neck and head
cube(3,15,-1,6,17,1,OAK_LOG);
cube(5,18,-1,7,19,1,OAK_LOG);
cube(7,19,-1,10,21,1,OAK_LOG);   // skull
cube(11,19,-1,13,20,1,OAK_LOG);  // muzzle
block(13,19,0,SNOW); block(13,20,0,SNOW); // blaze
block(11,19,-1,COBBLE); block(11,19,1,COBBLE); // bridle straps
block(11,20,-1,COBBLE); block(11,20,1,COBBLE);
block(10,20,-1,COBBLE); block(10,20,1,COBBLE); // eyes
block(7,22,-1,OAK_LOG); block(7,22,1,OAK_LOG); // ears
block(7,22,0,SNOW);                             // forelock
cube(8,22,-1,10,22,1,STONE);                    // chanfron head-armor plate
// white mane ridge
block(3,18,0,SNOW); block(4,18,0,SNOW); block(4,19,0,SNOW);
block(5,20,0,SNOW); block(6,20,0,SNOW);
// rein from bridle back to rider's hand
line(11,19,1,1,16,3,COBBLE);

// ---- Caparison: red cloth with white emblems and dagged hem ----
for(let x=-8;x<=4;x++){
  for(const s of [-4,4]){
    for(let y=8;y<=13;y++){
      let b=BRICK;
      if(y===11&&(x===-6||x===-2||x===2))b=SNOW;
      block(x,y,s,b);
    }
    if(x%2===0)block(x,7,s,SNOW); // hanging dag points
  }
}
cube(7,10,-2,7,13,2,BRICK);  cube(7,9,-2,7,9,2,SNOW);   // chest drape
cube(-10,9,-2,-10,12,2,BRICK);                           // rump drape
block(-10,8,-2,SNOW); block(-10,8,0,SNOW); block(-10,8,2,SNOW);
// flowing white tail (placed after drape)
line(-10,13,0,-13,7,0,SNOW);
line(-10,12,0,-12,7,0,SNOW);
block(-13,6,0,SNOW);

// ---- Saddle ----
cube(-5,15,-2,0,15,2,COBBLE);
cube(-5,16,-1,-5,16,1,BRICK); // cantle
cube(0,16,-1,0,16,1,BRICK);   // pommel

// ---- Knight ----
// legs over the caparison
cube(-3,14,4,0,14,4,STONE);  cube(0,10,4,0,13,4,STONE);  block(1,10,4,COBBLE);
cube(-3,14,-4,0,14,-4,STONE); cube(0,10,-4,0,13,-4,STONE); block(1,10,-4,COBBLE);
// torso, belt, chest emblem
cube(-4,16,-2,-2,16,2,COBBLE);
cube(-4,17,-2,-2,19,2,STONE);
block(-2,18,0,BRICK);
// pauldrons + arms
cube(-4,18,3,-2,19,3,COBBLE);
cube(-4,18,-3,-2,19,-3,COBBLE);
cube(-3,16,3,-2,17,3,STONE);
cube(-1,16,3,1,16,3,STONE);
cube(-3,16,-3,-2,17,-3,STONE);
block(-2,16,-4,COBBLE); // shield hand
// lance raised forward-up, stone tip, red pennant
line(0,15,4,14,26,4,PLANKS);
line(15,27,4,16,28,4,STONE);
block(1,16,4,COBBLE); // gauntlet gripping shaft
cube(9,25,4,12,25,4,BRICK);
cube(9,24,4,10,24,4,BRICK);
// heater shield with white cross, point down
for(let x=-4;x<=0;x++)for(let y=14;y<=19;y++){
  if(y===14&&x!==-2)continue;
  if(y===15&&(x===-4||x===0))continue;
  block(x,y,-5,(x===-2||y===17)?SNOW:BRICK);
}
// great helm, visor slit, crest and trailing plume
cube(-4,20,-1,-2,22,1,STONE);
cube(-2,21,-1,-2,21,1,COBBLE);
cube(-4,23,0,-2,23,0,BRICK);
block(-5,23,0,BRICK); block(-6,22,0,BRICK); block(-6,21,0,BRICK);

// ---- Banner poles at rear corners ----
for(const s of [-6,6]){
  cube(-11,1,s,-11,16,s,OAK_LOG);
  cube(-10,16,s,-8,16,s,OAK_LOG);
  block(-11,17,s,SNOW);
  for(let y=10;y<=15;y++)for(let x=-9;x<=-8;x++)block(x,y,s,(y===12)?SNOW:BRICK);
  block(-9,9,s,BRICK);
}

// ---- Torch posts at front corners ----
for(const s of [-6,6]){
  cube(12,1,s,12,4,s,OAK_LOG);
  block(12,5,s,BRICK);
}

// ---- Quintain (jousting target) east of the plinth ----
cube(17,1,0,17,7,0,OAK_LOG);
cube(14,8,0,20,8,0,PLANKS);
block(14,7,0,BRICK); block(14,6,0,SNOW); block(14,5,0,BRICK); // target shield
cube(20,6,0,20,7,0,SAND); // counterweight sack

// ---- Greenery accents on the plinth ----
block(-11,1,3,LEAVES); block(-11,1,-3,LEAVES);
block(11,1,4,LEAVES);  block(11,1,-4,LEAVES);