#!/usr/bin/env bash
# Flat-lit 8-angle facing QA for benchmark-grid quadrants. qaFlat=1 gives
# near-uniform lighting (no directional sun), so a build's front is never hidden
# in shadow; 8 camera angles at 45deg localize the facing. Montage 4x2,
# row-major compass order:  row1: N NE E SE   row2: S SW W NW
# The cell where the face/front sits dead-on = the facing direction; rotate the
# plan to bring it to north (-Z): S->(x,z)->(-x,-z); E->(z,-x); W->(-z,x).
#   marathon/fable-facing-qa.sh <key> [key...]      (defaults to *-4x-fable)
# Env: OUT=<dir> output dir (default /tmp/fable-qa), SUF=<suffix> (default 4x-fable)
set -u
cd "$(dirname "$0")/.."
OUT="${OUT:-/tmp/fable-qa}"; mkdir -p "$OUT"
SUF="${SUF:-4x-fable}"
TAGS=(N NE E SE S SW W NW)
declare -A ANG=( [N]=-90 [NE]=-45 [E]=0 [SE]=45 [S]=90 [SW]=135 [W]=180 [NW]=-135 )
render_one(){ nix develop .#record --command node scripts/smoke-record.mjs 5 \
  "$OUT/f8-${1}-${2}.png" \
  "single=${1}&faceAngleDeg=${3}&buildFrac=0.02&sweep=0.0001&qaFlat=1&promptText=none" >/dev/null 2>&1; }
for key in "$@"; do
  slug="${key}-${SUF}"
  [ -f "public/data/plans/${slug}.json" ] || { echo "skip $key (no ${slug}.json)"; continue; }
  n=0; for t in "${TAGS[@]}"; do render_one "$slug" "$t" "${ANG[$t]}" &
    n=$((n+1)); [ $((n%4)) -eq 0 ] && wait; done; wait
  nix develop .#record --command ffmpeg -y \
    -i "$OUT/f8-${slug}-N.png"  -i "$OUT/f8-${slug}-NE.png" -i "$OUT/f8-${slug}-E.png"  -i "$OUT/f8-${slug}-SE.png" \
    -i "$OUT/f8-${slug}-S.png"  -i "$OUT/f8-${slug}-SW.png" -i "$OUT/f8-${slug}-W.png"  -i "$OUT/f8-${slug}-NW.png" \
    -filter_complex "[0:v]scale=640:360[a];[1:v]scale=640:360[b];[2:v]scale=640:360[c];[3:v]scale=640:360[d];[4:v]scale=640:360[e];[5:v]scale=640:360[f];[6:v]scale=640:360[g];[7:v]scale=640:360[h];[a][b][c][d]hstack=4[top];[e][f][g][h]hstack=4[bot];[top][bot]vstack" \
    -frames:v 1 "$OUT/fable-qa8-${key}.png" >/dev/null 2>&1
  echo "montage: $OUT/fable-qa8-${key}.png  (row1 N NE E SE | row2 S SW W NW)"
done
