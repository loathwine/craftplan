// santa-sleigh-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
```javascript
// ===== Snowy ground platform =====
cube(-9, -1, -21, 9, -1, 16, 12); // SNOW

function reindeer(cx, hz, opts) {
  opts = opts || {};
  const nose = opts.rudolph ? 10 : 8; // BRICK or COBBLE
  const flLift = opts.flLift || 0, frLift = opts.frLift || 0;
  const blLift = opts.blLift || 0, brLift = opts.brLift || 0;
  const zHead = hz, zNeck = hz + 1, zBodyF = hz + 1, zBodyB = hz + 4, zTail = hz + 5;

  cube(cx - 1, flLift, zBodyF, cx - 1, 2, zBodyF, 4);
  cube(cx + 1, frLift, zBodyF, cx + 1, 2, zBodyF, 4);
  cube(cx - 1, blLift, zBodyB, cx - 1, 2, zBodyB, 4);
  cube(cx + 1, brLift, zBodyB, cx + 1, 2, zBodyB, 4);

  cube(cx - 1, 3, zBodyF, cx + 1, 4, zBodyB, 4); // body OAK_LOG
  block(cx, 3, Math.round((zBodyF + zBodyB) / 2), 12); // belly patch SNOW
  block(cx - 1, 4, zBodyF + 1, 2); // flank DIRT fur mark
  block(cx + 1, 4, zBodyB - 1, 2);

  block(cx, 4, zHead, 4); // neck
  block(cx, 5, zHead, 4);
  block(cx, 5, zHead - 1, 4); // head
  block(cx, 5, zHead - 2, 2); // snout DIRT
  block(cx, 5, zHead - 3, nose); // nose tip
  block(cx - 1, 5, zHead, 4); // ears
  block(cx + 1, 5, zHead, 4);

  line(cx, 6, zHead, cx - 2, 9, zHead - 2, 4); // antlers
  line(cx, 6, zHead, cx + 2, 9, zHead - 2, 4);
  line(cx - 2, 9, zHead - 2, cx - 3, 10, zHead - 3, 4);
  line(cx + 2, 9, zHead - 2, cx + 3, 10, zHead - 3, 4);
  line(cx - 2, 8, zHead - 1, cx - 3, 9, zHead - 1, 4);
  line(cx + 2, 8, zHead - 1, cx + 3, 9, zHead - 1, 4);

  block(cx, 4, zTail, 12); // tail tuft SNOW
  block(cx, 4, zNeck, 8); // collar COBBLE
  block(cx, 5, zNeck, 6); // little bell SAND

  line(cx, 4, zNeck, 0, 3, 2, 8); // harness rope to hitch
}

// three rows, two reindeer per row, Rudolph leads front-left
reindeer(-3, -18, { rudolph: true, frLift: 1, blLift: 1 });
reindeer(3, -18, { frLift: 1, blLift: 1 });
reindeer(-3, -11, { flLift: 1, brLift: 1 });
reindeer(3, -11, { flLift: 1, brLift: 1 });
reindeer(-3, -4, {});
reindeer(3, -4, {});

// yoke crossbars per row
line(-2, 4, -17, 2, 4, -17, 4);
line(-2, 4, -10, 2, 4, -10, 4);
line(-2, 4, -3, 2, 4, -3, 4);
block(0, 3, 2, 8); // central hitch ring

// ===== Sleigh =====
// runners with curled front tip
block(-2, 4, -2, 4); block(-2, 3, -1, 4); block(-2, 2, 0, 4); block(-2, 1, 1, 4);
cube(-2, 0, 2, -2, 0, 12, 4); block(-2, 1, 13, 4);
block(2, 4, -2, 4); block(2, 3, -1, 4); block(2, 2, 0, 4); block(2, 1, 1, 4);
cube(2, 0, 2, 2, 0, 12, 4); block(2, 1, 13, 4);

cube(-2, 1, 2, 2, 1, 12, 7); // floor PLANKS
cube(-2, 2, 2, -2, 4, 12, 10); // left wall BRICK
cube(2, 2, 2, 2, 4, 12, 10); // right wall BRICK
cube(-2, 2, 2, 2, 4, 2, 7); // front wall PLANKS
cube(-2, 2, 12, 2, 7, 12, 10); // tall back BRICK
line(-2, 7, 12, -2, 9, 10, 10); // curled top left
line(2, 7, 12, 2, 9, 10, 10); // curled top right
block(0, 10, 10, 10); // curl peak

// trim
cube(-2, 5, 2, -2, 5, 12, 12); cube(2, 5, 2, 2, 5, 12, 12); cube(-2, 5, 2, 2, 5, 2, 12);
cube(-2, 3, 2, -2, 3, 12, 6); cube(2, 3, 2, 2, 3, 12, 6); // gold stripe SAND

// icy trail behind sleigh
line(-2, 0, 13, -2, 0, 16, 13);
line(2, 0, 13, 2, 0, 16, 13);

// ===== Santa =====
cube(-1, 2, 6, 1, 2, 7, 10);
cube(-1, 3, 6, 1, 5, 7, 10);
cube(-1, 3, 7, 1, 3, 7, 8); // belt
cube(-2, 3, 6, -2, 4, 7, 10); cube(2, 3, 6, 2, 4, 7, 10); // arms
block(-2, 3, 5, 12); block(2, 3, 5, 12); // cuffs
block(0, 6, 6, 7); // face PLANKS
cube(-1, 5, 6, 1, 5, 6, 12); // beard
block(0, 6, 5, 12); // chin beard
cube(-1, 6, 6, 1, 6, 6, 12); // hat brim
block(0, 7, 6, 10); block(0, 8, 6, 10); // hat cone
block(0, 9, 6, 12); // pompom

// sack + spilled presents
sphere(0, 3, 10, 2, 2);
block(0, 5, 10, 8);
const giftColors = [10, 11, 7, 12, 6];
for (let i = 0; i < 8; i++) {
  const gx = -2 + (i % 4);
  const gz = 9 + Math.floor(i / 4);
  const gy = 2 + (i % 3 === 0 ? 1 : 0);
  const c = giftColors[i % giftColors.length];
  cube(gx, gy, gz, gx, gy + 1, gz, c);
  line(gx, gy + 2, gz, gx, gy + 2, gz, 12); // bow dot
}
// a couple fallen presents outside the sleigh
cube(4, 0, 14, 4, 1, 14, 11);
cube(-4, 0, 15, -4, 1, 15, 10);

// ===== Pine trees flanking the scene =====
function tree(cx, cz) {
  cylinder(cx, 0, cz, 1, 4, 4);
  disk(cx, 4, cz, 2, 5);
  disk(cx, 5, cz, 1, 5);
  block(cx, 6, cz, 12);
}
tree(-8, -19);
tree(8, -19);
tree(-8, 12);
tree(8, 12);

// ===== Snowman spectator =====
sphere(-8, 1, -2, 2, 12);
sphere(-8, 3, -2, 1, 12);
block(-8, 5, -2, 12);
block(-8, 5, -3, 10); // carrot nose
block(-8, 3, -3, 8); block(-8, 3, -1, 8); // buttons
line(-8, 4, -2, -10, 5, -4, 4); line(-8, 4, -2, -6, 5, -4, 4); // stick arms
cube(-9, 6, -3, -7, 6, -1, 8); block(-8, 7, -2, 8); block(-8, 8, -2, 8); // top hat

// ===== Falling snow =====
for (let i = 0; i < 45; i++) {
  const sx = Math.round(-9 + Math.random() * 18);
  const sy = 8 + Math.round(Math.random() * 8);
  const sz = Math.round(-21 + Math.random() * 37);
  block(sx, sy, sz, 12);
}
```
