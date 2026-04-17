#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PIDFILE=".craftplan.pid"

case "${1:-help}" in
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
    echo "  Share the Network URL with colleagues on the same network."
    echo "  Stop with: ./craftplan.sh stop"
    ;;
  stop)
    if [ -f "$PIDFILE" ]; then
      PID=$(cat "$PIDFILE")
      if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        echo "Stopped (PID $PID)"
      else
        echo "Stale pidfile (process $PID already gone)"
      fi
      rm -f "$PIDFILE"
    else
      PID=$(lsof -ti :"$PORT" 2>/dev/null || true)
      if [ -n "$PID" ]; then
        echo "Port $PORT in use by PID $PID (not started by craftplan.sh)"
        echo "Inspect with: ps -p $PID -o command="
        echo "Kill it yourself with: kill $PID"
      else
        echo "Not running"
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
      echo "Running (PID $PID)"
      echo "  Local:   http://localhost:$PORT"
      echo "  Network: http://$IP:$PORT"
    else
      echo "Not running"
    fi
    ;;
  bot)
    if ! lsof -ti :"$PORT" >/dev/null 2>&1; then
      echo "Server not running. Run: ./craftplan.sh start"
      exit 1
    fi
    echo "Starting Claude bot (Ctrl+C to stop)..."
    echo "In-game: type chat with Enter, send '@Claude help'"
    HOST="localhost:$PORT" nix develop --command node scripts/bot.mjs
    ;;
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
    echo "Usage: ./craftplan.sh {start|stop|restart|status|tunnel}"
    echo ""
    echo "  start    Start the server (background)"
    echo "  stop     Stop the server"
    echo "  restart  Restart the server"
    echo "  status   Show if running + URLs"
    echo "  bot      Run the Claude builder bot (responds to @Claude commands)"
    echo "  tunnel   Expose to internet via Cloudflare (for remote colleagues)"
    echo ""
    echo "  PORT=8080 ./craftplan.sh start   # custom port"
    ;;
esac
