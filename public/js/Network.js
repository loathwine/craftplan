export class Network {
  constructor(callbacks) {
    this.ws = null;
    this.cb = callbacks;
    this.myId = null;
  }

  connect(name) {
    const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${proto}//${location.host}`);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({ type: 'join', name }));
    };

    this.ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case 'welcome':
          this.myId = msg.id;
          this.cb.onWelcome?.(msg);
          break;
        case 'player_join':
          this.cb.onPlayerJoin?.(msg.player);
          break;
        case 'player_move':
          this.cb.onPlayerMove?.(msg);
          break;
        case 'player_leave':
          this.cb.onPlayerLeave?.(msg.id);
          break;
        case 'chat':
          this.cb.onChat?.(msg);
          break;
        case 'block_update':
          this.cb.onBlockUpdate?.(msg);
          break;
        case 'task_created':
          this.cb.onTaskCreated?.(msg.task);
          break;
        case 'task_updated':
          this.cb.onTaskUpdated?.(msg.task);
          break;
        case 'task_deleted':
          this.cb.onTaskDeleted?.(msg.id);
          break;
      }
    };

    this.ws.onclose = () => this.cb.onDisconnect?.();
  }

  send(type, data) {
    if (this.ws?.readyState === 1) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  sendMove(position, rotation) {
    this.send('move', { position, rotation });
  }

  sendChat(message) {
    this.send('chat', { message });
  }

  sendBlockBreak(x, y, z) {
    this.send('block_break', { x, y, z });
  }

  sendBlockPlace(x, y, z, block) {
    this.send('block_place', { x, y, z, block });
  }

  sendTaskCreate(name, description, size) {
    this.send('task_create', { name, description, size });
  }

  sendTaskUpdate(id, changes) {
    this.send('task_update', { id, ...changes });
  }

  sendTaskDelete(id) {
    this.send('task_delete', { id });
  }
}
