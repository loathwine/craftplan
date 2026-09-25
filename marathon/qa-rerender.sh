#!/usr/bin/env bash
# Re-render QA-flagged quadrants (baked -rot<deg> plans) and re-stitch their grids.
#   marathon/qa-rerender.sh key:model:deg [key:model:deg ...]
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
SH=recordings/shorts-mode; LOG=marathon/qa-rerender.log
say(){ echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }
header_for(){ nix develop --command node -e 'const q=require("./marathon/queue.json");const s=q.subjects.find(x=>x.key===process.argv[1]);process.stdout.write(s?s.prompt:process.argv[1]);' "$1" 2>/dev/null; }
KEYS=""
for job in "$@"; do
  IFS=: read -r key m deg <<<"$job"
  say "=== $key $m rot$deg ==="
  nix develop .#record --command node scripts/record-demo.mjs --single "${key}-4x-${m}-rot${deg}" --order flood-fill --promptText none \
    --duration 10 --width 1080 --height 1920 --fps 30 --out "$SH/${key}-4x-${m}-10s.mp4" >>"$LOG" 2>&1
  case " $KEYS " in *" $key "*) ;; *) KEYS="$KEYS $key";; esac
done
for key in $KEYS; do
  hdr="\"$(header_for "$key")\""
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 4.5|$SH/${key}-4x-haiku-10s.mp4" --clip "SONNET 5|$SH/${key}-4x-sonnet-10s.mp4" \
    --clip "OPUS 4.8|$SH/${key}-4x-opus-10s.mp4" --clip "FABLE 5|$SH/${key}-4x-fable-10s.mp4" \
    --duration 10 --header "$hdr" --out "$SH/${key}-4x-grid-10s.mp4" >>"$LOG" 2>&1 && say "GRID RESTITCHED: $key"
done
say "qa-rerender DONE"
