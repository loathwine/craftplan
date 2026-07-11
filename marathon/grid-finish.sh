#!/usr/bin/env bash
# Finish 4-model benchmark grids for subjects that already have a fable half.
# Generates the remaining haiku/opus/sonnet halves, renders 4 quadrants, and
# stitches a SILENT grid master (NO audio mux — music is chosen per-subject
# later). Derived from grid-batch.sh but:
#   * NO mux step (silent <key>-4x-grid-10s.mp4 only)
#   * resumable: skips gens whose plan json already exists, skips render whose
#     mp4 exists, skips subjects whose grid mp4 already exists — so a re-run
#     after a throttle stop does not re-burn completed work.
#   * throttle-safe: any generation failure STOPS the batch (resume next window)
#
#   marathon/grid-finish.sh gorilla elephant volcano ...
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/grid-finish.log
SH=recordings/shorts-mode
PLANS=public/data/plans
say() { echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }

header_for() { # key -> quoted subject prompt from queue.json
  nix develop --command node -e '
    const q=require("./marathon/queue.json");
    const s=q.subjects.find(x=>x.key===process.argv[1]);
    process.stdout.write(s?s.prompt:process.argv[1]);' "$1" 2>/dev/null
}

gen_cacheplan() { # key model suffix timeout -> 0 ok, 1 stop(throttle), 2 empty(skip subj)
  local key="$1" model="$2" suf="$3" to="$4" out solid
  if [ -f "$PLANS/${key}-4x-${suf}.json" ]; then say "  $suf: exists — skip"; return 0; fi
  out=$(nix develop .#record --command node scripts/cache-plan.mjs \
    --slug "${key}-4x-${suf}" --prompt "$(header_for "$key")" --model "$model" \
    --effort high --force --timeout "$((to*1000))" 2>&1)
  if echo "$out" | grep -q "wrote .*\.json"; then
    solid=$(echo "$out" | grep -oE '[0-9]+ solid' | head -1 | grep -oE '[0-9]+')
    # Guard: cache-plan writes a plan even when the model emitted no usable code
    # (e.g. taj-mahal opus -> "const meta = undefined", 0 blocks). Rendering that
    # empty quadrant wastes ~28min + produces a misleading grid. Discard + retry
    # on a later run rather than stitching a blank quadrant.
    if [ "${solid:-0}" -lt 200 ]; then
      say "  $suf: EMPTY (${solid:-0} solid) — discarding, will retry; skipping subject"
      rm -f "$PLANS/${key}-4x-${suf}.json" "$PLANS/${key}-4x-${suf}.code.js"
      return 2
    fi
    say "  $suf: ${solid} solid"
    return 0
  fi
  say "  $suf: FAILED/throttled — $(echo "$out" | tail -1 | cut -c1-120)"
  return 1
}

gen_sonnet5() { # key -> 0 ok, 1 stop
  local key="$1" stream="marathon/${key}-sonnet5.stream.jsonl" raw
  if [ -f "$PLANS/${key}-4x-sonnet.json" ]; then say "  sonnet5: exists — skip"; return 0; fi
  local pf="prompts/${key}-4x.v2.prompt.txt"
  nix develop .#record --command node scripts/cache-plan.mjs \
    --slug "${key}-4x-sonnet" --prompt "$(header_for "$key")" \
    --dump-prompt "$pf" >>"$LOG" 2>&1
  cat "$pf" | timeout 900 claude -p --model claude-sonnet-5 \
    --effort high --output-format stream-json --verbose > "$stream" 2>&1
  raw=$(nix develop .#record --command node marathon/kk-extract.mjs "$stream")
  if [ "${#raw}" -gt 200 ]; then
    printf '// %s-4x-sonnet (claude-sonnet-5)\n// --- extracted code ---\n%s\n' "$key" "$raw" \
      > "$PLANS/${key}-4x-sonnet.failed.code.js"
    if nix develop .#record --command node scripts/recover-plan.mjs \
         --slug "${key}-4x-sonnet" --radius 22 --vradius 14 --budget 4000 >>"$LOG" 2>&1; then
      mv "$PLANS/${key}-4x-sonnet.failed.code.js" "$PLANS/${key}-4x-sonnet.code.js"
      say "  sonnet5: recovered"
      return 0
    fi
  fi
  say "  sonnet5: EMPTY/failed (${#raw} chars) — throttle, STOP"
  return 1
}

render_q() { # key model -> render only if mp4 missing
  local key="$1" m="$2"
  if [ -f "$SH/${key}-4x-${m}-10s.mp4" ]; then return 0; fi
  nix develop .#record --command node scripts/record-demo.mjs \
    --single "${key}-4x-${m}" --order flood-fill --promptText none \
    --duration 10 --width 1080 --height 1920 --fps 30 \
    --out "$SH/${key}-4x-${m}-10s.mp4" >>"$LOG" 2>&1
}

say "grid-finish start: $*"
DONE=()
for key in "$@"; do
  say "=== $key ==="
  if [ -f "$SH/${key}-4x-grid-10s.mp4" ]; then say "  grid exists — skip"; DONE+=("$key"); continue; fi
  [ -f "$PLANS/${key}-4x-fable.json" ] || { say "  no fable half — skip"; continue; }
  gen_cacheplan "$key" claude-haiku-4-5-20251001 haiku 600; rc=$?
  [ $rc -eq 1 ] && break; [ $rc -eq 2 ] && continue
  gen_cacheplan "$key" claude-opus-4-8          opus  900; rc=$?
  [ $rc -eq 1 ] && break; [ $rc -eq 2 ] && continue
  gen_sonnet5   "$key"                                    || break
  say "  rendering 4 quadrants..."
  for m in haiku opus sonnet fable; do render_q "$key" "$m"; done
  # guard: all 4 quadrant mp4s must exist before stitching
  ok=1; for m in haiku opus sonnet fable; do [ -f "$SH/${key}-4x-${m}-10s.mp4" ] || ok=0; done
  if [ "$ok" -ne 1 ]; then say "  RENDER INCOMPLETE — skip stitch"; continue; fi
  hdr="\"$(header_for "$key")\""
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 4.5|$SH/${key}-4x-haiku-10s.mp4" \
    --clip "SONNET 5|$SH/${key}-4x-sonnet-10s.mp4" \
    --clip "OPUS 4.8|$SH/${key}-4x-opus-10s.mp4" \
    --clip "FABLE 5|$SH/${key}-4x-fable-10s.mp4" \
    --duration 10 --header "$hdr" --out "$SH/${key}-4x-grid-10s.mp4" >>"$LOG" 2>&1
  if [ -f "$SH/${key}-4x-grid-10s.mp4" ]; then say "  GRID DONE (silent): $SH/${key}-4x-grid-10s.mp4"; DONE+=("$key"); fi
done
say "grid-finish end. completed: ${DONE[*]:-none}"
