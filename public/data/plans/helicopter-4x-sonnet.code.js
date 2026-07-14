// helicopter-4x-sonnet (claude-sonnet-5)
// --- extracted code ---
Good, no stray file was created. Here's the build code:

```js
const HULL = STONE;
const TRIM = COBBLE;
const HOT = BRICK;
const GLASSC = GLASS;
const BLADE = STONE;

const profile = {
  '-10': { hw: 0, yb: 3, yt: 4 },
  '-9':  { hw: 1, yb: 2, yt: 5 },
  '-8':  { hw: 1, yb: 2, yt: 5 },
  '-7':  { hw: 1, yb: 2, yt: 6 },
  '-6':  { hw: 2, yb: 1, yt: 6 },
  '-5':  { hw: 2, yb: 1, yt: 7 },
  '-4':  { hw: 2, yb: 1, yt: 7 },
  '-3':  { hw: 2, yb: 1, yt: 7 },
  '-2':  { hw: 2, yb: 1, yt: 7 },
  '-1':  { hw: 2, yb: 1, yt: 7 },
  '0':   { hw: 2, yb: 1, yt: 7 },
  '1':   { hw: 2, yb: 1, yt: 7 },
  '2':   { hw: 2, yb: 1, yt: 6 },
  '3':   { hw: 1, yb: 1, yt: 5 },
  '4':   { hw: 1, yb: 1, yt: 5 },
  '5':   { hw: 1, yb: 2, yt: 4 },
  '6':   { hw: 1, yb: 2, yt: 4 },
};

for (const zs in profile) {
  const z = parseInt(zs, 10);
  const p = profile[zs];
  cube(-p.hw, p.yb, z, p.hw, p.yt, z, HULL);
}

cube(-2, 1, -6, 2, 1, 2, TRIM);
cube(-2, 7, -5, 2, 7, 1, TRIM);

for (let z = 7; z <= 16; z++) {
  const yb = 2;
  const yt = z <= 14 ? 3 : 2;
  cube(0, yb, z, 0, yt, z, HULL);
}
line(0, 4, 7, 0, 4, 12, TRIM);

cube(-3, 3, 13, 3, 3, 14, HULL);
cube(-3, 3, 13, -3, 3, 14, TRIM);
cube(3, 3, 13, 3, 3, 14, TRIM);

cube(0, 2, 17, 0, 7, 17, HULL);
cube(0, 6, 17, 0, 8, 18, HULL);
line(0, 2, 18, 0, 2, 19, TRIM);

block(1, 5, 18, TRIM);
line(1, 2, 18, 1, 8, 18, BLADE);
line(1, 5, 15, 1, 5, 21, BLADE);

cube(-1, 3, -9, 1, 4, -8, GLASSC);
cube(-1, 4, -7, 1, 5, -6, GLASSC);
cube(-1, 5, -6, 1, 6, -5, GLASSC);
line(-1, 3, -9, -1, 6, -5, TRIM);
line(1, 3, -9, 1, 6, -5, TRIM);
line(-1, 6, -5, 1, 6, -5, TRIM);

sphere(0, 1, -9, 1, TRIM);
line(0, 1, -10, 0, 1, -13, HULL);
line(-1, 1, -13, 1, 1, -13, TRIM);

sphere(0, 0, -9, 1, TRIM);

cylinder(0, 7, -1, 1, 2, HULL);
sphere(0, 9, -1, 1, TRIM);
line(-9, 9, -1, 9, 9, -1, BLADE);
line(0, 9, -10, 0, 9, 8, BLADE);
block(-9, 8, -1, BLADE);
block(9, 8, -1, BLADE);
block(0, 8, -10, BLADE);
block(0, 8, 8, BLADE);

cube(-2, 7, 1, -2, 8, 2, HOT);
cube(2, 7, 1, 2, 8, 2, HOT);

function pod(sign) {
  const xIn = sign * 2, xOut = sign * 6, xPod1 = sign * 6, xPod2 = sign * 5;
  cube(Math.min(xIn, xOut), 2, 0, Math.max(xIn, xOut), 3, 1, HULL);
  cube(Math.min(xPod1, xPod2), 2, -3, Math.max(xPod1, xPod2), 3, 3, TRIM);
  cube(Math.min(xPod1, xPod2), 2, -4, Math.max(xPod1, xPod2), 3, -4, HOT);
  block(xPod1, 2, -4, HOT);
  block(xPod2, 3, -4, HOT);
  cube(xOut, 2, -1, xOut, 3, 1, HULL);
}
pod(1);
pod(-1);

line(-2, 0, -4, -2, 0, 5, TRIM);
line(2, 0, -4, 2, 0, 5, TRIM);
line(-2, 0, -4, 2, 0, -4, TRIM);
line(-2, 0, 5, 2, 0, 5, TRIM);
line(-2, 0, -3, -2, 1, -3, HULL);
line(-2, 0, 3, -2, 1, 3, HULL);
line(2, 0, -3, 2, 1, -3, HULL);
line(2, 0, 3, 2, 1, 3, HULL);

line(0, 0, 15, 0, 2, 15, TRIM);
sphere(0, 0, 15, 1, TRIM);

line(1, 7, -3, 1, 9, -3, TRIM);
```
