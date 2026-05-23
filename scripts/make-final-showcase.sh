#!/usr/bin/env bash
# Assemble the final shorts-mode showcase. Run after the per-clip renders
# are all in place under recordings/shorts-mode/. Uses 720x1280; bump
# --width/--height to 1080x1920 for upload-quality.
#
# Usage:
#   ./scripts/make-final-showcase.sh
#   WIDTH=1080 HEIGHT=1920 ./scripts/make-final-showcase.sh
set -euo pipefail

W=${WIDTH:-720}
H=${HEIGHT:-1280}
OUT=${OUT:-recordings/shorts-mode/SHOWCASE.mp4}

nix develop .#record --command node scripts/build-showcase.mjs \
  --out "$OUT" --width "$W" --height "$H" \
  --clip "BEFORE: v7 dragon|recordings/shorts-mode/_v7-dragon-6s.mp4|0|5" \
  --clip "Same build, new look|recordings/shorts-mode/dragon-tower-new.mp4|1|5" \
  --clip "Structural build order|recordings/shorts-mode/hogwarts-big.mp4|2|5" \
  --clip "BIGGER: 14K-block Hogwarts|recordings/shorts-mode/hogwarts-big.mp4|5|5" \
  --clip "BIGGER: 12K-block leaping dragon|recordings/shorts-mode/dragon-attacking-v2.mp4|4|5" \
  --clip "BIGGER: 13K-block fire vs ice dragons|recordings/shorts-mode/dragons-fighting-v2.mp4|4|6" \
  --clip "Weather: rain|recordings/shorts-mode/hogwarts-rain-final.mp4|3|5" \
  --clip "Weather: snow|recordings/shorts-mode/dragons-fighting-v2.mp4|5|5" \
  --epilogue "shorts-mode upgrades|+ gradient sky + AO + cast shadows|+ ACES tonemap + SSAO + bloom|+ structural build order|+ snow / rain / storm weather|+ bigger builds (10-12K blocks)|+ smaller world for fast iteration"
ls -la "$OUT"
