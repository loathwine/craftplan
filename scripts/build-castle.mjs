// Build a medieval castle via WebSocket.
// Usage: nix develop --command node scripts/build-castle.mjs [centerX] [baseY] [centerZ]
import WebSocket from 'ws';

const HOST = process.env.HOST || 'localhost:3000';
const CX = parseInt(process.argv[2] ?? '20');
const BY = parseInt(process.argv[3] ?? '20');
const CZ = parseInt(process.argv[4] ?? '21');

// Block types (from Textures.js)
const AIR=0, GRASS=1, DIRT=2, STONE=3, OAK_LOG=4, LEAVES=5,
      SAND=6, PLANKS=7, COBBLE=8, BEDROCK=9, BRICK=10, GLASS=11;

const plan = [];
const add = (x, y, z, b) => plan.push({ x, y, z, block: b });

// ---- Castle parameters ----
const S = 10;              // half-size of outer wall (21x21 footprint)
const WALL_H = 9;          // outer wall height
const TOWER_R = 2;         // half-size of corner tower (5x5)
const TOWER_H = 14;        // corner tower height
const KEEP_R = 3;          // half-size of central keep (7x7)
const KEEP_H = 17;         // keep height

// ---- Clear airspace first (for clean build) ----
for (let dx = -S - 1; dx <= S + 1; dx++) {
  for (let dz = -S - 1; dz <= S + 1; dz++) {
    for (let y = BY; y <= BY + TOWER_H + 5; y++) {
      add(CX + dx, y, CZ + dz, AIR);
    }
  }
}

// ---- Floor (cobblestone) ----
for (let dx = -S; dx <= S; dx++) {
  for (let dz = -S; dz <= S; dz++) {
    add(CX + dx, BY, CZ + dz, COBBLE);
  }
}

// Decorative planks path from gate to keep
for (let dz = KEEP_R + 1; dz <= S; dz++) {
  for (let w = -1; w <= 1; w++) {
    add(CX + w, BY, CZ + dz, PLANKS);
  }
}

// ---- Outer walls (brick) ----
for (let h = 1; h <= WALL_H; h++) {
  for (let d = -S; d <= S; d++) {
    add(CX + d, BY + h, CZ - S, BRICK); // north
    add(CX + d, BY + h, CZ + S, BRICK); // south
    add(CX - S, BY + h, CZ + d, BRICK); // west
    add(CX + S, BY + h, CZ + d, BRICK); // east
  }
}

// Main gate on south wall (3 wide × 5 tall)
for (let h = 1; h <= 5; h++) {
  for (let d = -1; d <= 1; d++) {
    add(CX + d, BY + h, CZ + S, AIR);
  }
}
// Gate arch (wooden frame)
add(CX - 2, BY + 5, CZ + S, OAK_LOG);
add(CX + 2, BY + 5, CZ + S, OAK_LOG);
add(CX - 2, BY + 6, CZ + S, OAK_LOG);
add(CX + 2, BY + 6, CZ + S, OAK_LOG);
for (let d = -1; d <= 1; d++) add(CX + d, BY + 6, CZ + S, OAK_LOG);

// Wall battlements (alternating blocks on top)
for (let d = -S; d <= S; d += 2) {
  add(CX + d, BY + WALL_H + 1, CZ - S, BRICK);
  add(CX + d, BY + WALL_H + 1, CZ + S, BRICK);
  add(CX - S, BY + WALL_H + 1, CZ + d, BRICK);
  add(CX + S, BY + WALL_H + 1, CZ + d, BRICK);
}

// Wall-top walkway (inside edge)
for (let d = -S + 1; d <= S - 1; d++) {
  add(CX + d, BY + WALL_H, CZ - S + 1, COBBLE);
  add(CX + d, BY + WALL_H, CZ + S - 1, COBBLE);
  add(CX - S + 1, BY + WALL_H, CZ + d, COBBLE);
  add(CX + S - 1, BY + WALL_H, CZ + d, COBBLE);
}

// ---- 4 corner towers ----
const corners = [[-S, -S], [S, -S], [-S, S], [S, S]];
for (const [ox, oz] of corners) {
  // Hollow stone walls
  for (let h = 1; h <= TOWER_H; h++) {
    for (let tx = -TOWER_R; tx <= TOWER_R; tx++) {
      for (let tz = -TOWER_R; tz <= TOWER_R; tz++) {
        if (Math.abs(tx) === TOWER_R || Math.abs(tz) === TOWER_R) {
          add(CX + ox + tx, BY + h, CZ + oz + tz, STONE);
        }
      }
    }
  }
  // Glass windows (mid-height, all 4 sides)
  for (let h = 5; h <= 7; h++) {
    add(CX + ox - TOWER_R, BY + h, CZ + oz, GLASS);
    add(CX + ox + TOWER_R, BY + h, CZ + oz, GLASS);
    add(CX + ox, BY + h, CZ + oz - TOWER_R, GLASS);
    add(CX + ox, BY + h, CZ + oz + TOWER_R, GLASS);
  }
  // Battlements on tower top
  for (let tx = -TOWER_R; tx <= TOWER_R; tx += 2) {
    for (let tz = -TOWER_R; tz <= TOWER_R; tz++) {
      if (Math.abs(tx) === TOWER_R || Math.abs(tz) === TOWER_R) {
        add(CX + ox + tx, BY + TOWER_H + 1, CZ + oz + tz, STONE);
      }
    }
  }
  // Conical brick roof
  for (let h = 0; h < TOWER_R + 1; h++) {
    const r = TOWER_R - h;
    for (let tx = -r; tx <= r; tx++) {
      for (let tz = -r; tz <= r; tz++) {
        if (Math.abs(tx) === r || Math.abs(tz) === r || (h === TOWER_R && tx === 0 && tz === 0)) {
          add(CX + ox + tx, BY + TOWER_H + 2 + h, CZ + oz + tz, BRICK);
        }
      }
    }
  }
  // Flagpole + flag
  add(CX + ox, BY + TOWER_H + 5, CZ + oz, OAK_LOG);
  add(CX + ox, BY + TOWER_H + 6, CZ + oz, OAK_LOG);
  add(CX + ox + 1, BY + TOWER_H + 6, CZ + oz, BRICK);
  add(CX + ox + 2, BY + TOWER_H + 6, CZ + oz, BRICK);
}

// ---- Central keep ----
for (let h = 1; h <= KEEP_H; h++) {
  for (let dx = -KEEP_R; dx <= KEEP_R; dx++) {
    for (let dz = -KEEP_R; dz <= KEEP_R; dz++) {
      if (Math.abs(dx) === KEEP_R || Math.abs(dz) === KEEP_R) {
        add(CX + dx, BY + h, CZ + dz, COBBLE);
      }
    }
  }
}
// Keep door (south side)
for (let h = 1; h <= 3; h++) {
  for (let d = -1; d <= 1; d++) {
    add(CX + d, BY + h, CZ + KEEP_R, AIR);
  }
}
// Keep windows
for (let h = 6; h <= 7; h++) {
  for (let side of [-KEEP_R, KEEP_R]) {
    add(CX + side, BY + h, CZ - 1, GLASS);
    add(CX + side, BY + h, CZ + 1, GLASS);
    add(CX - 1, BY + h, CZ + side, GLASS);
    add(CX + 1, BY + h, CZ + side, GLASS);
  }
}
// Higher keep windows
for (let h = 12; h <= 13; h++) {
  for (let side of [-KEEP_R, KEEP_R]) {
    add(CX + side, BY + h, CZ, GLASS);
    add(CX, BY + h, CZ + side, GLASS);
  }
}
// Keep battlements
for (let d = -KEEP_R; d <= KEEP_R; d += 2) {
  add(CX + d, BY + KEEP_H + 1, CZ - KEEP_R, COBBLE);
  add(CX + d, BY + KEEP_H + 1, CZ + KEEP_R, COBBLE);
  add(CX - KEEP_R, BY + KEEP_H + 1, CZ + d, COBBLE);
  add(CX + KEEP_R, BY + KEEP_H + 1, CZ + d, COBBLE);
}
// Keep spire
for (let h = 0; h < 5; h++) add(CX, BY + KEEP_H + 2 + h, CZ, OAK_LOG);
for (let h = 0; h < 3; h++) {
  for (let w = 1; w <= 3; w++) {
    add(CX + w, BY + KEEP_H + 5 + h, CZ, BRICK);
  }
}

// ---- Courtyard decorations ----
// Garden patches
for (const [gx, gz] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) {
  add(CX + gx, BY + 1, CZ + gz, LEAVES);
  for (const [dx, dz] of [[-1,0],[1,0],[0,-1],[0,1]]) {
    add(CX + gx + dx, BY + 1, CZ + gz + dz, GRASS);
  }
}

// ---- Send the plan ----
console.log(`Built plan: ${plan.length} block operations`);
console.log(`Center: (${CX}, ${BY}, ${CZ})`);

const ws = new WebSocket(`ws://${HOST}`);

ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'join', name: 'Builder' }));
});

ws.on('message', async (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.type === 'welcome') {
    console.log('Connected. Placing blocks...');
    const start = Date.now();
    for (let i = 0; i < plan.length; i++) {
      const b = plan[i];
      const type = b.block === AIR ? 'block_break' : 'block_place';
      ws.send(JSON.stringify({ type, x: b.x, y: b.y, z: b.z, block: b.block }));
      if (i % 200 === 199) {
        await new Promise(r => setTimeout(r, 30));
        process.stdout.write(`\r  ${i + 1}/${plan.length}`);
      }
    }
    process.stdout.write(`\r  ${plan.length}/${plan.length}\n`);
    console.log(`Done in ${((Date.now() - start) / 1000).toFixed(1)}s`);
    setTimeout(() => { ws.close(); process.exit(0); }, 500);
  }
});

ws.on('error', (e) => {
  console.error('WebSocket error:', e.message);
  process.exit(1);
});
