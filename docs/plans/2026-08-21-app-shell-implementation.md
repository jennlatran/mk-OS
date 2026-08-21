# mkOS Phase 1 App Shell Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Replace the Overview widget-grid dashboard with a left product-nav rail (collapsed/expanded/hover modes) whose selected product renders a full data table in the main area, independent of an existing Chrome-style tab strip used only for customer/RO detail records, plus a single-instance "more details" slide-in drawer.

**Architecture:** Refactor `app.js`/`index.html`/`styles.css` in place — no new files, no build step (matches existing prototype conventions). `state.homeApps` is renamed to `state.navProducts` and reused by the existing marketplace/manager-lock code; `state.tabs`/`state.activeTabId` lose their seeded "overview" tab and become purely record-detail state; a new `renderProductTable()` becomes the base surface shown whenever no tab is focused.

**Tech Stack:** Vanilla HTML/CSS/JS, `localStorage` for persisted prefs, Material Icons, no test framework — verification is manual (open `index.html` in a browser and click through each behavior called out per task).

**Note on "tests" in this plan:** this repo has no automated test suite (it's a clickable prototype). Every task's verification step is a manual browser check instead of a unit test — do them in order, since later tasks assume earlier ones render correctly.

---

### Task 1: Add per-product table mock data

**Files:**
- Modify: `app.js` (insert after the `WIDGET_DETAIL` block, i.e. after line 151)

**Step 1: Add the `PRODUCT_TABLES` data object**

Each entry has `columns` (array of header strings) and a `rows(state)` function returning row objects: `{ cells: [...], linkType: 'customer'|'ro'|null, linkId }`. `linkType: null` rows aren't clickable (no customer/RO record backs them).

```js
// Per-product table shown on the base surface (left-nav selection) when no tab is
// focused. rows() returns { cells, linkType, linkId } — linkType null means the row
// has no backing customer/RO record, so it isn't clickable.
function custName(id) { return MOCK_CUSTOMERS.find(c => c.id === id).name; }

const PRODUCT_TABLES = {
  scheduler: {
    columns: ['Customer', 'Vehicle', 'Service', 'Date', 'Status'],
    rows: () => MOCK_APPOINTMENTS.map(a => ({
      cells: [custName(a.customerId), a.vehicle, a.service, a.date, a.upcoming ? 'Upcoming' : 'Completed'],
      linkType: 'customer', linkId: a.customerId,
    })),
  },
  'check-in': {
    columns: ['Customer', 'Vehicle', 'Checked In'],
    rows: () => MOCK_APPOINTMENTS.filter(a => a.upcoming).map(a => ({
      cells: [custName(a.customerId), a.vehicle, a.date],
      linkType: 'customer', linkId: a.customerId,
    })),
  },
  mpi: {
    columns: ['RO', 'Customer', 'Vehicle', 'Date', 'Status'],
    rows: () => MOCK_INSPECTIONS.map(i => {
      const ro = MOCK_ROS.find(r => r.customerId === i.customerId);
      return { cells: [ro ? ro.number : '—', custName(i.customerId), i.vehicle, i.date, i.status], linkType: 'customer', linkId: i.customerId };
    }),
  },
  'tech-video': {
    columns: ['Customer', 'Vehicle', 'Status'],
    rows: () => MOCK_INSPECTIONS.map(i => ({
      cells: [custName(i.customerId), i.vehicle, i.status.includes('flagged') ? 'Needs grading' : 'Graded'],
      linkType: 'customer', linkId: i.customerId,
    })),
  },
  'video-walkaround': {
    columns: ['Customer', 'Vehicle', 'Sent'],
    rows: () => MOCK_INSPECTIONS.map(i => ({
      cells: [custName(i.customerId), i.vehicle, i.date],
      linkType: 'customer', linkId: i.customerId,
    })),
  },
  payments: {
    columns: ['Invoice', 'Customer', 'RO', 'Amount', 'Status'],
    rows: () => MOCK_INVOICES.map(inv => ({
      cells: [inv.id.toUpperCase(), custName(inv.customerId), inv.roNumber, `$${inv.amount.toFixed(2)}`, inv.status],
      linkType: 'customer', linkId: inv.customerId,
    })),
  },
  'repair-orders': {
    columns: ['RO', 'Customer', 'Vehicle', 'Status'],
    rows: () => MOCK_ROS.map(r => ({
      cells: [r.number, custName(r.customerId), r.vehicle, r.status],
      linkType: 'ro', linkId: r.id,
    })),
  },
  communication: {
    columns: ['Customer', 'Last Message'],
    rows: () => WIDGET_DETAIL.communication.map(row => {
      const cust = MOCK_CUSTOMERS.find(c => c.name === row.label);
      return { cells: [row.label, row.value], linkType: cust ? 'customer' : null, linkId: cust ? cust.id : null };
    }),
  },
  'follow-up': {
    columns: ['Campaign', 'Detail'],
    rows: () => WIDGET_DETAIL['follow-up'].map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  transportation: {
    columns: ['Type', 'Detail'],
    rows: () => WIDGET_DETAIL.transportation.map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  'mobile-service': {
    columns: ['Customer', 'Detail'],
    rows: () => WIDGET_DETAIL['mobile-service'].map(row => {
      const cust = MOCK_CUSTOMERS.find(c => c.name === row.label);
      return { cells: [row.label, row.value], linkType: cust ? 'customer' : null, linkId: cust ? cust.id : null };
    }),
  },
  'parts-lookup': {
    columns: ['Part', 'Availability'],
    rows: () => WIDGET_DETAIL['parts-lookup'].map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  'parts-ordering': {
    columns: ['Order', 'Status'],
    rows: () => WIDGET_DETAIL['parts-ordering'].map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  reporting: {
    columns: ['Metric', 'Value'],
    rows: () => WIDGET_DETAIL.reporting.map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  'team-schedule': {
    columns: ['Metric', 'Value'],
    rows: () => WIDGET_DETAIL['team-schedule'].map(row => ({ cells: [row.label, row.value], linkType: null, linkId: null })),
  },
  'customer-directory': {
    columns: ['Customer', 'Phone', 'Email'],
    rows: () => MOCK_CUSTOMERS.map(c => ({ cells: [c.name, c.phone, c.email], linkType: 'customer', linkId: c.id })),
  },
};

// Fallback for any app without a PRODUCT_TABLES entry (e.g. a custom app created
// via "Create Your Own App") — an empty-state table rather than a missing render.
function productTableFor(appId) {
  return PRODUCT_TABLES[appId] || { columns: ['Detail'], rows: () => [] };
}
```

**Step 2: Manual check**

Open the browser console on `index.html` and run `productTableFor('scheduler').rows()` — should log 6 row objects with `linkType: 'customer'`. No code depends on this yet, so nothing renders differently.

**Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add per-product mocked table data for base surface"
```

---

### Task 2: Rename `homeApps` → `navProducts`, add nav-mode and selected-product state

**Files:**
- Modify: `app.js` (state object at line 224, and every reference to `state.homeApps`)

**Step 1: Update the state object**

Replace:
```js
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
```
with:
```js
const state = {
  role: null,
  pendingRole: null,
  navProducts: [],   // was homeApps — same marketplace/manager-lock mechanism, now a nav list
  scratchSelected: new Set(),
  device: 'desktop',
  managerConfig: {},        // { [roleId]: { appIds: [...], mode: 'default' | 'locked' } }
  managerEditingRoleId: null,
  managerEditSelected: new Set(),

  // Dashboard — nav rail, tabs, widget sizes, and notification filter
  navMode: 'expanded',   // 'collapsed' | 'expanded' | 'hover'
  selectedProduct: null, // appId shown on the base surface; not persisted, resets on reload
  tabs: [],               // record-detail tabs only — no seeded "overview" tab
  activeTabId: null,      // null = show selectedProduct's table; else a tab id
  widgetSizes: {},   // { [appId]: 'small' | 'large' }
  notifFilter: '',   // '' | 'vehicle' | 'customer' | 'internal'
};
```

**Step 2: Rename every remaining reference**

Run a search-and-replace of the whole-word identifier `homeApps` → `navProducts` across `app.js`. This touches (verify each after renaming): `choosePathMykRecommended`, `choosePathDealerRecommended`, `finishScratch`, `getContextSelection`, `addToContext`, `removeFromContext`, `renderHome`, `overviewHTML`/`widgetCardHTML` call sites (removed in Task 4, skip renaming inside code you're about to delete), `persistWidgetOrder`, `applySavedWidgetOrder`, `bindOverviewEvents`, and the `proto-jump-select` handler in `init()`.

```bash
grep -n "homeApps" app.js
```
Use this to confirm no references remain after the rename (Task 4 will delete the two Overview-specific functions rather than rename them — see that task).

**Step 3: Manual check**

Reload `index.html`, go through onboarding (any role → myKaarma Recommended), land on Edit Home Screen. It should render exactly as before — tile grid populated, add/remove working. This confirms the rename didn't break the existing flow.

**Step 4: Commit**

```bash
git add app.js
git commit -m "refactor: rename homeApps to navProducts, add nav-mode/selected-product state"
```

---

### Task 3: Left nav rail markup, CSS, and mode/hover behavior

**Files:**
- Modify: `index.html` (Dashboard screen, lines 174–216)
- Modify: `styles.css` (add new rules near the existing `.dash-*` rules, after line ~1341)
- Modify: `app.js` (add rail render/bind functions; call from `renderDashboard`)

**Step 1: Restructure the Dashboard screen markup**

Replace the `<section class="screen" id="screen-dashboard" ...>` contents (lines 174–216 of `index.html`) with a layout that adds the rail alongside the existing topbar/tab-strip/tab-content:

```html
<section class="screen" id="screen-dashboard" data-screen hidden>
  <div class="dash-shell">
    <nav class="dash-nav-rail" id="dash-nav-rail" data-mode="expanded">
      <div class="dash-nav-rail-list" id="dash-nav-rail-list"></div>
      <div class="dash-nav-rail-footer">
        <button class="dash-nav-rail-edit-btn" id="dash-nav-rail-edit-btn" title="Edit products">
          <span class="material-icons">edit</span><span class="dash-nav-rail-label">Edit</span>
        </button>
        <div class="dash-nav-mode-toggle" id="dash-nav-mode-toggle" role="group" aria-label="Nav rail mode">
          <button class="dash-nav-mode-btn" data-mode="collapsed" title="Keep collapsed"><span class="material-icons">menu_open</span></button>
          <button class="dash-nav-mode-btn" data-mode="expanded" title="Keep expanded"><span class="material-icons">view_sidebar</span></button>
          <button class="dash-nav-mode-btn" data-mode="hover" title="Expand on hover"><span class="material-icons">swipe</span></button>
        </div>
      </div>
    </nav>

    <div class="dash-main">
      <div class="home-topbar">
        <div class="home-topbar-role">
          <span class="material-icons" id="dashboard-role-icon">support_agent</span>
          <div>
            <div class="home-role-name" id="dashboard-role-name">Service Advisor</div>
            <div class="home-role-sub myk-body2">Your dashboard</div>
          </div>
        </div>

        <div class="dash-search">
          <span class="material-icons">search</span>
          <input type="text" id="dashboard-search-input" placeholder="Search customers, ROs, or apps…" autocomplete="off" />
          <div class="dash-search-results" id="dashboard-search-results" hidden></div>
        </div>

        <div class="home-topbar-actions">
          <div class="notif-bell-wrap">
            <button class="notif-bell-btn" id="dashboard-bell-btn" title="Notifications">
              <span class="material-icons">notifications</span>
              <span class="notif-badge" id="dashboard-bell-badge" hidden>0</span>
            </button>
            <div class="notif-panel" id="dashboard-notif-panel" hidden>
              <div class="notif-panel-header">
                <div class="myk-subtitle1">Notifications</div>
              </div>
              <div class="notif-filter-row" id="dashboard-notif-filter"></div>
              <div class="notif-list" id="dashboard-notif-list"></div>
            </div>
          </div>
          <button class="mk-button tertiary-mk-button" id="dashboard-manage-views-btn" hidden>
            <span class="material-icons">admin_panel_settings</span> Manage Dealership Views
          </button>
        </div>
      </div>

      <div class="dash-tab-strip" id="dashboard-tab-strip"></div>
      <div class="dash-tab-content" id="dashboard-tab-content"></div>
    </div>
  </div>
</section>
```

Note: the old `dashboard-edit-home-btn` button is removed from the topbar — editing products now happens from the rail's own Edit button (`dash-nav-rail-edit-btn`), added above. `init()` will need its listener moved (Task 3 Step 4).

**Step 2: Add CSS for the rail**

Append to `styles.css`, after the existing `.dash-tab-content` rule (~line 1341):

```css
#shell.light .dash-shell {
  display: flex;
  height: 100%;
  overflow: hidden;
}

#shell.light .dash-nav-rail {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 64px;
  flex-shrink: 0;
  background: var(--bg-surface);
  border-right: 1px solid var(--border-subtle);
  transition: width 0.15s ease;
  z-index: 5;
}
#shell.light .dash-nav-rail[data-mode="expanded"] { width: 240px; }
#shell.light .dash-nav-rail[data-mode="hover"].dash-nav-rail--hover-expanded {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  width: 240px;
  box-shadow: var(--shadow-lg);
}

#shell.light .dash-nav-rail-list { overflow-y: auto; padding: var(--space-2) 0; }

#shell.light .dash-nav-rail-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
}
#shell.light .dash-nav-rail-item:hover { background: var(--row-hover); }
#shell.light .dash-nav-rail-item.active { background: var(--chip-bg); color: var(--brand); font-weight: 600; }
#shell.light .dash-nav-rail-item .material-icons { font-size: 22px; flex-shrink: 0; }
#shell.light .dash-nav-rail[data-mode="collapsed"]:not(.dash-nav-rail--hover-expanded) .dash-nav-rail-item-label,
#shell.light .dash-nav-rail[data-mode="hover"]:not(.dash-nav-rail--hover-expanded) .dash-nav-rail-item-label {
  display: none;
}

#shell.light .dash-nav-rail-footer {
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
#shell.light .dash-nav-rail-edit-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-1) var(--space-2);
  white-space: nowrap;
  overflow: hidden;
}
#shell.light .dash-nav-rail[data-mode="collapsed"]:not(.dash-nav-rail--hover-expanded) .dash-nav-rail-label,
#shell.light .dash-nav-rail[data-mode="hover"]:not(.dash-nav-rail--hover-expanded) .dash-nav-rail-label {
  display: none;
}
#shell.light .dash-nav-mode-toggle { display: flex; gap: 2px; }
#shell.light .dash-nav-mode-btn {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-muted);
  padding: var(--space-1);
  cursor: pointer;
  border-radius: var(--radius-sm);
}
#shell.light .dash-nav-mode-btn.active { background: var(--chip-bg); color: var(--brand); }
#shell.light .dash-nav-mode-btn .material-icons { font-size: 18px; }

#shell.light .dash-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

#shell.light .product-table-wrap { flex: 1; overflow: auto; padding: var(--space-3); }
#shell.light .product-table { width: 100%; border-collapse: collapse; }
#shell.light .product-table th {
  text-align: left;
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 12px;
  text-transform: uppercase;
}
#shell.light .product-table td {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
}
#shell.light .product-table tr.clickable { cursor: pointer; }
#shell.light .product-table tr.clickable:hover { background: var(--row-hover); }
```

**Step 3: Add rail render/bind logic to `app.js`**

Add after `renderDashboard()` (currently ends at line 714):

```js
const NAV_MODES = ['collapsed', 'expanded', 'hover'];

function loadNavMode() {
  const saved = localStorage.getItem('mkos-nav-mode');
  if (NAV_MODES.includes(saved)) state.navMode = saved;
}

function setNavMode(mode) {
  state.navMode = mode;
  localStorage.setItem('mkos-nav-mode', mode);
  renderNavRail();
}

function selectProduct(appId) {
  state.selectedProduct = appId;
  state.activeTabId = null;
  renderNavRail();
  renderDashboardTabContent();
}

function renderNavRail() {
  const rail = document.getElementById('dash-nav-rail');
  rail.dataset.mode = state.navMode;

  // Fall back to the first available product if the current selection was
  // removed from the nav (e.g. a manager re-locked the role's app list).
  if (!state.navProducts.includes(state.selectedProduct)) {
    state.selectedProduct = state.navProducts[0] || null;
  }

  document.getElementById('dash-nav-rail-list').innerHTML = state.navProducts.map(id => {
    const app = getApp(id);
    const active = id === state.selectedProduct && state.activeTabId === null;
    return `
      <button class="dash-nav-rail-item${active ? ' active' : ''}" data-app-id="${app.id}" title="${escHtml(app.name)}">
        <span class="material-icons">${app.icon}</span>
        <span class="dash-nav-rail-item-label">${escHtml(app.name)}</span>
      </button>
    `;
  }).join('');

  document.getElementById('dash-nav-rail-list').querySelectorAll('.dash-nav-rail-item').forEach(btn => {
    btn.addEventListener('click', () => selectProduct(btn.dataset.appId));
  });

  document.querySelectorAll('.dash-nav-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === state.navMode);
  });
}

function bindNavRailHover() {
  const rail = document.getElementById('dash-nav-rail');
  rail.addEventListener('mouseenter', () => {
    if (state.navMode === 'hover') rail.classList.add('dash-nav-rail--hover-expanded');
  });
  rail.addEventListener('mouseleave', () => {
    rail.classList.remove('dash-nav-rail--hover-expanded');
  });
}
```

Update `renderDashboard()` to call the new rail renderer:

```js
function renderDashboard() {
  const role = getRole(state.role);
  document.getElementById('dashboard-role-icon').textContent = role.icon;
  document.getElementById('dashboard-role-name').textContent = role.name;
  document.getElementById('dashboard-manage-views-btn').hidden = state.role !== 'manager-admin';
  renderNavRail();
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
  renderDashboardTabContent();
}
```

**Step 4: Wire the mode toggle and edit button in `init()`**

Remove the old `dashboard-edit-home-btn` listener (its button no longer exists in the markup) and add:

```js
document.querySelectorAll('.dash-nav-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => setNavMode(btn.dataset.mode));
});
document.getElementById('dash-nav-rail-edit-btn').addEventListener('click', () => {
  renderHome();
  showScreen('home');
});
bindNavRailHover();
loadNavMode();
```
Add this block inside `init()`, near the other Dashboard-related listeners (after the `dashboard-manage-views-btn` listener).

**Step 5: Manual check**

Reload, complete onboarding to reach the Dashboard. Confirm:
- The rail renders with icons for whatever products were picked.
- Clicking the three mode buttons switches collapsed (icons only, ~64px) / expanded (labels visible, ~240px) / hover (collapsed by default; hovering the rail expands it in place without shifting the table beneath it, and moving the mouse off the rail collapses it again).
- The Edit button opens the existing Edit Home Screen.
- No console errors.

**Step 6: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: add left product nav rail with collapsed/expanded/hover modes"
```

---

### Task 4: Base surface — render the selected product's table

**Files:**
- Modify: `app.js`

**Step 1: Replace the Overview-widget-grid functions with a product-table renderer**

Delete `overviewHTML()` and `bindOverviewEvents()` (the two functions at lines 866–885) — they're fully superseded. In their place, add:

```js
function productTableHTML(appId) {
  if (!appId) {
    return `<div class="dashboard-placeholder">
      <span class="material-icons">dashboard</span>
      <div class="dashboard-placeholder-title">No products yet</div>
      <p class="myk-body2">Add products from the rail's Edit button to see them here.</p>
    </div>`;
  }
  const app = getApp(appId);
  const table = productTableFor(appId);
  const rows = table.rows();
  return `
    <div class="product-table-wrap">
      <h2 class="myk-h6">${escHtml(app.name)}</h2>
      ${rows.length === 0 ? `<p class="myk-body2">No records yet.</p>` : `
        <table class="product-table">
          <thead><tr>${table.columns.map(c => `<th>${escHtml(c)}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map((row, i) => `
              <tr class="${row.linkType ? 'clickable' : ''}" data-row-index="${i}">
                ${row.cells.map(cell => `<td>${escHtml(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

function bindProductTable(container, appId) {
  if (!appId) return;
  const rows = productTableFor(appId).rows();
  container.querySelectorAll('tr.clickable').forEach(tr => {
    tr.addEventListener('click', () => {
      const row = rows[Number(tr.dataset.rowIndex)];
      if (row.linkType === 'customer') {
        const cust = MOCK_CUSTOMERS.find(c => c.id === row.linkId);
        openTab('customer', cust.id, cust.name);
      } else if (row.linkType === 'ro') {
        const ro = MOCK_ROS.find(r => r.id === row.linkId);
        openTab('ro', ro.id, `${ro.number} · ${ro.vehicle}`);
      }
    });
  });
}
```

**Step 2: Update `renderDashboardTabContent()` to use the base surface**

Replace the current function (lines 807–820):

```js
function renderDashboardTabContent() {
  const container = document.getElementById('dashboard-tab-content');

  if (state.activeTabId === null) {
    container.innerHTML = productTableHTML(state.selectedProduct);
    bindProductTable(container, state.selectedProduct);
    return;
  }

  const tab = state.tabs.find(t => t.id === state.activeTabId);
  if (!tab) { state.activeTabId = null; renderDashboardTabContent(); return; }

  container.innerHTML = tabWidgetGridHTML(tab);
  bindTabWidgetGrid(container, tab);
  renderMarketplace('tab-widget-marketplace', `tab:${tab.id}`, pageInfoPseudoApps(tab.type));
}
```

**Step 3: Remove now-dead widget-size wiring that only served Overview**

`setWidgetSize()` (lines 842–846) was written generically but its only caller was the Overview grid via `bindWidgetGrid`'s `setSize`/`onChange`, which is now gone along with `bindOverviewEvents`. Check for other callers:

```bash
grep -n "setWidgetSize(" app.js
```

If this shows no remaining call sites, delete the `setWidgetSize` function — it's now dead code introduced as a side effect of this change, not pre-existing dead code, so removing it matches "clean up your own mess."

**Step 4: Manual check**

Reload, complete onboarding, land on Dashboard. Confirm:
- The base surface shows a table for the first nav product (matching `state.selectedProduct` defaulting to `navProducts[0]`).
- Clicking each nav item swaps the table to that product's columns/rows.
- Clicking a clickable row (e.g. a Scheduler row) opens a customer detail tab, and the tab strip now shows that tab; clicking the same nav product again returns focus to the table while the tab stays open in the strip.
- Rows with `linkType: null` (e.g. Reporting, Team Schedule) render but don't respond to clicks.
- No console errors when the nav list is empty (test via "Start from Scratch" with zero apps added, if reachable, or by removing all products from Edit Home Screen).

**Step 5: Commit**

```bash
git add app.js
git commit -m "feat: render selected product's table as the dashboard base surface"
```

---

### Task 5: Tab strip — empty by default, `+` opens search to create a tab

**Files:**
- Modify: `app.js` (`openTab`, `setActiveTab`, `closeTab`, `renderTabStrip`, `focusOverviewWidget`, `handleSearchResultClick`)
- Modify: `index.html` (tab strip container needs a `+` button slot)
- Modify: `styles.css` (style the `+` button and its search popover)

**Step 1: Update tab lifecycle functions for the no-overview-tab model**

Replace `setActiveTab`, `closeTab`, and `renderTabStrip` (lines 748–804):

```js
function setActiveTab(tabId) {
  state.activeTabId = tabId;
  renderDashboard();
}

function closeTab(tabId) {
  state.tabs = state.tabs.filter(t => t.id !== tabId);
  if (state.activeTabId === tabId) state.activeTabId = null;
  persistPinnedTabs();
  renderDashboard();
}

function togglePinTab(tabId) {
  const tab = state.tabs.find(t => t.id === tabId);
  if (!tab) return;
  tab.pinned = !tab.pinned;
  persistPinnedTabs();
  renderDashboard();
}

function renderTabStrip() {
  const strip = document.getElementById('dashboard-tab-strip');
  const pinned = state.tabs.filter(t => t.pinned);
  const unpinned = state.tabs.filter(t => !t.pinned);
  const ordered = [...pinned, ...unpinned];

  const tabsHTML = ordered.map(tab => {
    const active = tab.id === state.activeTabId;
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

  strip.innerHTML = `
    ${tabsHTML}
    <div class="dash-tab-add-wrap">
      <button class="dash-tab-add-btn" id="dash-tab-add-btn" title="Add tab"><span class="material-icons">add</span></button>
      <div class="dash-tab-add-search" id="dash-tab-add-search" hidden>
        <input type="text" id="dash-tab-add-input" placeholder="Search customer or RO…" autocomplete="off" />
        <div class="dash-tab-add-results" id="dash-tab-add-results"></div>
      </div>
    </div>
  `;

  strip.querySelectorAll('.dash-tab').forEach(el => {
    el.addEventListener('click', () => setActiveTab(el.dataset.tabId));
  });
  strip.querySelectorAll('.dash-tab-pin-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); togglePinTab(btn.dataset.tabId); });
  });
  strip.querySelectorAll('.dash-tab-close-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); closeTab(btn.dataset.tabId); });
  });
  bindTabAddSearch(strip);
}
```

Also simplify `openTab` (it no longer needs to special-case an "overview" type — it never did, but confirm no stray references remain):

```bash
grep -n "type === 'overview'\|type: 'overview'" app.js
```
Should return no matches after this task; if `openTab` itself doesn't reference `'overview'`, leave it as-is.

**Step 2: Add the tab-strip search popover logic**

Add near `renderSearchResults`/`handleSearchResultClick` (after line 1280):

```js
function bindTabAddSearch(strip) {
  const btn = strip.querySelector('#dash-tab-add-btn');
  const box = strip.querySelector('#dash-tab-add-search');
  const input = strip.querySelector('#dash-tab-add-input');
  const results = strip.querySelector('#dash-tab-add-results');

  btn.addEventListener('click', e => {
    e.stopPropagation();
    box.hidden = !box.hidden;
    if (!box.hidden) input.focus();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.innerHTML = ''; return; }
    const customers = MOCK_CUSTOMERS.filter(c => c.name.toLowerCase().includes(q) || c.phone.includes(input.value.trim())).slice(0, 5);
    const ros = MOCK_ROS.filter(r => r.number.toLowerCase().includes(q)).slice(0, 5);
    results.innerHTML = customers.map(c => `<button class="dash-search-result" data-kind="customer" data-id="${c.id}"><span class="material-icons">person</span>${escHtml(c.name)}</button>`).join('')
      + ros.map(r => `<button class="dash-search-result" data-kind="ro" data-id="${r.id}"><span class="material-icons">directions_car</span>${escHtml(r.number)}</button>`).join('');
    results.querySelectorAll('.dash-search-result').forEach(rbtn => {
      rbtn.addEventListener('click', () => {
        if (rbtn.dataset.kind === 'customer') {
          const c = MOCK_CUSTOMERS.find(x => x.id === rbtn.dataset.id);
          openTab('customer', c.id, c.name);
        } else {
          const r = MOCK_ROS.find(x => x.id === rbtn.dataset.id);
          openTab('ro', r.id, `${r.number} · ${r.vehicle}`);
        }
        input.value = '';
        results.innerHTML = '';
        box.hidden = true;
      });
    });
  });
}
```

Add a document-level click handler (in `init()`, alongside the existing outside-click handlers around line 1427) to close the popover when clicking elsewhere:

```js
if (!e.target.closest('.dash-tab-add-wrap')) {
  const box = document.getElementById('dash-tab-add-search');
  if (box) box.hidden = true;
}
```

**Step 3: Update the global dashboard search's "app" result**

`focusOverviewWidget` (lines 1282–1294) no longer makes sense — there's no Overview widget grid to scroll to. Replace it with nav selection:

```js
function focusNavProduct(appId) {
  if (state.navProducts.includes(appId)) {
    selectProduct(appId);
  } else {
    showToast(`Add "${getApp(appId).name}" to your nav to see it here.`);
  }
}
```
Update `handleSearchResultClick` (line 1276) to call `focusNavProduct(id)` instead of `focusOverviewWidget(id)`.

**Step 4: CSS for the add-tab control**

Append to `styles.css`:

```css
#shell.light .dash-tab-add-wrap { position: relative; display: flex; align-items: center; }
#shell.light .dash-tab-add-btn {
  border: none; background: none; color: var(--text-muted); cursor: pointer;
  padding: var(--space-1); border-radius: var(--radius-sm);
}
#shell.light .dash-tab-add-btn:hover { background: var(--row-hover); color: var(--text-primary); }
#shell.light .dash-tab-add-search {
  position: absolute; top: 100%; left: 0; z-index: 10;
  background: var(--bg-surface); border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md); box-shadow: var(--shadow-lg);
  padding: var(--space-2); width: 260px;
}
#shell.light .dash-tab-add-search input {
  width: 100%; padding: var(--space-1) var(--space-2);
  border: 1px solid var(--border-subtle); border-radius: var(--radius-sm);
}
#shell.light .dash-tab-add-results { display: flex; flex-direction: column; margin-top: var(--space-1); }
```

**Step 5: Manual check**

- Confirm the tab strip starts empty on a fresh session (no "Overview" tab).
- Click a product-table row → a tab opens and focuses; clicking it again doesn't duplicate.
- Click `+`, search a customer and an RO number, confirm each opens/focuses a tab.
- Close the active tab → base surface (selected product's table) reappears, not another tab.
- Pin a tab, reload the page → pinned tab restores into the strip but `activeTabId` is `null` (table shown, not the restored tab).
- Global search for an app name → nav rail selects that product (if present) or shows the "add it first" toast.

**Step 6: Commit**

```bash
git add app.js index.html styles.css
git commit -m "feat: independent tab strip with add-via-search, base-surface fallback on close"
```

---

### Task 6: "More details" slide-in drawer

**Files:**
- Modify: `index.html` (add drawer container near the end of `#shell`, before `create-app-overlay`)
- Modify: `styles.css`
- Modify: `app.js`

**Step 1: Add the drawer markup**

In `index.html`, insert before the `create-app-overlay` div (line 254):

```html
<div class="details-drawer-overlay" id="details-drawer-overlay" hidden>
  <aside class="details-drawer" id="details-drawer">
    <div class="details-drawer-header">
      <div class="myk-subtitle1" id="details-drawer-title"></div>
      <button class="details-drawer-close-btn" id="details-drawer-close-btn"><span class="material-icons">close</span></button>
    </div>
    <div class="details-drawer-body" id="details-drawer-body"></div>
  </aside>
</div>
```

**Step 2: Add drawer functions to `app.js`**

Add near the tab-content functions (after `bindTabWidgetGrid`, before the notification bell section):

```js
function openDetailsDrawer(title, bodyHTML) {
  document.getElementById('details-drawer-title').textContent = title;
  document.getElementById('details-drawer-body').innerHTML = bodyHTML;
  document.getElementById('details-drawer-overlay').hidden = false;
}

function closeDetailsDrawer() {
  document.getElementById('details-drawer-overlay').hidden = true;
}
```

Wire a details trigger inside the RO-detail tab content — `contentWidgetBodyHTML`'s `ro-details` case (around line 1029) is the natural place, since it's content shown inside a tab, not a table row:

Replace:
```js
if (widgetId === 'ro-details') {
  return listRowHTML('directions_car', escHtml(ro.vehicle), '') + listRowHTML('info', escHtml(ro.status), '');
}
```
with:
```js
if (widgetId === 'ro-details') {
  return listRowHTML('directions_car', escHtml(ro.vehicle), '')
    + listRowHTML('info', escHtml(ro.status), '')
    + `<button class="tab-more-details-btn" data-ro-id="${ro.id}"><span class="material-icons">open_in_new</span> More details</button>`;
}
```

Bind the new button in `bindTabWidgetGrid` (add alongside the existing `.tab-ro-row`/`.tab-customer-link` bindings, after line 1131):

```js
container.querySelectorAll('.tab-more-details-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const ro = MOCK_ROS.find(r => r.id === btn.dataset.roId);
    openDetailsDrawer(`${ro.number} — ${ro.vehicle}`, `
      <p class="myk-body2"><strong>Status:</strong> ${escHtml(ro.status)}</p>
      <p class="myk-body2"><strong>Vehicle:</strong> ${escHtml(ro.vehicle)}</p>
    `);
  });
});
```

**Step 3: Wire close behavior in `init()`**

```js
document.getElementById('details-drawer-close-btn').addEventListener('click', closeDetailsDrawer);
document.getElementById('details-drawer-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('details-drawer-overlay')) closeDetailsDrawer();
});
```

**Step 4: CSS**

Append to `styles.css`:

```css
#shell.light .details-drawer-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.25);
  z-index: 50; display: flex; justify-content: flex-end;
}
#shell.light .details-drawer-overlay[hidden] { display: none; }
#shell.light .details-drawer {
  width: 360px; max-width: 90vw; height: 100%;
  background: var(--bg-surface); box-shadow: var(--shadow-lg);
  display: flex; flex-direction: column;
  animation: details-drawer-in 0.15s ease-out;
}
@keyframes details-drawer-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
#shell.light .details-drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--space-3); border-bottom: 1px solid var(--border-subtle);
}
#shell.light .details-drawer-close-btn { border: none; background: none; cursor: pointer; color: var(--text-muted); }
#shell.light .details-drawer-body { padding: var(--space-3); overflow-y: auto; }
#shell.light .tab-more-details-btn {
  display: inline-flex; align-items: center; gap: var(--space-1);
  border: none; background: none; color: var(--brand); cursor: pointer;
  padding: var(--space-1) 0; margin-top: var(--space-1);
}
#shell.light .tab-more-details-btn .material-icons { font-size: 16px; }
```

**Step 5: Manual check**

Open a customer's tab from a product table row, follow the linked RO into an RO tab (or open one directly via search), click "More details" — confirm the drawer slides in from the right with the RO's info. Click a second "More details" elsewhere (e.g. open a different RO tab and click its button) — confirm the drawer's content is replaced, not stacked. Close via the ✕ and via clicking the backdrop.

**Step 6: Commit**

```bash
git add index.html styles.css app.js
git commit -m "feat: add single-instance more-details slide-in drawer"
```

---

### Task 7: Copy/label cleanup for the renamed nav-products concept

**Files:**
- Modify: `index.html` (Edit Home Screen screen, lines 143–171)

**Step 1: Update the Edit Home Screen sub-label**

The screen still functions identically (it edits `state.navProducts`, same marketplace), but its copy currently says "Reorder and resize anytime from your Dashboard" — reordering/resizing no longer applies since the nav rail isn't a draggable/resizable widget grid. Update line 149:

```html
<div class="home-role-sub myk-body2">Edit your products — remove with the ✕, or add more below.</div>
```

**Step 2: Manual check**

Reload, reach Edit Home Screen, confirm the updated copy reads correctly and add/remove still works.

**Step 3: Commit**

```bash
git add index.html
git commit -m "docs: update Edit Home Screen copy for the nav-rail model"
```

---

### Task 8: Full end-to-end manual verification pass

**Files:** none (verification only)

**Step 1: Fresh-session walkthrough**

```bash
open index.html
```

Run through, for at least two roles (e.g. Service Advisor and Technician):
1. Onboarding → pick role → myKaarma Recommended → lands on Edit Home Screen → Done → Dashboard.
2. Nav rail shows the recommended products; base surface shows the first product's table.
3. Toggle all three nav modes; verify hover-expand/collapse behavior at the rail boundary.
4. Click through every nav product; confirm each renders a distinct table (columns/rows match Task 1's data).
5. Click a clickable row → tab opens; click the same nav product again → base surface returns, tab stays in strip.
6. Use `+` to search and open both a customer and an RO tab.
7. Trigger "More details" from an RO tab → drawer opens; open a second one → contents replace, not stack; close both ways.
8. Reload with a pinned tab present → tab restores pinned, but base surface (not the tab) is shown.
9. As `manager-admin`, lock a role's product list from Manager view, then confirm a user in that role sees the locked list and the one-time banner still fires correctly on Edit Home Screen.

**Step 2: Check the browser console**

No errors or warnings should appear during the entire walkthrough above.

**Step 3: Commit (only if Step 1 surfaced fixes)**

If the walkthrough finds issues, fix them in the relevant task's files and commit with a `fix:` message describing the specific behavior corrected. If no issues are found, no commit is needed for this task.

---

## Out of Scope (carried over from the design doc)

- Dealer-built custom apps via myKaarma APIs.
- Voice interface / in-system AI assistant.
- A generalized "surface stack" abstraction for arbitrary future product types.
