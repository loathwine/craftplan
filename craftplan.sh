#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PIDFILE=".craftplan.pid"
BOT_PIDFILE=".craftplan-bot.pid"
BOT_LOG="bot.log"

case "${1:-help}" in
  # ---------- Server ----------
  start)
    EXISTING=$(lsof -ti :"$PORT" 2>/dev/null || true)
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
      PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
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
    PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
    if [ -n "$PID" ]; then
      IP=$(hostname -I | awk '{print $1}')
      echo "Server: running (PID $PID)"
      echo "  Local:   http://localhost:$PORT"
      echo "  Network: http://$IP:$PORT"
    else echo "Server: not running"
    fi
    if [ -f "$BOT_PIDFILE" ] && kill -0 "$(cat "$BOT_PIDFILE")" 2>/dev/null; then
      echo "Bot:    running (PID $(cat "$BOT_PIDFILE"))"
    else echo "Bot:    not running"
    fi
    ;;

  # ---------- Bot ----------
  bot|bot-start)
    if ! lsof -ti :"$PORT" >/dev/null 2>&1; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    if [ -f "$BOT_PIDFILE" ] && kill -0 "$(cat "$BOT_PIDFILE")" 2>/dev/null; then
      echo "Bot already running (PID $(cat "$BOT_PIDFILE")). Run: ./craftplan.sh bot-stop"
      exit 1
    fi
    echo "Starting Claude bot..."
    HOST="localhost:$PORT" nix develop --command node scripts/bot.mjs > "$BOT_LOG" 2>&1 &
    echo $! > "$BOT_PIDFILE"
    sleep 2
    if kill -0 "$(cat "$BOT_PIDFILE")" 2>/dev/null; then
      echo "Bot started (PID $(cat "$BOT_PIDFILE")). In-game, say: @Claude help"
      echo "Tail log: ./craftplan.sh bot-log"
    else
      echo "Bot failed to start. Check $BOT_LOG"
      rm -f "$BOT_PIDFILE"
      exit 1
    fi
    ;;
  bot-stop)
    if [ -f "$BOT_PIDFILE" ]; then
      PID=$(cat "$BOT_PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then kill "$PID"; echo "Bot stopped (PID $PID)"
      else echo "Stale bot pidfile"
      fi
      rm -f "$BOT_PIDFILE"
    else echo "Bot not running"
    fi
    # Also kill any orphan claude -p children
    pkill -f "claude -p --model" 2>/dev/null || true
    ;;
  bot-restart)
    "$0" bot-stop
    sleep 1
    "$0" bot
    ;;
  bot-log)
    if [ -f "$BOT_LOG" ]; then tail -f "$BOT_LOG"
    else echo "No log yet ($BOT_LOG)"
    fi
    ;;

  # ---------- Tunnel ----------
  tunnel)
    if ! lsof -ti :"$PORT" >/dev/null 2>&1; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    echo "Starting tunnel to localhost:$PORT..."
    echo "Share the https:// URL below with your colleagues."
    echo ""
    nix run nixpkgs#cloudflared -- tunnel --url "http://localhost:$PORT"
    ;;

  *)
    cat <<EOF
Usage: ./craftplan.sh <command>

Server:
  start        Start the server (background)
  stop         Stop the server
  restart      Stop + start
  status       Show status (server + bot)

Bot (AI builder, responds to @Claude in chat):
  bot          Start the bot (background)
  bot-stop     Stop the bot
  bot-restart  Stop + start
  bot-log      Tail the bot log

Other:
  tunnel       Expose server via Cloudflare tunnel

Env:
  PORT=8080                         custom server port
  AI_MODEL=claude-sonnet-4-6        override bot model (default: opus 4.7)
EOF
    ;;
esac
