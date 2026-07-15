// mount-rushmore-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
// Mount Rushmore — stone cliff with four carved presidential heads facing north (-Z, toward camera)

// ---- Mountain base: stepped stone cliff, wide at bottom, narrowing with height ----
cube(-22, -1, -16, 22, 2, -14, STONE);   // tier 1 (foundation)
cube(-20, 3, -16, 20, 8, -14, STONE);    // tier 2
cube(-19, 9, -16, 19, 14, -14, STONE);   // tier 3
cube(-19, 15, -16, 19, 17, -14, STONE);  // tier 4 (ridge the heads sit on)

// rough rock texture on the front face — swap in cobble in a sparse deterministic pattern
for (let x = -22; x <= 22; x++) {
  for (let y = -1; y <= 17; y++) {
    if ((x + y * 3) % 7 === 0) block(x, y, -16, COBBLE);
  }
}

// crack/ledge details
line(-22, 6, -14, 22, 5, -14, COBBLE);
line(-19, 12, -14, 19, 11, -14, COBBLE);

// ---- Head builder ----
function buildHead(cx, opts) {
  const cy = 21, cz = -16, r = 4.0;
  opts = opts || {};

  // skull
  sphere(cx, cy, cz, r, STONE);

  // brow ridge
  cube(cx - 3, 22, -20, cx + 3, 23, -19, STONE);

  // eye sockets (recessed)
  block(cx - 2, 21, -20, AIR);
  block(cx + 2, 21, -20, AIR);
  block(cx - 2, 21, -19, AIR);
  block(cx + 2, 21, -19, AIR);

  // nose, protruding toward camera
  cube(cx - 1, 18, -21, cx + 1, 20, -19, STONE);

  // nostrils
  block(cx - 1, 18, -21, AIR);
  block(cx + 1, 18, -21, AIR);

  // mouth carve
  line(cx - 2, 17, -20, cx + 2, 17, -20, AIR);
  line(cx - 2, 17, -19, cx + 2, 17, -19, AIR);

  // cheekbones (subtle bumps)
  block(cx - 3, 19, -19, STONE);
  block(cx + 3, 19, -19, STONE);

  // ears
  cube(cx - 5, 20, -17, cx - 4, 21, -16, STONE);
  cube(cx + 4, 20, -17, cx + 5, 21, -16, STONE);

  // chin
  cube(cx - 2, 16, -19, cx + 2, 16, -18, STONE);

  if (opts.beard) {
    // Lincoln — full jaw beard hanging below the chin
    cube(cx - 3, 13, -19, cx + 3, 16, -16, STONE);
    cube(cx - 2, 12, -18, cx + 2, 13, -17, STONE);
  }
  if (opts.mustache) {
    // Roosevelt — thick mustache under the nose
    cube(cx - 3, 18, -20, cx + 3, 18, -19, STONE);
    cube(cx - 3, 18, -19, cx + 3, 18, -18, COBBLE);
  }
  if (opts.tallForehead) {
    // Jefferson — slightly higher, sloped forehead
    sphere(cx, 25, -15, 2, STONE);
  }
  if (opts.queue) {
    // Washington — hair tied back at the nape
    cube(cx - 2, 18, -13, cx + 2, 22, -11, STONE);
  }
}

buildHead(-15, { queue: true });                 // Washington
buildHead(-5, { tallForehead: true });           // Jefferson
buildHead(5, { mustache: true });                // Roosevelt
buildHead(15, { beard: true });                  // Lincoln

// ---- Foreground: low border wall + flanking flagpoles for depth separation ----
hollowCube(-22, -2, -22, 22, 0, -21, STONE);

function flagpole(x) {
  cylinder(x, -1, -21, 0.4, 8, OAK_LOG);
  cube(x, 6, -21, x + 2, 7, -21, BRICK);
}
flagpole(-19);
flagpole(19);
