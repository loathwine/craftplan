// Shared building primitives. Each planner returns { x, y, z, block }[].

export const AIR=0, GRASS=1, DIRT=2, STONE=3, OAK_LOG=4, LEAVES=5,
              SAND=6, PLANKS=7, COBBLE=8, BEDROCK=9, BRICK=10, GLASS=11;

const mk = () => { const p = []; p.add = (x,y,z,b) => p.push({x,y,z,block:b}); return p; };

// ---- Castle ----
export function planCastle(cx, by, cz) {
  const p = mk();
  const S = 10, WALL_H = 9, TOWER_R = 2, TOWER_H = 14, KEEP_R = 3, KEEP_H = 17;

  // Clear airspace
  for (let dx = -S-1; dx <= S+1; dx++)
    for (let dz = -S-1; dz <= S+1; dz++)
      for (let y = by; y <= by + TOWER_H + 5; y++)
        p.add(cx+dx, y, cz+dz, AIR);

  // Floor
  for (let dx = -S; dx <= S; dx++)
    for (let dz = -S; dz <= S; dz++)
      p.add(cx+dx, by, cz+dz, COBBLE);

  // Planks path to keep
  for (let dz = KEEP_R+1; dz <= S; dz++)
    for (let w = -1; w <= 1; w++)
      p.add(cx+w, by, cz+dz, PLANKS);

  // Outer walls
  for (let h = 1; h <= WALL_H; h++)
    for (let d = -S; d <= S; d++) {
      p.add(cx+d, by+h, cz-S, BRICK);
      p.add(cx+d, by+h, cz+S, BRICK);
      p.add(cx-S, by+h, cz+d, BRICK);
      p.add(cx+S, by+h, cz+d, BRICK);
    }

  // Gate
  for (let h = 1; h <= 5; h++)
    for (let d = -1; d <= 1; d++)
      p.add(cx+d, by+h, cz+S, AIR);
  for (let d = -2; d <= 2; d++) p.add(cx+d, by+6, cz+S, OAK_LOG);

  // Battlements + walkway
  for (let d = -S; d <= S; d += 2) {
    p.add(cx+d, by+WALL_H+1, cz-S, BRICK);
    p.add(cx+d, by+WALL_H+1, cz+S, BRICK);
    p.add(cx-S, by+WALL_H+1, cz+d, BRICK);
    p.add(cx+S, by+WALL_H+1, cz+d, BRICK);
  }

  // Corner towers
  for (const [ox, oz] of [[-S,-S],[S,-S],[-S,S],[S,S]]) {
    for (let h = 1; h <= TOWER_H; h++)
      for (let tx = -TOWER_R; tx <= TOWER_R; tx++)
        for (let tz = -TOWER_R; tz <= TOWER_R; tz++)
          if (Math.abs(tx) === TOWER_R || Math.abs(tz) === TOWER_R)
            p.add(cx+ox+tx, by+h, cz+oz+tz, STONE);
    for (let h = 5; h <= 7; h++) {
      p.add(cx+ox-TOWER_R, by+h, cz+oz, GLASS);
      p.add(cx+ox+TOWER_R, by+h, cz+oz, GLASS);
      p.add(cx+ox, by+h, cz+oz-TOWER_R, GLASS);
      p.add(cx+ox, by+h, cz+oz+TOWER_R, GLASS);
    }
    for (let h = 0; h < TOWER_R+1; h++) {
      const r = TOWER_R - h;
      for (let tx = -r; tx <= r; tx++)
        for (let tz = -r; tz <= r; tz++)
          if (Math.abs(tx) === r || Math.abs(tz) === r || (h === TOWER_R && !tx && !tz))
            p.add(cx+ox+tx, by+TOWER_H+2+h, cz+oz+tz, BRICK);
    }
    p.add(cx+ox, by+TOWER_H+5, cz+oz, OAK_LOG);
    p.add(cx+ox, by+TOWER_H+6, cz+oz, OAK_LOG);
    p.add(cx+ox+1, by+TOWER_H+6, cz+oz, BRICK);
    p.add(cx+ox+2, by+TOWER_H+6, cz+oz, BRICK);
  }

  // Central keep
  for (let h = 1; h <= KEEP_H; h++)
    for (let dx = -KEEP_R; dx <= KEEP_R; dx++)
      for (let dz = -KEEP_R; dz <= KEEP_R; dz++)
        if (Math.abs(dx) === KEEP_R || Math.abs(dz) === KEEP_R)
          p.add(cx+dx, by+h, cz+dz, COBBLE);
  for (let h = 1; h <= 3; h++)
    for (let d = -1; d <= 1; d++)
      p.add(cx+d, by+h, cz+KEEP_R, AIR);
  for (let h = 0; h < 5; h++) p.add(cx, by+KEEP_H+2+h, cz, OAK_LOG);
  for (let h = 0; h < 3; h++)
    for (let w = 1; w <= 3; w++)
      p.add(cx+w, by+KEEP_H+5+h, cz, BRICK);

  return p;
}

// ---- Wizard Tower ----
export function planTower(cx, by, cz) {
  const p = mk();
  const R = 3, H = 25;
  for (let dx = -R-1; dx <= R+1; dx++)
    for (let dz = -R-1; dz <= R+1; dz++)
      for (let y = by; y <= by + H + R + 2; y++)
        p.add(cx+dx, y, cz+dz, AIR);
  for (let h = 0; h <= H; h++)
    for (let dx = -R; dx <= R; dx++)
      for (let dz = -R; dz <= R; dz++)
        if (Math.abs(dx) === R || Math.abs(dz) === R)
          p.add(cx+dx, by+h, cz+dz, STONE);
  // Door
  p.add(cx, by+1, cz+R, AIR);
  p.add(cx, by+2, cz+R, AIR);
  // Windows
  for (let h = 5; h <= H - 3; h += 4)
    for (const [dx, dz] of [[-R, 0], [R, 0], [0, -R], [0, R]])
      p.add(cx+dx, by+h, cz+dz, GLASS);
  // Conical roof
  for (let h = 1; h <= R + 1; h++) {
    const r = R + 1 - h;
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++)
        if (Math.abs(dx) === r || Math.abs(dz) === r || (!dx && !dz))
          p.add(cx+dx, by+H+h, cz+dz, BRICK);
  }
  return p;
}

// ---- Pyramid ----
export function planPyramid(cx, by, cz) {
  const p = mk();
  const R = 10;
  for (let h = 0; h <= R; h++) {
    const r = R - h;
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++) {
        const shell = Math.abs(dx) === r || Math.abs(dz) === r;
        if (shell || h === 0) p.add(cx+dx, by+h, cz+dz, h === R ? BRICK : SAND);
      }
  }
  return p;
}

// ---- Giant Tree ----
export function planTree(cx, by, cz) {
  const p = mk();
  const trunkH = 15, leafR = 6;
  for (let h = 0; h < trunkH; h++) p.add(cx, by+h, cz, OAK_LOG);
  const topY = by + trunkH;
  for (let dx = -leafR; dx <= leafR; dx++)
    for (let dy = -leafR; dy <= leafR; dy++)
      for (let dz = -leafR; dz <= leafR; dz++) {
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d >= leafR - 1.5 && d <= leafR) p.add(cx+dx, topY+dy, cz+dz, LEAVES);
      }
  return p;
}

// ---- Sphere ----
export function planSphere(cx, by, cz, radius = 5, block = GLASS) {
  const p = mk();
  const r = radius;
  for (let dx = -r; dx <= r; dx++)
    for (let dy = -r; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++) {
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d >= r - 0.6 && d <= r + 0.2) p.add(cx+dx, by+dy, cz+dz, block);
      }
  return p;
}

// ---- House ----
export function planHouse(cx, by, cz) {
  const p = mk();
  const W = 3, L = 4, H = 4;
  // Floor
  for (let dx = -W; dx <= W; dx++)
    for (let dz = -L; dz <= L; dz++)
      p.add(cx+dx, by, cz+dz, PLANKS);
  // Walls
  for (let h = 1; h <= H; h++)
    for (let dx = -W; dx <= W; dx++)
      for (let dz = -L; dz <= L; dz++) {
        const edge = Math.abs(dx) === W || Math.abs(dz) === L;
        if (edge) p.add(cx+dx, by+h, cz+dz, PLANKS);
      }
  // Door
  p.add(cx, by+1, cz+L, AIR);
  p.add(cx, by+2, cz+L, AIR);
  // Windows
  p.add(cx-W, by+2, cz, GLASS);
  p.add(cx+W, by+2, cz, GLASS);
  // Peaked roof
  for (let dz = -L; dz <= L; dz++)
    for (let i = 0; i <= W; i++) {
      const y = by + H + 1 + i;
      const x1 = cx - W + i, x2 = cx + W - i;
      p.add(x1, y, cz+dz, BRICK);
      if (x2 !== x1) p.add(x2, y, cz+dz, BRICK);
    }
  return p;
}

export const PLANNERS = {
  castle: planCastle,
  tower: planTower,
  pyramid: planPyramid,
  tree: planTree,
  house: planHouse,
};
