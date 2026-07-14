#!/usr/bin/env bash
# Burn the remaining weekly Fable budget: cache fable for every `queued` subject
# in marathon/queue.json across as many 5-hour windows as it takes, stopping only
# when the queue is empty OR Fable is genuinely exhausted (a full window reset
# yields no further progress = weekly cap hit / model removed).
#
# Fable-only gens drain a 5h window fast, so on a stall we probe the window's
# resetsAt and sleep until the refill (not a short backoff — the render loop's
# transient-boundary problem doesn't apply here; the window really is drained).
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
LOG=marathon/fable-loop.log
MAX=12
say(){ echo "$(date -u +%H:%M:%SZ) [fable-loop] $*" | tee -a "$LOG"; }
queued(){ nix develop --command node -e 'const q=require("./marathon/queue.json");process.stdout.write(String(q.subjects.filter(s=>s.status==="queued").length))' 2>/dev/null; }
probe_reset(){
  echo "OK" | timeout 90 nix develop .#record --command bash -c \
    'claude -p --model claude-fable-5 --output-format stream-json --verbose 2>/dev/null' \
    | grep -oE '"resetsAt":[0-9]+' | grep -oE '[0-9]{10}' | tail -1
}

say "start: $(queued) queued"
stale=0
for i in $(seq 1 $MAX); do
  before=$(queued)
  if [ "${before:-0}" -eq 0 ]; then say "queue empty — all fable cached"; break; fi
  say "pass $i begin ($before queued)"
  MARATHON_BATCH=50 nix develop .#record --command node marathon/batch.mjs >> "$LOG" 2>&1
  after=$(queued)
  cached=$(( before - ${after:-before} ))
  if [ "${after:-0}" -eq 0 ]; then say "pass $i cached $cached — queue empty, done"; break; fi
  if [ "$cached" -gt 0 ]; then
    say "pass $i cached $cached (now $after queued)"; stale=0
  else
    stale=$((stale+1))
    if [ "$stale" -ge 2 ]; then
      say "pass $i: no progress across a full window reset (stale=$stale) — Fable EXHAUSTED for the week (or removed). $after subjects left uncached. Stopping."
      break
    fi
    say "pass $i: window drained, 0 cached (stale=$stale)"
  fi
  reset=$(probe_reset); now=$(date -u +%s)
  if [ -n "$reset" ] && [ "$reset" -gt "$now" ]; then
    wait=$(( reset + 180 - now ))
    say "sleeping ${wait}s until 5h reset $(date -u -d @"$reset" +%H:%MZ)"
    sleep "$wait"
  else
    say "no future resetsAt parsed ('$reset') — sleeping 3600s"
    sleep 3600
  fi
done
say "end: $(queued) queued remaining"
