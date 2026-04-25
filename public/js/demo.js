// Cinematic demo mode: scripted camera flythrough with title cards.
// Activated by ?demo=1 in the URL or by calling demo.start() from console.
// Auto-discovers task positions in the world; falls back to hardcoded waypoints.
import * as THREE from 'three';

// Smoothstep / ease-in-out
const ease = (t) => t * t * (3 - 2 * t);

function lerpVec(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export class Demo {
  constructor(camera, taskManager) {
    this.camera = camera;
    this.taskManager = taskManager;
    this.active = false;
    this.t = 0;        // elapsed seconds since start
    this.script = null;
    this.titleEl = null;
    this._setupOverlay();
  }

  _setupOverlay() {
    const ov = document.createElement('div');
    ov.id = 'demo-overlay';
    ov.innerHTML = `
      <div id="demo-prestart">Press <kbd>Space</kbd> to start the demo</div>
      <div id="demo-title-wrap">
        <div id="demo-main"></div>
        <div id="demo-sub"></div>
      </div>
      <div id="demo-end">github.com/loathwine/craftplan</div>
    `;
    document.body.appendChild(ov);
    this.titleEl = {
      pre: document.getElementById('demo-prestart'),
      main: document.getElementById('demo-main'),
      sub: document.getElementById('demo-sub'),
      end: document.getElementById('demo-end'),
      wrap: document.getElementById('demo-title-wrap'),
    };
  }

  arm() {
    this.active = false;
    this._showWaiting();
    document.body.classList.add('demo-mode');
  }

  start() {
    if (!this.script) this.script = this._buildScript();
    this.active = true;
    this.t = 0;
    this.titleEl.pre.style.opacity = 0;
    this.titleEl.end.style.opacity = 0;
  }

  stop() {
    this.active = false;
    this.titleEl.wrap.style.opacity = 0;
    this.titleEl.pre.style.opacity = 0;
    this.titleEl.end.style.opacity = 0;
    document.body.classList.remove('demo-mode');
  }

  _showWaiting() {
    this.titleEl.pre.style.opacity = 1;
    this.titleEl.wrap.style.opacity = 0;
    this.titleEl.end.style.opacity = 0;
  }

  // Build script from world contents + hardcoded waypoints
  _buildScript() {
    const tasks = this.taskManager.getTasks();
    // Sort tasks: prefer those with structure, then by size descending
    const ranked = [...tasks].sort((a, b) => {
      const aHas = a.structure?.length ? 1 : 0;
      const bHas = b.structure?.length ? 1 : 0;
      if (aHas !== bHas) return bHas - aHas;
      const order = { XL: 4, L: 3, M: 2, S: 1 };
      return (order[b.size] || 0) - (order[a.size] || 0);
    });
    const featured = ranked.slice(0, 4);

    // World center (256x256)
    const C = [128, 30, 128];

    // Get a good "look at" for a task
    const taskCenter = (t) => {
      const e = t.extents || { cx: 1, cz: 1, height: 5 };
      return [t.position.x + e.cx, t.baseY + e.height / 2, t.position.z + e.cz];
    };

    // Camera position: hover on the south side of a task, slightly elevated
    const taskCam = (t, offset = 12, height = 4) => {
      const c = taskCenter(t);
      return [c[0] + offset * Math.cos(t.id ? hashAngle(t.id) : 0),
              c[1] + height,
              c[2] + offset * Math.sin(t.id ? hashAngle(t.id) : 0)];
    };

    // Orbit camera around a task
    const orbit = (t, t0, dur, radius = 11, height = 4) => {
      const c = taskCenter(t);
      const startA = hashAngle(t.id || 'a');
      return Array.from({ length: 5 }, (_, i) => {
        const f = i / 4;
        const a = startA + f * Math.PI * 1.4;
        return {
          t: t0 + dur * f,
          pos: [c[0] + radius * Math.cos(a), c[1] + height, c[2] + radius * Math.sin(a)],
          look: c,
        };
      });
    };

    const w = []; // waypoints
    let now = 0;

    // 1. Opening: high wide shot
    w.push({ t: now, pos: [C[0], 90, C[2] + 90], look: C, title: { main: 'CraftPlan', sub: 'Project planning in a multiplayer voxel world' } });
    now += 4;
    w.push({ t: now, pos: [C[0] - 60, 70, C[2] + 70], look: C });
    now += 4;
    // 2. Glide low over biomes
    w.push({ t: now, pos: [C[0] - 30, 35, C[2] + 30], look: C, title: { main: 'Procedural terrain', sub: 'Plains, forest, desert, taiga, mountain caps' } });
    now += 5;
    // 3. Approach the first task
    if (featured[0]) {
      const t1 = featured[0];
      const c1 = taskCenter(t1);
      w.push({ t: now, pos: [c1[0] + 25, c1[1] + 18, c1[2] + 25], look: c1, title: { main: 'Tasks become 3D structures', sub: 'Size, status, position - all visible' } });
      now += 3;
      w.push(...orbit(t1, now, 8, 11, 4));
      now += 8;
    }
    // 4. Feature an AI-designed task structure
    const aiTask = featured.find(t => t.structure?.length);
    if (aiTask) {
      const c2 = taskCenter(aiTask);
      w.push({ t: now, pos: [c2[0] + 14, c2[1] + 6, c2[2] + 14], look: c2, title: { main: 'AI-designed structures', sub: 'Each task gets a unique building from its description' } });
      now += 3;
      w.push(...orbit(aiTask, now, 8, 9, 3));
      now += 8;
    }
    // 5. Fly through a cluster of tasks
    if (featured[2]) {
      const t3 = featured[2];
      const c3 = taskCenter(t3);
      w.push({ t: now, pos: [c3[0] - 15, c3[1] + 10, c3[2] - 15], look: c3, title: { main: 'Import from JIRA', sub: 'Your backlog materializes as a town' } });
      now += 4;
      w.push({ t: now, pos: [c3[0] + 10, c3[1] + 8, c3[2] + 10], look: c3 });
      now += 4;
    }
    // 6. Bot mention
    w.push({ t: now, pos: [C[0] + 30, 45, C[2] + 30], look: C, title: { main: 'Watch Claude build', sub: '@Claude build a dragon, here' } });
    now += 5;
    // 7. Final pull-back
    w.push({ t: now, pos: [C[0] - 40, 60, C[2] - 60], look: C, title: { main: 'Multiplayer · Open source · ~2500 LOC', sub: 'Fly mode, AI bots, JIRA, persistence' } });
    now += 5;
    w.push({ t: now, pos: [C[0], 110, C[2] + 110], look: C, end: true });
    now += 5;

    return { waypoints: w, duration: now };
  }

  update(dt) {
    if (!this.active) return false;
    this.t += dt;
    const s = this.script;
    if (!s) return false;
    if (this.t >= s.duration) {
      this.titleEl.wrap.style.opacity = 0;
      this.titleEl.end.style.opacity = 1;
      if (this.t > s.duration + 4) this.stop();
      return true;
    }

    // Find the bracket of waypoints around current t
    const wps = s.waypoints;
    let i = 0;
    for (; i < wps.length - 1; i++) {
      if (wps[i + 1].t > this.t) break;
    }
    const a = wps[i];
    const b = wps[Math.min(i + 1, wps.length - 1)];
    const span = Math.max(0.001, b.t - a.t);
    const f = ease(Math.min(1, Math.max(0, (this.t - a.t) / span)));

    const pos = lerpVec(a.pos, b.pos, f);
    const look = lerpVec(a.look, b.look, f);

    this.camera.position.set(pos[0], pos[1], pos[2]);
    this.camera.lookAt(look[0], look[1], look[2]);

    // Title cards: show the most recent waypoint title for ~3.5s
    let activeTitle = null;
    for (let j = wps.length - 1; j >= 0; j--) {
      if (wps[j].title && this.t >= wps[j].t) {
        const age = this.t - wps[j].t;
        if (age <= 4.5) activeTitle = { ...wps[j].title, age };
        break;
      }
    }
    if (activeTitle) {
      this.titleEl.main.textContent = activeTitle.main || '';
      this.titleEl.sub.textContent = activeTitle.sub || '';
      // Fade in 0.3s, hold to 3.7s, fade out by 4.5s
      const op = activeTitle.age < 0.3 ? activeTitle.age / 0.3
        : activeTitle.age < 3.7 ? 1
        : Math.max(0, 1 - (activeTitle.age - 3.7) / 0.8);
      this.titleEl.wrap.style.opacity = op;
    } else {
      this.titleEl.wrap.style.opacity = 0;
    }

    return true; // demo is driving the camera
  }
}

// Stable hash → angle in radians
function hashAngle(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return ((h >>> 0) % 6283) / 1000; // 0..2π-ish
}
