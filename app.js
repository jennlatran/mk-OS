/* ============================================================
   DATA — app catalog, roles, per-role recommendations
   ============================================================ */
// pricing: 'free' | 'plan' ("Add to Plan" sends a request to sales instead of adding instantly)
// createdBy: 'myKaarma' | 'Partner' | 'You' (custom apps built via "Create Your Own App")
// label: null | 'bestseller' | 'spotlight' — a mix of install-driven ranking and myKaarma team curation
const APPS = [
  { id: 'communication',    name: 'Communication',            icon: 'chat',                cat: 'Communication', pricing: 'free', createdBy: 'myKaarma', label: 'bestseller', desc: 'Text, call, and message customers from one thread, synced to the repair order.' },
  { id: 'payments',         name: 'Payments',                 icon: 'payments',             cat: 'Payments',      pricing: 'plan', createdBy: 'myKaarma', label: 'bestseller', desc: 'Collect payment in-person, online, or by text with surcharge and split-tender support.' },
  { id: 'mpi',              name: 'Multipoint Inspection',     icon: 'fact_check',           cat: 'Inspection',    pricing: 'plan', createdBy: 'myKaarma', label: 'spotlight', desc: 'Guided digital inspections with photo/video evidence attached to every line item.' },
  { id: 'tech-video',       name: 'Tech Video Grader',         icon: 'video_camera_front',   cat: 'Inspection',    pricing: 'plan', createdBy: 'myKaarma', label: null, desc: 'Techs record a quick video grading the vehicle condition for the advisor and customer.' },
  { id: 'video-walkaround', name: 'Video Walkaround',          icon: 'videocam',             cat: 'Inspection',    pricing: 'plan', createdBy: 'myKaarma', label: null, desc: 'Send customers a personal video walkaround before they arrive or while they wait.' },
  { id: 'scheduler',        name: 'Appointment Scheduler',     icon: 'event',                cat: 'Appointments',  pricing: 'free', createdBy: 'myKaarma', label: 'bestseller', desc: 'Online and phone booking with real-time bay/tech capacity.' },
  { id: 'check-in',         name: 'Check-In',                  icon: 'how_to_reg',           cat: 'Appointments',  pricing: 'free', createdBy: 'myKaarma', label: null, desc: 'Digital check-in that pulls the appointment straight into the write-up.' },
  { id: 'follow-up',        name: 'Follow Up Campaigns',       icon: 'campaign',             cat: 'Marketing',     pricing: 'plan', createdBy: 'myKaarma', label: 'spotlight', desc: 'Automated reminders and win-back campaigns based on service history.' },
  { id: 'transportation',   name: 'Transportation',            icon: 'local_shipping',       cat: 'Logistics',     pricing: 'plan', createdBy: 'Partner', label: null, desc: 'Coordinate shuttles, loaners, and tow pickups from a live dispatch board.' },
  { id: 'mobile-service',   name: 'Mobile Service',            icon: 'build',                cat: 'Logistics',     pricing: 'plan', createdBy: 'Partner', label: null, desc: 'Dispatch a technician to the customer for on-site service and payment.' },
  { id: 'repair-orders',    name: 'Repair Order Queue',        icon: 'assignment',           cat: 'Operations',    pricing: 'free', createdBy: 'myKaarma', label: null, desc: 'A live queue of every open RO with status, tech assignment, and age.' },
  { id: 'parts-lookup',     name: 'Parts Lookup',              icon: 'inventory_2',          cat: 'Parts',         pricing: 'free', createdBy: 'myKaarma', label: null, desc: 'Cross-reference part numbers and check on-hand inventory in seconds.' },
  { id: 'parts-ordering',   name: 'Parts Ordering',            icon: 'shopping_cart',        cat: 'Parts',         pricing: 'plan', createdBy: 'myKaarma', label: null, desc: 'Order from suppliers and track incoming parts against open ROs.' },
  { id: 'reporting',        name: 'Reporting & Analytics',     icon: 'bar_chart',            cat: 'Insights',      pricing: 'plan', createdBy: 'myKaarma', label: 'spotlight', desc: 'Dashboards across payments, CSI, and technician productivity.' },
  { id: 'team-schedule',    name: 'Team Schedule',             icon: 'groups',               cat: 'Operations',    pricing: 'free', createdBy: 'myKaarma', label: null, desc: 'Shift and PTO planning for advisors, techs, and BDC reps.' },
  { id: 'customer-directory', name: 'Customer Directory',      icon: 'contacts',             cat: 'Communication', pricing: 'free', createdBy: 'myKaarma', label: null, desc: 'Every customer’s contact info, vehicles, and service history in one place.' },
];

const CATEGORIES = ['Appointments', 'Payments', 'Inspection', 'Insights', 'Communication', 'Marketing', 'Logistics', 'Operations', 'Parts'];

// Mocked list of data sources a custom app could pull from — illustrative only, no real
// integration behind this in the prototype.
const API_ENDPOINTS = [
  'Repair Orders API', 'Customer Profiles API', 'Payments API',
  'Scheduling API', 'Inspection Results API', 'Parts Inventory API', 'Messaging API',
];

const ROLES = [
  { id: 'bdc-rep',        name: 'BDC Rep',                             icon: 'headset_mic' },
  { id: 'parts-rep',      name: 'Parts Rep',                           icon: 'inventory_2' },
  { id: 'service-advisor', name: 'Service Advisor',                    icon: 'support_agent' },
  { id: 'manager-admin',  name: 'Service Manager or Dealership Admin', icon: 'admin_panel_settings' },
  { id: 'technician',     name: 'Technician',                          icon: 'build_circle' },
];

const RECOMMENDED = {
  'bdc-rep':          ['communication', 'follow-up', 'scheduler', 'check-in', 'customer-directory'],
  'parts-rep':        ['parts-lookup', 'parts-ordering', 'reporting', 'communication'],
  'service-advisor':  ['communication', 'scheduler', 'check-in', 'payments', 'follow-up', 'mpi', 'video-walkaround', 'transportation'],
  'manager-admin':    ['reporting', 'team-schedule', 'follow-up', 'communication', 'scheduler'],
  'technician':       ['mpi', 'tech-video', 'video-walkaround', 'repair-orders', 'parts-lookup'],
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

// Mocked live-data line shown on each app's dashboard widget (no backing data source).
const WIDGET_PREVIEW = {
  communication:      '3 unread messages',
  payments:           '$1,240 collected today',
  mpi:                '2 inspections pending review',
  'tech-video':        '1 video pending grading',
  'video-walkaround':  '4 walkarounds this week',
  scheduler:          '5 appointments today',
  'check-in':          '2 customers checked in',
  'follow-up':         '12 active campaigns',
  transportation:     '3 pickups scheduled',
  'mobile-service':    '1 mobile job today',
  'repair-orders':     '8 ROs in queue',
  'parts-lookup':      '6 lookups today',
  'parts-ordering':    '2 orders awaiting approval',
  reporting:          'Weekly report ready',
  'team-schedule':     '6 techs on shift today',
  'customer-directory': '1,204 customers',
};

// Richer per-app rows shown when a widget is toggled to the Large preset.
const WIDGET_DETAIL = {
  communication: [
    { label: 'Jane Smith', value: '"When will my car be ready?"' },
    { label: 'Mike Johnson', value: '"Thanks for the update!"' },
    { label: 'Aisha Patel', value: '"Can I add an oil change?"' },
  ],
  payments: [
    { label: 'RO-10198', value: '$412.50 · Paid' },
    { label: 'RO-10212', value: '$89.00 · Pending' },
    { label: 'RO-10231', value: '$1,204.00 · Paid' },
  ],
  mpi: [
    { label: 'RO-10267', value: 'Brakes flagged — needs approval' },
    { label: 'RO-10198', value: 'Passed, no issues' },
  ],
  scheduler: [
    { label: '9:00 AM', value: 'Jane Smith — Oil Change' },
    { label: '11:30 AM', value: 'Carlos Rivera — Brake Inspection' },
    { label: '2:00 PM', value: 'Aisha Patel — 30k Service' },
  ],
  'check-in': [
    { label: 'Mike Johnson', value: 'Checked in 8:45 AM' },
    { label: 'Carlos Rivera', value: 'Checked in 9:15 AM' },
  ],
  'follow-up': [
    { label: 'Win-back campaign', value: '48 customers · 12 responded' },
    { label: '6-month reminder', value: '112 customers · 30 responded' },
  ],
  transportation: [
    { label: 'Shuttle', value: '2 pickups scheduled today' },
    { label: 'Loaner', value: '1 vehicle out — due back Friday' },
  ],
  'mobile-service': [
    { label: 'Carlos Rivera', value: 'On-site oil change, 1:00 PM' },
  ],
  'repair-orders': [
    { label: 'RO-10231', value: 'Awaiting Parts' },
    { label: 'RO-10245', value: 'In Progress' },
    { label: 'RO-10198', value: 'Ready for Pickup' },
  ],
  'parts-lookup': [
    { label: 'Brake pads (Accord)', value: 'In stock — 4 units' },
    { label: 'Cabin filter (RAV4)', value: 'Backordered' },
  ],
  'parts-ordering': [
    { label: 'PO-2291', value: 'Awaiting supplier confirmation' },
  ],
  reporting: [
    { label: 'CSI this week', value: '4.7 / 5' },
    { label: 'Avg RO value', value: '$482' },
  ],
  'team-schedule': [
    { label: 'On shift today', value: '6 of 8 techs' },
  ],
  'customer-directory': [
    { label: 'Total customers', value: '1,204' },
  ],
};

/* ============================================================
   MOCK DATA — customers, ROs, notifications (for tabs + the bell)
   ============================================================ */
const MOCK_CUSTOMERS = [
  { id: 'cust-1', name: 'Jane Smith', phone: '(555) 123-4567', email: 'jane.smith@example.com' },
  { id: 'cust-2', name: 'Mike Johnson', phone: '(555) 234-5678', email: 'mike.johnson@example.com' },
  { id: 'cust-3', name: 'Aisha Patel', phone: '(555) 345-6789', email: 'aisha.patel@example.com' },
  { id: 'cust-4', name: 'Carlos Rivera', phone: '(555) 456-7890', email: 'carlos.rivera@example.com' },
];

const MOCK_ROS = [
  { id: 'ro-10231', number: 'RO-10231', customerId: 'cust-1', vehicle: '2021 Honda Accord', status: 'Awaiting Parts' },
  { id: 'ro-10245', number: 'RO-10245', customerId: 'cust-1', vehicle: '2019 Toyota RAV4', status: 'In Progress' },
  { id: 'ro-10198', number: 'RO-10198', customerId: 'cust-2', vehicle: '2020 Ford F-150', status: 'Ready for Pickup' },
  { id: 'ro-10267', number: 'RO-10267', customerId: 'cust-3', vehicle: '2022 Subaru Outback', status: 'Inspection' },
  { id: 'ro-10212', number: 'RO-10212', customerId: 'cust-4', vehicle: '2018 Chevrolet Malibu', status: 'Awaiting Approval' },
];

const NOTIF_TYPE_ICON = { vehicle: 'directions_car', customer: 'chat', internal: 'groups' };
const NOTIF_TYPE_LABELS = { vehicle: 'Vehicle Updates', customer: 'Customer Messages', internal: 'Internal' };

// resolved is mutated in place as the user resolves items — fine for a single-session prototype.
const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'vehicle', title: 'Inspection flagged an issue', detail: 'RO-10267 — brake pads worn, needs approval', actionRequired: true, targetType: 'ro', targetId: 'ro-10267', resolved: false },
  { id: 'n2', type: 'customer', title: 'Customer reply awaiting response', detail: 'Jane Smith asked about pickup time', actionRequired: true, targetType: 'customer', targetId: 'cust-1', resolved: false },
  { id: 'n3', type: 'internal', title: 'Tech tagged you', detail: 'Marcus flagged RO-10231 for your review', actionRequired: true, targetType: 'ro', targetId: 'ro-10231', resolved: false },
  { id: 'n4', type: 'vehicle', title: 'Parts arrived', detail: 'RO-10212 parts are in', actionRequired: false, targetType: 'ro', targetId: 'ro-10212', resolved: false },
  { id: 'n5', type: 'customer', title: 'Payment received', detail: 'Mike Johnson paid online', actionRequired: false, targetType: 'customer', targetId: 'cust-2', resolved: false },
];

/* ============================================================
   STATE (in-memory — resets on reload, this is a prototype)
   ============================================================ */
const state = {
  role: null,
  pendingRole: null,
  homeApps: [],
  scratchSelected: new Set(),
  device: 'desktop',
  managerConfig: {},        // { [roleId]: { appIds: [...], mode: 'default' | 'locked' } }
  managerEditingRoleId: null,
  managerEditSelected: new Set(),

  // Dashboard — tabs, widget sizes, and notification filter
  tabs: [{ id: 'overview', type: 'overview', label: 'Overview', pinned: true }],
  activeTabId: 'overview',
  widgetSizes: {},   // { [appId]: 'small' | 'large' }
  notifFilter: '',   // '' | 'vehicle' | 'customer' | 'internal'
};

function getApp(id) { return APPS.find(a => a.id === id); }
function getRole(id) { return ROLES.find(r => r.id === id); }

/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
// Screens that show step-progress dots; index = dot step.
const ONBOARDING_STEPS = ['onboarding-role', 'onboarding-path', 'onboarding-scratch'];
// The branded welcome sidebar only shows before a role is picked.
const SIDEBAR_SCREENS = ['onboarding-role'];

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.setAttribute('hidden', ''));
  document.getElementById('screen-' + id).removeAttribute('hidden');
  const jump = document.getElementById('proto-jump-select');
  if ([...jump.options].some(o => o.value === id)) jump.value = id;

  document.getElementById('onboarding-sidebar').hidden = !SIDEBAR_SCREENS.includes(id);
  const step = ONBOARDING_STEPS.indexOf(id);
  document.querySelectorAll('[data-progress-dots] .dot').forEach(dot => {
    dot.classList.toggle('active', Number(dot.dataset.step) === step);
  });

  document.getElementById('app-frame').scrollTop = 0;
  window.scrollTo(0, 0);
}

/* ============================================================
   ONBOARDING — ROLE SELECT
   ============================================================ */
function renderRoleGrid() {
  const grid = document.getElementById('role-grid');
  grid.innerHTML = ROLES.map(role => `
    <button class="role-card${role.id === state.pendingRole ? ' selected' : ''}" data-role-id="${role.id}">
      <span class="material-icons">${role.icon}</span>
      <div class="role-card-name">I'm a ${role.name}</div>
    </button>
  `).join('');
  grid.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', () => {
      state.pendingRole = card.dataset.roleId;
      grid.querySelectorAll('.role-card').forEach(c => c.classList.toggle('selected', c === card));
      document.getElementById('role-next-btn').disabled = false;
    });
  });
}

function confirmRoleSelection() {
  if (!state.pendingRole) return;
  selectRole(state.pendingRole);
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
  renderHome();
  showScreen('home');
}

function choosePathScratch() {
  state.scratchSelected = new Set();
  document.getElementById('ai-prompt-input').value = '';
  document.getElementById('ai-prompt-result').setAttribute('hidden', '');
  renderScratchSection();
  showScreen('onboarding-scratch');
}

/* ============================================================
   APP MARKETPLACE — shared "add an app" experience used by Edit Home
   Screen, the scratch builder, and Manager's "Edit view"
   ============================================================ */
function escHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

let toastTimer = null;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.getElementById('shell').appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

const MARKET_LABELS = { bestseller: 'Best Seller', spotlight: 'Spotlight' };

const marketState = { search: '', category: '', pricing: '', createdBy: '', label: '' };
const marketRequestedPlan = new Set(); // appIds already requested-to-plan this session
let marketCreateContext = null;        // which context "Create Your Own App" was opened from

// A "context" is one of the three screens that let a user add apps — each owns its own
// selection of app ids, so the marketplace just needs to know which one it's serving.
function getContextSelection(context) {
  if (context === 'home') return state.homeApps;
  if (context === 'scratch') return [...state.scratchSelected];
  if (context === 'manager-edit') return [...state.managerEditSelected];
  return [];
}

function addToContext(context, appId) {
  if (context === 'home' && !state.homeApps.includes(appId)) state.homeApps.push(appId);
  if (context === 'scratch') state.scratchSelected.add(appId);
  if (context === 'manager-edit') state.managerEditSelected.add(appId);
}

function removeFromContext(context, appId) {
  if (context === 'home') state.homeApps = state.homeApps.filter(id => id !== appId);
  if (context === 'scratch') state.scratchSelected.delete(appId);
  if (context === 'manager-edit') state.managerEditSelected.delete(appId);
}

// Re-renders both the "your apps" tile row and the marketplace for whichever
// screen owns this context — kept in one place since every add/remove touches both.
function refreshContext(context) {
  if (context === 'home') renderHome();
  if (context === 'scratch') renderScratchSection();
  if (context === 'manager-edit') renderManagerEditSection();
}

function selectedTilesHTML(context) {
  const ids = getContextSelection(context);
  if (ids.length === 0) {
    return `<p class="myk-body2 selected-tiles-empty">No apps added yet — add some from the marketplace below.</p>`;
  }
  return `<div class="app-tile-row">${ids.map(id => {
    const app = getApp(id);
    return `
      <div class="app-tile" data-app-id="${app.id}">
        <button class="app-tile-remove" data-remove-id="${app.id}"><span class="material-icons">close</span></button>
        <div class="app-tile-icon material-icons">${app.icon}</div>
        <div class="app-tile-name">${app.name}</div>
        <div class="app-tile-cat">${app.cat}</div>
      </div>
    `;
  }).join('')}</div>`;
}

function bindSelectedTiles(mountEl, context) {
  mountEl.querySelectorAll('.app-tile-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      removeFromContext(context, btn.dataset.removeId);
      refreshContext(context);
    });
  });
}

function marketActionHTML(context, app) {
  if (getContextSelection(context).includes(app.id)) {
    return `<button class="mk-button functional-mk-button market-action-btn" disabled><span class="material-icons">check</span> Added</button>`;
  }
  if (app.pricing === 'plan') {
    if (marketRequestedPlan.has(app.id)) {
      return `<button class="mk-button functional-mk-button market-action-btn" disabled><span class="material-icons">schedule</span> Requested</button>`;
    }
    return `<button class="mk-button secondary-mk-button market-action-btn market-plan-btn" data-app-id="${app.id}">Add to Plan</button>`;
  }
  return `<button class="mk-button primary-mk-button market-action-btn market-add-btn" data-app-id="${app.id}">Add</button>`;
}

function marketCardHTML(context, app) {
  return `
    <div class="market-card" data-app-id="${app.id}">
      ${app.label ? `<span class="market-badge market-badge--${app.label}">${MARKET_LABELS[app.label]}</span>` : ''}
      <div class="market-card-icon material-icons">${app.icon}</div>
      <div class="market-card-name">${escHtml(app.name)}</div>
      <div class="market-card-by">by ${escHtml(app.createdBy)}</div>
      <p class="market-card-desc">${escHtml(app.desc)}</p>
      <div class="market-card-footer">
        <span class="market-card-cat">${escHtml(app.cat)}</span>
        ${marketActionHTML(context, app)}
      </div>
    </div>
  `;
}

function filteredMarketApps() {
  const q = marketState.search.toLowerCase().trim();
  return APPS.filter(app => {
    if (q && !app.name.toLowerCase().includes(q)) return false;
    if (marketState.category && app.cat !== marketState.category) return false;
    if (marketState.pricing && app.pricing !== marketState.pricing) return false;
    if (marketState.createdBy && app.createdBy !== marketState.createdBy) return false;
    if (marketState.label && app.label !== marketState.label) return false;
    return true;
  });
}

function marketToolbarHTML() {
  const createdByOptions = [...new Set(APPS.map(a => a.createdBy))];
  return `
    <div class="market-toolbar">
      <div class="market-search">
        <span class="material-icons">search</span>
        <input type="text" class="market-search-input" placeholder="Search apps" value="${escHtml(marketState.search)}" />
      </div>
      <select class="market-filter-select" data-filter="category">
        <option value="">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}"${marketState.category === c ? ' selected' : ''}>${c}</option>`).join('')}
      </select>
      <select class="market-filter-select" data-filter="pricing">
        <option value="">All Pricing</option>
        <option value="free"${marketState.pricing === 'free' ? ' selected' : ''}>Free</option>
        <option value="plan"${marketState.pricing === 'plan' ? ' selected' : ''}>Add to Plan</option>
      </select>
      <select class="market-filter-select" data-filter="createdBy">
        <option value="">Created By: All</option>
        ${createdByOptions.map(c => `<option value="${c}"${marketState.createdBy === c ? ' selected' : ''}>${c}</option>`).join('')}
      </select>
      <select class="market-filter-select" data-filter="label">
        <option value="">All Labels</option>
        <option value="bestseller"${marketState.label === 'bestseller' ? ' selected' : ''}>Best Seller</option>
        <option value="spotlight"${marketState.label === 'spotlight' ? ' selected' : ''}>Spotlight</option>
      </select>
    </div>
  `;
}

function renderMarketplace(mountId, context) {
  const mount = document.getElementById(mountId);
  const apps = filteredMarketApps();
  mount.innerHTML = `
    ${marketToolbarHTML()}
    <div class="market-count myk-body2">Showing ${apps.length} app${apps.length === 1 ? '' : 's'}</div>
    <div class="market-grid">
      <button class="market-card market-card--create" id="market-create-card">
        <span class="material-icons">add_circle</span>
        <div class="market-card-name">Create Your Own App</div>
        <p class="market-card-desc">Build a custom app using myKaarma's APIs and data.</p>
      </button>
      ${apps.map(app => marketCardHTML(context, app)).join('')}
    </div>
  `;

  mount.querySelector('.market-search-input').addEventListener('input', e => {
    const cursorPos = e.target.selectionStart;
    marketState.search = e.target.value;
    renderMarketplace(mountId, context);
    const newInput = mount.querySelector('.market-search-input');
    newInput.focus();
    newInput.setSelectionRange(cursorPos, cursorPos);
  });
  mount.querySelectorAll('.market-filter-select').forEach(sel => {
    sel.addEventListener('change', () => {
      marketState[sel.dataset.filter] = sel.value;
      renderMarketplace(mountId, context);
    });
  });
  mount.querySelectorAll('.market-add-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      addToContext(context, btn.dataset.appId);
      refreshContext(context);
    });
  });
  mount.querySelectorAll('.market-plan-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      marketRequestedPlan.add(btn.dataset.appId);
      renderMarketplace(mountId, context);
      showToast(`Request sent to our sales team for "${getApp(btn.dataset.appId).name}".`);
    });
  });
  mount.querySelector('#market-create-card').addEventListener('click', () => openCreateAppModal(context));
}

/* ============================================================
   CREATE YOUR OWN APP
   ============================================================ */
function openCreateAppModal(context) {
  marketCreateContext = context;
  document.getElementById('create-app-name').value = '';
  document.getElementById('create-app-category').innerHTML =
    CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
  document.getElementById('create-app-endpoints').innerHTML = API_ENDPOINTS.map((ep, i) => `
    <label class="create-app-endpoint">
      <input type="checkbox" value="${escHtml(ep)}" />
      ${escHtml(ep)}
    </label>
  `).join('');
  document.getElementById('create-app-overlay').removeAttribute('hidden');
}

function closeCreateAppModal() {
  document.getElementById('create-app-overlay').setAttribute('hidden', '');
}

function submitCreateApp() {
  const name = document.getElementById('create-app-name').value.trim();
  if (!name) return;
  const category = document.getElementById('create-app-category').value;
  const endpoints = [...document.querySelectorAll('#create-app-endpoints input:checked')].map(i => i.value);
  const id = 'custom-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + (APPS.length + 1);

  APPS.push({
    id, name, icon: 'widgets', cat: category, pricing: 'free', createdBy: 'You', label: null,
    desc: endpoints.length > 0 ? `Custom app connected to ${endpoints.join(', ')}.` : 'Custom app.',
  });

  const context = marketCreateContext;
  addToContext(context, id);
  closeCreateAppModal();
  refreshContext(context);
  showToast(`"${name}" created and added.`);
}

/* ============================================================
   SCRATCH BUILDER SECTION (your apps + marketplace)
   ============================================================ */
function renderScratchSection() {
  document.getElementById('scratch-selected-tiles').innerHTML = selectedTilesHTML('scratch');
  bindSelectedTiles(document.getElementById('scratch-selected-tiles'), 'scratch');
  renderMarketplace('scratch-marketplace', 'scratch');
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
  renderScratchSection();

  resultEl.hidden = false;
  resultEl.innerHTML = matched.length > 0
    ? `Based on what you described, we added: ${suggestions.map(a => `<strong>${a.name}</strong>`).join(', ')}.`
    : `We couldn't match specific apps to that, so we added a few commonly used by ${getRole(state.role).name}s: ${suggestions.map(a => `<strong>${a.name}</strong>`).join(', ')}.`;
}

function finishScratch() {
  state.homeApps = state.scratchSelected.size > 0
    ? [...state.scratchSelected]
    : [...RECOMMENDED[state.role]];
  renderHome();
  renderDashboard();
  showScreen('dashboard');
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
// Edit Home Screen — always editable, no separate customize mode/toggle.
function renderHome() {
  const role = getRole(state.role);
  document.getElementById('home-role-icon').textContent = role.icon;
  document.getElementById('home-role-name').textContent = role.name;

  const grid = document.getElementById('home-grid');
  grid.innerHTML = state.homeApps.map(id => {
    const app = getApp(id);
    return `
      <div class="app-tile" data-app-id="${app.id}">
        <button class="app-tile-remove" data-remove-id="${app.id}"><span class="material-icons">close</span></button>
        <div class="app-tile-icon material-icons">${app.icon}</div>
        <div class="app-tile-name">${app.name}</div>
        <div class="app-tile-cat">${app.cat}</div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('.app-tile-remove').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.homeApps = state.homeApps.filter(id => id !== btn.dataset.removeId);
      renderHome();
    });
  });

  renderMarketplace('home-marketplace', 'home');
}

/* ============================================================
   DASHBOARD — the actual landing screen
   ============================================================ */
function renderDashboard() {
  const role = getRole(state.role);
  document.getElementById('dashboard-role-icon').textContent = role.icon;
  document.getElementById('dashboard-role-name').textContent = role.name;
  document.getElementById('dashboard-manage-views-btn').hidden = state.role !== 'manager-admin';
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
  renderDashboardTabContent();
}

/* ---- Tabs (Chrome-style: Overview + Customer/RO tabs, pin to persist) ---- */
function persistPinnedTabs() {
  const pinned = state.tabs.filter(t => t.pinned && t.type !== 'overview');
  localStorage.setItem('mkos-pinned-tabs', JSON.stringify(pinned));
}

function loadPinnedTabs() {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('mkos-pinned-tabs') || '[]'); } catch (e) { saved = []; }
  saved.forEach(t => {
    if (!state.tabs.find(x => x.id === t.id)) state.tabs.push(t);
  });
}

// Opens a tab for this customer/RO, or focuses it if already open — never duplicates.
function openTab(type, targetId, label) {
  const existing = state.tabs.find(t => t.type === type && t.targetId === targetId);
  if (existing) {
    state.activeTabId = existing.id;
  } else {
    const tab = { id: `${type}-${targetId}`, type, targetId, label, pinned: false };
    state.tabs.push(tab);
    state.activeTabId = tab.id;
  }
  renderDashboard();
}

function setActiveTab(tabId) {
  state.activeTabId = tabId;
  renderDashboard();
}

function closeTab(tabId) {
  const tab = state.tabs.find(t => t.id === tabId);
  if (!tab || tab.type === 'overview') return;
  state.tabs = state.tabs.filter(t => t.id !== tabId);
  if (state.activeTabId === tabId) state.activeTabId = 'overview';
  persistPinnedTabs();
  renderDashboard();
}

function togglePinTab(tabId) {
  const tab = state.tabs.find(t => t.id === tabId);
  if (!tab || tab.type === 'overview') return;
  tab.pinned = !tab.pinned;
  persistPinnedTabs();
  renderDashboard();
}

function renderTabStrip() {
  const strip = document.getElementById('dashboard-tab-strip');
  const overview = state.tabs.find(t => t.type === 'overview');
  const pinned = state.tabs.filter(t => t.type !== 'overview' && t.pinned);
  const unpinned = state.tabs.filter(t => t.type !== 'overview' && !t.pinned);
  const ordered = [overview, ...pinned, ...unpinned];

  strip.innerHTML = ordered.map(tab => {
    const active = tab.id === state.activeTabId;
    if (tab.type === 'overview') {
      return `<button class="dash-tab dash-tab--overview${active ? ' active' : ''}" data-tab-id="overview">
        <span class="material-icons">home</span> Overview
      </button>`;
    }
    const typeIcon = tab.type === 'customer' ? 'person' : 'directions_car';
    return `<div class="dash-tab${active ? ' active' : ''}${tab.pinned ? ' pinned' : ''}" data-tab-id="${tab.id}">
      <span class="material-icons dash-tab-type-icon">${typeIcon}</span>
      ${tab.pinned ? '' : `<span class="dash-tab-label">${escHtml(tab.label)}</span>`}
      <button class="dash-tab-pin-btn${tab.pinned ? ' pinned' : ''}" data-tab-id="${tab.id}" title="${tab.pinned ? 'Unpin' : 'Pin'} tab">
        <span class="material-icons">push_pin</span>
      </button>
      ${tab.pinned ? '' : `<button class="dash-tab-close-btn" data-tab-id="${tab.id}" title="Close tab"><span class="material-icons">close</span></button>`}
    </div>`;
  }).join('');

  strip.querySelectorAll('.dash-tab, .dash-tab--overview').forEach(el => {
    el.addEventListener('click', () => setActiveTab(el.dataset.tabId));
  });
  strip.querySelectorAll('.dash-tab-pin-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); togglePinTab(btn.dataset.tabId); });
  });
  strip.querySelectorAll('.dash-tab-close-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); closeTab(btn.dataset.tabId); });
  });
}

/* ---- Tab content: Overview (widget grid), Customer, RO ---- */
function renderDashboardTabContent() {
  const container = document.getElementById('dashboard-tab-content');
  const tab = state.tabs.find(t => t.id === state.activeTabId) || state.tabs[0];

  if (tab.type === 'customer') { container.innerHTML = customerTabContentHTML(tab.targetId); bindTabContentLinks(container); return; }
  if (tab.type === 'ro') { container.innerHTML = roTabContentHTML(tab.targetId); bindTabContentLinks(container); return; }

  container.innerHTML = overviewHTML();
  bindOverviewEvents(container);
}

function loadWidgetSizes() {
  try { state.widgetSizes = JSON.parse(localStorage.getItem('mkos-widget-sizes') || '{}'); } catch (e) { state.widgetSizes = {}; }
}

function setWidgetSize(appId, size) {
  state.widgetSizes[appId] = size;
  localStorage.setItem('mkos-widget-sizes', JSON.stringify(state.widgetSizes));
  renderDashboardTabContent();
}

function widgetCardHTML(app) {
  const size = state.widgetSizes[app.id] || 'small';
  const detail = WIDGET_DETAIL[app.id];
  const body = (size === 'large' && detail)
    ? `<div class="dash-widget-table">${detail.map(row => `
        <div class="dash-widget-row"><span>${escHtml(row.label)}</span><span>${escHtml(row.value)}</span></div>
      `).join('')}</div>`
    : `<div class="dash-widget-stat">${escHtml(WIDGET_PREVIEW[app.id] || `Open ${app.name}`)}</div>`;

  return `
    <div class="dash-widget dash-widget--${size}" data-app-id="${app.id}">
      <div class="dash-widget-header">
        <div class="dash-widget-icon material-icons">${app.icon}</div>
        <div class="dash-widget-name">${escHtml(app.name)}</div>
        <button class="dash-widget-size-btn" data-app-id="${app.id}" title="${size === 'large' ? 'Shrink' : 'Expand'} widget">
          <span class="material-icons">${size === 'large' ? 'close_fullscreen' : 'open_in_full'}</span>
        </button>
      </div>
      ${body}
    </div>
  `;
}

function overviewHTML() {
  if (state.homeApps.length === 0) {
    return `<div class="dashboard-placeholder">
      <span class="material-icons">dashboard</span>
      <div class="dashboard-placeholder-title">No apps yet</div>
      <p class="myk-body2">Add apps from Edit Home Screen to see them here.</p>
    </div>`;
  }
  return `<div class="dash-widget-grid">${state.homeApps.map(id => widgetCardHTML(getApp(id))).join('')}</div>`;
}

function bindOverviewEvents(container) {
  container.querySelectorAll('.dash-widget-size-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const appId = btn.dataset.appId;
      const current = state.widgetSizes[appId] || 'small';
      setWidgetSize(appId, current === 'large' ? 'small' : 'large');
    });
  });
}

function customerTabContentHTML(custId) {
  const cust = MOCK_CUSTOMERS.find(c => c.id === custId);
  if (!cust) return `<p class="myk-body2">Customer not found.</p>`;
  const ros = MOCK_ROS.filter(r => r.customerId === custId);
  return `
    <div class="tab-content-stub">
      <h2 class="myk-h6">${escHtml(cust.name)}</h2>
      <p class="myk-body2">${escHtml(cust.phone)} · ${escHtml(cust.email)}</p>
      <div class="myk-subtitle1 tab-stub-section-label">Vehicles &amp; ROs</div>
      <div class="tab-ro-list">
        ${ros.length > 0 ? ros.map(r => `
          <button class="tab-ro-row" data-ro-id="${r.id}">
            <span class="material-icons">directions_car</span>
            <span class="tab-ro-row-label">${escHtml(r.vehicle)} — ${escHtml(r.number)}</span>
            <span class="tab-ro-status">${escHtml(r.status)}</span>
          </button>
        `).join('') : `<p class="myk-body2">No open ROs.</p>`}
      </div>
      <p class="tab-stub-note myk-body2">Full customer view design is TBD — this is a functional placeholder so tabs and cross-linking can be demoed.</p>
    </div>
  `;
}

function roTabContentHTML(roId) {
  const ro = MOCK_ROS.find(r => r.id === roId);
  if (!ro) return `<p class="myk-body2">RO not found.</p>`;
  const cust = MOCK_CUSTOMERS.find(c => c.id === ro.customerId);
  return `
    <div class="tab-content-stub">
      <h2 class="myk-h6">${escHtml(ro.number)} — ${escHtml(ro.vehicle)}</h2>
      <p class="myk-body2">Status: ${escHtml(ro.status)}</p>
      <button class="tab-customer-link" data-customer-id="${cust.id}">
        <span class="material-icons">person</span> ${escHtml(cust.name)}
      </button>
      <p class="tab-stub-note myk-body2">Full RO detail view design is TBD — this is a functional placeholder so tabs and cross-linking can be demoed.</p>
    </div>
  `;
}

function bindTabContentLinks(container) {
  container.querySelectorAll('.tab-ro-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const ro = MOCK_ROS.find(r => r.id === btn.dataset.roId);
      openTab('ro', ro.id, `${ro.number} · ${ro.vehicle}`);
    });
  });
  container.querySelectorAll('.tab-customer-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const cust = MOCK_CUSTOMERS.find(c => c.id === btn.dataset.customerId);
      openTab('customer', cust.id, cust.name);
    });
  });
}

/* ---- Notification bell ---- */
function unresolvedNotifications() {
  return MOCK_NOTIFICATIONS.filter(n => !n.resolved);
}

function actionRequiredCount() {
  return unresolvedNotifications().filter(n => n.actionRequired).length;
}

function renderNotifBell() {
  const badge = document.getElementById('dashboard-bell-badge');
  const count = actionRequiredCount();
  if (count > 0) {
    badge.textContent = String(count);
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

function notifItemHTML(n) {
  return `
    <div class="notif-item${n.actionRequired ? ' notif-item--action' : ''}" data-notif-id="${n.id}">
      <span class="material-icons notif-item-icon">${NOTIF_TYPE_ICON[n.type]}</span>
      <div class="notif-item-body">
        <div class="notif-item-title">${escHtml(n.title)}</div>
        <div class="notif-item-detail">${escHtml(n.detail)}</div>
      </div>
      ${n.actionRequired ? `<button class="mk-button functional-mk-button notif-resolve-btn" data-notif-id="${n.id}">Resolve</button>` : ''}
    </div>
  `;
}

function renderNotifPanel() {
  const filterRow = document.getElementById('dashboard-notif-filter');
  const filters = [{ key: '', label: 'All' }, ...Object.entries(NOTIF_TYPE_LABELS).map(([key, label]) => ({ key, label }))];
  filterRow.innerHTML = filters.map(f => `
    <button class="notif-filter-btn${state.notifFilter === f.key ? ' active' : ''}" data-filter="${f.key}">${f.label}</button>
  `).join('');
  filterRow.querySelectorAll('.notif-filter-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      state.notifFilter = btn.dataset.filter;
      renderNotifPanel();
    });
  });

  const list = document.getElementById('dashboard-notif-list');
  const items = unresolvedNotifications().filter(n => !state.notifFilter || n.type === state.notifFilter);
  list.innerHTML = items.length > 0
    ? items.map(notifItemHTML).join('')
    : `<p class="myk-body2 notif-empty">Nothing here.</p>`;

  list.querySelectorAll('.notif-item').forEach(el => {
    el.addEventListener('click', () => openNotificationTarget(el.dataset.notifId));
  });
  list.querySelectorAll('.notif-resolve-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      resolveNotification(btn.dataset.notifId);
    });
  });
}

function resolveNotification(notifId) {
  const n = MOCK_NOTIFICATIONS.find(x => x.id === notifId);
  if (n) n.resolved = true;
  renderNotifBell();
  renderNotifPanel();
}

function openNotificationTarget(notifId) {
  const n = MOCK_NOTIFICATIONS.find(x => x.id === notifId);
  if (!n) return;
  if (n.targetType === 'customer') {
    const cust = MOCK_CUSTOMERS.find(c => c.id === n.targetId);
    openTab('customer', cust.id, cust.name);
  } else {
    const ro = MOCK_ROS.find(r => r.id === n.targetId);
    openTab('ro', ro.id, `${ro.number} · ${ro.vehicle}`);
  }
  toggleNotifPanel(false);
}

function toggleNotifPanel(show) {
  const panel = document.getElementById('dashboard-notif-panel');
  panel.hidden = show === undefined ? !panel.hidden : !show;
}

/* ---- Global search (customers / ROs / apps) ---- */
function renderSearchResults(query) {
  const results = document.getElementById('dashboard-search-results');
  const q = query.trim().toLowerCase();
  if (!q) { results.hidden = true; results.innerHTML = ''; return; }

  const customers = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(query.trim()) || c.email.toLowerCase().includes(q)).slice(0, 5);
  const ros = MOCK_ROS.filter(r => r.number.toLowerCase().includes(q)).slice(0, 5);
  const apps = APPS.filter(a => a.name.toLowerCase().includes(q)).slice(0, 5);

  if (customers.length === 0 && ros.length === 0 && apps.length === 0) {
    results.innerHTML = `<div class="dash-search-empty myk-body2">No results for "${escHtml(query)}"</div>`;
    results.hidden = false;
    return;
  }

  const group = (label, rows) => rows.length === 0 ? '' : `
    <div class="dash-search-group">
      <div class="dash-search-group-label">${label}</div>
      ${rows}
    </div>`;

  results.innerHTML =
    group('Customers', customers.map(c => `
      <button class="dash-search-result" data-kind="customer" data-id="${c.id}">
        <span class="material-icons">person</span>${escHtml(c.name)}
        <span class="dash-search-result-sub">${escHtml(c.phone)}</span>
      </button>`).join('')) +
    group('Repair Orders', ros.map(r => `
      <button class="dash-search-result" data-kind="ro" data-id="${r.id}">
        <span class="material-icons">directions_car</span>${escHtml(r.number)}
        <span class="dash-search-result-sub">${escHtml(r.vehicle)}</span>
      </button>`).join('')) +
    group('Apps', apps.map(a => `
      <button class="dash-search-result" data-kind="app" data-id="${a.id}">
        <span class="material-icons">${a.icon}</span>${escHtml(a.name)}
      </button>`).join(''));

  results.hidden = false;
  results.querySelectorAll('.dash-search-result').forEach(btn => {
    btn.addEventListener('click', () => handleSearchResultClick(btn.dataset.kind, btn.dataset.id));
  });
}

function handleSearchResultClick(kind, id) {
  if (kind === 'customer') {
    const c = MOCK_CUSTOMERS.find(x => x.id === id);
    openTab('customer', c.id, c.name);
  } else if (kind === 'ro') {
    const r = MOCK_ROS.find(x => x.id === id);
    openTab('ro', r.id, `${r.number} · ${r.vehicle}`);
  } else if (kind === 'app') {
    focusOverviewWidget(id);
  }
  document.getElementById('dashboard-search-input').value = '';
  document.getElementById('dashboard-search-results').hidden = true;
}

function focusOverviewWidget(appId) {
  setActiveTab('overview');
  setTimeout(() => {
    const el = document.querySelector(`.dash-widget[data-app-id="${appId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 1200);
    } else {
      showToast(`Add "${getApp(appId).name}" to your home screen to see it here.`);
    }
  }, 50);
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
  renderManagerEditSection();
  showScreen('manager-edit');
}

function renderManagerEditSection() {
  document.getElementById('manager-edit-selected-tiles').innerHTML = selectedTilesHTML('manager-edit');
  bindSelectedTiles(document.getElementById('manager-edit-selected-tiles'), 'manager-edit');
  renderMarketplace('manager-edit-marketplace', 'manager-edit');
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
  loadPinnedTabs();
  loadWidgetSizes();

  document.getElementById('role-next-btn').addEventListener('click', confirmRoleSelection);

  document.getElementById('dashboard-manage-views-btn').addEventListener('click', () => {
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

  document.getElementById('home-to-dashboard-btn').addEventListener('click', () => {
    renderDashboard();
    showScreen('dashboard');
  });
  document.getElementById('dashboard-edit-home-btn').addEventListener('click', () => {
    renderHome();
    showScreen('home');
  });

  document.getElementById('manager-edit-save-btn').addEventListener('click', saveManagerEdit);

  document.getElementById('create-app-cancel-btn').addEventListener('click', closeCreateAppModal);
  document.getElementById('create-app-submit-btn').addEventListener('click', submitCreateApp);
  document.getElementById('create-app-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('create-app-overlay')) closeCreateAppModal();
  });

  document.getElementById('dashboard-bell-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleNotifPanel();
  });
  document.getElementById('dashboard-search-input').addEventListener('input', e => {
    renderSearchResults(e.target.value);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.notif-bell-wrap')) toggleNotifPanel(false);
    if (!e.target.closest('.dash-search')) {
      document.getElementById('dashboard-search-results').hidden = true;
    }
  });

  /* Prototype toolbar */
  document.getElementById('proto-jump-select').addEventListener('change', e => {
    const target = e.target.value;
    if ((target === 'home' || target === 'dashboard') && state.homeApps.length === 0) {
      state.role = 'service-advisor';
      state.homeApps = [...RECOMMENDED['service-advisor']];
    }
    if (target === 'home') renderHome();
    if (target === 'dashboard') renderDashboard();
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
