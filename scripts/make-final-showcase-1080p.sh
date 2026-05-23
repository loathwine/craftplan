#!/usr/bin/env bash
# Final upload-quality showcase: all clips at 1080x1920 (Shorts native).
# Source clips are already rendered at this resolution where possible.
set -euo pipefail

OUT=${OUT:-recordings/shorts-mode/SHOWCASE-1080p.mp4}

nix develop .#record --command node scripts/build-showcase.mjs \
  --out "$OUT" --width 1080 --height 1920 \
  --clip "BEFORE: v7 dragon|recordings/shorts-mode/_v7-dragon-6s.mp4|0|5" \
  --clip "Same build, new look|recordings/shorts-mode/dragon-tower-new-1080p.mp4|1|5" \
  --clip "Structural build order|recordings/shorts-mode/hogwarts-big-1080p.mp4|2|5" \
  --clip "BIGGER: 14K-block Hogwarts|recordings/shorts-mode/hogwarts-big-1080p.mp4|5|5" \
  --clip "BIGGER: 12K-block leaping dragon|recordings/shorts-mode/dragon-attacking-v2-1080p.mp4|4|5" \
  --clip "BIGGER: 13K-block fire vs ice dragons|recordings/shorts-mode/dragons-fighting-v2-1080p.mp4|4|6" \
  --clip "Weather: rain|recordings/shorts-mode/hogwarts-rain-1080p.mp4|3|5" \
  --clip "Weather: snow|recordings/shorts-mode/dragons-fighting-v2-1080p.mp4|5|5" \
  --epilogue "shorts-mode upgrades|+ gradient sky + AO + cast shadows|+ ACES tonemap + SSAO + bloom|+ structural build order|+ snow / rain / storm weather|+ bigger builds (10-14K blocks)|+ smaller world for fast iteration"
ls -la "$OUT"
