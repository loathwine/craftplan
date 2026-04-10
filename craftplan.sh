#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3000}"
PIDFILE=".craftplan.pid"

case "${1:-help}" in
  start)
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      echo "Already running (PID $(cat "$PIDFILE")). Use: ./craftplan.sh restart"
      exit 1
    fi
    echo "Starting CraftPlan on port $PORT..."
    nix develop --command node server.js &
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
        echo "Process $PID not running"
      fi
      rm -f "$PIDFILE"
    else
      echo "Not running (no pidfile). Killing anything on port $PORT..."
      lsof -ti :"$PORT" | xargs kill 2>/dev/null || true
    fi
    ;;
  restart)
    "$0" stop
    sleep 1
    "$0" start
    ;;
  status)
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      IP=$(hostname -I | awk '{print $1}')
      echo "Running (PID $(cat "$PIDFILE"))"
      echo "  Local:   http://localhost:$PORT"
      echo "  Network: http://$IP:$PORT"
    else
      echo "Not running"
    fi
    ;;
  *)
    echo "Usage: ./craftplan.sh {start|stop|restart|status}"
    echo ""
    echo "  start    Start the server (background)"
    echo "  stop     Stop the server"
    echo "  restart  Restart the server"
    echo "  status   Show if running + URLs"
    echo ""
    echo "  PORT=8080 ./craftplan.sh start   # custom port"
    ;;
esac
