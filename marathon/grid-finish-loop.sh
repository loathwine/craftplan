#!/usr/bin/env bash
# Drive marathon/grid-finish.sh across multiple 5-hour windows until every grid
# in KEYS exists. Each pass generates+renders as far as the window allows;
# grid-finish stops cleanly on throttle. We then probe the fable window's
# resetsAt, sleep until the refill, and retry. Idempotent: grid-finish skips
# work already done, so no pass re-burns completed gens/renders.
#
# Run detached (its own sleeps are long):
#   nohup bash marathon/grid-finish-loop.sh &   (or via the harness in background)
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
SH=recordings/shorts-mode
LOG=marathon/grid-finish.batch.log
# remaining/incomplete first, the 8 already-done last (they skip instantly)
KEYS="elephant taj-mahal cobra mammoth eagle lighthouse wizard-tower pagoda locomotive treasure-chest fighter-jet excalibur statue-liberty space-shuttle volcano gorilla sydney-opera knight-vs-dragon sphinx-giza big-ben"
MAX=30
BACKOFF=900   # 15 min. The throttle near the weekly cap is marginal/intermittent
              # and refills gradually, and a transient failure can hit right at a
              # 5h-reset boundary — so retry soon rather than sleeping to the far
              # reset. Throttled passes fail fast + cheap; renders cost no budget.

say(){ echo "$(date -u +%H:%M:%SZ) [loop] $*" | tee -a "$LOG"; }
remaining(){ local n=0 k; for k in $KEYS; do [ -f "$SH/${k}-4x-grid-10s.mp4" ] || n=$((n+1)); done; echo "$n"; }

say "grid-finish-loop start: $(remaining)/20 grids remaining"
prev=99
for i in $(seq 1 $MAX); do
  before=$(remaining)
  say "pass $i begin ($before remaining)"
  nix develop .#record --command bash marathon/grid-finish.sh $KEYS >> "$LOG" 2>&1
  r=$(remaining)
  if [ "$r" -eq 0 ]; then say "ALL 20 GRIDS COMPLETE"; break; fi
  if [ "$r" -lt "$before" ]; then
    say "pass $i made progress ($before -> $r) — retrying immediately"
  else
    say "pass $i stalled ($r remaining) — backoff ${BACKOFF}s then retry"
    sleep "$BACKOFF"
  fi
done
say "grid-finish-loop end: $(remaining)/20 grids remaining"
