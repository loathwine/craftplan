// jack-frost-haiku55 — prompt:
// Jack Frost...

// ===== helpers =====
function ring(cx, y, cz, r, id) {
  if (r <= 0) { block(cx, y, cz, id); return; }
  for (let x = cx - r; x <= cx + r; x++) {
    block(x, y, cz - r, id);
    block(x, y, cz + r, id);
  }
  for (let z = cz - r + 1; z <= cz + r - 1; z++) {
    block(cx - r, y, z, id);
    block(cx + r, y, z, id);
  }
}

function fillSquare(cx, y, cz, r, id) {
  for (let x = cx - r; x <= cx + r; x++)
    for (let z = cz - r; z <= cz + r; z++) block(x, y, z, id);
}

// stepped frosted spruce: ICE tiers capped with SNOW
function spruce(cx, base, cz, tiers, maxR) {
  for (let t = 0; t < tiers; t++) {
    const r = Math.max(1, maxR - t);
    const y = base + 2 * t;
    fillSquare(cx, y, cz, r, ICE);
    fillSquare(cx, y + 1, cz, Math.max(0, r - 1), SNOW);
  }
  block(cx, base + 2 * tiers, cz, SNOW);
}

function snowflake(cx, cy, cz, r, id) {
  const arms = [[1, 0], [0, 1], [1, 1], [1, -1]];
  for (const [ax, ay] of arms) {
    line(cx - ax * r, cy - ay * r, cz, cx + ax * r, cy + ay * r, cz, id);
  }
  for (const [ax, ay] of arms) {
    const px = -ay, py = ax;
    for (const s of [-1, 1]) {
      const tx = cx + s * ax * r, ty = cy + s * ay * r;
      block(tx + px, ty + py, cz, id);
      block(tx - px, ty - py, cz, id);
    }
  }
}

function crystal(x, z, h) {
  line(x, 0, z, x, h - 1, z, ICE);
  block(x, h, z, WHITE);
}

// ===== clear footprints (AIR is free) =====
cube(-6, 0, -4, 6, 12, 6, AIR);            // subject footprint, removes the old tree
cube(-19, 0, 4, -9, 11, 16, AIR);          // back-left spruce
cube(-12, 0, 6, -2, 12, 17, AIR);          // back-left-center spruce
cube(3, 0, 5, 13, 11, 16, AIR);            // back-right spruce
cube(10, 0, 4, 20, 11, 14, AIR);           // far-right spruce

// ===== ground =====
cube(-10, -1, -5, 10, -1, 6, SNOW);        // frosted field under and around Jack
cube(-10, -1, -12, 10, -1, -6, ICE);       // frozen pond in the foreground

// foreground ice boulders for depth
sphere(-9, 0, -3, 2, ICE);
sphere(10, 0, -3, 2, ICE);

// ice crystals on the pond edge
crystal(-4, -8, 3);
crystal(5, -9, 2);
crystal(-8, -10, 4);
crystal(2, -11, 2);

// ===== background: frosted spruces =====
spruce(-14, 0, 10, 5, 4);
spruce(-7, 0, 12, 5, 4);
spruce(8, 0, 11, 5, 4);
spruce(15, 0, 9, 5, 4);

// ===== background: glacier wall with snow-capped peaks =====
for (let x = -22; x <= 22; x++) {
  const h = 9 + Math.round(4 * Math.abs(Math.sin(x * 0.29)) + 2 * Math.abs(Math.cos(x * 0.13)));
  line(x, -1, 20, x, h - 1, 20, ICE);
  block(x, h, 20, SNOW);
}

// winter moon and frost snowflakes in the sky
sphere(-10, 26, 15, 3, WHITE);
snowflake(12, 22, 15, 4, ICE);
snowflake(-18, 18, 12, 3, ICE);

// ===== JACK FROST =====
// bare feet
cube(-2, 0, -2, -1, 0, 0, WHITE);
cube(0, 0, -2, 1, 0, 0, WHITE);

// blue pants
cube(-2, 1, -1, -1, 8, 1, BLUE);
cube(0, 1, -1, 1, 8, 1, BLUE);

// hood sitting behind the shoulders
cube(-2, 14, 2, 1, 16, 2, LIGHT_BLUE);

// light blue hoodie
cube(-2, 9, -1, 1, 16, 1, LIGHT_BLUE);
cube(-1, 10, -2, 0, 11, -2, BLUE);         // front pocket
block(-1, 12, -2, WHITE);                   // drawstrings
block(-1, 13, -2, WHITE);
block(0, 12, -2, WHITE);
block(0, 13, -2, WHITE);

// arms
cube(-3, 9, -1, -3, 15, 0, LIGHT_BLUE);
cube(-3, 8, -1, -3, 8, 0, WHITE);          // left hand
cube(2, 9, -1, 2, 15, 0, LIGHT_BLUE);
cube(3, 10, -1, 3, 11, -1, WHITE);         // right hand gripping the staff

// head, pale skin and white hair
cube(-2, 17, -1, 1, 21, 2, WHITE);
cube(-2, 22, -1, 1, 22, 2, WHITE);         // hair cap

// frosted hair spikes
block(-2, 23, -1, ICE);
block(1, 23, -1, ICE);
block(-2, 23, 2, ICE);
block(1, 23, 2, ICE);
block(0, 23, 0, ICE);
block(-1, 24, 0, ICE);
block(0, 24, 1, ICE);
block(1, 24, 0, ICE);
block(0, 25, 0, ICE);

// face: glowing eyes, rosy cheeks, cheeky grin
block(-1, 19, -1, NEON_BLUE);
block(0, 19, -1, NEON_BLUE);
block(-2, 18, -1, PINK);
block(1, 18, -1, PINK);
block(-1, 17, -1, BLACK);
block(0, 17, -1, BLACK);

// ===== shepherd's crook staff =====
line(3, 0, 0, 3, 26, 0, OAK_LOG);          // shaft
line(3, 27, 0, 3, 27, -3, OAK_LOG);        // top of the hook
line(3, 27, -3, 3, 24, -3, OAK_LOG);       // hook curling down toward the viewer
block(3, 28, 0, ICE);                      // frost spray on the crook
block(2, 28, -2, ICE);
block(4, 29, -1, ICE);
block(3, 29, -3, ICE);
block(1, 29, -1, WHITE);
block(5, 27, -1, WHITE);

// ===== frost details around Jack =====
block(-4, 0, -3, SNOW);
block(4, 0, -3, SNOW);
block(-5, 0, 2, SNOW);
block(5, 0, 1, SNOW);

block(-5, 20, -2, WHITE);
block(6, 22, -1, ICE);
block(-6, 14, -3, ICE);
block(5, 12, -3, WHITE);
block(-4, 27, -1, ICE);
block(7, 28, -2, WHITE);
block(-7, 9, -4, ICE);
block(6, 6, -4, WHITE);
block(-6, 25, -2, ICE);