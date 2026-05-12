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
