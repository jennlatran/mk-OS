/* ============================================================
   DATA — app catalog, roles, per-role recommendations
   ============================================================ */
const APPS = [
  { id: 'communication',    name: 'Communication',            icon: 'chat',                cat: 'Customer' },
  { id: 'payments',         name: 'Payments',                 icon: 'payments',             cat: 'Finance' },
  { id: 'mpi',              name: 'Multipoint Inspection',     icon: 'fact_check',           cat: 'Shop Floor' },
  { id: 'tech-video',       name: 'Tech Video Grader',         icon: 'video_camera_front',   cat: 'Shop Floor' },
  { id: 'video-walkaround', name: 'Video Walkaround',          icon: 'videocam',             cat: 'Customer' },
  { id: 'scheduler',        name: 'Appointment Scheduler',     icon: 'event',                cat: 'Scheduling' },
  { id: 'check-in',         name: 'Check-In',                  icon: 'how_to_reg',           cat: 'Scheduling' },
  { id: 'follow-up',        name: 'Follow Up Campaigns',       icon: 'campaign',             cat: 'Marketing' },
  { id: 'transportation',   name: 'Transportation',            icon: 'local_shipping',       cat: 'Logistics' },
  { id: 'mobile-service',   name: 'Mobile Service',            icon: 'build',                cat: 'Logistics' },
  { id: 'repair-orders',    name: 'Repair Order Queue',        icon: 'assignment',           cat: 'Shop Floor' },
  { id: 'parts-lookup',     name: 'Parts Lookup',              icon: 'inventory_2',          cat: 'Parts' },
  { id: 'parts-ordering',   name: 'Parts Ordering',            icon: 'shopping_cart',        cat: 'Parts' },
  { id: 'reporting',        name: 'Reporting & Analytics',     icon: 'bar_chart',            cat: 'Insights' },
  { id: 'team-schedule',    name: 'Team Schedule',             icon: 'groups',               cat: 'Operations' },
  { id: 'customer-directory', name: 'Customer Directory',      icon: 'contacts',             cat: 'Customer' },
];

const ROLES = [
  { id: 'service-advisor',   name: 'Service Advisor',   icon: 'support_agent' },
  { id: 'technician',        name: 'Technician',        icon: 'build_circle' },
  { id: 'parts',             name: 'Parts',             icon: 'inventory_2' },
  { id: 'channel-manager',   name: 'Channel Manager',   icon: 'hub' },
  { id: 'service-director',  name: 'Service Director',  icon: 'insights' },
];

const RECOMMENDED = {
  'service-advisor':  ['communication', 'scheduler', 'check-in', 'payments', 'follow-up', 'mpi', 'video-walkaround', 'transportation'],
  'technician':       ['mpi', 'tech-video', 'video-walkaround', 'repair-orders', 'parts-lookup'],
  'parts':            ['parts-lookup', 'parts-ordering', 'reporting', 'communication'],
  'channel-manager':  ['reporting', 'follow-up', 'communication', 'team-schedule'],
  'service-director': ['reporting', 'team-schedule', 'follow-up', 'mobile-service', 'transportation'],
};

// Rough keyword → app mapping for the "start from scratch" AI prompt (mocked, no real model).
const AI_KEYWORDS = {
  communication:      ['text', 'call', 'message', 'customer', 'chat'],
  payments:           ['pay', 'payment', 'invoice', 'charge', 'bill'],
  mpi:                ['inspect', 'multipoint', 'mpi'],
  'tech-video':       ['video grade', 'grader', 'tech video'],
  'video-walkaround':  ['walkaround', 'video', 'record'],
  scheduler:          ['schedule', 'appointment', 'book'],
  'check-in':          ['check in', 'check-in', 'checkin'],
  'follow-up':         ['follow up', 'follow-up', 'campaign', 'remind', 'entice'],
  transportation:     ['tow', 'shuttle', 'pickup', 'drop off', 'transport'],
  'mobile-service':    ['mobile', 'onsite', 'on-site', 'at home'],
  'repair-orders':     ['repair order', 'ro queue', 'queue'],
  'parts-lookup':      ['part lookup', 'find part', 'part'],
  'parts-ordering':    ['order part', 'ordering'],
  reporting:          ['report', 'analytic', 'metric', 'dashboard'],
  'team-schedule':     ['team', 'staff', 'roster', 'shift'],
  'customer-directory': ['directory', 'contact'],
};

/* ============================================================
   STATE (in-memory — resets on reload, this is a prototype)
   ============================================================ */
const state = {
  role: null,
  homeApps: [],
  editMode: false,
  scratchSelected: new Set(),
  device: 'desktop',
  managerConfig: {},        // { [roleId]: { appIds: [...], mode: 'default' | 'locked' } }
  managerEditingRoleId: null,
  managerEditSelected: new Set(),
};

function getApp(id) { return APPS.find(a => a.id === id); }
function getRole(id) { return ROLES.find(r => r.id === id); }

/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.setAttribute('hidden', ''));
  document.getElementById('screen-' + id).removeAttribute('hidden');
  const jump = document.getElementById('proto-jump-select');
  if ([...jump.options].some(o => o.value === id)) jump.value = id;
  document.getElementById('app-frame').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ============================================================
   ONBOARDING — ROLE SELECT
   ============================================================ */
function renderRoleGrid() {
  const grid = document.getElementById('role-grid');
  grid.innerHTML = ROLES.map(role => `
    <div class="role-card" data-role-id="${role.id}">
      <span class="material-icons">${role.icon}</span>
      <div class="role-card-name">${role.name}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => selectRole(card.dataset.roleId));
  });
}

function selectRole(roleId) {
  state.role = roleId;
  const role = getRole(roleId);
  document.getElementById('path-role-label').textContent = role.name;
  const preview = RECOMMENDED[roleId].map(id => `<span class="chip">${getApp(id).name}</span>`).join('');
  document.getElementById('path-recommended-preview').innerHTML = preview;
  showScreen('onboarding-path');
}

/* ============================================================
   ONBOARDING — PATH CHOICE
   ============================================================ */
function choosePathRecommended() {
  state.homeApps = [...RECOMMENDED[state.role]];
  showScreen('home');
  renderHome();
}

function choosePathScratch() {
  state.scratchSelected = new Set();
  document.getElementById('ai-prompt-input').value = '';
  document.getElementById('ai-prompt-result').setAttribute('hidden', '');
  renderScratchCatalog();
  showScreen('onboarding-scratch');
}

/* ============================================================
   CATALOG TILE RENDERING (shared by scratch builder + manager edit)
   ============================================================ */
function catalogTileHTML(app, selected) {
  return `
    <button class="catalog-tile${selected ? ' selected' : ''}" data-app-id="${app.id}">
      <span class="catalog-tile-icon material-icons">${app.icon}</span>
      <div>
        <div class="catalog-tile-name">${app.name}</div>
        <div class="catalog-tile-cat">${app.cat}</div>
      </div>
      <span class="catalog-tile-check material-icons">check_circle</span>
    </button>
  `;
}

function renderScratchCatalog() {
  const grid = document.getElementById('scratch-catalog-grid');
  grid.innerHTML = APPS.map(app => catalogTileHTML(app, state.scratchSelected.has(app.id))).join('');
  grid.querySelectorAll('.catalog-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const id = tile.dataset.appId;
      if (state.scratchSelected.has(id)) state.scratchSelected.delete(id);
      else state.scratchSelected.add(id);
      renderScratchCatalog();
    });
  });
  document.getElementById('scratch-selected-count').textContent =
    `${state.scratchSelected.size} app${state.scratchSelected.size === 1 ? '' : 's'} selected`;
}

function runAIPrompt() {
  const text = document.getElementById('ai-prompt-input').value.toLowerCase().trim();
  const resultEl = document.getElementById('ai-prompt-result');
  if (!text) {
    resultEl.hidden = true;
    return;
  }
  const matched = APPS.filter(app =>
    (AI_KEYWORDS[app.id] || []).some(kw => text.includes(kw))
  );
  const suggestions = matched.length > 0
    ? matched
    : RECOMMENDED[state.role].slice(0, 3).map(getApp);

  suggestions.forEach(app => state.scratchSelected.add(app.id));
  renderScratchCatalog();

  resultEl.hidden = false;
  resultEl.innerHTML = matched.length > 0
    ? `Based on what you described, we added: ${suggestions.map(a => `<strong>${a.name}</strong>`).join(', ')}.`
    : `We couldn't match specific apps to that, so we added a few commonly used by ${getRole(state.role).name}s: ${suggestions.map(a => `<strong>${a.name}</strong>`).join(', ')}.`;
}

function finishScratch() {
  state.homeApps = state.scratchSelected.size > 0
    ? [...state.scratchSelected]
    : [...RECOMMENDED[state.role]];
  showScreen('home');
  renderHome();
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
function renderHome() {
  const role = getRole(state.role);
  document.getElementById('home-role-icon').textContent = role.icon;
  document.getElementById('home-role-name').textContent = role.name;
  document.getElementById('home-role-sub').textContent = state.editMode ? 'Customizing your home screen' : 'Your home screen';

  const grid = document.getElementById('home-grid');
  grid.innerHTML = state.homeApps.map(id => {
    const app = getApp(id);
    return `
      <div class="app-tile" data-app-id="${app.id}">
        ${state.editMode ? `<button class="app-tile-remove" data-remove-id="${app.id}"><span class="material-icons">close</span></button>` : ''}
        <div class="app-tile-icon material-icons">${app.icon}</div>
        <div class="app-tile-name">${app.name}</div>
        <div class="app-tile-cat">${app.cat}</div>
      </div>
    `;
  }).join('');

  if (state.editMode) {
    grid.innerHTML += `
      <div class="app-tile app-tile-add" id="home-add-tile">
        <span class="material-icons">add</span>
        <div class="app-tile-name">Add app</div>
      </div>
    `;
  }

  grid.querySelectorAll('.app-tile-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.homeApps = state.homeApps.filter(id => id !== btn.dataset.removeId);
      renderHome();
    });
  });

  const addTile = document.getElementById('home-add-tile');
  if (addTile) addTile.addEventListener('click', () => toggleHomeAddCatalog());

  document.getElementById('home-edit-banner').hidden = !state.editMode;
  if (!state.editMode) document.getElementById('home-add-catalog').hidden = true;
}

function toggleHomeAddCatalog() {
  const el = document.getElementById('home-add-catalog');
  el.hidden = !el.hidden;
  if (!el.hidden) renderHomeAddCatalog();
}

function renderHomeAddCatalog() {
  const available = APPS.filter(a => !state.homeApps.includes(a.id));
  const grid = document.getElementById('home-add-catalog-grid');
  if (available.length === 0) {
    grid.innerHTML = `<p class="myk-body2">Every available app is already on your home screen.</p>`;
    return;
  }
  grid.innerHTML = available.map(app => catalogTileHTML(app, false)).join('');
  grid.querySelectorAll('.catalog-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      state.homeApps.push(tile.dataset.appId);
      renderHome();
      renderHomeAddCatalog();
    });
  });
}

function setEditMode(on) {
  state.editMode = on;
  if (!on) document.getElementById('home-add-catalog').hidden = true;
  renderHome();
}

function restartOnboarding() {
  state.role = null;
  state.homeApps = [];
  state.editMode = false;
  showScreen('onboarding-role');
}

/* ============================================================
   MANAGER / IT VIEW
   ============================================================ */
function ensureManagerConfig() {
  ROLES.forEach(role => {
    if (!state.managerConfig[role.id]) {
      state.managerConfig[role.id] = { appIds: [...RECOMMENDED[role.id]], mode: 'default' };
    }
  });
}

function renderManagerRoleList() {
  ensureManagerConfig();
  const list = document.getElementById('manager-role-list');
  list.innerHTML = ROLES.map(role => {
    const cfg = state.managerConfig[role.id];
    const isCustom = JSON.stringify(cfg.appIds) !== JSON.stringify(RECOMMENDED[role.id]);
    return `
      <div class="manager-role-row" data-role-id="${role.id}">
        <div class="manager-role-row-icon material-icons">${role.icon}</div>
        <div class="manager-role-row-body">
          <div class="manager-role-row-name">${role.name}</div>
          <div class="manager-role-row-sub">${cfg.appIds.length} apps · ${isCustom ? 'Custom view' : 'myKaarma recommended'}</div>
        </div>
        <div class="manager-role-row-actions">
          <div class="manager-mode-toggle" data-role-id="${role.id}">
            <button class="manager-mode-btn${cfg.mode === 'default' ? ' active' : ''}" data-mode="default">
              <span class="material-icons">edit</span> Editable default
            </button>
            <button class="manager-mode-btn${cfg.mode === 'locked' ? ' active' : ''}" data-mode="locked">
              <span class="material-icons">lock</span> Locked
            </button>
          </div>
          <button class="mk-button functional-mk-button manager-edit-view-btn" data-role-id="${role.id}">Edit view</button>
        </div>
      </div>
    `;
  }).join('');

  list.querySelectorAll('.manager-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const roleId = btn.closest('.manager-mode-toggle').dataset.roleId;
      state.managerConfig[roleId].mode = btn.dataset.mode;
      renderManagerRoleList();
    });
  });

  list.querySelectorAll('.manager-edit-view-btn').forEach(btn => {
    btn.addEventListener('click', () => openManagerEdit(btn.dataset.roleId));
  });
}

function openManagerEdit(roleId) {
  state.managerEditingRoleId = roleId;
  state.managerEditSelected = new Set(state.managerConfig[roleId].appIds);
  document.getElementById('manager-edit-heading').textContent = `Edit ${getRole(roleId).name} view`;
  renderManagerEditCatalog();
  showScreen('manager-edit');
}

function renderManagerEditCatalog() {
  const grid = document.getElementById('manager-edit-catalog-grid');
  grid.innerHTML = APPS.map(app => catalogTileHTML(app, state.managerEditSelected.has(app.id))).join('');
  grid.querySelectorAll('.catalog-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const id = tile.dataset.appId;
      if (state.managerEditSelected.has(id)) state.managerEditSelected.delete(id);
      else state.managerEditSelected.add(id);
      renderManagerEditCatalog();
    });
  });
  document.getElementById('manager-edit-selected-count').textContent =
    `${state.managerEditSelected.size} app${state.managerEditSelected.size === 1 ? '' : 's'} selected`;
}

function saveManagerEdit() {
  state.managerConfig[state.managerEditingRoleId].appIds = [...state.managerEditSelected];
  showScreen('manager');
  renderManagerRoleList();
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderRoleGrid();
  ensureManagerConfig();

  document.getElementById('manager-entry-link').addEventListener('click', () => {
    renderManagerRoleList();
    showScreen('manager');
  });

  document.querySelectorAll('[data-back-to]').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.backTo));
  });

  document.getElementById('path-recommended-card').addEventListener('click', choosePathRecommended);
  document.getElementById('path-scratch-card').addEventListener('click', choosePathScratch);

  document.getElementById('ai-prompt-btn').addEventListener('click', runAIPrompt);
  document.getElementById('ai-prompt-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runAIPrompt();
  });
  document.getElementById('scratch-continue-btn').addEventListener('click', finishScratch);

  document.getElementById('home-edit-btn').addEventListener('click', () => setEditMode(true));
  document.getElementById('home-edit-done-btn').addEventListener('click', () => setEditMode(false));
  document.getElementById('home-restart-btn').addEventListener('click', restartOnboarding);

  document.getElementById('manager-edit-save-btn').addEventListener('click', saveManagerEdit);

  /* Prototype toolbar */
  document.getElementById('proto-jump-select').addEventListener('change', e => {
    const target = e.target.value;
    if (target === 'home' && state.homeApps.length === 0) {
      state.role = 'service-advisor';
      state.homeApps = [...RECOMMENDED['service-advisor']];
      renderHome();
    }
    if (target === 'manager') renderManagerRoleList();
    showScreen(target);
  });

  document.querySelectorAll('.proto-device-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.proto-device-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.device = btn.dataset.device;
      document.getElementById('app-frame').dataset.device = state.device;
    });
  });

  document.getElementById('proto-reset-btn').addEventListener('click', () => location.reload());

  showScreen('onboarding-role');
}

document.addEventListener('DOMContentLoaded', init);
