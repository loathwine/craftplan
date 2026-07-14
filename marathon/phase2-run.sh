#!/usr/bin/env bash
# PHASE 2 (standalone): for every subject that has a fable half but no finished
# grid, generate haiku/opus/sonnet, render 4 quadrants, stitch a SILENT grid.
# Across 5h windows. Guard: if the next reset is >6h out (i.e. the probe is
# returning the WEEKLY reset because a weekly cap was hit), STOP instead of
# sleeping ~64h. Silent masters only — no mux/upload/push.
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
LOG=marathon/phase2.log
SH=recordings/shorts-mode
PLANS=public/data/plans
say(){ echo "$(date -u +%H:%M:%SZ) [phase2] $*" | tee -a "$LOG"; }
keys(){ local f k; for f in "$PLANS"/*-4x-fable.json; do k=$(basename "$f" -4x-fable.json); [ -f "$SH/${k}-4x-grid-10s.mp4" ] || echo "$k"; done; }
nkeys(){ keys | grep -c .; }
probe_reset(){ echo OK | timeout 90 nix develop .#record --command bash -c \
  'claude -p --model claude-fable-5 --output-format stream-json --verbose 2>/dev/null' \
  | grep -oE '"resetsAt":[0-9]+' | grep -oE '[0-9]{10}' | tail -1; }

say "start: $(nkeys) subject(s) need grids"
stale=0
for i in $(seq 1 30); do
  n=$(nkeys)
  [ "$n" -eq 0 ] && { say "ALL GRIDS COMPLETE"; break; }
  say "pass $i begin: $n need grids"
  ks=$(keys | tr '\n' ' '); before=$n
  bash marathon/grid-finish.sh $ks >> "$LOG" 2>&1
  after=$(nkeys)
  if [ "$after" -lt "$before" ]; then say "pass $i completed $((before-after)) grid(s) (now $after)"; stale=0
  else
    stale=$((stale+1)); say "pass $i no progress (stale=$stale)"
    [ "$stale" -ge 2 ] && { say "no progress across a reset — stopping, $after left"; break; }
  fi
  [ "$(nkeys)" -eq 0 ] && { say "ALL GRIDS COMPLETE"; break; }
  reset=$(probe_reset); now=$(date -u +%s)
  if [ -n "$reset" ] && [ "$reset" -gt "$now" ]; then
    w=$(( reset + 180 - now ))
    if [ "$w" -gt 21600 ]; then say "next reset ${w}s away (>6h) = weekly cap hit; stopping with $(nkeys) left"; break; fi
    say "sleeping ${w}s until reset $(date -u -d @"$reset" +%H:%MZ)"; sleep "$w"
  else say "no resetsAt parsed; sleeping 1800s"; sleep 1800; fi
done
say "END: $(nkeys) grid(s) still missing ($(keys | tr '\n' ' '))"
