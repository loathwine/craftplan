#!/usr/bin/env bash
# Halloween run: 12 new moonlight comparison grids for 10-23..11-05 (with the
# held haunted-house + jack-o-lantern-n on 10-30/31).
#   Haiku 5.5 / Sonnet 5.5 / Opus 5.5 (effort high)  +  Fable 5.1 (effort low)
# Resumable: skips plans / clips / grids that already exist.
# Output: recordings/shorts-mode/<k>-n7-grid-10s.mp4
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/halloween-grids.log
SH=recordings/shorts-mode; PL=public/data/plans
say(){ echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }
SUBJ=(
  "witch-cauldron|a witch brewing a glowing potion in her cauldron"
  "scarecrow|a creepy scarecrow in a pumpkin patch"
  "ghost-ship|a ghost pirate ship"
  "mummy|a mummy bursting out of its sarcophagus"
  "frankenstein|Frankenstein's monster coming to life in the lab"
  "graveyard-zombie|a zombie rising from a graveyard"
  "headless-horseman|the Headless Horseman holding a flaming pumpkin"
  "sugar-skull|a Day of the Dead sugar skull"
  "grim-reaper|the Grim Reaper with his scythe"
  "dracula-castle|Dracula's castle on a cliff"
  "witch-broom|a witch flying on a broomstick"
  "bonfire-night|a Bonfire Night bonfire with fireworks"
)
MODELS=("haiku55|claude-haiku-5-5|high" "sonnet55|claude-sonnet-5-5|high" "opus|claude-opus-5-5|high" "fable|claude-fable-5-1|low")
LABELS=("HAIKU 5.5" "SONNET 5.5" "OPUS 5.5" "FABLE 5.1")

gen(){ # key prompt suffix model effort
  local f="$PL/$1-$3.json"
  [ -f "$f" ] && return 0
  for try in 1 2 3; do
    out=$(nix develop .#record --command node scripts/cache-plan.mjs --slug "$1-$3" --prompt "$2" --model "$4" --effort "$5" --force --timeout 2400000 2>&1)
    if echo "$out" | grep -q "wrote .*\.json"; then
      n=$(echo "$out" | grep -oE '[0-9]+ solid' | head -1 | grep -oE '[0-9]+')
      if [ "${n:-0}" -ge 200 ]; then say "  gen $1-$3: $n solid"; return 0; fi
      say "  gen $1-$3: only ${n:-0} solid — retry"; rm -f "$f" "$PL/$1-$3.code.js"
    else say "  gen $1-$3 FAILED try $try: $(echo "$out" | grep -iE 'error|limit|timeout' | grep -v 'model catalog' | tail -1 | cut -c1-160)"
      echo "$out" | grep -qiE 'rate.?limit|usage limit|resets' && { say "  throttled — sleeping 30 min"; sleep 1800; }
    fi
  done
  return 1
}
render(){ # slug out
  for try in 1 2; do
    [ -f "$2" ] && return 0
    nix develop .#record --command node scripts/record-demo.mjs --single "$1" --order flood-fill --promptText none --moonlight 1 \
      --duration 10 --width 1080 --height 1920 --fps 30 --out "$2" >> "$LOG" 2>&1
  done
}

say "=== PHASE 1: generations ==="
for s in "${SUBJ[@]}"; do
  k=${s%%|*}; p=${s#*|}
  [ -f "prompts/$k.prompt.txt" ] || nix develop --command node scripts/cache-plan.mjs --slug "$k-dump" --prompt "$p" --dump-prompt "prompts/$k.prompt.txt" >/dev/null 2>&1
  pids=()
  for m in "${MODELS[@]}"; do IFS='|' read -r suf id eff <<<"$m"; gen "$k" "$p" "$suf" "$id" "$eff" & pids+=($!); done
  wait "${pids[@]}"
done

say "=== PHASE 2: renders + stitch ==="
for s in "${SUBJ[@]}"; do
  k=${s%%|*}; p=${s#*|}
  [ -f "$SH/$k-n7-grid-10s.mp4" ] && continue
  pids=()
  for m in "${MODELS[@]}"; do suf=${m%%|*}; [ -f "$PL/$k-$suf.json" ] && { render "$k-$suf" "$SH/$k-n7-$suf-10s.mp4" & pids+=($!); }; done
  wait "${pids[@]}"
  args=(); ok=1; i=0
  for m in "${MODELS[@]}"; do suf=${m%%|*}; f="$SH/$k-n7-$suf-10s.mp4"; [ -f "$f" ] || ok=0; args+=(--clip "${LABELS[$i]}|$f"); i=$((i+1)); done
  [ $ok = 1 ] || { say "  $k: missing quadrant(s), no grid"; continue; }
  nix develop .#record --command node scripts/stitch-grid.mjs "${args[@]}" \
    --duration 10 --header "\"$p\"" --out "$SH/$k-n7-grid-10s.mp4" >> "$LOG" 2>&1 && say "  GRID $k done"
done
say "=== HALLOWEEN DONE ==="
