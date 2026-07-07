// pegasus-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
This task expects raw JavaScript as the response (not a file) — outputting it directly below.

```js
function feather(x0, y0, z0, x1, y1, z1, r0, r1, id) {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const steps = Math.max(1, Math.ceil(dist));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + dx * t);
    const y = Math.round(y0 + dy * t);
    const z = Math.round(z0 + dz * t);
    const r = Math.round(r0 + (r1 - r0) * t);
    if (r <= 0) block(x, y, z, id);
    else sphere(x, y, z, r, id);
  }
}

const WHITE = SNOW;
const MANE = OAK_LOG;
const HOOF = COBBLE;
const DARK = STONE;

// Clear trees/leaves out of the body+legs footprint so the silhouette reads clean.
cube(-7, 1, -11, 7, 13, 10, AIR);

// ---------- HINDQUARTERS / TORSO / CHEST ----------
sphere(0, 9, 3, 4, WHITE);                     // rump mass
feather(0, 9, 3, 0, 13, -3, 4, 3, WHITE);       // torso, hip -> shoulder
sphere(0, 13, -3, 3, WHITE);                   // chest mass

// ---------- NECK / HEAD ----------
feather(0, 14, -3, 0, 17, -6, 3, 2, WHITE);
feather(0, 17, -6, 0, 19, -9, 2, 2, WHITE);
sphere(0, 20, -10, 2, WHITE);                  // skull
feather(0, 19, -10, 0, 18, -13, 2, 1, WHITE);  // muzzle
block(-1, 18, -13, DARK);                      // nostril
block(1, 18, -13, DARK);                       // nostril
block(-2, 20, -11, DARK);                      // eye
block(2, 20, -11, DARK);                       // eye
cube(-2, 21, -10, -1, 22, -9, WHITE);           // left ear
cube(1, 21, -10, 2, 22, -9, WHITE);             // right ear

// ---------- MANE / FORELOCK ----------
feather(0, 19, -9, 2, 15, -6, 2, 0, MANE);
feather(0, 17, -6, 2, 13, -4, 2, 0, MANE);
feather(0, 14, -3, 2, 10, 0, 2, 0, MANE);
feather(0, 20, -10, 1, 22, -9, 1, 0, MANE);

// ---------- TAIL ----------
feather(0, 8, 6, -2, 3, 13, 3, 0, MANE);
feather(0, 8, 6, 0, 2, 14, 3, 0, MANE);
feather(0, 8, 6, 2, 4, 12, 3, 0, MANE);

// ---------- HIND LEGS (planted, mirrored) ----------
for (const s of [-1, 1]) {
  feather(s * 2, 9, 3, s * 3, 5, 6, 2, 2, WHITE);
  feather(s * 3, 5, 6, s * 3, 1, 8, 2, 1, WHITE);
  cube(s * 3 - 1, 0, 7, s * 3 + 1, 0, 9, HOOF);
}

// ---------- FRONT LEGS (raised, asymmetric rearing pose) ----------
// left: tucked
feather(-2, 13, -3, -3, 16, -6, 2, 2, WHITE);
feather(-3, 16, -6, -3, 13, -8, 2, 1, WHITE);
cube(-4, 12, -8, -2, 13, -7, HOOF);
// right: extended further out/up toward the light (+X)
feather(2, 13, -3, 4, 18, -7, 2, 2, WHITE);
feather(4, 18, -7, 5, 16, -10, 2, 1, WHITE);
cube(4, 15, -11, 6, 16, -9, HOOF);

// ---------- WINGS (mirrored, swept up) ----------
for (const s of [-1, 1]) {
  sphere(s * 5, 15, -3, 3, WHITE); // covert mass at the shoulder

  // secondaries (shorter, closer to body)
  feather(s * 3, 14, -3, s * 11, 19, -6, 2, 0, WHITE);
  feather(s * 3, 14, -3, s * 12, 16, 2, 2, 0, WHITE);
  feather(s * 3, 14, -3, s * 10, 13, 7, 2, 0, WHITE);

  // primaries (long, fanning skyward)
  feather(s * 5, 15, -3, s * 17, 27, -9, 2, 0, WHITE);
  block(s * 17, 27, -9, GLASS);
  feather(s * 5, 15, -3, s * 20, 25, -3, 2, 0, WHITE);
  block(s * 20, 25, -3, GLASS);
  feather(s * 5, 15, -3, s * 21, 21, 3, 2, 0, WHITE);
  block(s * 21, 21, 3, GLASS);
  feather(s * 5, 15, -3, s * 19, 17, 8, 2, 0, WHITE);
  block(s * 19, 17, 8, GLASS);
  feather(s * 5, 15, -3, s * 15, 14, 11, 2, 0, WHITE);
}

// ---------- floating mist wisps beneath the raised hooves ----------
disk(-3, 11, -8, 1, ICE);
disk(5, 14, -10, 1, ICE);
disk(0, 0, 8, 2, ICE);
```

Note: the earlier Write tool call was denied by permissions, so no file was created — the code above is the complete, final answer.
