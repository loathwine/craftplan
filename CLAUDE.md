# CraftPlan

Browser-based Minecraft-style multiplayer voxel world for project planning. Tasks become 3D structures (size = effort, color = status). Includes a Claude-powered builder bot.

## Quick start

```bash
./craftplan.sh start          # server (background)
./craftplan.sh bot            # AI builder bot (background) — chat: @Claude help
./craftplan.sh status         # show server + bot state
./craftplan.sh stop           # stop server
./craftplan.sh ngrok          # public tunnel (needs NGROK_AUTHTOKEN once)
./craftplan.sh tunnel         # cloudflare quick tunnel (no account)
```

The server runs via `nix develop --command node server.js` so npm install never touches the host. Build/run is reproducible through `flake.nix` (`buildNpmPackage` with pinned `npmDepsHash`).

## Architecture

```
server.js               WebSocket + Express. In-memory state (players, tasks,
                        block deltas). Auto-saves to data.json every 30s.
                        REST: /api/export, /api/import, /api/jira/import

public/index.html       Importmap loads three from unpkg, no bundler.
public/js/
  main.js               Three.js setup, controls, physics, raycast targeting,
                        game loop. Glues everything together.
  World.js              Voxel world: chunk-based block storage, deterministic
                        hash noise → terrain + biomes (plains/forest/desert/
                        taiga + mountain caps), tree gen, merged BufferGeometry
                        chunk mesher (only exposed faces, vertex colors).
  Textures.js           Block enum + per-face color table + per-block color
                        variation hash. No textures, vertex colors only.
  Network.js            WebSocket client, message dispatch.
  TaskManager.js        Task storage, InstancedMesh task structures, canvas-
                        sprite floating labels, AABB hit-test (manual ray vs
                        bounding box — Three.js InstancedMesh raycast was
                        unreliable here).
  UI.js                 DOM event wiring: join, hotbar, task panel, chat,
                        JIRA import form, export/import.

scripts/
  builders.mjs          Reusable building primitives (castle, tower, tree,
                        sphere, house). Each returns [{x,y,z,block}, ...].
  build-castle.mjs      One-shot: connect, place a castle, disconnect.
  bot.mjs               Persistent WebSocket client named "Claude". Listens
                        for "@Name" in chat. For freeform builds it shells out
                        to `claude -p` (Opus 4.7 by default), feeds it a prompt
                        describing a sandbox API, and runs the returned
                        JavaScript inside `vm.createContext` to collect block
                        ops. Throttled to ~40 blocks/sec for visible builds.
                        Multiple named bots can run concurrently.
```

## Networking

- One server on a port (default 3000). All clients connect via WebSocket.
- Server is the source of truth for tasks and block deltas. Terrain itself is
  client-generated from a deterministic noise function (no need to sync).
- When a client joins, server sends: existing players, tasks, block changes.
- 10 Hz position broadcast; remote players are interpolated client-side.

## World

- 16×16 chunks of 16×16×64 blocks = 256×256 world.
- Deterministic noise: `hash2 → smoothNoise → terrainHeight + biomeAt`.
- Biomes are slow-varying noise (frequency 0.008). Surface block + tree density
  + dirt/sand subsoil depend on biome. y≥19 forces stone, y≥22 forces snow.
- Trees densities: desert ~0, plains ~0.6%, taiga ~1.5%, forest ~4%.
- Spawn at center (128, terrain+2, 128).

## Tasks

Each task is a colored InstancedMesh tower:

| Size | Footprint | Height |
|------|-----------|--------|
| S    | 1×1       | 3      |
| M    | 2×2       | 5      |
| L    | 3×3       | 7      |
| XL   | 5×5       | 10     |

Status colors: `todo`=red, `wip`=orange, `done`=green, `blocked`=purple.

Position: client computes `baseY = max(server.position.y, terrainHeight+1)` so
imported tasks (server-set y=0) sit on the surface.

## JIRA import

`POST /api/jira/import { url, email, token, jql }`. Uses the new
`/rest/api/3/search/jql` endpoint. Maps:
- story points → size (S/M/L/XL)
- status category → status (todo/wip/done)
- subtask count → parent size override
- parents/children form clusters in the world

Token is sent on the wire; not stored.

## Bot — AI building

The bot is a normal WebSocket player. Triggers on chat regex `^@<Name>\s+(.+)$`.

For preset builds (`@Claude build castle here`), it calls a function from
`builders.mjs`. For freeform (`@Claude build a dragon here`), it spawns
`claude -p --model claude-opus-4-7` with a prompt that defines an API:

```js
block(x, y, z, BLOCK)
cube(x1, y1, z1, x2, y2, z2, BLOCK)
hollowCube(...)
sphere(cx, cy, cz, r, BLOCK)
hollowSphere(...)
cylinder(cx, cy, cz, r, h, BLOCK)
hollowCylinder(...)
disk(cx, cy, cz, r, BLOCK)
line(x1, y1, z1, x2, y2, z2, BLOCK)
// constants: AIR, GRASS, DIRT, STONE, OAK_LOG, LEAVES, SAND, PLANKS,
// COBBLE, BRICK, GLASS, SNOW, ICE
// Math is exposed
```

LLM returns JavaScript. We strip optional ```js fences and run it in
`vm.createContext` with 5s timeout. Block list is filtered (valid block IDs,
coord clamps, max 5000 ops) then sent over WebSocket throttled to ~40 ops/sec
so users see the build happen.

Coordinate conventions: relative to user — origin (0,0,0) is center-bottom.
The bot translates to absolute world coords (`pos + speakerPos`).

`@Name come` / `@Name goto here` — "here" / "me" expand to the speaker's
position (bot tracks all players via `player_join`/`player_move`).

## State / persistence

- `data.json` — `{ tasks, blockChanges, nextTaskSlot }`. Auto-save every 30s
  and on SIGINT/SIGTERM. Loaded on startup.
- `/api/export` returns this as a download. `/api/import` overwrites and
  broadcasts a `world_reset` to clients (which simply `location.reload()`).

## Deployment notes

Public access via tunneling:
- **ngrok** — reliable, needs auth token (free signup). `NGROK_AUTHTOKEN=…
  ./craftplan.sh ngrok` first time, persists to `~/.config/ngrok`.
- **Cloudflare quick tunnel** — `./craftplan.sh tunnel`. No account needed
  but DNS is sometimes slow / fails to register.

Office WiFi often has client isolation, so LAN multiplayer between colleagues
on the same network may not work. Tunnel is usually the safest path.

## Things I learned the hard way

- `nix run` serves files from the nix store, not from the working dir. After
  source edits, restart with `nix develop --command node server.js` (which
  `./craftplan.sh start` does).
- Three.js `InstancedMesh` raycasting is buggy enough that a manual AABB
  ray-test was simpler and more reliable for task structures.
- Raycaster from `setFromCamera` uses the camera position from the previous
  frame. To stay consistent with the player's current view direction, build
  the ray manually from `pos` + `yaw/pitch`.
- The new JIRA `/rest/api/3/search/jql` endpoint is POST-only and rejects
  unrestricted JQL (must include a project filter or similar).
- Always use `lsof ... || true` after `set -euo pipefail` — `lsof` exits 1
  when nothing matches and would silently abort the script otherwise.

## Roadmap

See `PLAN.md`.
