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
  // --- Palette (matte, Lambert path — same look model as the originals) ---
  WHITE:      14,
  LIGHT_GRAY: 15,
  GRAY:       16,
  BLACK:      17,
  RED:        18,
  ORANGE:     19,
  YELLOW:     20,
  LIME:       21,
  GREEN:      22,
  CYAN:       23,
  LIGHT_BLUE: 24,
  BLUE:       25,
  PURPLE:     26,
  MAGENTA:    27,
  PINK:       28,
  BROWN:      29,
  // --- Special materials (MeshStandard pass: roughness/metalness/emissive) ---
  GOLD:       30,
  IRON:       31,
  COPPER:     32,
  OBSIDIAN:   33,
  MARBLE:     34,
  WATER:      35,
  LAVA:       36,
  GLOWSTONE:  37,
  NEON_RED:   38,
  NEON_BLUE:  39,
};

// Uniform-colour block: top a touch brighter, bottom darker (matches the
// hand-tuned originals' shading so palette blocks sit in the same world).
const flat = (r, g, b) => ({
  top:    [r, g, b],
  side:   [r * 0.94, g * 0.94, b * 0.94],
  bottom: [r * 0.86, g * 0.86, b * 0.86],
});
// Hex values are sRGB (what a designer picks); vertex colours are consumed as
// linear, so convert or everything renders pastel/washed out.
const lin = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255].map(lin);
const flatHex = (h) => flat(...hex(h));

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

  [Block.WHITE]:      flatHex(0xe9ecec),
  [Block.LIGHT_GRAY]: flatHex(0x9d9d97),
  [Block.GRAY]:       flatHex(0x474f52),
  [Block.BLACK]:      flatHex(0x16161b),
  [Block.RED]:        flatHex(0xa12722),
  [Block.ORANGE]:     flatHex(0xf07613),
  [Block.YELLOW]:     flatHex(0xf8c627),
  [Block.LIME]:       flatHex(0x70b919),
  [Block.GREEN]:      flatHex(0x546d1b),
  [Block.CYAN]:       flatHex(0x158991),
  [Block.LIGHT_BLUE]: flatHex(0x3aafd9),
  [Block.BLUE]:       flatHex(0x35399d),
  [Block.PURPLE]:     flatHex(0x792aac),
  [Block.MAGENTA]:    flatHex(0xbe44b4),
  [Block.PINK]:       flatHex(0xed8dac),
  [Block.BROWN]:      flatHex(0x724728),

  [Block.GOLD]:       flatHex(0xf2c24a),
  [Block.IRON]:       flatHex(0xc8ccd2),
  [Block.COPPER]:     flatHex(0xc8744a),
  [Block.OBSIDIAN]:   flatHex(0x1b1426),
  [Block.MARBLE]:     flatHex(0xf1eee8),
  [Block.WATER]:      flatHex(0x2a6fc4),
  [Block.LAVA]:       flatHex(0xff5a14),
  [Block.GLOWSTONE]:  flatHex(0xffd27a),
  [Block.NEON_RED]:   flatHex(0xff2238),
  [Block.NEON_BLUE]:  flatHex(0x22c4ff),
};

// Physically-based properties for blocks that need more than a matte colour.
// Blocks listed here render in a separate MeshStandardMaterial pass (see
// World._buildMesh); everything else keeps the original Lambert path, so
// existing builds render unchanged.
//   roughness 0..1 (0 = mirror), metalness 0..1, emissive = glow strength
//   (HDR multiplier on the block colour; >~1 reads as a light under bloom).
export const BLOCK_MATERIALS = {
  [Block.GOLD]:      { roughness: 0.30, metalness: 0.85, emissive: 0 },
  [Block.IRON]:      { roughness: 0.34, metalness: 0.85, emissive: 0 },
  [Block.COPPER]:    { roughness: 0.40, metalness: 0.85, emissive: 0 },
  [Block.OBSIDIAN]:  { roughness: 0.12, metalness: 0.0, emissive: 0 },
  [Block.MARBLE]:    { roughness: 0.22, metalness: 0.0, emissive: 0 },
  [Block.WATER]:     { roughness: 0.05, metalness: 0.0, emissive: 0 },
  [Block.LAVA]:      { roughness: 0.9,  metalness: 0.0, emissive: 2.2 },
  [Block.GLOWSTONE]: { roughness: 0.8,  metalness: 0.0, emissive: 1.0 },
  [Block.NEON_RED]:  { roughness: 0.6,  metalness: 0.0, emissive: 3.2 },
  [Block.NEON_BLUE]: { roughness: 0.6,  metalness: 0.0, emissive: 2.6 },
};
export const hasSpecialMaterial = (b) => b in BLOCK_MATERIALS;
export const isEmissive = (b) => (BLOCK_MATERIALS[b]?.emissive ?? 0) > 0;

// Name lookup (id -> NAME) — shared with the AI sandbox so there's one list.
export const BLOCK_NAMES = Object.fromEntries(Object.entries(Block).map(([k, v]) => [v, k]));

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
export const TRANSPARENT_BLOCKS = new Set([Block.GLASS, Block.ICE, Block.WATER]);
export const isTransparent = (b) => TRANSPARENT_BLOCKS.has(b);
export const isOpaque = (b) => b !== Block.AIR && !TRANSPARENT_BLOCKS.has(b);

// Deterministic per-block color variation (±7%)
export function colorVariation(x, y, z) {
  let n = x * 374761393 + y * 668265263 + z * 1274126177;
  n = ((n ^ (n >>> 13)) * 1571765493) >>> 0;
  return 0.93 + (n % 150) / 1000; // 0.93 to 1.08
}
