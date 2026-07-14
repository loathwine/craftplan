#!/usr/bin/env bash
# Unattended overnight master runner:
#   PHASE 1  burn the remaining weekly Fable budget (marathon/fable-loop.sh):
#            cache fable for every queued subject across 5h windows until the
#            queue empties or Fable is exhausted.
#   PHASE 2  for every subject that now has a fable half but no finished grid,
#            generate haiku/opus/sonnet, render 4 quadrants, stitch a SILENT
#            grid master (marathon/grid-finish.sh), across 5h windows.
# Silent masters only — NO audio mux, NO upload, NO push.
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
LOG=marathon/night-run.log
SH=recordings/shorts-mode
PLANS=public/data/plans
say(){ echo "$(date -u +%H:%M:%SZ) [night] $*" | tee -a "$LOG"; }

# subjects with a fable plan but no finished grid (the phase-2 work list)
keys(){ local f k; for f in "$PLANS"/*-4x-fable.json; do k=$(basename "$f" -4x-fable.json); [ -f "$SH/${k}-4x-grid-10s.mp4" ] || echo "$k"; done; }
nkeys(){ keys | grep -c . ; }
probe_reset(){ echo OK | timeout 90 nix develop .#record --command bash -c \
  'claude -p --model claude-fable-5 --output-format stream-json --verbose 2>/dev/null' \
  | grep -oE '"resetsAt":[0-9]+' | grep -oE '[0-9]{10}' | tail -1; }
sleep_to_reset(){ local reset now w; reset=$(probe_reset); now=$(date -u +%s)
  if [ -n "$reset" ] && [ "$reset" -gt "$now" ]; then w=$(( reset + 180 - now ))
    say "sleeping ${w}s until 5h reset $(date -u -d @"$reset" +%H:%MZ)"; sleep "$w"
  else say "no future resetsAt ('$reset') — sleeping 3600s"; sleep 3600; fi; }

say "############ NIGHT RUN START ############"

say "===== PHASE 1: Fable burn ====="
bash marathon/fable-loop.sh
say "PHASE 1 done. fable plans present: $(ls "$PLANS"/*-4x-fable.json 2>/dev/null | grep -c .)"

say "===== PHASE 2: haiku/opus/sonnet + render + stitch ====="
stale=0
for i in $(seq 1 30); do
  n=$(nkeys)
  say "pass $i: $n subject(s) still need a grid"
  [ "$n" -eq 0 ] && { say "all grids complete"; break; }
  ks=$(keys | tr '\n' ' ')
  before=$n
  bash marathon/grid-finish.sh $ks >> "$LOG" 2>&1
  after=$(nkeys)
  if [ "$after" -lt "$before" ]; then
    say "pass $i: completed $((before-after)) grid(s) (now $after remaining)"; stale=0
  else
    stale=$((stale+1))
    say "pass $i: no progress (stale=$stale)"
    [ "$stale" -ge 2 ] && { say "no progress across a full reset — model budget likely exhausted; stopping phase 2 with $after left"; break; }
  fi
  [ "$(nkeys)" -eq 0 ] && { say "all grids complete"; break; }
  sleep_to_reset
done

say "############ NIGHT RUN COMPLETE ############"
say "grids still missing: $(nkeys)   (subjects: $(keys | tr '\n' ' '))"
