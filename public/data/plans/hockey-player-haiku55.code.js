// hockey-player-haiku55 — prompt:
// an ice hockey player taking a slapshot...

// Ice hockey slapshot: rink, goal, goalie, crowd, and a player mid-windup
const hash = (a, b, c) => {
  const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453;
  return s - Math.floor(s);
};

// ---- Clear the site ----
cube(-15, 0, -8, 15, 12, 22, AIR);

// ---- Rink ----
cube(-9, -2, -7, 9, -2, 7, WHITE);      // white base under the ice
cube(-9, -1, -7, 9, -1, 7, ICE);        // ice surface, top at y=0
cube(-5, -1, -7, -5, -1, 7, BLUE);      // blue lines
cube(5, -1, -7, 5, -1, 7, BLUE);
cube(0, -1, -7, 0, -1, 7, RED);         // red centre line
for (let k = 0; k < 64; k++) {          // centre faceoff circle
  const a = (k / 64) * Math.PI * 2;
  block(Math.round(4 * Math.cos(a)), -1, Math.round(4 * Math.sin(a)), RED);
}
// Boards: white base with red cap
cube(-9, 0, -7, 9, 0, -7, WHITE); cube(-9, 1, -7, 9, 1, -7, RED);
cube(-9, 0, 7, 9, 0, 7, WHITE);   cube(-9, 1, 7, 9, 1, 7, RED);
cube(-9, 0, -7, -9, 0, 7, WHITE); cube(-9, 1, -7, -9, 1, 7, RED);
cube(9, 0, -7, 9, 0, 7, WHITE);   cube(9, 1, -7, 9, 1, 7, RED);

// ---- Stands behind the south boards, rising away from the camera ----
const CROWD = [RED, BLUE, YELLOW, GREEN, ORANGE, PURPLE, PINK, LIME, CYAN, WHITE, BLACK, BROWN, MAGENTA, LIGHT_BLUE];
for (let i = 0; i < 6; i++) {
  const z1 = 8 + 2 * i, z2 = z1 + 1;
  cube(-13, 0, z1, 13, i, z2, LIGHT_GRAY);           // tier
  for (let x = -12; x <= 12; x++) {
    for (const z of [z1, z2]) {
      if (hash(x, z, i) < 0.2) continue;             // gaps in the crowd
      block(x, i + 1, z, CROWD[Math.floor(hash(z, x, i + 7) * CROWD.length)]);
      if (hash(x, z, i + 3) < 0.25) {                // raised arms
        block(x, i + 2, z, CROWD[Math.floor(hash(x + 1, z, i + 9) * CROWD.length)]);
      }
    }
  }
}

// ---- Light rigs at the front corners ----
for (const px of [-13, -10, 10, 13]) {
  line(px, 1, -8, px, 10, -8, IRON);
  cube(px - 1, 11, -9, px + 1, 11, -7, GLOWSTONE);
}

// ---- Goal: red frame at the north end, glass net behind ----
cube(4, 0, -5, 4, 3, -5, RED);
cube(8, 0, -5, 8, 3, -5, RED);
cube(4, 3, -5, 8, 3, -5, RED);
cube(4, 0, -6, 8, 3, -6, GLASS);

// ---- Puck and ice shavings ----
cube(-1, 0, -5, 1, 0, -3, BLACK);
[[4, 0, 5], [7, 0, 5], [8, 0, 3], [8, 1, 2], [8, 2, 4]].forEach(([x, y, z]) => block(x, y, z, SNOW));

// ---- Stick (drawn first so the body overlaps it) ----
line(-4, 16, -4, 6, 0, 2, OAK_LOG);
cube(5, 0, 1, 7, 0, 2, BLACK);          // blade flat on the ice

// ---- Background goalie, facing the shooter with his back to the camera ----
cube(4, 0, -3, 5, 0, -2, IRON);         // skates
cube(7, 0, -3, 8, 0, -2, IRON);
cube(4, 1, -3, 5, 6, -2, WHITE);        // leg pads
cube(7, 1, -3, 8, 6, -2, WHITE);
cube(4, 7, -3, 8, 11, -2, GREEN);       // jersey
block(3, 9, -2, BROWN);                 // catch glove
block(9, 9, -2, BLACK);                 // blocker
cube(5, 12, -3, 7, 15, -2, WHITE);      // mask
block(5, 14, -3, BLACK);                // eye slots
block(7, 14, -3, BLACK);

// ---- Shooter: skates ----
cube(-2, 0, -2, -1, 0, 1, IRON);
cube(1, 0, -2, 2, 0, 1, IRON);
cube(-2, 1, -2, -1, 2, 1, BLACK);
cube(1, 1, -2, 2, 2, 1, BLACK);

// ---- Shooter: shin pads and pants ----
cube(-2, 3, -1, -1, 5, 1, WHITE);
cube(1, 3, -1, 2, 5, 1, WHITE);
cube(-2, 6, -1, 2, 7, 1, WHITE);

// ---- Shooter: jersey, hem stripe, chest number 9 ----
cube(-2, 8, -1, 2, 13, 1, RED);
cube(-2, 8, -1, 2, 8, -1, WHITE);
[[-1, 12], [0, 12], [1, 12], [-1, 11], [1, 11], [-1, 10], [0, 10], [1, 10], [1, 9]]
  .forEach(([x, y]) => block(x, y, -1, WHITE));

// ---- Shooter: shoulder pads, arms, gloves ----
cube(-3, 11, -1, -3, 13, 1, WHITE);
cube(3, 11, -1, 3, 13, 1, WHITE);
line(-3, 9, -2, -3, 12, -2, RED);       // top arm, reaching up
block(-2, 13, -3, BLACK);               // top glove
cube(3, 8, -2, 3, 10, -2, RED);         // bottom arm
cube(2, 8, -2, 2, 8, -2, RED);
block(1, 8, -2, BLACK);                 // bottom glove

// ---- Shooter: neck, helmet, cage ----
cube(-1, 14, -1, 1, 14, 1, SAND);
cube(-2, 15, -2, 2, 18, 2, BLUE);
cube(0, 18, -2, 0, 18, 2, RED);         // helmet stripe
cube(-1, 15, -3, 1, 15, -3, IRON);      // cage
cube(-1, 17, -3, 1, 17, -3, IRON);
cube(-1, 15, -3, -1, 17, -3, IRON);
cube(1, 15, -3, 1, 17, -3, IRON);
cube(0, 15, -3, 0, 17, -3, IRON);