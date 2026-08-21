# Global App Header Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Replace the per-screen topbars (Dashboard, Edit Home Screen, Manager) with one shared 40px-tall global header — logo, unified search, the tab strip, notifications, help, and a user avatar menu — shown on every post-onboarding screen.

**Architecture:** Add one `<header id="app-header">` inside `#app-frame`, above the existing `.onboarding-layout`, toggled visible/hidden by `showScreen()` based on whether the target screen is an onboarding screen. Reuse existing element ids (`dashboard-search-input`, `dashboard-tab-strip`, `dashboard-bell-btn`, etc.) inside the new markup so `renderSearchResults`/`renderTabStrip`/`renderNotifBell`/`renderNotifPanel` need no changes — only their DOM location moves. Remove the now-redundant tab-strip "+" search popover since the header search bar covers the same job.

**Tech Stack:** Vanilla HTML/CSS/JS, no build step, no test framework — verification is a real headless-Chromium Playwright run (same harness used for the phase 1 shell), since this repo has no automated test suite.

**Working directory:** `/Users/jenntran/code/mk-OS/.worktrees/app-shell`, branch `feature/app-shell-phase1` (same branch/PR as phase 1, per the design doc).

---

### Task 1: Global header markup + strip per-screen topbars

**Files:**
- Modify: `index.html`

**Step 1: Insert the global header**

Insert a new `<header>` inside `#app-frame`, immediately before `<div class="onboarding-layout">` (currently line 41):

```html
<header class="app-header" id="app-header" hidden>
  <div class="app-header-logo">
    <span class="material-icons">apps</span>
    <span class="app-header-logo-text">myKaarma</span>
  </div>

  <div class="app-header-search dash-search">
    <span class="material-icons">search</span>
    <input type="text" id="dashboard-search-input" placeholder="Search customers, ROs, or apps…" autocomplete="off" />
    <div class="dash-search-results" id="dashboard-search-results" hidden></div>
  </div>

  <div class="app-header-tabs dash-tab-strip" id="dashboard-tab-strip"></div>

  <div class="app-header-actions">
    <div class="notif-bell-wrap">
      <button class="notif-bell-btn" id="dashboard-bell-btn" title="Notifications">
        <span class="material-icons">notifications</span>
        <span class="notif-badge" id="dashboard-bell-badge" hidden>0</span>
      </button>
      <div class="notif-panel" id="dashboard-notif-panel" hidden>
        <div class="notif-panel-header"><div class="myk-subtitle1">Notifications</div></div>
        <div class="notif-filter-row" id="dashboard-notif-filter"></div>
        <div class="notif-list" id="dashboard-notif-list"></div>
      </div>
    </div>

    <button class="app-header-help-btn" id="app-header-help-btn" title="Help">
      <span class="material-icons">help_outline</span>
    </button>

    <div class="app-header-avatar-wrap">
      <button class="app-header-avatar-btn" id="app-header-avatar-btn" title="Account">
        <span id="app-header-avatar-initials">JD</span>
      </button>
      <div class="app-header-avatar-menu" id="app-header-avatar-menu" hidden>
        <div class="app-header-avatar-role" id="app-header-avatar-role"></div>
        <button class="app-header-avatar-item" id="app-header-manage-views-item" hidden>
          <span class="material-icons">admin_panel_settings</span> Manage Dealership Views
        </button>
        <button class="app-header-avatar-item" id="app-header-reset-password-item">
          <span class="material-icons">lock_reset</span> Reset password
        </button>
        <button class="app-header-avatar-item" id="app-header-edit-profile-item">
          <span class="material-icons">person</span> Edit profile
        </button>
      </div>
    </div>
  </div>
</header>
```

Note this reuses the *exact same ids* (`dashboard-search-input`, `dashboard-search-results`, `dashboard-tab-strip`, `dashboard-bell-btn`, `dashboard-bell-badge`, `dashboard-notif-panel`, `dashboard-notif-filter`, `dashboard-notif-list`) that currently live inside the Dashboard screen's markup — deliberately, so the JS functions that already target them by id need zero changes for those specific mounts.

**Step 2: Remove the old Dashboard topbar and old tab-strip location**

In the Dashboard screen (`#screen-dashboard`), the `.dash-main` div currently contains a `.home-topbar` block, then `.dash-tab-strip`, then `.dash-tab-content`. Delete the `.home-topbar` block (the whole `<div class="home-topbar">...</div>` containing the role icon/name, `.dash-search`, and `.home-topbar-actions` with the bell/manage-views button) and delete the old `<div class="dash-tab-strip" id="dashboard-tab-strip"></div>` line — both are now superseded by the global header. `.dash-main` should end up containing only:

```html
<div class="dash-main">
  <div class="dash-tab-content" id="dashboard-tab-content"></div>
</div>
```

**Step 3: Simplify Edit Home Screen's header**

Replace the `#screen-home` section's `.home-topbar` block (role icon/name row + Done button) with a plain content header that has no role icon (role display now lives in the header's avatar menu):

```html
<div class="home-content-header">
  <div class="home-role-sub myk-body2">Edit your products — remove with the ✕, or add more below.</div>
  <button class="mk-button primary-mk-button" id="home-to-dashboard-btn">
    <span class="material-icons">check</span> Done
  </button>
</div>
```

**Step 4: Manual check**

Reload, confirm the page still loads without errors (the header won't render meaningfully yet since `renderAppHeader()` doesn't exist until Task 3 — that's fine, this task is markup-only). Confirm `document.getElementById('app-header')` exists and is `hidden` by default.

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add global app header markup, strip per-screen topbars"
```

---

### Task 2: Global header CSS

**Files:**
- Modify: `styles.css`

**Step 1: Add the header layout CSS**

Add a new section (e.g. right after the RESET/DESIGN TOKENS blocks, or near the top of the DASHBOARD sections — placement within the file doesn't matter functionally, keep it together as one block):

```css
/* ============================================================
   GLOBAL APP HEADER — 40px, shown on every post-onboarding screen
   ============================================================ */
#shell.light .app-header {
  display: flex;
  align-items: center;
  height: 40px;
  flex-shrink: 0;
  width: 100%;
  padding: 0 var(--space-3);
  gap: var(--space-3);
  border-bottom: 1px solid var(--border);
  background: var(--bg-surface);
}
#shell.light .app-header[hidden] { display: none; }

#shell.light .app-header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
  color: var(--text-primary);
}
#shell.light .app-header-logo .material-icons { font-size: 20px; color: var(--brand); }
#shell.light .app-header-logo-text { font-size: 14px; font-weight: 700; }

#shell.light .app-header-search { flex: 0 0 240px; margin: 0; }

#shell.light .app-header-tabs { flex: 1; min-width: 0; padding: 0; border-bottom: none; background: none; }

#shell.light .app-header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}

#shell.light .app-header-help-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: none;
  background: none;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
}
#shell.light .app-header-help-btn:hover { background: var(--row-hover); }
#shell.light .app-header-help-btn .material-icons { font-size: 18px; }

#shell.light .app-header-avatar-wrap { position: relative; }
#shell.light .app-header-avatar-btn {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px;
  border: none;
  border-radius: 50%;
  background: var(--brand-light);
  color: var(--brand);
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
#shell.light .app-header-avatar-btn:hover { background: var(--chip-active-bg); }

#shell.light .app-header-avatar-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: 60;
  padding: var(--space-2);
}
#shell.light .app-header-avatar-role {
  padding: var(--space-2) var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-1);
  font-size: 13px;
  color: var(--text-secondary);
}
#shell.light .app-header-avatar-item {
  display: flex; align-items: center; gap: var(--space-2);
  width: 100%;
  padding: var(--space-2);
  border: none;
  background: none;
  border-radius: var(--radius-sm);
  text-align: left;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  font-family: inherit;
}
#shell.light .app-header-avatar-item:hover { background: var(--row-hover); }
#shell.light .app-header-avatar-item .material-icons { font-size: 16px; color: var(--text-muted); }

#shell.light .home-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border);
}
```

**Step 2: Shrink the reused rules to header scale**

These rules are edited in place (not duplicated) since — after Task 1 — `.dash-search`, `.notif-bell-btn`, `.dash-tab-strip`/`.dash-tab-list`/`.dash-tab`/`.dash-tab-pin-btn`/`.dash-tab-close-btn` only ever appear inside the new header:

- `.dash-search`: remove `max-width: 420px; margin: 0 var(--space-4);` (the new `.app-header-search` rule above already controls sizing/spacing) — leave `position: relative; flex: 1;` alone since `.app-header-search`'s `flex: 0 0 240px` overrides `flex: 1` via the later rule (same selector specificity, later source order wins — `.app-header-search` block must appear after `.dash-search`'s own rule in the stylesheet for this to apply; since you're adding the new CSS in Step 1 which comes after the existing `.dash-search` rule in file order already, this is satisfied automatically as long as you don't reorder anything).
- `.dash-search input`: change `height: 38px;` → `height: 26px;`, `font-size: 14px;` → `font-size: 12px;`, `padding: 0 var(--space-3) 0 40px;` → `padding: 0 var(--space-2) 0 28px;`.
- `.dash-search > .material-icons`: change `font-size: 18px;` → `font-size: 14px;`, `left: var(--space-3)` → `left: var(--space-2)`.
- `.notif-bell-btn`: change `width: 38px; height: 38px;` → `width: 28px; height: 28px;`.
- `.notif-bell-btn .material-icons` (add if not already sized): ensure it's `font-size: 18px;` to fit the smaller circle — check the current rule; if the icon size isn't explicitly set, add `#shell.light .notif-bell-btn .material-icons { font-size: 18px; }`.
- `.dash-tab-strip`: change `padding: var(--space-2) var(--space-3) 0;` → `padding: 0;` and remove `border-bottom: 1px solid var(--border); background: var(--bg-page);` (the header already has its own border/background — this rule is now purely a flex container).
- `.dash-tab`: change `padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);` → `padding: var(--space-1) var(--space-1) var(--space-1) var(--space-2);`, `font-size: 13px;` → `font-size: 12px;`.
- `.dash-tab-type-icon`: `font-size: 16px;` → `font-size: 14px;`.
- `.dash-tab-pin-btn`, `.dash-tab-close-btn`: `width: 20px; height: 20px;` → `width: 16px; height: 16px;`; their `.material-icons` `font-size: 14px;` → `font-size: 12px;`.

**Step 3: Delete now-dead CSS**

- Delete `.home-topbar`, `.home-topbar-role`, `.home-topbar-role > .material-icons`, `.home-topbar-actions` rules — after Task 1, nothing references the `.home-topbar` class anywhere (Edit Home Screen uses the new `.home-content-header`; Dashboard's topbar is gone entirely). Verify with `grep -n "home-topbar" index.html app.js` before deleting — should return nothing.
- `.home-role-name` becomes dead too (it was only used inside the deleted role-icon row) — verify with `grep -n "home-role-name" index.html app.js` and delete the rule if confirmed unused. `.home-role-sub` is still used (by the new `.home-content-header`'s subtext) — keep it.

**Step 4: Manual check**

Reload, walk through role select → Edit Home Screen → Dashboard. Even without Task 3's JS wiring, you should see: a thin 40px bar with the myKaarma wordmark, a small search input, an empty middle area, and (empty/non-functional for now) notif bell / help / avatar icons on the right — no layout overflow, no visual breakage. The Edit Home Screen should show its new plain content header with just the subtext + Done button, no role icon circle.

**Step 5: Commit**

```bash
git add styles.css
git commit -m "feat: add global header CSS, shrink reused elements to 40px scale, remove dead per-screen topbar CSS"
```

---

### Task 3: Wire the header's role display, tab strip, notifications, and screen-visibility toggle

**Files:**
- Modify: `app.js`

**Step 1: Add `renderAppHeader()`**

Add this function near `renderDashboard()` (app.js, currently ending around line 819):

```js
// Runs on every screen transition. Keeps the header's role display, manage-views
// visibility, tab strip, and notification state current regardless of which
// screen is active — the header persists across screens, unlike renderDashboard().
function renderAppHeader() {
  if (!state.role) return; // nothing to show before a role is picked
  const role = getRole(state.role);
  document.getElementById('app-header-avatar-role').textContent = `Signed in as: ${role.name}`;
  document.getElementById('app-header-manage-views-item').hidden = state.role !== 'manager-admin';
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
}
```

**Step 2: Call it from `showScreen()`, and toggle the header's visibility there**

Modify `showScreen()` (app.js, currently lines 359–373):

```js
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

  document.getElementById('app-header').hidden = ONBOARDING_STEPS.includes(id);
  renderAppHeader();

  document.getElementById('app-frame').scrollTop = 0;
  window.scrollTo(0, 0);
}
```

This reuses the existing `ONBOARDING_STEPS` array (`['onboarding-role', 'onboarding-path', 'onboarding-scratch']`) — no new screen-list constant needed, since it already enumerates exactly the screens that should hide the header.

**Step 3: Remove references to deleted elements in `renderHome()` and `renderDashboard()`**

In `renderHome()` (app.js, currently lines 776–804), delete these two lines (the elements `home-role-icon`/`home-role-name` no longer exist after Task 1):
```js
document.getElementById('home-role-icon').textContent = role.icon;
document.getElementById('home-role-name').textContent = role.name;
```
Also delete the now-unused `const role = getRole(state.role);` line at the top of `renderHome()` *only if* nothing else in the function uses `role` — check the rest of the function body first; if `role` is otherwise unused after removing those two lines, delete its declaration too.

In `renderDashboard()` (app.js, currently lines 809–819), delete these lines (elements `dashboard-role-icon`/`dashboard-role-name`/`dashboard-manage-views-btn` no longer exist after Task 1 — that role/manage-views display now lives in `renderAppHeader()`):
```js
const role = getRole(state.role);
document.getElementById('dashboard-role-icon').textContent = role.icon;
document.getElementById('dashboard-role-name').textContent = role.name;
document.getElementById('dashboard-manage-views-btn').hidden = state.role !== 'manager-admin';
```
`renderDashboard()` should end up as:
```js
function renderDashboard() {
  renderNavRail();
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
  renderDashboardTabContent();
}
```
(This keeps calling `renderTabStrip`/`renderNotifBell`/`renderNotifPanel` directly too — slightly redundant with `renderAppHeader()` when both run back-to-back during a screen transition, but harmless and simpler than threading render coordination between the two call paths. Not worth optimizing away in a prototype.)

**Step 4: Retarget the "Manage Dealership Views" listener and wire the new avatar/help controls**

In `init()` (app.js, currently around lines 1613–1616), replace:
```js
document.getElementById('dashboard-manage-views-btn').addEventListener('click', () => {
  renderManagerRoleList();
  showScreen('manager');
});
```
with:
```js
document.getElementById('app-header-manage-views-item').addEventListener('click', () => {
  toggleAvatarMenu(false);
  renderManagerRoleList();
  showScreen('manager');
});

document.getElementById('app-header-reset-password-item').addEventListener('click', () => {
  toggleAvatarMenu(false);
  showToast('Password reset isn\'t available in this prototype yet.');
});
document.getElementById('app-header-edit-profile-item').addEventListener('click', () => {
  toggleAvatarMenu(false);
  showToast('Profile editing isn\'t available in this prototype yet.');
});
document.getElementById('app-header-avatar-btn').addEventListener('click', e => {
  e.stopPropagation();
  toggleAvatarMenu();
});

document.getElementById('app-header-help-btn').addEventListener('click', () => {
  showToast('Help isn\'t available in this prototype yet.');
});
```
(`toggleAvatarMenu` is added in Task 6 — this task will reference it, so Task 6 must land before this code path is exercised; write it now, it'll work once Task 6 adds the function. If you're implementing tasks in order this is fine since Task 6 comes right after in this same plan... actually Task 6 is later — for THIS task, temporarily stub `toggleAvatarMenu` isn't necessary since JS won't error until the button is actually clicked, and Task 6 will exist by the time you're done. Just make sure Task 6 is completed before considering this feature done end-to-end.)

**Step 5: Manual check**

Reload, go through onboarding → Edit Home Screen → Dashboard. Confirm the header is hidden during onboarding and appears starting at Edit Home Screen. Confirm the avatar button is clickable (menu won't fully work until Task 6, but shouldn't throw — check console). Confirm Dashboard's nav rail, base surface, and tab strip (now in the header) all still render without console errors.

**Step 6: Commit**

```bash
git add app.js
git commit -m "feat: wire global header role display, tab strip, notifications into screen transitions"
```

---

### Task 4: Remove the redundant tab-add search popover

**Files:**
- Modify: `app.js`

**Step 1: Delete `bindTabAddSearch` and its call site**

Delete the entire `bindTabAddSearch` function (app.js, currently lines 977–1011). Remove its call from `renderTabStrip()` (the line `bindTabAddSearch(strip);` at the end of that function).

**Step 2: Simplify `renderTabStrip()`'s generated markup**

`renderTabStrip()` currently builds `strip.innerHTML` with a `.dash-tab-list` div followed by a `.dash-tab-add-wrap` div (the `+` button and its popover). Remove the `.dash-tab-add-wrap` block entirely — the header's search bar is now the only way to open a tab. `renderTabStrip()`'s `strip.innerHTML` assignment should become just:
```js
strip.innerHTML = `<div class="dash-tab-list">${tabsHTML}</div>`;
```

**Step 3: Remove the outside-click handling for the deleted popover**

In `init()`'s document click listener, remove this block (it references elements that no longer exist):
```js
if (!e.target.closest('.dash-tab-add-wrap')) {
  const box = document.getElementById('dash-tab-add-search');
  if (box) box.hidden = true;
}
```

**Step 4: Remove the now-dead CSS**

Delete the `.dash-tab-add-wrap`, `.dash-tab-add-btn`, `.dash-tab-add-btn:hover`, `.dash-tab-add-search`, `.dash-tab-add-search input`, `.dash-tab-add-results` rules from `styles.css` (added in phase 1, now fully superseded). Verify with `grep -n "dash-tab-add" app.js index.html styles.css` — should return nothing after this step.

**Step 5: Manual check**

Reload, reach Dashboard, open a tab via the header search bar (search a customer name, click the result) — confirm it opens/focuses a tab in the header's tab strip. Confirm there is no `+` button anywhere in the tab strip anymore, and no console errors.

**Step 6: Commit**

```bash
git add app.js styles.css
git commit -m "refactor: remove redundant tab-add search popover, superseded by unified header search"
```

---

### Task 5: Cross-screen tab navigation

**Files:**
- Modify: `app.js`

**Step 1: Add a small navigation helper**

Add near `showScreen()`:
```js
// Brings the Dashboard screen into view if it isn't already showing — used
// whenever focusing a tab needs to guarantee its content is actually visible,
// since tabs (in the header) and their content (on the Dashboard screen) can
// now be interacted with from any screen.
function ensureDashboardScreen() {
  if (document.getElementById('screen-dashboard').hasAttribute('hidden')) {
    showScreen('dashboard');
  }
}
```

**Step 2: Call it from `openTab` and `setActiveTab`**

These are the two functions that focus a tab — `openTab` is reachable from the header search bar (any screen) and from a product-table row click (Dashboard only); `setActiveTab` is reachable from clicking a tab in the header's tab strip (any screen). Both need to guarantee the Dashboard is visible afterward.

In `openTab` (app.js, currently lines 898–913), add the call right before `renderDashboard()`:
```js
function openTab(type, targetId, label) {
  const existing = state.tabs.find(t => t.type === type && t.targetId === targetId);
  if (existing) {
    state.activeTabId = existing.id;
  } else {
    const catalog = TAB_WIDGET_CATALOG[type] || [];
    const tab = {
      id: `${type}-${targetId}`, type, targetId, label, pinned: false,
      widgets: catalog.map(w => w.id),
      widgetSizes: {},
    };
    state.tabs.push(tab);
    state.activeTabId = tab.id;
  }
  ensureDashboardScreen();
  renderDashboard();
}
```

In `setActiveTab` (app.js, currently lines 915–918):
```js
function setActiveTab(tabId) {
  state.activeTabId = tabId;
  ensureDashboardScreen();
  renderDashboard();
}
```

Note `ensureDashboardScreen()` calling `showScreen('dashboard')` already triggers `renderAppHeader()` (Task 3) and (per Task 3's simplified `renderDashboard()`) the subsequent `renderDashboard()` call re-renders the tab strip again — a small, harmless double-render when navigating screens, not worth adding coordination logic to avoid in a prototype.

**Step 3: Manual check**

From the Manager screen, use the header search bar to open a customer tab — confirm the screen switches to Dashboard and the tab is focused, showing that customer's content. From the Dashboard, click a different tab in the header — confirm it stays on Dashboard (no unnecessary screen flicker) and focuses correctly. From Edit Home Screen, click an already-open tab in the header — confirm it navigates to Dashboard and focuses it.

**Step 4: Commit**

```bash
git add app.js
git commit -m "feat: navigate to Dashboard when a tab is opened or focused from another screen"
```

---

### Task 6: Popover mutual exclusivity (search / notifications / avatar menu)

**Files:**
- Modify: `app.js`

**Step 1: Add a shared close-all helper and `toggleAvatarMenu`**

Add near `toggleNotifPanel` (app.js, currently around line 1444):
```js
function closeAllHeaderPopovers() {
  document.getElementById('dashboard-notif-panel').hidden = true;
  document.getElementById('dashboard-search-results').hidden = true;
  document.getElementById('app-header-avatar-menu').hidden = true;
}

function toggleAvatarMenu(show) {
  const menu = document.getElementById('app-header-avatar-menu');
  const nextOpen = show === undefined ? menu.hidden : show;
  closeAllHeaderPopovers();
  menu.hidden = !nextOpen;
}
```

**Step 2: Update `toggleNotifPanel` to close the others first**

Replace `toggleNotifPanel` (app.js, currently lines 1444–1447):
```js
function toggleNotifPanel(show) {
  const panel = document.getElementById('dashboard-notif-panel');
  const nextOpen = show === undefined ? panel.hidden : show;
  closeAllHeaderPopovers();
  panel.hidden = !nextOpen;
}
```

**Step 3: Update `renderSearchResults` to close the others when it's about to show results**

In `renderSearchResults` (app.js, currently starting line 1462), right after the early-return empty-query check (`if (!q) { results.hidden = true; results.innerHTML = ''; return; }`), add:
```js
closeAllHeaderPopovers();
```
before the rest of the function proceeds to build and show results. (`closeAllHeaderPopovers()` also hides `dashboard-search-results` itself — harmless, since the function immediately re-shows it via `results.hidden = false` a few lines later once it has content to display.)

**Step 4: Extend the outside-click handler**

In `init()`'s document click listener, add a check for the avatar menu (the `.dash-tab-add-wrap` check was already removed in Task 4):
```js
document.addEventListener('click', e => {
  if (!e.target.closest('.notif-bell-wrap')) document.getElementById('dashboard-notif-panel').hidden = true;
  if (!e.target.closest('.dash-search')) document.getElementById('dashboard-search-results').hidden = true;
  if (!e.target.closest('.app-header-avatar-wrap')) document.getElementById('app-header-avatar-menu').hidden = true;
});
```

**Step 5: Manual check**

Open the notif panel, then click the avatar button — confirm the notif panel closes and the avatar menu opens (not both open at once). Open the avatar menu, then start typing in the search bar — confirm the avatar menu closes as search results appear. Click outside all three — confirm whichever is open closes.

**Step 6: Commit**

```bash
git add app.js
git commit -m "feat: make header search results, notifications, and avatar menu mutually exclusive popovers"
```

---

### Task 7: Full end-to-end verification pass

**Files:** none (verification only)

**Step 1: Reuse and extend the phase 1 Playwright harness**

A headless-Chromium Playwright script already exists from phase 1 verification (set up under a scratch npm project with `playwright` installed — recreate it if it's no longer present: `npm init -y && npm install playwright && npx playwright install chromium` in a scratch directory, then drive `file:///.../index.html` with `chromium.launch()`/`browser.newPage()`).

Extend that script (or write a fresh one) to additionally verify, on top of the phase 1 checks:
1. The header is hidden on all three onboarding screens (`#app-header` has the `hidden` attribute) and visible starting at Edit Home Screen.
2. The header's search bar opens a customer tab and an RO tab (replacing the old `+`-popover checks from phase 1, which no longer exist).
3. A tab opened via search remains visible in the header while navigating to Edit Home Screen and to the Manager screen (`#dashboard-tab-strip .dash-tab` count stays the same across screen switches).
4. Clicking that tab from the Manager screen navigates back to the Dashboard screen (`#screen-dashboard` loses its `hidden` attribute) and focuses the tab.
5. The avatar button opens a dropdown showing "Signed in as: {role name}"; for a non-manager role, "Manage Dealership Views" is hidden; clicking "Reset password" or "Edit profile" shows a toast and closes the menu.
6. Opening the notif panel then clicking the avatar button closes the notif panel and opens the avatar menu (mutual exclusivity).
7. The help button shows a toast.
8. No console errors throughout.

**Step 2: Run it and fix any failures**

```bash
node verify.js
```
If any check fails, diagnose whether it's a test-script issue (timing, wrong selector, wrong expectation — as happened twice during phase 1's equivalent pass) or a real app bug, fix accordingly, and re-run until everything passes with zero console errors.

**Step 3: Report**

No commit needed for this task unless it surfaces a real bug fix — in that case, commit the fix with a `fix:` message describing the specific behavior corrected.

---

## Out of Scope (carried over from the design doc)

- Real password reset / profile editing flows (stubs only).
- Real help content.
- Changes to the left nav rail, product tables, more-details drawer, or onboarding screens — all carried over unchanged from phase 1.
