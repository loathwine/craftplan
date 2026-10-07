#!/usr/bin/env bash
# Refresh the 18 night grids to the latest lineup: regenerate the Haiku/Sonnet
# quadrants with Haiku 5.5 / Sonnet 5.5, reuse the Opus 5.5 / Fable 5.1 clips.
# Resumable. Output: recordings/shorts-mode/<k>-n6-grid-10s.mp4
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/refresh55.log
SH=recordings/shorts-mode; PL=public/data/plans
say(){ echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }
SUBJ=(
  "pikachu-n|Pikachu" "thor|Thor summoning lightning" "dragon-hoard|a dragon sleeping on a pile of gold"
  "lava-golem|a lava golem" "forge|a blacksmith's forge" "jack-o-lantern-n|a glowing jack-o'-lantern"
  "wizard-fireball|a wizard casting a fireball" "lighthouse-n|a lighthouse on a stormy night"
  "dragon-fire|a dragon breathing fire" "haunted-house|a haunted house on Halloween night"
  "eye-of-sauron|the Eye of Sauron on the tower of Barad-dur" "zeus|Zeus throwing a lightning bolt"
  "ghost-rider|Ghost Rider on his flaming motorcycle" "viking-funeral|a burning Viking funeral ship"
  "rocket-launch|a rocket launching into space" "cyber-samurai|a cyberpunk samurai with a neon katana"
  "jungle-temple|a jungle temple with a waterfall" "bowser|Bowser"
)
MODELS=("haiku55|claude-haiku-5-5|high" "sonnet55|claude-sonnet-5-5|high")

gen(){ # key prompt suffix model effort
  local f="$PL/$1-$3.json"
  [ -f "$f" ] && return 0
  for try in 1 2 3; do
    out=$(nix develop .#record --command node scripts/cache-plan.mjs --slug "$1-$3" --prompt "$2" --model "$4" --effort "$5" --force --timeout 2400000 2>&1)
    if echo "$out" | grep -q "wrote .*\.json"; then
      n=$(echo "$out" | grep -oE '[0-9]+ solid' | head -1 | grep -oE '[0-9]+')
      if [ "${n:-0}" -ge 200 ]; then say "  gen $1-$3: $n solid"; return 0; fi
      say "  gen $1-$3: only ${n:-0} solid — retry"; rm -f "$f" "$PL/$1-$3.code.js"
    else say "  gen $1-$3 FAILED try $try: $(echo "$out" | grep -iE 'error|limit|timeout' | tail -1 | cut -c1-160)"
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
  k=${s%%|*}; p=${s#*|}; pids=()
  for m in "${MODELS[@]}"; do IFS='|' read -r suf id eff <<<"$m"; gen "$k" "$p" "$suf" "$id" "$eff" & pids+=($!); done
  wait "${pids[@]}"
done

say "=== PHASE 2: renders + stitch ==="
for s in "${SUBJ[@]}"; do
  k=${s%%|*}; p=${s#*|}
  [ -f "$SH/$k-n6-grid-10s.mp4" ] && continue
  pids=()
  for suf in haiku55 sonnet55; do [ -f "$PL/$k-$suf.json" ] && { render "$k-$suf" "$SH/$k-n6-$suf-10s.mp4" & pids+=($!); }; done
  wait "${pids[@]}"
  ok=1; for f in "$SH/$k-n6-haiku55-10s.mp4" "$SH/$k-n6-sonnet55-10s.mp4" "$SH/$k-n5-opus-10s.mp4" "$SH/$k-n5-fable-10s.mp4"; do [ -f "$f" ] || ok=0; done
  [ $ok = 1 ] || { say "  $k: missing quadrant(s), no grid"; continue; }
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 5.5|$SH/$k-n6-haiku55-10s.mp4" --clip "SONNET 5.5|$SH/$k-n6-sonnet55-10s.mp4" \
    --clip "OPUS 5.5|$SH/$k-n5-opus-10s.mp4" --clip "FABLE 5.1|$SH/$k-n5-fable-10s.mp4" \
    --duration 10 --header "\"$p\"" --out "$SH/$k-n6-grid-10s.mp4" >> "$LOG" 2>&1 && say "  GRID $k done"
done
say "=== REFRESH55 DONE ==="
