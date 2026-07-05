#!/usr/bin/env bash
# Self-chaining marathon driver. Runs batch.mjs back-to-back without needing
# the supervising Claude session awake: exit 0 (batch completed, window still
# fresh) -> next batch immediately; exit 1 (window drained) -> sleep to
# resetsAt+120 from marathon/window.json, then next batch. Stops when the
# queue is empty or 4 consecutive batches make zero progress (model gone or
# a persistent pipeline error). QA/commit still happens in the Claude session,
# decoupled from generation.
set -u
cd /home/edvin/dev/craftplan
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
LOG=marathon/log.txt
note() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) chain: $*" | tee -a "$LOG"; }

queued() {
  nix develop .#record --command node -e \
    'const q=require("./marathon/queue.json");console.log(q.subjects.filter(s=>s.status==="queued").length)'
}

noProgress=0
note "chain started (pid $$)"
while :; do
  before=$(queued)
  if [ "$before" -eq 0 ]; then note "queue empty — chain done"; exit 0; fi
  nix develop .#record --command node marathon/batch.mjs
  rc=$?
  after=$(queued)
  if [ "$after" -lt "$before" ]; then noProgress=0; else noProgress=$((noProgress+1)); fi
  if [ "$noProgress" -ge 4 ]; then
    note "4 consecutive zero-progress batches — stopping chain (fable gone or persistent error)"
    exit 2
  fi
  if [ "$rc" -eq 0 ]; then continue; fi
  # window drained: sleep to the reset the failed batch probed, +120s slack
  reset=$(nix develop .#record --command node -e \
    'try{console.log(require("./marathon/window.json").resetsAt||0)}catch{console.log(0)}')
  now=$(date +%s)
  target=$((reset + 120))
  if [ "$reset" -eq 0 ] || [ "$target" -le "$now" ]; then target=$((now + 900)); fi
  note "window drained — sleeping until $(date -u -d @"$target" +%Y-%m-%dT%H:%M:%SZ)"
  while [ "$(date +%s)" -lt "$target" ]; do sleep 60; done
done
