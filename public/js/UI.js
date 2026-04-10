export class UI {
  constructor(callbacks) {
    this.cb = callbacks;
    this.taskPanelOpen = false;
    this.chatActive = false;
    this.selectedBlock = 1;
    this.selectedSize = 'M';
    this.detailTaskId = null;

    this._bindJoinScreen();
    this._bindHotbar();
    this._bindTaskPanel();
    this._bindChat();
    this._bindTaskDetail();
  }

  // --- Join Screen ---
  _bindJoinScreen() {
    const btn = document.getElementById('join-btn');
    const input = document.getElementById('name-input');
    const join = () => {
      const name = input.value.trim() || 'Steve';
      this.cb.onJoin(name);
    };
    btn.addEventListener('click', join);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') join(); });
  }

  hideJoinScreen() {
    document.getElementById('join-screen').classList.add('hidden');
    document.getElementById('hud').classList.remove('hidden');
    document.getElementById('chat').classList.remove('hidden');
  }

  // --- Hotbar ---
  _bindHotbar() {
    const slots = document.querySelectorAll('.hotbar-slot');
    slots.forEach((slot, i) => {
      slot.addEventListener('click', () => this.selectHotbarSlot(i));
    });
  }

  selectHotbarSlot(index) {
    const slots = document.querySelectorAll('.hotbar-slot');
    slots.forEach(s => s.classList.remove('selected'));
    if (slots[index]) {
      slots[index].classList.add('selected');
      this.selectedBlock = parseInt(slots[index].dataset.block);
    }
  }

  handleScroll(deltaY) {
    const slots = document.querySelectorAll('.hotbar-slot');
    let current = [...slots].findIndex(s => s.classList.contains('selected'));
    if (deltaY > 0) current = (current + 1) % slots.length;
    else current = (current - 1 + slots.length) % slots.length;
    this.selectHotbarSlot(current);
  }

  handleNumberKey(num) {
    if (num >= 1 && num <= 9) this.selectHotbarSlot(num - 1);
  }

  // --- Coords / Player Count ---
  updateCoords(x, y, z, flying = false) {
    document.getElementById('coords').textContent =
      `${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)}${flying ? '  [FLY]' : ''}`;
  }

  updatePlayerCount(n) {
    document.getElementById('player-count').textContent = `${n} online`;
  }

  // --- Task Panel ---
  _bindTaskPanel() {
    document.getElementById('close-tasks').addEventListener('click', () => this.toggleTaskPanel());
    document.getElementById('create-task-btn').addEventListener('click', () => this._createTask());

    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedSize = btn.dataset.size;
      });
    });

    document.getElementById('import-file')?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          fetch('/api/import', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          }).then(r => r.json()).then(res => {
            if (res.ok) alert(`Imported ${res.tasks} tasks, ${res.blocks} block changes`);
            else alert('Import failed: ' + (res.error || 'unknown'));
          });
        } catch { alert('Invalid JSON file'); }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  toggleTaskPanel() {
    this.taskPanelOpen = !this.taskPanelOpen;
    document.getElementById('task-panel').classList.toggle('hidden', !this.taskPanelOpen);
    return this.taskPanelOpen;
  }

  _createTask() {
    const nameEl = document.getElementById('task-name');
    const descEl = document.getElementById('task-desc');
    const name = nameEl.value.trim();
    if (!name) return;
    this.cb.onTaskCreate(name, descEl.value.trim(), this.selectedSize);
    nameEl.value = '';
    descEl.value = '';
  }

  renderTaskList(tasks) {
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    for (const task of tasks) {
      const div = document.createElement('div');
      div.className = `task-item ${task.status}`;
      div.innerHTML = `
        <div class="task-item-name">${this._esc(task.name)}</div>
        <div class="task-item-meta">${task.size} &middot; ${task.status} &middot; by ${this._esc(task.createdBy)}</div>
      `;
      div.addEventListener('click', () => this.showTaskDetail(task));
      list.appendChild(div);
    }
  }

  // --- Task Detail ---
  _bindTaskDetail() {
    document.getElementById('close-detail').addEventListener('click', () => this.hideTaskDetail());
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.detailTaskId) this.cb.onTaskUpdate(this.detailTaskId, { status: btn.dataset.status });
      });
    });
    document.getElementById('delete-task-btn').addEventListener('click', () => {
      if (this.detailTaskId) {
        this.cb.onTaskDelete(this.detailTaskId);
        this.hideTaskDetail();
      }
    });
  }

  showTaskDetail(task) {
    this.detailTaskId = task.id;
    document.getElementById('detail-name').textContent = task.name;
    document.getElementById('detail-desc').textContent = task.description || '(no description)';
    document.getElementById('detail-meta').textContent = `Size: ${task.size} | Created by: ${task.createdBy}`;
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === task.status);
    });
    document.getElementById('task-detail').classList.remove('hidden');
  }

  get isTaskDetailOpen() {
    return !document.getElementById('task-detail').classList.contains('hidden');
  }

  hideTaskDetail() {
    this.detailTaskId = null;
    document.getElementById('task-detail').classList.add('hidden');
  }

  updateTaskDetail(task) {
    if (this.detailTaskId === task.id) this.showTaskDetail(task);
  }

  // --- Chat ---
  _bindChat() {
    const input = document.getElementById('chat-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const msg = input.value.trim();
        if (msg) this.cb.onChat(msg);
        input.value = '';
        this.deactivateChat();
        e.stopPropagation();
      }
      if (e.key === 'Escape') {
        this.deactivateChat();
        e.stopPropagation();
      }
    });
  }

  activateChat() {
    this.chatActive = true;
    const input = document.getElementById('chat-input');
    input.classList.add('active');
    input.focus();
  }

  deactivateChat() {
    this.chatActive = false;
    const input = document.getElementById('chat-input');
    input.classList.remove('active');
    input.blur();
  }

  addChatMessage(name, message, isSystem = false) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-msg${isSystem ? ' system' : ''}`;
    if (isSystem) {
      div.textContent = message;
    } else {
      div.innerHTML = `<span class="chat-name">${this._esc(name)}</span>: ${this._esc(message)}`;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;

    // Fade out old messages
    setTimeout(() => { div.style.opacity = '0.4'; }, 10000);
  }

  get isChatActive() { return this.chatActive; }
  get isTaskPanelOpen() { return this.taskPanelOpen; }

  isInputFocused() {
    const active = document.activeElement;
    return active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA';
  }

  _esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
}
