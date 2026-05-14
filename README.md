# CraftPlan

A browser-based, Minecraft-style multiplayer voxel world where an
in-world player named **Claude** builds anything you ask. Type
`@Claude build a dragon, here` in chat and watch the LLM stream blocks
into the world over ~10 seconds. Dragons, Hogwarts, pirate ships,
whatever you can describe.

**Demo video:** <https://youtu.be/GDJijs-ZlSk>

> CraftPlan started life as a JIRA-backlog visualizer — story points
> became tower sizes, status became color, parent links became spatial
> clusters. Then the AI builder bot landed and quietly took over the
> project. The JIRA import still works (see below), but the fun part is
> asking Claude to build you a castle.

> **A note on how this was built:** every line of code in this repo was
> written by Claude. So were the cached LLM builds, the recording
> pipeline, and the demo video itself (shot list, fades, audio cues,
> the lot). I drove, Claude typed. The whole thing is a vibe-coding
> experiment — I wanted to see how far Claude could be pushed on a real
> multi-component project, end to end.

## Try it without installing anything

The static demo is on GitHub Pages: <https://loathwine.github.io/craftplan/>

- Fly around a finished demo world, no server required.
- Pick from 16 cached builds (dragon, Hogwarts, pirate ship, …); a small
  Claude avatar appears and places blocks visibly over ~10 s.
- Works on desktop (WASD + mouse-look) **and mobile** (virtual joystick,
  drag-to-look, on-screen Spawn button).

## Run locally

### Dependencies

| What you want to run | Needs |
| -- | -- |
| The static demo above | A browser. That's it. |
| Live multiplayer server | [Nix](https://nixos.org/download) (with flakes). The flake pins Node 22 and resolves all npm deps via `buildNpmPackage`, so there's no host-level `npm install` and no global packages on your `$PATH`. |
| AI builder bot | Nix **plus** the [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) CLI on `$PATH`. The bot shells out to `claude -p --model claude-opus-4-7` to turn freeform prompts into block-placement scripts. |

### Server

```bash
./craftplan.sh start          # WebSocket + Express server on :3000
./craftplan.sh status         # show server + bot state
./craftplan.sh stop
./craftplan.sh tunnel         # public Cloudflare URL (no account needed)
./craftplan.sh ngrok          # public ngrok URL (needs free token once)
```

Then open <http://localhost:3000>, pick a name, and play. Controls:
**WASD** move · **mouse** look · **Space** jump · **F** fly · **LMB**
break · **RMB** place · **T** task panel · **Enter** chat ·
**G/R** carry + rotate a task.

### AI builder bot

```bash
./craftplan.sh bot            # connects as @Claude
```

In chat:

```
@Claude build a dragon, here
@Claude build castle here
@Claude come
```

Preset builds (`castle`, `tower`, `sphere`, …) run instantly from
`scripts/builders.mjs`. Freeform prompts ask the LLM for a build plan,
which is then run inside `vm.createContext` and streamed to the world at
~40 blocks/sec so the build is visibly placed.

### JIRA import

Open the task panel (**T**), click **Import from JIRA**, supply your
Atlassian URL + email + API token + JQL. Story points → tower size,
status category → color, parent/child links → spatial clusters.

## Architecture

See [`CLAUDE.md`](CLAUDE.md) — full breakdown of the world generator,
task rendering, networking, bot pipeline, and the things I learned the
hard way.

```
server.js               WebSocket + Express. In-memory state, auto-saves
                        to data.json every 30 s.
public/js/              Three.js client (~2500 LOC, no bundler — three.js
                        loads from a CDN via importmap).
scripts/bot.mjs         AI player, listens for @Name in chat.
scripts/builders.mjs    Reusable building primitives.
```
