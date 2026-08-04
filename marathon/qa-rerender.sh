#!/usr/bin/env bash
# Re-render the 4 haiku quadrants the user flagged for rotation in the QA pass,
# then re-stitch each grid. The rotated -rot<deg> plans are already baked.
set -u
cd "$(dirname "$(readlink -f "$0")")/.."
SH=recordings/shorts-mode
LOG=marathon/qa-rerender.log
say(){ echo "$(date -u +%H:%M:%SZ) $*" | tee -a "$LOG"; }
header_for(){ nix develop --command node -e 'const q=require("./marathon/queue.json");const s=q.subjects.find(x=>x.key===process.argv[1]);process.stdout.write(s?s.prompt:process.argv[1]);' "$1" 2>/dev/null; }

JOBS="taj-mahal:taj-mahal-4x-haiku-rot90 stonehenge:stonehenge-4x-haiku-rot180 mount-rushmore:mount-rushmore-4x-haiku-rot180 golden-gate:golden-gate-4x-haiku-rot270"
for job in $JOBS; do
  key=${job%%:*}; slug=${job#*:}
  say "=== $key: render rotated haiku ($slug) -> haiku quadrant ==="
  nix develop .#record --command node scripts/record-demo.mjs \
    --single "$slug" --order flood-fill --promptText none \
    --duration 10 --width 1080 --height 1920 --fps 30 \
    --out "$SH/${key}-4x-haiku-10s.mp4" >>"$LOG" 2>&1
  say "  re-stitch grid"
  hdr="\"$(header_for "$key")\""
  nix develop .#record --command node scripts/stitch-grid.mjs \
    --clip "HAIKU 4.5|$SH/${key}-4x-haiku-10s.mp4" \
    --clip "SONNET 5|$SH/${key}-4x-sonnet-10s.mp4" \
    --clip "OPUS 4.8|$SH/${key}-4x-opus-10s.mp4" \
    --clip "FABLE 5|$SH/${key}-4x-fable-10s.mp4" \
    --duration 10 --header "$hdr" --out "$SH/${key}-4x-grid-10s.mp4" >>"$LOG" 2>&1
  [ -f "$SH/${key}-4x-grid-10s.mp4" ] && say "  GRID RESTITCHED: $key" || say "  STITCH FAILED: $key"
done
say "qa-rerender DONE"
