#!/usr/bin/env bash
# Build complete 4-model benchmark grids for the given subject keys, reusing
# the already-cached fable half + byte-identical saved prompt. For each key:
#   haiku 4.5 + opus 4.8 via cache-plan (buffered json), sonnet 5 via
#   stream-json + recover-plan, then render 4 quadrants, stitch, mux Demon.
# Self-limiting: any generation failure/timeout is treated as window-drain and
# STOPS the whole batch (don't chase fresh 5h windows overnight).
#
#   marathon/grid-batch.sh shark werewolf terminator ...
set -u
cd /home/edvin/dev/craftplan
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/grid-batch.log
SH=recordings/shorts-mode
say() { echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }

header_for() { # key -> quoted subject prompt from queue.json
  nix develop --command node -e '
    const q=require("./marathon/queue.json");
    const s=q.subjects.find(x=>x.key===process.argv[1]);
    process.stdout.write(s?s.prompt:process.argv[1]);' "$1" 2>/dev/null
}

gen_cacheplan() { # key model suffix timeout -> 0 ok, 1 stop
  local key="$1" model="$2" suf="$3" to="$4" out
  out=$(nix develop .#record --command node scripts/cache-plan.mjs \
    --slug "${key}-4x-${suf}" --prompt "$(header_for "$key")" --model "$model" \
    --effort high --force --timeout "$((to*1000))" 2>&1)
  if echo "$out" | grep -q "wrote .*\.json"; then
    say "  $suf: $(echo "$out" | grep -oE '[0-9]+ solid \+ [0-9]+ carve' | head -1)"
    return 0
  fi
  say "  $suf: FAILED/throttled — $(echo "$out" | tail -1 | cut -c1-120)"
  return 1
}

gen_sonnet5() { # key -> 0 ok, 1 stop
  local key="$1" stream="marathon/${key}-sonnet5.stream.jsonl" raw
  cat "prompts/${key}-4x.prompt.txt" | timeout 900 claude -p --model claude-sonnet-5 \
    --effort high --output-format stream-json --verbose > "$stream" 2>&1
  raw=$(nix develop .#record --command node marathon/kk-extract.mjs "$stream")
  if [ "${#raw}" -gt 200 ]; then
    printf '// %s-4x-sonnet (claude-sonnet-5)\n// --- extracted code ---\n%s\n' "$key" "$raw" \
      > "public/data/plans/${key}-4x-sonnet.failed.code.js"
    if nix develop .#record --command node scripts/recover-plan.mjs \
         --slug "${key}-4x-sonnet" --radius 22 --vradius 14 --budget 4000 >>"$LOG" 2>&1; then
      mv "public/data/plans/${key}-4x-sonnet.failed.code.js" "public/data/plans/${key}-4x-sonnet.code.js"
      say "  sonnet5: recovered"
      return 0
    fi
  fi
  say "  sonnet5: EMPTY/failed (${#raw} chars) — throttle, STOP"
  return 1
}

render_q() { # key model
  nix develop .#record --command node scripts/record-demo.mjs \
    --single "${1}-4x-${2}" --order flood-fill --promptText none \
    --duration 10 --width 1080 --height 1920 --fps 30 \
    --out "$SH/${1}-4x-${2}-10s.mp4" >>"$LOG" 2>&1
}

say "grid-batch start: $*"
DONE=()
for key in "$@"; do
  say "=== $key ==="
  [ -f "prompts/${key}-4x.prompt.txt" ]      || { say "  no prompt dump — skip"; continue; }
  [ -f "public/data/plans/${key}-4x-fable.json" ] || { say "  no fable half — skip"; continue; }
  gen_cacheplan "$key" claude-haiku-4-5-20251001 haiku 600 || break
  gen_cacheplan "$key" claude-opus-4-8          opus  900 || break
  gen_sonnet5   "$key"                                    || break
  say "  rendering 4 quadrants..."
  for m in haiku opus sonnet fable; do render_q "$key" "$m"; done
  hdr="\"$(header_for "$key")\""
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 4.5|$SH/${key}-4x-haiku-10s.mp4" \
    --clip "SONNET 5|$SH/${key}-4x-sonnet-10s.mp4" \
    --clip "OPUS 4.8|$SH/${key}-4x-opus-10s.mp4" \
    --clip "FABLE 5|$SH/${key}-4x-fable-10s.mp4" \
    --duration 10 --header "$hdr" --out "$SH/${key}-4x-grid-10s.mp4" >>"$LOG" 2>&1
  nix develop .#record --command node scripts/mux-audio.mjs \
    --video "$SH/${key}-4x-grid-10s.mp4" --music recordings/audio/demon-jvna.mp3 \
    --start 3 --out "$SH/${key}-4x-grid-10s-demon.mp4" >>"$LOG" 2>&1
  if [ -f "$SH/${key}-4x-grid-10s-demon.mp4" ]; then say "  GRID DONE: $SH/${key}-4x-grid-10s-demon.mp4"; DONE+=("$key"); fi
done
say "grid-batch end. completed: ${DONE[*]:-none}"
