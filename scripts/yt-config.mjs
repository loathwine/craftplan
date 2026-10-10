// Shared YouTube OAuth credentials — the same files the `yt` CLI (youtube skill
// in ~/.dotfiles) uses, so one re-consent (`yt auth`) covers every script.
// Override the directory with YT_CONFIG_DIR.
import { mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const YT_DIR = process.env.YT_CONFIG_DIR || join(homedir(), '.config', 'youtube');
export const CLIENT_PATH = join(YT_DIR, 'client.json');
export const TOKEN_PATH = join(YT_DIR, 'token.json');

export function saveToken(tokens) {
  mkdirSync(YT_DIR, { recursive: true, mode: 0o700 });
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  chmodSync(TOKEN_PATH, 0o600);
}
