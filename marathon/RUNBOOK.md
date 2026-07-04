# Fable-5 cache marathon — runbook

**Goal:** cache as many `<key>-4x-fable` benchmark plans as possible before
claude-fable-5 leaves the subscription (~2026-07-07). Each subject also gets a
byte-identical prompt dump in `prompts/<key>-4x.prompt.txt` so haiku/sonnet/opus
variants can be generated later (world geometry is baked into prompts — later
runs must re-dump, diff, and fall back to feeding the saved dump via
`claude -p --output-format stream-json` + `scripts/recover-plan.mjs` on drift).

User is away for a few days (left 2026-07-03 evening). **NO YouTube uploads.
NO pushes.** Local commits after each batch are authorized.

## State

- `marathon/queue.json` — subject list + statuses (queued → cached → smoked → qa_ok | needs_review)
- `marathon/log.txt` — timestamped batch log
- `marathon/window.json` — last five-hour-window probe ({resetsAt, overageStatus, probedAt}, epoch seconds)
- `marathon/smokes/<key>.png` — t=5 smoke of each cached build
- Batches run as transient units `marathon-batch-<n>` via:
  `systemd-run --user --unit=marathon-batch-<n> --working-directory=/home/edvin/dev/craftplan /home/edvin/dev/craftplan/marathon/run-batch.sh [waitUntilEpoch]`

## Wake procedure (each /loop wake)

1. If a `marathon-batch-*` unit is still active → just reschedule a wake
   (~1800s fallback; a Monitor should already be armed on the unit).
2. Otherwise, QA any subjects with status `smoked`: **view each smoke PNG**
   (frame-check rule). Something recognizably built → `qa_ok` + short `note`
   with a 1–5 quality score (bad-but-honest model output is still qa_ok —
   that IS the benchmark). Empty scene / pipeline garbage → `needs_review`,
   set status back to `queued` if attempts < 2.
3. Commit: new `public/data/plans/*-4x-fable.*`, `prompts/*.prompt.txt`,
   `marathon/queue.json`, `marathon/log.txt`. Message style:
   `Marathon batch N: <keys> (fable-5, effort high)`. Do NOT commit
   marathon/smokes (recordings-sized PNGs are fine on disk).
4. Launch the next batch:
   - If last batch exited 1 (window drained): read `marathon/window.json`,
     launch unit with waitUntilEpoch = resetsAt + 120. ONE batch per window.
   - Else launch immediately (no wait arg).
   - Arm a Monitor on the new unit; ScheduleWakeup fallback ≈ min(3600, time
     until expected completion + slack).
5. Stop conditions: queue exhausted, OR generation fails with a
   model-not-found/permission error (fable pulled — mark remaining subjects
   `blocked_no_fable` in a final commit), OR the user is back and says stop.
   On stop: write a summary at the top of this file, final commit, end loop
   (no ScheduleWakeup).

## Window mechanics (from memory, hard-won)

- Subscription five-hour windows. When drained: `rate_limit_event` shows
  `overageStatus: "rejected", overageDisabledReason: "out_of_credits"` and
  generation crawls at ~1K tokens/min. A throttled run BURNS the window it
  runs in — never blind-retry; sleep to `resetsAt` (it moves — always read
  the newest probe).
- ~4–5 effort-high fable generations fit per window (each 3–8 min, 15–30K
  tokens). batch.mjs stops the chain on first failure and probes resetsAt.
- This Claude Code session shares the same pool — keep wakes lightweight.
- If resetsAt is implausibly far (days), it may be a weekly cap: idle-loop
  with hourly wakes and re-probe; nothing else to do.

## Resume after crash/reboot

Start claude in /home/edvin/dev/craftplan and say: "resume the fable
marathon per marathon/RUNBOOK.md". Check `systemctl --user list-units
'marathon-*'`, read queue.json/log.txt, continue the wake procedure.

## Remote check-in (for the user)

```
cd ~/dev/craftplan
tail -30 marathon/log.txt                     # what's happening
grep -c '"status": "qa_ok"' marathon/queue.json   # finished subjects
git log --oneline -10                          # committed batches
```
