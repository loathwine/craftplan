# CraftPlan Feature Roadmap

## Networking & Infrastructure
- **Real multiplayer hosting** — Need public WebSocket access. Options: reverse proxy with surge/Cloudflare Tunnel for static + separate WS server on home machine, or ngrok/bore for tunneling everything. Could also do a lightweight VPS (fly.io free tier).
- **Persistent storage** — Server state is in-memory, lost on restart. SQLite or JSON file for tasks/block changes. Could also persist world modifications.
- **Export/Import** — Dump world + tasks to JSON, reload later. Enables backups and sharing project snapshots.
- **JIRA import** — Pull issues from JIRA API, auto-create task structures. Map issue type/story points to structure size, status to color.

## Gameplay & Controls
- **Fly mode** — Toggle with F. Disable gravity, Space=up, Shift=down. Essential for navigating a large task world.
- **Task creation UX rework** — Place a special "task block" (crafting-table style), then press E to open task editor in-context. More Minecraft-native than a side panel.
- **Emotes** — Predefined animations/particles triggered by hotkeys. Wave, thumbs up, thinking, etc.
- **Detailed characters & character creation** — Skin picker or simple customization (color, hat, accessories). Replace current box-people.
- **Voice proximity chat** — WebRTC audio that fades with distance. Huge for the collaborative feel.

## Task Visualization
- **AI-generated structures** — Send task description to an LLM, get back a voxel blueprint. "Authentication system" → castle with a gate. "Database migration" → minecart track.
- **Predefined shape templates** — Tower, house, bridge, wall, etc. Quick pick when creating a task.
- **Underground dungeons for dreaded tasks** — If a task is flagged as unpleasant, generate it as a cave/dungeon below the surface. You descend into it. Dark, torches, mob sounds.
- **Factorissimo-style portals** — Each task structure has a door/portal. Enter it to load a sub-world where you can create subtasks, plan the breakdown. Nested worlds. This is the killer feature.

## Collaboration Modes
- **Sprint planning / Planning Poker** — Special mode: tasks appear as cards, players vote on size by placing colored blocks. Reveal simultaneously. Integrates with the task size field.
- **Retro mode** — Three zones in the world (went well / improve / action items). Players place blocks/signs in each zone. Timer, voting on action items.

## Audio
- **Sound effects** — Block place/break, footsteps, task creation fanfare, portal entry.
- **Music** — Ambient background tracks. Calm C418-style for building, upbeat for sprint planning.
