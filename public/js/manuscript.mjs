// Demo manuscript: ordered list of shots. The recorder turns this into a
// global timeline starting at t=0. Each shot's start time is the sum of all
// prior durations.
//
// Camera types:
//   { type: 'orbit', center, radius, height, startAngle, endAngle, lookOffset? }
//   { type: 'dolly', from, to, lookFrom, lookTo? }
//   { type: 'still', pos, look }
//
// Build (optional, on a shot):
//   { plan: '<slug>', bot: 'Claude', startT, endT, botRadius? }
//   - plan slug resolves to public/data/plans/<slug>.json
//   - blocks are placed linearly across [startT, endT] (shot-local seconds)
//   - bot avatar hovers above the most recent block
//
// Overlay (optional, on a shot):
//   { html, t0, t1, fadeIn?, fadeOut? }
//   - shown between t0 and t1 (shot-local seconds), with fades

export const MANUSCRIPT = {
  fps: 30,
  width: 1280,
  height: 720,
  // Run once before the timeline starts. Used to clear trees / level ground
  // so structures aren't obscured by terrain.
  setup: [
    // Clear a 26x26 box centered on the demo site so trees don't sit on top
    // of the cottage.
    { type: 'clear', min: [114, 19, 114], max: [142, 32, 142] },
  ],
  shots: [
    {
      id: 'claude-house',
      duration: 10,
      camera: {
        type: 'orbit',
        center: [128, 22, 128],
        radius: 22, height: 14,
        startAngle: 0.4, endAngle: 2.6,
      },
      overlay: { html: '@Claude build a cozy stone cottage', t0: 0.4, t1: 8.5, fadeIn: 0.4, fadeOut: 1.0 },
      build: {
        plan: 'test-house',
        bot: 'Claude',
        startT: 1.0,
        endT: 8.0,
        botRadius: 6, botHeight: 4,
      },
    },
  ],
};
