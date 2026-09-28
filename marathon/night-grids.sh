#!/usr/bin/env bash
# Overnight: 8 new-engine grids with the newest models + feedback-loop POC.
#   Haiku 4.5 / Sonnet 5 / Opus 5.5 (effort high)  +  Fable 5.1 (effort low)
# Resumable: skips plans / clips / grids that already exist.
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/night-grids.log
SH=recordings/shorts-mode; PL=public/data/plans
say(){ echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }
SUBJ=(
  "pikachu-n|Pikachu"
  "thor|Thor summoning lightning"
  "dragon-hoard|a dragon sleeping on a pile of gold"
  "lava-golem|a lava golem"
  "forge|a blacksmith's forge"
  "jack-o-lantern-n|a glowing jack-o'-lantern"
  "wizard-fireball|a wizard casting a fireball"
  "lighthouse-n|a lighthouse on a stormy night"
)
FEEDBACK="thor dragon-hoard lava-golem"
MODELS=("haiku|claude-haiku-4-5-20251001|high" "sonnet|claude-sonnet-5|high" "opus|claude-opus-5-5|high" "fable|claude-fable-5-1|low")

gen(){ # key prompt suffix model effort
  local f="$PL/$1-$3.json"
  [ -f "$f" ] && return 0
  for try in 1 2; do
    out=$(nix develop .#record --command node scripts/cache-plan.mjs --slug "$1-$3" --prompt "$2" --model "$4" --effort "$5" --force --timeout 1200000 2>&1)
    if echo "$out" | grep -q "wrote .*\.json"; then
      n=$(echo "$out" | grep -oE '[0-9]+ solid' | head -1 | grep -oE '[0-9]+')
      if [ "${n:-0}" -ge 200 ]; then say "  gen $1-$3: $n solid"; return 0; fi
      say "  gen $1-$3: only ${n:-0} solid — retry"; rm -f "$f" "$PL/$1-$3.code.js"
    else say "  gen $1-$3 FAILED try $try: $(echo "$out" | tail -1 | cut -c1-140)"; fi
  done
  return 1
}

say "=== PHASE 1: generations ==="
for s in "${SUBJ[@]}"; do
  k=${s%%|*}; p=${s#*|}
  nix develop --command node scripts/cache-plan.mjs --slug "$k-dump" --prompt "$p" --dump-prompt "prompts/$k.prompt.txt" >/dev/null 2>&1
  pids=()
  for m in "${MODELS[@]}"; do IFS='|' read -r suf id eff <<<"$m"; gen "$k" "$p" "$suf" "$id" "$eff" & pids+=($!); done
  wait "${pids[@]}"
done

say "=== PHASE 2: feedback POC ==="
for k in $FEEDBACK; do
  for m in "${MODELS[@]:0:3}"; do IFS='|' read -r suf id eff <<<"$m"
    [ -f "$PL/$k-$suf-fb2.json" ] && continue
    [ -f "$PL/$k-$suf.json" ] || continue
    nix develop .#record --command node marathon/feedback.mjs --base "$k-$suf" --model "$id" --passes 2 --effort high >> "$LOG" 2>&1 \
      && say "  feedback $k-$suf done" || say "  feedback $k-$suf FAILED"
  done
done

say "=== PHASE 3: renders ==="
render(){ # slug out
  [ -f "$2" ] && return 0
  nix develop .#record --command node scripts/record-demo.mjs --single "$1" --order flood-fill --promptText none --moonlight 1 \
    --duration 10 --width 1080 --height 1920 --fps 30 --out "$2" >> "$LOG" 2>&1
}
for s in "${SUBJ[@]}"; do
  k=${s%%|*}; p=${s#*|}
  pids=()
  for suf in haiku sonnet opus fable; do [ -f "$PL/$k-$suf.json" ] && { render "$k-$suf" "$SH/$k-n5-$suf-10s.mp4" & pids+=($!); }; done
  wait "${pids[@]}"
  ok=1; for suf in haiku sonnet opus fable; do [ -f "$SH/$k-n5-$suf-10s.mp4" ] || ok=0; done
  [ $ok = 1 ] || { say "  $k: missing quadrant(s), no grid"; continue; }
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 4.5|$SH/$k-n5-haiku-10s.mp4" --clip "SONNET 5|$SH/$k-n5-sonnet-10s.mp4" \
    --clip "OPUS 5.5|$SH/$k-n5-opus-10s.mp4" --clip "FABLE 5.1|$SH/$k-n5-fable-10s.mp4" \
    --duration 10 --header "\"$p\"" --out "$SH/$k-n5-grid-10s.mp4" >> "$LOG" 2>&1 && say "  GRID $k done"
done
say "=== NIGHT DONE ==="
