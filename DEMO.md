# Demo Recording

The headless recorder produces a deterministic MP4 from a JS manuscript: a
comedic intro skit, a 9-build AI montage, and an outro pull-back. The page
is driven frame-by-frame over CDP so the same script always produces the
same video.

## Static explore mode (browser-only)

`?explore=demo` opens the page in a server-less mode: the deterministic
terrain plus a snapshot of every demo build are loaded straight in the
browser, the viewer flies around in first person, and an on-page menu
lets them spawn any of the 13 cached LLM plans (dragon, Hogwarts,
Stonehenge, Eiffel, …). A small green Claude avatar appears at the
build spot and places blocks visibly over ~10 s — same replay path the
recorder uses, no LLM call needed.

Regenerate the snapshot whenever the manuscript changes:

```bash
nix develop --command node scripts/generate-snapshot.mjs
```

The output is `public/data/world-snapshot.json` (~1.4 MB; only the
~100 K block deltas that actually differ from the natural terrain).

### Deploying to GitHub Pages

`public/` is the entire site (importmap loads three.js from unpkg, no
bundler) so any static host works. The repo ships a workflow at
`.github/workflows/pages.yml` that publishes `public/` automatically.

One-time setup on github.com:
1. Push the repo (with the workflow file) to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, pick **"GitHub Actions"** (not "Deploy from a branch").
4. The workflow runs on every push to `master`/`main`/`demo-mode`; watch
   it in the **Actions** tab. When it goes green, Pages shows the URL.

Visitors land at:
`https://<user>.github.io/<repo>/?explore=demo`

The page fetches `data/world-snapshot.json` and `data/plans/*.json`
relative to the page URL, so subpath hosting works out of the box.

Trigger a manual rebuild any time via the Actions tab → "Deploy demo
to GitHub Pages" → **Run workflow**.

## Shorts mode (single-build vertical Shorts)

The `shorts-mode` branch adds a parallel pipeline for producing YouTube
Shorts: one cached LLM build, a smooth full 360° camera orbit around it,
upgraded rendering (real shadows, SSAO, bloom, ACES tonemapping,
gradient sky), optional weather, and the natural 256×256 world as
background.

### TL;DR — render one Short

```bash
nix develop .#record --command node scripts/record-demo.mjs \
  --single dragon-attacking \
  --width 1080 --height 1920 \
  --order flood-fill \
  --out recordings/shorts-mode/dragon-attacking.mp4
```

That's it. Default duration 10s (short clips loop, which the Shorts
algo rewards — see the analytics-driven tuning history), full world
(chunks=16, 256×256), a slow front-facing pan (not a full revolution —
figural builds have boring backs), flood-fill build order (structure
rises from the floor up). The recorder defaults all the camera/orbit
knobs to sensible values for shorts.

### CLI flags

| Flag | URL param | Default | Notes |
|---|---|---|---|
| `--single <slug>` | `?single=` | — | Required. Name of a cached plan under `public/data/plans/`. |
| `--duration <s>` | `?dur=` | 10 | Whole shot length. 8-10s loops best (algo rewards it); 18s hurt retention badly in practice. |
| `--chunks <n>` | `?chunks=` | 16 | World size in chunks (16 → 256×256). Drop to 6-8 for faster iteration. |
| `--orbitR <units>` | `?orbitR=` | 50 | Orbit radius. Use 55-75 for medium builds. |
| `--orbitH <units>` | `?orbitH=` | 14 | Camera height above orbit centre. |
| `--camY <units>` | `?camY=` | 12 | Y of orbit centre above ground. |
| `--sweep <fraction>` | `?sweep=` | 0.35 | `sweep × 2π` = pan angle. 0.35 ≈ 126° front pan; 1.0 = full revolution. |
| `--faceAngleDeg <deg>` | `?faceAngleDeg=` | -90 | Camera angle the pan is centred on. -90 = the build's front (LLM orients "face the viewer" builds toward -Z in practice). |
| `--order <mode>` | `?order=` | `structural` | See "Build orders" below. |
| `--weather <kind>` | `?weather=` | `clear` | `snow` / `rain` / `storm` / `clouds` / `fog`. |
| `--buildFrac <0..1>` | `?buildFrac=` | 0.5 | What fraction of the shot is build-animation. Rest is camera continuing to pan the finished build. |
| `--cam <mode>` | `?cam=` | `orbit` | `orbit` = single smooth pan (default), `multi` = keyframed multi-angle reveal after build. |
| `--camStyle <s>` | `?camStyle=` | `wide` | Only for `cam=multi`: `wide`, `low-up`, `overhead`. |
| `--promptText <s>` | `?promptText=` | slug | Text after "I asked an AI to build" in the baked-in title card. |
| `--width / --height` | `?w=/?h=` | 1280/720 | For Shorts pass `--width 1080 --height 1920`. |
| `--fps <n>` | — | 30 | Output framerate. |
| `--out <path>` | — | — | Output MP4 path. |

Note: the build animation resolves AIR carve-ops at compile time and
animates only surviving solid blocks, so builds that carve their shape
with AIR (T-Rex, Moai) don't show "dead time" placing invisible blocks.

### Build orders (`--order`)

| Mode | Behaviour |
|---|---|
| `bottom-up` | Y ascending — classic 3D-printer feel, layer by layer. Default for the full manuscript path. |
| `structural` | Bottom half first, then upper-shell silhouette, then upper interior. Reads as "foundation → silhouette → fill". |
| `outline-first` | Per-Y plane: edge blocks before interior. Wireframe-fills-in look. |
| `painterly` | Centre outward in radial shells with light Y bias. Good for symmetrical builds. |
| `sparse-then-dense` | Stride-3 scaffold first, then fill in the gaps. Materialising-from-nothing feel. |
| `bfs-corner` | 6-connected BFS from one corner of the bounding box. Expanding wave from a single seed. |
| `dfs-corner` | DFS variant — a single tendril snakes through the structure. |
| `flood-fill` | DFS direction + per-step BFS ball. Wide river of placement; seeded from the lowest Y block so structures grow up from the floor. Best default for shorts. |

### Weather (`--weather`)

| Kind | Implementation |
|---|---|
| `clear` | No effect. |
| `snow` | Particle system: drifting white flakes. |
| `rain` | Particle system: slanted streaks. |
| `storm` | Rain + grey-tinted scene fog. |
| `clouds` | Large soft-edged white quads drifting across the upper hemisphere. |
| `fog` | Dense grey scene fog plus drifting fog quads near the world floor. |

### Rendering upgrades (apply to all three entry points)

Implemented in `public/js/sky.js`, `composer.js`, plus mesher/avatar
shadow flags:

- Gradient sky shader (custom; replaces THREE.Sky which read too hazy)
- Per-corner ambient occlusion baked into vertex colors in the chunk
  mesher (`World.js`)
- Real cast shadows from a sun-aligned directional light, 2048² shadow
  map, PCFSoftShadowMap, ortho frustum covering the 256×256 world
- ACES filmic tonemapping + sRGB output
- Post-processing composer: RenderPass → SSAO → UnrealBloom → OutputPass
- Optional ocean (off by default; opt-in via `?ocean=true` — has wave
  shader and brighter colour but the default natural-terrain backdrop
  reads better at the horizon)

### Caching bigger LLM builds

`cache-plan.mjs` accepts `--budget` / `--radius` / `--vradius` / `--timeout`
flags so you can request larger and more detailed builds:

```bash
nix develop --command node scripts/cache-plan.mjs \
  --slug my-big-thing --radius 30 --vradius 22 --budget 12000 --timeout 1200000 \
  --prompt "..." --force
```

Existing big builds:
- `dragon-attacking.json` — 12K-block dragon mid-leap (BRICK/STONE/OAK_LOG/SAND)
- `dragons-fighting.json` — 13K-block fire+ice dragon combat (BRICK + GLASS/ICE/SNOW)
- `hogwarts-big.json` — 14K-block castle complex (STONE/COBBLE/BRICK/OAK_LOG/GLASS)

### Helper scripts

- `scripts/smoke-record.mjs <t> <out.png>` — load `?record` mode and
  screenshot at one manuscript time. Used to audit visual changes
  without running a full render.
- `scripts/build-showcase.mjs --clip "label|file|start|dur" …`
  — stitch multiple clips into a single labelled MP4. Optional
  `--epilogue "Title|line1|line2|…"` appends a summary card.
- `scripts/stitch-compare.mjs --before A.mp4 --after B.mp4 …` —
  side-by-side BEFORE/AFTER stitch.

## Quick start

```bash
# Fast iteration (854x480 @ 15fps, ~3 min)
nix develop .#record --command node scripts/record-demo.mjs --iter

# 720p 30fps preview (~15 min)
nix develop .#record --command node scripts/record-demo.mjs --label preview --archive

# 1080p 60fps final (~50 min)
nix develop .#record --command node scripts/record-demo.mjs --final --archive
```

Outputs land in `recordings/`:
- `recordings/latest.mp4` — symlink to the most recent render
- `recordings/montage-<timestamp>-<label>.mp4` — timestamped copy
- `recordings/archive/...` — kept around when `--archive` is set
- `recordings/montage-*.markers.json` — sidecar with shot/music/sfx timings

## Structure

```
public/js/manuscript.mjs   Top-level: composes skit + montage + audio markers
public/js/skit.mjs         Intro skit (11 shots, ~32s)
public/js/montage.mjs      Build montage (9 shots + outro, ~99s)
public/js/recorder.js      Renderer: compiles manuscript → timeline,
                           exposes window.__demoFrame(t) for the recorder
public/js/avatar.js        Character avatars + facial expressions
public/data/plans/*.json   Cached LLM build plans (block lists, relative coords)

scripts/record-demo.mjs    Headless recorder: static server + chromium + CDP + ffmpeg
scripts/cache-plan.mjs     Cache a build plan from a prompt (LLM) or a builder
```

## Iterating

### Tweak a camera or position
Edit `skit.mjs` or `montage.mjs`. Re-run `--iter` to see the change in ~3 min.

### Add a new build to the montage
1. Cache the plan:
   ```bash
   nix develop --command node scripts/cache-plan.mjs \
     --prompt "your prompt here" \
     --slug your-slug \
     --origin 128,0,128
   ```
   Plans take 60–180s of LLM time. They land in `public/data/plans/<slug>.json`.
2. Pick a location and add a shot via `buildShot(...)` in `montage.mjs`.
3. Extend the `MONTAGE_SETUP` clearAboveGround min/max so the area is cleared.
4. Re-render.

Builds that aren't worth a real prompt can use `--builder house|castle|sphere|...`
to copy an existing primitive instead.

### Re-cache a build with a better prompt
Add `--force` to `cache-plan.mjs` and the slug overwrites in place.
Build silhouettes that don't read from orbital angles (long-thin sculptures,
side-on figures) get better with explicit "facing the viewer (+Z direction)"
hints in the prompt.

### Audio
The recorder never plays audio (headless can't). Instead, each render emits a
`.markers.json` next to the MP4 with absolute timestamps for every shot start,
music section, and SFX cue. Drop the MP4 into a video editor, then drop tracks
at those times. Sample marker cues already in the manuscript:

- `0.0s` music: ambient strings (skit intro)
- `30.7s` sfx: whoosh (1s before drop)
- `31.7s` music: techno drop (montage begins)
- `120.7s` music: orchestral swell (outro)

Edit `MANUSCRIPT.audioMarkers` in `manuscript.mjs` to add or move cues, or add
`audio: {...}` on any individual shot.

If you only changed cue timings (no visual change), you can regenerate the
sidecar JSON against an existing MP4 without re-rendering:

```bash
nix develop --command node scripts/dump-markers.mjs recordings/latest.markers.json
```

### Determinism

The page never reads a wall clock — the recorder is the clock. Two consecutive
runs of the same manuscript produce byte-identical PNG frames (verified at
POC). If you bisect a regression: pin the manuscript, hash a few sample frames
with `md5sum recordings/frames/frame_*.png`, and they should match across runs.

## Recorder presets

| Preset    | Resolution | FPS | ~Time for current manuscript |
|-----------|------------|-----|------------------------------|
| `--iter`  | 854x480    | 15  | ~3 min                       |
| (default) | 1280x720   | 30  | ~15 min                      |
| `--final` | 1920x1080  | 60  | ~50 min                      |

Override individual params with `--width`, `--height`, `--fps`, `--duration`,
`--frames`. `--archive` saves under `recordings/archive/` and points
`latest.mp4` at the new file; without it, output lands in the top of
`recordings/`.

## How the deterministic loop works

1. `record-demo.mjs` starts a tiny static HTTP server serving `/public`.
2. It spawns headless chromium with `--remote-debugging-port` and a unique
   user-data-dir.
3. Over CDP it locks the viewport via `Emulation.setDeviceMetricsOverride`,
   waits for `window.__demoReady === true`.
4. For each frame `f` in `[0, N)`:
   - `Runtime.evaluate("window.__demoFrame(${f / fps})")` advances the page's
     internal clock, applies the next batch of build events through
     `World.applyBlockChanges` (chunks rebuild once per frame, not per block),
     repositions avatars and camera, re-renders.
   - `Page.captureScreenshot` returns a base64 PNG; the script writes it to
     `recordings/frames/frame_00000.png`.
5. ffmpeg stitches the PNGs into MP4 (libx264, yuv420p, CRF 18 default).

## What's where in the manuscript

Shot helpers:
- `buildShot({...})` (`montage.mjs`) — orbit camera + prompt overlay + cached
  build replay. Defaults to 11s with `hideTags: true`.
- Skit shots (`skit.mjs`) are hand-authored with per-shot `avatars`, `events`,
  `dialog`, `camera`, `fadeIn(Color)`, `fadeOut(Color)`.

Avatars (`MANUSCRIPT.avatars`):
- `Edvin` (player) — blue body, baseball cap
- `Claude` — emerald body, purple wizard hat
- `Bot_NW/NE/SW/SE` — colorful background bots in the outro

Each avatar exposes 8 expressions via `setExpression`: neutral, happy,
surprised, frustrated, smug, focused, sad, thinking. Add `expressionAt:
[{t, expression}, ...]` to keyframe a switch within one shot.

`lookAtCamera: true` snaps an avatar's facing toward the camera every frame
(use for close-up reaction shots so the face is visible, not the side).

## Scheduled uploads (YouTube Data API)

`scripts/yt-upload.mjs` uploads a Short with metadata and an optional
future publish time, so a batch can be queued once and released
automatically.

One-time setup (manual — Google requires a human through the consent
screen):
1. console.cloud.google.com → new project.
2. Enable **YouTube Data API v3**.
3. Credentials → OAuth client ID → **Desktop app** → download JSON.
4. Save as `secrets/yt-client.json` (gitignored).
5. First run opens a browser for consent; refresh token caches to
   `secrets/yt-token.json`.

Usage:
```bash
nix develop --command node scripts/yt-upload.mjs \
  --file recordings/shorts-mode/moai-10s-v4.mp4 \
  --title "I asked an AI to build the Easter Island heads" \
  --description-file desc.txt \
  --tags "shorts,ai,minecraft,moai,history" \
  --publish-at 2026-05-28T16:00:00Z
```

`--publish-at` (ISO 8601 UTC) schedules the video private-until-then.
Omit it to upload as a private draft. Requires the `googleapis` npm
package (not in the bundled server deps — add to package.json + refresh
npmDepsHash, or run with npx).
