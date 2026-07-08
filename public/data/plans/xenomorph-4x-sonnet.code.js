// xenomorph-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```js
function lerp(a, b, t) { return a + (b - a) * t; }

function limbChain(points, blockId, stepSize) {
  stepSize = stepSize || 0.6;
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1, z1, r1] = points[i];
    const [x2, y2, z2, r2] = points[i + 1];
    const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2);
    const steps = Math.max(1, Math.round(dist / stepSize));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = Math.round(lerp(x1, x2, t));
      const y = Math.round(lerp(y1, y2, t));
      const z = Math.round(lerp(z1, z2, t));
      const r = Math.max(1, Math.round(lerp(r1, r2, t)));
      sphere(x, y, z, r, blockId);
    }
  }
}

// clear tree canopy in front so the silhouette reads clean against sky
cube(-4, 1, -14, 5, 11, -6, AIR);

// scorched/charred ground patch the creature stands on
disk(0, -1, -1, 4, COBBLE);

// ================= LEGS =================
const LEFT_LEG = [[-2, 0, -3, 0.9], [-2, 1, -2, 1.0], [-2, 3, -1, 1.2], [-2, 5, 0, 1.3], [-2, 7, 0, 1.4]];
const RIGHT_LEG = [[2, 0, -3, 0.9], [2, 1, -2, 1.0], [2, 3, -1, 1.2], [2, 5, 0, 1.3], [2, 7, 0, 1.4]];
limbChain(LEFT_LEG, STONE);
limbChain(RIGHT_LEG, STONE);

// foot claws (toes), splayed forward
line(-2, 0, -3, -3, 0, -5, COBBLE);
line(-2, 0, -3, -2, 0, -6, COBBLE);
line(-2, 0, -3, -1, 0, -5, COBBLE);
line(2, 0, -3, 3, 0, -5, COBBLE);
line(2, 0, -3, 2, 0, -6, COBBLE);
line(2, 0, -3, 1, 0, -5, COBBLE);

// ================= SPINE / TORSO =================
const LOWER_SPINE = [[0, 7, 0, 2.0], [0, 9, -1, 2.3], [0, 11, -1, 2.5]];
const UPPER_CHEST = [[0, 11, -1, 2.5], [0, 13, -2, 2.3], [0, 14, -3, 1.9]];
limbChain(LOWER_SPINE, STONE);
limbChain(UPPER_CHEST, COBBLE);

// dorsal ridge spikes along the back (+Z side of spine)
line(0, 9, 2, 0, 11, 2, COBBLE);
line(-1, 11, 2, -1, 13, 2, COBBLE);
line(1, 12, 1, 1, 14, 1, COBBLE);

// ================= HEAD / NECK =================
const HEAD = [[0, 14, -3, 1.9], [0, 16, -5, 2.0], [1, 18, -7, 2.1], [1, 19, -9, 1.8], [1, 19, -11, 1.1], [1, 18, -12, 0.6]];
limbChain(HEAD, STONE);

// crest ridge along top of dome
const HEAD_RIDGE = [[0, 17, -5, 0.6], [1, 19, -7, 0.7], [1, 20, -9, 0.6], [1, 20, -11, 0.4]];
limbChain(HEAD_RIDGE, COBBLE);

// inner secondary jaw dart
line(1, 18, -12, 1, 17, -14, COBBLE);

// ================= ARMS =================
// left arm hangs low, claw near hip
const LEFT_ARM = [[-3, 13, -2, 1.3], [-4, 11, -1, 1.1], [-4, 8, -1, 0.9], [-4, 6, -1, 0.7]];
limbChain(LEFT_ARM, STONE);
line(-4, 6, -1, -5, 5, -2, COBBLE);
line(-4, 6, -1, -4, 4, -2, COBBLE);
line(-4, 6, -1, -3, 5, -2, COBBLE);

// right arm raised, reaching toward camera/sky
const RIGHT_ARM = [[3, 13, -2, 1.3], [5, 15, -4, 1.0], [6, 17, -6, 0.8], [7, 18, -8, 0.6]];
limbChain(RIGHT_ARM, STONE);
line(7, 18, -8, 8, 19, -10, COBBLE);
line(7, 18, -8, 9, 18, -9, COBBLE);
line(7, 18, -8, 8, 17, -9, COBBLE);

// ================= TAIL =================
const TAIL = [[0, 7, 2, 1.8], [0, 9, 4, 1.9], [0, 13, 6, 1.8], [0, 17, 6, 1.5], [0, 20, 4, 1.2], [0, 22, 1, 0.9], [0, 23, -2, 0.6]];
limbChain(TAIL, STONE);
const TAIL_TIP = [[0, 23, -2, 0.6], [0, 22, -5, 0.35], [0, 20, -7, 0.15]];
limbChain(TAIL_TIP, COBBLE);
line(0, 20, -7, 0, 19, -8, COBBLE);

// tail dorsal fins
line(0, 10, 4, 0, 11, 4, COBBLE);
line(0, 14, 6, 0, 15, 6, COBBLE);
line(0, 18, 5, 0, 19, 5, COBBLE);
line(0, 21, 2, 0, 22, 2, COBBLE);

// ================= FOREGROUND RUBBLE =================
cube(-7, -1, -5, -6, -1, -4, STONE);
cube(6, -1, -5, 7, -1, -4, COBBLE);
cube(-8, -1, -3, -8, 0, -3, OAK_LOG);
cube(8, -1, -2, 8, -1, -2, STONE);
```
