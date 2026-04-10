# CraftPlan Feature Roadmap

## Done
- ~~Fly mode~~ — F to toggle, Space/Shift for up/down
- ~~Persistent storage~~ — Auto-saves to data.json every 30s
- ~~Export/Import~~ — JSON snapshots via task panel
- ~~Task interaction~~ — E/click on structures, Escape to close
- ~~LAN multiplayer~~ — Already works: colleagues on same network/VPN connect to http://<host-ip>:3000

## Next up: Make the demo compelling for colleagues
- **Shareable link UX** — Show the LAN URL on the join screen so the host can easily share it. Maybe a QR code.
- **Task creation UX rework** — Place a special "task block" (crafting-table style), then press E to open task editor in-context. More Minecraft-native than a side panel.
- **JIRA import** — Pull issues from JIRA API, auto-create task structures. Map issue type/story points to structure size, status to color. Instant wow-factor when you import a real backlog.
- **Predefined shape templates** — Tower, house, bridge, wall, etc. Quick pick when creating a task. Makes the world look better fast.

## Multiplayer beyond LAN
- **Cloudflare Tunnel / ngrok** — For remote colleagues not on VPN. Free tunneling, single command to expose the local server.
- **Lightweight VPS deploy** — fly.io / Railway free tier for always-on hosting. Package as Docker container.

## Ambitious features
- **AI-generated structures** — Send task description to an LLM, get back a voxel blueprint. "Authentication system" → castle with a gate. "Database migration" → minecart track.
- **Underground dungeons for dreaded tasks** — If a task is flagged as unpleasant, generate it as a cave/dungeon below the surface. You descend into it. Dark, torches, mob sounds.
- **Factorissimo-style portals** — Each task structure has a door/portal. Enter it to load a sub-world where you can create subtasks, plan the breakdown. Nested worlds. This is the killer feature.
- **Sprint planning / Planning Poker** — Special mode: tasks appear as cards, players vote on size by placing colored blocks. Reveal simultaneously.
- **Retro mode** — Three zones in the world (went well / improve / action items). Players place blocks/signs in each zone. Timer, voting on action items.
- **Voice proximity chat** — WebRTC audio that fades with distance. Huge for the collaborative feel.

## Polish
- **Sound effects** — Block place/break, footsteps, task creation fanfare, portal entry.
- **Music** — Ambient background tracks. Calm C418-style for building, upbeat for sprint planning.
- **Emotes** — Predefined animations/particles triggered by hotkeys. Wave, thumbs up, thinking, etc.
- **Detailed characters & character creation** — Skin picker or simple customization (color, hat, accessories). Replace current box-people.
