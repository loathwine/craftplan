// Demo manuscript: ordered list of shots. The recorder turns this into a
// global timeline starting at t=0. Each shot's start time is the sum of all
// prior durations.

// Build sites: spaced 70 blocks apart so each can be orbited at radius 35
// without catching neighbours in frame.
const ORIGIN_DRAGON   = [100, 19, 100];
const ORIGIN_PAGODA   = [170, 19, 100];
const ORIGIN_KURAMA   = [100, 19, 170];
const ORIGIN_ROCINANT = [170, 19, 170];

// Shot helpers
function buildShot({ id, plan, origin, prompt, duration = 14, radius = 35, height = 14, startA = 0.4, endA = 2.6 }) {
  const center = [origin[0], origin[1] + 16, origin[2]];
  return {
    id,
    duration,
    camera: { type: 'orbit', center, radius, height, startAngle: startA, endAngle: endA },
    overlay: { html: prompt, t0: 0.4, t1: duration - 1.5, fadeIn: 0.4, fadeOut: 1.0 },
    build: {
      plan, origin, bot: 'Claude',
      startT: 1.0,
      endT: duration - 2,
      botRadius: 8, botHeight: 4,
    },
  };
}

export const MANUSCRIPT = {
  fps: 30,
  width: 1280,
  height: 720,
  // Clear the union of all 4 build sites. Topo-aware so we don't dig pits.
  setup: [
    { type: 'clearAboveGround', min: [78, 78], max: [192, 195], topY: 60 },
  ],
  shots: [
    buildShot({
      id: 'dragon',
      plan: 'dragon-tower',
      origin: ORIGIN_DRAGON,
      prompt: '@Claude build a fearsome dragon coiled around a tall stone tower',
      duration: 14, radius: 38, height: 14,
    }),
    buildShot({
      id: 'pagoda',
      plan: 'glass-pagoda',
      origin: ORIGIN_PAGODA,
      prompt: '@Claude build an elegant five-story Japanese pagoda',
      duration: 12, radius: 30, height: 14,
    }),
    buildShot({
      id: 'kurama',
      plan: 'naruto-kurama',
      origin: ORIGIN_KURAMA,
      prompt: '@Claude build Kurama the nine-tailed fox',
      duration: 12, radius: 32, height: 12,
    }),
    // Rocinante is a long-thin ship (7 wide x 45 long), and the plan
    // anchors on -X side of origin. Override the camera center to focus
    // on its real centroid and tighten the orbit.
    {
      id: 'rocinante',
      duration: 12,
      camera: {
        type: 'orbit',
        center: [ORIGIN_ROCINANT[0] - 9, ORIGIN_ROCINANT[1] + 8, ORIGIN_ROCINANT[2]],
        radius: 22, height: 8,
        startAngle: 0.6, endAngle: 2.4,
      },
      overlay: { html: '@Claude build the Rocinante from The Expanse', t0: 0.4, t1: 10.5, fadeIn: 0.4, fadeOut: 1.0 },
      build: {
        plan: 'rocinante',
        origin: ORIGIN_ROCINANT,
        bot: 'Claude',
        startT: 1.0, endT: 10.0,
        botRadius: 6, botHeight: 4,
      },
    },
    // Outro: dolly pull-back from a low corner up to a high wide angle so
    // all four builds fit the frame at the end.
    {
      id: 'outro',
      duration: 8,
      camera: {
        type: 'dolly',
        from: [220, 45, 220],
        to:   [220, 110, 250],
        lookFrom: [135, 30, 135],
        lookTo:   [135, 30, 135],
      },
      overlay: {
        html: 'CraftPlan · AI-designed structures',
        t0: 1.0, t1: 7.0, fadeIn: 0.6, fadeOut: 1.0,
      },
    },
  ],
};
