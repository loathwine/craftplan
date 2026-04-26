#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PIDFILE=".craftplan.pid"

# Bot pidfile + log keyed by name: .craftplan-bot-<Name>.pid / bot-<Name>.log

# Find PID listening on a TCP port. Prefer lsof, fall back to ss (always
# present on NixOS via iproute2; lsof typically isn't in the default PATH).
port_pid() {
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti :"$1" 2>/dev/null
  elif command -v ss >/dev/null 2>&1; then
    ss -tlnHp "sport = :$1" 2>/dev/null | grep -oP 'pid=\K[0-9]+' | head -1
  fi
}

case "${1:-help}" in
  # ---------- Server ----------
  start)
    EXISTING=$(port_pid "$PORT" || true)
    if [ -n "$EXISTING" ]; then
      echo "Port $PORT already in use (PID $EXISTING). Run: ./craftplan.sh stop"
      exit 1
    fi
    echo "Starting CraftPlan on port $PORT..."
    nix develop --command node server.js > craftplan.log 2>&1 &
    echo $! > "$PIDFILE"
    sleep 2
    IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "  Local:   http://localhost:$PORT"
    echo "  Network: http://$IP:$PORT"
    echo ""
    echo "  Stop with: ./craftplan.sh stop"
    ;;
  stop)
    if [ -f "$PIDFILE" ]; then
      PID=$(cat "$PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then kill "$PID"; echo "Stopped (PID $PID)"
      else echo "Stale pidfile (PID $PID already gone)"
      fi
      rm -f "$PIDFILE"
    else
      PID=$(port_pid "$PORT" || true)
      if [ -n "$PID" ]; then
        echo "Port $PORT in use by PID $PID (not started by craftplan.sh)"
        echo "  ps -p $PID -o command=   # to inspect"
        echo "  kill $PID                # to stop manually"
      else echo "Not running"
      fi
    fi
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    PID=$(port_pid "$PORT" || true)
    if [ -n "$PID" ]; then
      IP=$(hostname -I | awk '{print $1}')
      echo "Server: running (PID $PID)"
      echo "  Local:   http://localhost:$PORT"
      echo "  Network: http://$IP:$PORT"
    else echo "Server: not running"
    fi
    # List all running bots
    shopt -s nullglob
    any_bot=0
    for f in .craftplan-bot-*.pid; do
      any_bot=1
      NAME=${f#.craftplan-bot-}; NAME=${NAME%.pid}
      PID=$(cat "$f")
      if kill -0 "$PID" 2>/dev/null; then
        echo "Bot ${NAME}: running (PID $PID)"
      else
        echo "Bot ${NAME}: stale pidfile (removing)"
        rm -f "$f"
      fi
    done
    [ "$any_bot" = 0 ] && echo "Bots:   none running"
    ;;

  # ---------- Bot ----------
  bot|bot-start)
    NAME="${2:-Claude}"
    BOT_PIDFILE=".craftplan-bot-${NAME}.pid"
    BOT_LOG="bot-${NAME}.log"
    if [ -z "$(port_pid "$PORT")" ]; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    if [ -f "$BOT_PIDFILE" ] && kill -0 "$(cat "$BOT_PIDFILE")" 2>/dev/null; then
      echo "Bot '$NAME' already running (PID $(cat "$BOT_PIDFILE"))."
      echo "Stop with: ./craftplan.sh bot-stop $NAME"
      exit 1
    fi
    echo "Starting bot '$NAME'..."
    HOST="localhost:$PORT" BOT_NAME="$NAME" \
      nix develop --command node scripts/bot.mjs > "$BOT_LOG" 2>&1 &
    echo $! > "$BOT_PIDFILE"
    sleep 2
    if kill -0 "$(cat "$BOT_PIDFILE")" 2>/dev/null; then
      echo "Bot '$NAME' started (PID $(cat "$BOT_PIDFILE"))."
      echo "In-game: @${NAME} help"
      echo "Tail log: ./craftplan.sh bot-log $NAME"
    else
      echo "Bot failed to start. Check $BOT_LOG"
      rm -f "$BOT_PIDFILE"
      exit 1
    fi
    ;;
  bot-stop)
    NAME="${2:-}"
    if [ -z "$NAME" ]; then
      # Stop all if no name given
      shopt -s nullglob
      any=0
      for f in .craftplan-bot-*.pid; do
        any=1
        N=${f#.craftplan-bot-}; N=${N%.pid}
        "$0" bot-stop "$N"
      done
      [ "$any" = 0 ] && echo "No bots running"
      exit 0
    fi
    BOT_PIDFILE=".craftplan-bot-${NAME}.pid"
    if [ -f "$BOT_PIDFILE" ]; then
      PID=$(cat "$BOT_PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then kill "$PID"; echo "Bot '$NAME' stopped (PID $PID)"
      else echo "Stale pidfile for '$NAME'"
      fi
      rm -f "$BOT_PIDFILE"
    else
      echo "Bot '$NAME' not running"
    fi
    ;;
  bot-restart)
    NAME="${2:-Claude}"
    "$0" bot-stop "$NAME"
    sleep 1
    "$0" bot "$NAME"
    ;;
  bot-log)
    NAME="${2:-Claude}"
    BOT_LOG="bot-${NAME}.log"
    if [ -f "$BOT_LOG" ]; then tail -f "$BOT_LOG"
    else echo "No log for '$NAME' ($BOT_LOG)"
    fi
    ;;

  # ---------- Tunnels ----------
  tunnel)
    if [ -z "$(port_pid "$PORT")" ]; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    echo "Starting Cloudflare tunnel to localhost:$PORT..."
    echo "Share the https:// URL below with your colleagues."
    echo ""
    nix run nixpkgs#cloudflared -- tunnel --url "http://localhost:$PORT"
    ;;
  ngrok)
    if [ -z "$(port_pid "$PORT")" ]; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    if [ -z "${NGROK_AUTHTOKEN:-}" ] && [ ! -f "$HOME/.config/ngrok/ngrok.yml" ]; then
      echo "No ngrok token configured. Either:"
      echo "  NGROK_AUTHTOKEN=<token> ./craftplan.sh ngrok"
      echo "  or run once: nix run nixpkgs#ngrok -- config add-authtoken <token>"
      echo ""
      echo "Get your token at https://dashboard.ngrok.com/get-started/your-authtoken"
      exit 1
    fi
    echo "Starting ngrok tunnel to localhost:$PORT..."
    echo "Share the https:// URL below with your colleagues."
    echo ""
    NIXPKGS_ALLOW_UNFREE=1 nix run --impure nixpkgs#ngrok -- http "$PORT"
    ;;

  *)
    cat <<EOF
Usage: ./craftplan.sh <command>

Server:
  start                       Start the server (background)
  stop                        Stop the server
  restart                     Stop + start
  status                      Show server + all bots

Bots (AI builders, trigger: @Name in chat):
  bot [Name]                  Start a bot (default name: Claude)
  bot-stop [Name|blank]       Stop one bot (or all if no name given)
  bot-restart [Name]          Restart a bot
  bot-log [Name]              Tail a bot's log

Examples:
  ./craftplan.sh bot                    # -> @Claude
  ./craftplan.sh bot Picasso            # -> @Picasso
  ./craftplan.sh bot Bob                # -> @Bob (now 3 bots running)
  ./craftplan.sh bot-stop Picasso       # stop just Picasso
  ./craftplan.sh bot-stop               # stop all bots

Tunnels (expose server publicly):
  tunnel                      Cloudflare quick tunnel (no account)
  ngrok                       ngrok tunnel (needs NGROK_AUTHTOKEN)

Env:
  PORT=8080                             custom server port
  AI_MODEL=claude-sonnet-4-6            override bot model (default: opus 4.7)
EOF
    ;;
esac
