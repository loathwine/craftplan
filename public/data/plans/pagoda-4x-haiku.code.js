// pagoda-4x-haiku — prompt:
// a Japanese pagoda...

// Japanese Pagoda - 5-tier structure with ornamental details

// === FOUNDATION (y = -1 to 1) ===
cube(-12, -1, -12, 12, -1, 12, BRICK);
cube(-11, 0, -11, 11, 0, 11, STONE);
cube(-10, 1, -10, 10, 1, 10, BRICK);

// === TIER 1: GROUND FLOOR (y = 2-10) ===
cube(-8, 2, -8, 8, 2, 8, PLANKS);

// Decorative floor pattern
for (let x = -7; x <= 7; x++) {
    for (let z = -7; z <= 7; z++) {
        if ((x + z) % 4 === 0) block(x, 2, z, BRICK);
    }
}

// Four corner pavilions
const cornersTier1 = [[-8, -8], [8, -8], [-8, 8], [8, 8]];
for (let [cx, cz] of cornersTier1) {
    // Thick corner posts
    for (let y = 3; y <= 7; y++) {
        block(cx, y, cz, OAK_LOG);
    }
    // Support bracing
    for (let dy = 0; dy <= 4; dy++) {
        block(cx - (cx > 0 ? 1 : -1), 3 + dy, cz, COBBLE);
        block(cx, 3 + dy, cz - (cz > 0 ? 1 : -1), COBBLE);
    }
}

// Perimeter wall beams
for (let x = -7; x <= 7; x++) {
    for (let y = 4; y <= 6; y++) {
        block(x, y, -8, OAK_LOG);
        block(x, y, 8, OAK_LOG);
    }
}
for (let z = -8; z <= 8; z++) {
    for (let y = 4; y <= 6; y++) {
        block(-8, y, z, OAK_LOG);
        block(8, y, z, OAK_LOG);
    }
}

// Interior floor supports
for (let x = -4; x <= 4; x += 4) {
    for (let z = -4; z <= 4; z += 4) {
        for (let y = 3; y <= 5; y++) {
            block(x, y, z, OAK_LOG);
        }
    }
}

// Stepped roof - main overhang
for (let x = -9; x <= 9; x++) {
    for (let z = -9; z <= 9; z++) {
        const dx = Math.abs(x);
        const dz = Math.abs(z);
        const dist = Math.max(dx, dz);
        if (dist === 9) {
            block(x, 8, z, BRICK);
            block(x, 9, z, BRICK);
            block(x, 10, z, BRICK);
        } else if (dist === 8 && (dx === 8 || dz === 8)) {
            block(x, 10, z, BRICK);
            block(x, 11, z, BRICK);
        }
    }
}

// Roof edge detail
for (let x = -10; x <= 10; x++) {
    for (let z = -10; z <= 10; z++) {
        const dist = Math.max(Math.abs(x), Math.abs(z));
        if (dist === 10 && Math.abs(x) <= 9 && Math.abs(z) <= 9) {
            block(x, 11, z, BRICK);
        }
    }
}

// === TIER 2 (y = 12-17) ===
cube(-6, 12, -6, 6, 12, 6, PLANKS);

// Floor detail pattern
for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
        if (Math.abs(x - z) % 3 === 0) block(x, 12, z, STONE);
    }
}

// Corner posts
for (let [cx, cz] of [[-6, -6], [6, -6], [-6, 6], [6, 6]]) {
    for (let y = 11; y <= 15; y++) {
        block(cx, y, cz, OAK_LOG);
    }
}

// Wall elements with lattice pattern
for (let x = -5; x <= 5; x += 2) {
    for (let y = 12; y <= 14; y++) {
        block(x, y, -6, COBBLE);
        block(x, y, 6, COBBLE);
    }
}
for (let z = -5; z <= 5; z += 2) {
    for (let y = 12; y <= 14; y++) {
        block(-6, y, z, COBBLE);
        block(6, y, z, COBBLE);
    }
}

// Cross beam support
cube(-1, 13, -1, 1, 14, 1, OAK_LOG);
cube(-5, 13, 0, 5, 13, 0, OAK_LOG);
cube(0, 13, -5, 0, 13, 5, OAK_LOG);

// Roof overhang
for (let x = -7; x <= 7; x++) {
    for (let z = -7; z <= 7; z++) {
        const dist = Math.max(Math.abs(x), Math.abs(z));
        if (dist === 7) {
            block(x, 15, z, BRICK);
            block(x, 16, z, BRICK);
            block(x, 17, z, BRICK);
        } else if (dist === 6 && (Math.abs(x) === 6 || Math.abs(z) === 6)) {
            block(x, 17, z, BRICK);
            block(x, 18, z, BRICK);
        }
    }
}

// === TIER 3 (y = 19-24) ===
cube(-4, 19, -4, 4, 19, 4, PLANKS);

// Floor inlay
for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
        if ((x * z) % 2 === 1) block(x, 19, z, STONE);
    }
}

// Posts
for (let [cx, cz] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) {
    for (let y = 18; y <= 21; y++) {
        block(cx, y, cz, OAK_LOG);
    }
}

// Wall beams
for (let x = -3; x <= 3; x += 2) {
    for (let y = 19; y <= 20; y++) {
        block(x, y, -4, COBBLE);
        block(x, y, 4, COBBLE);
    }
}
for (let z = -4; z <= 4; z += 2) {
    for (let y = 19; y <= 20; y++) {
        block(-4, y, z, COBBLE);
        block(4, y, z, COBBLE);
    }
}

// Roof
for (let x = -5; x <= 5; x++) {
    for (let z = -5; z <= 5; z++) {
        const dist = Math.max(Math.abs(x), Math.abs(z));
        if (dist === 5) {
            block(x, 21, z, BRICK);
            block(x, 22, z, BRICK);
            block(x, 23, z, BRICK);
        } else if (dist === 4 && (Math.abs(x) === 4 || Math.abs(z) === 4)) {
            block(x, 23, z, BRICK);
            block(x, 24, z, BRICK);
        }
    }
}

// === TIER 4 (y = 25-29) ===
cube(-2, 25, -2, 2, 25, 2, PLANKS);

// Floor pattern
block(-2, 25, -2, STONE);
block(2, 25, -2, STONE);
block(-2, 25, 2, STONE);
block(2, 25, 2, STONE);

// Posts
for (let [cx, cz] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) {
    for (let y = 24; y <= 27; y++) {
        block(cx, y, cz, OAK_LOG);
    }
}

// Windows/openings
block(-2, 25, 0, GLASS);
block(2, 25, 0, GLASS);
block(0, 25, -2, GLASS);
block(0, 25, 2, GLASS);

// Roof
for (let x = -3; x <= 3; x++) {
    for (let z = -3; z <= 3; z++) {
        if (Math.abs(x) === 3 || Math.abs(z) === 3) {
            block(x, 27, z, BRICK);
            block(x, 28, z, BRICK);
        } else if (Math.abs(x) <= 2 && Math.abs(z) <= 2 && Math.max(Math.abs(x), Math.abs(z)) === 2) {
            block(x, 28, z, BRICK);
        }
    }
}

// === SPIRE (y = 29-33) ===
cube(-1, 29, -1, 1, 29, 1, OAK_LOG);
block(0, 30, 0, OAK_LOG);
block(0, 31, 0, BRICK);
block(0, 32, 0, BRICK);
block(0, 33, 0, BRICK);

// Ornamental rings on spire
block(1, 30, 0, BRICK);
block(-1, 30, 0, BRICK);
block(0, 30, 1, BRICK);
block(0, 30, -1, BRICK);

// Tip
block(0, 34, 0, SNOW);