#!/usr/bin/env bash
# v2 final showcase: drops dragons-fighting (scrapped per user feedback),
# adds painterly + low-up + clouds + ocean improvements. All clips are
# 1080×1920 multi-angle.
set -euo pipefail

W=${WIDTH:-1080}
H=${HEIGHT:-1920}
OUT=${OUT:-recordings/shorts-mode/SHOWCASE-v2.mp4}

nix develop .#record --command node scripts/build-showcase.mjs \
  --out "$OUT" --width "$W" --height "$H" \
  --clip "BEFORE: v7 dragon|recordings/shorts-mode/_v7-dragon-6s.mp4|0|5" \
  --clip "Same build, new look|recordings/shorts-mode/dragon-tower-final.mp4|9|5" \
  --clip "Painterly build order|recordings/shorts-mode/hogwarts-painterly-final.mp4|2|5" \
  --clip "Multi-angle reveal|recordings/shorts-mode/hogwarts-clouds-final.mp4|9|5" \
  --clip "BIGGER: dragon mid-attack (ground view)|recordings/shorts-mode/dragon-attacking-final.mp4|8|6" \
  --clip "Weather: rain|recordings/shorts-mode/hogwarts-rain-final-v2.mp4|10|5" \
  --clip "Weather: snow|recordings/shorts-mode/dragon-tower-final.mp4|3|5" \
  --clip "Weather: clouds|recordings/shorts-mode/hogwarts-clouds-final.mp4|11|4" \
  --epilogue "shorts-mode upgrades|+ gradient sky + AO + cast shadows|+ ACES tonemap + SSAO + bloom|+ structural/BFS/flood-fill build orders|+ multi-angle camera reveals|+ snow/rain/storm/clouds weather|+ ocean horizon|+ bigger builds (10-14K blocks)"
ls -la "$OUT"
