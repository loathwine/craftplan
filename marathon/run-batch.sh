#!/usr/bin/env bash
# systemd-run wrapper for a marathon batch. Optional $1 = epoch seconds to
# wait for (fresh five-hour window) before starting.
set -u
cd /home/edvin/dev/craftplan
export CLAUDE_CODE_MAX_OUTPUT_TOKENS=64000
if [ -n "${1:-}" ]; then
  while [ "$(date +%s)" -lt "$1" ]; do sleep 60; done
fi
exec nix develop .#record --command node marathon/batch.mjs
