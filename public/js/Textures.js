// Block type constants
export const Block = {
  AIR:      0,
  GRASS:    1,
  DIRT:     2,
  STONE:    3,
  OAK_LOG:  4,
  LEAVES:   5,
  SAND:     6,
  PLANKS:   7,
  COBBLE:   8,
  BEDROCK:  9,
  BRICK:    10,
  GLASS:    11,
  SNOW:     12,
  ICE:      13,
};

// Per-face colors [r, g, b] in 0-1 range
export const BLOCK_COLORS = {
  [Block.GRASS]:   { top: [0.30, 0.62, 0.08], side: [0.53, 0.38, 0.26], bottom: [0.53, 0.38, 0.26] },
  [Block.DIRT]:    { top: [0.53, 0.38, 0.26], side: [0.53, 0.38, 0.26], bottom: [0.53, 0.38, 0.26] },
  [Block.STONE]:   { top: [0.52, 0.52, 0.52], side: [0.48, 0.48, 0.48], bottom: [0.45, 0.45, 0.45] },
  [Block.OAK_LOG]: { top: [0.47, 0.37, 0.18], side: [0.40, 0.27, 0.12], bottom: [0.47, 0.37, 0.18] },
  [Block.LEAVES]:  { top: [0.16, 0.48, 0.10], side: [0.13, 0.42, 0.07], bottom: [0.11, 0.38, 0.05] },
  [Block.SAND]:    { top: [0.87, 0.84, 0.64], side: [0.84, 0.80, 0.60], bottom: [0.80, 0.76, 0.56] },
  [Block.PLANKS]:  { top: [0.76, 0.60, 0.38], side: [0.72, 0.56, 0.34], bottom: [0.68, 0.52, 0.30] },
  [Block.COBBLE]:  { top: [0.44, 0.44, 0.44], side: [0.40, 0.40, 0.40], bottom: [0.36, 0.36, 0.36] },
  [Block.BEDROCK]: { top: [0.20, 0.20, 0.20], side: [0.18, 0.18, 0.18], bottom: [0.15, 0.15, 0.15] },
  [Block.BRICK]:   { top: [0.60, 0.25, 0.20], side: [0.58, 0.22, 0.18], bottom: [0.55, 0.20, 0.15] },
  [Block.GLASS]:   { top: [0.70, 0.85, 0.95], side: [0.70, 0.85, 0.95], bottom: [0.70, 0.85, 0.95] },
  [Block.SNOW]:    { top: [0.96, 0.97, 1.00], side: [0.92, 0.94, 0.98], bottom: [0.85, 0.87, 0.92] },
  [Block.ICE]:     { top: [0.65, 0.82, 0.98], side: [0.60, 0.78, 0.95], bottom: [0.55, 0.72, 0.92] },
};

// Status colors for task structures
export const STATUS_COLORS = {
  todo:    [0.86, 0.27, 0.27],
  wip:     [0.96, 0.62, 0.04],
  done:    [0.13, 0.77, 0.37],
  blocked: [0.66, 0.33, 0.93],
};

// Task size dimensions: { width, height }
export const TASK_SIZES = {
  S:  { w: 1, h: 3 },
  M:  { w: 2, h: 5 },
  L:  { w: 3, h: 7 },
  XL: { w: 5, h: 10 },
};

// Block types that should render with transparency.
export const TRANSPARENT_BLOCKS = new Set([Block.GLASS, Block.ICE]);
export const isTransparent = (b) => TRANSPARENT_BLOCKS.has(b);
export const isOpaque = (b) => b !== Block.AIR && !TRANSPARENT_BLOCKS.has(b);

// Deterministic per-block color variation (±7%)
export function colorVariation(x, y, z) {
  let n = x * 374761393 + y * 668265263 + z * 1274126177;
  n = ((n ^ (n >>> 13)) * 1571765493) >>> 0;
  return 0.93 + (n % 150) / 1000; // 0.93 to 1.08
}
