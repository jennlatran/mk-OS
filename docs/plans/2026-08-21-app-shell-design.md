# mkOS Phase 1 App Shell — Design

## Context

Today, after onboarding, the Dashboard's "Overview" tab shows an app widget grid (small stat tiles or large embedded-table previews). Phase 1 replaces that model with a persistent left navigation rail listing the user's products (Appointments, Inspect, etc.), where selecting a product shows a full data table for it in the main content area. This is a genuine navigation paradigm shift, not an incremental change to the widget grid.

## Layout

Three horizontal regions, persistent after role/onboarding:

```
┌────────┬─────────────────────────────────────────┐
│  Left  │  Tab strip (empty until a tab opens)     │
│  Nav   ├─────────────────────────────────────────┤
│  Rail  │  Base surface: selected product's table  │
│        │  (or focused tab's detail view)          │
└────────┴─────────────────────────────────────────┘
```

A single-instance slide-in drawer overlays from the right edge on top of this, only when a "more details" trigger (not a table row) is used.

## Left Nav Rail

Three display modes, chosen via a control at the bottom of the rail (mirroring the reference screenshot's toggle), persisted to `localStorage` (`mkos-nav-mode`):

1. **Collapsed** — icon-only, fixed narrow width (~64px).
2. **Expanded** — icon + label, wider fixed width (~240px).
3. **Hover-to-expand** — rail sits collapsed; expands in place on `mouseenter` over the rail's bounding box (absolutely positioned so it doesn't reflow the table underneath); collapses back on `mouseleave`. Direct enter/leave, no delay.

Nav content is `state.navProducts` (renamed from today's `state.homeApps`) — same underlying app IDs, same marketplace add/remove and manager lock/default mechanism as today, rendered as a vertical nav list instead of a tile grid. Editing the nav list stays on the existing separate **Edit Home Screen** flow, unchanged in navigation entry point.

Clicking a product sets `state.selectedProduct = id` and `state.activeTabId = null` (returns focus to the base surface) without closing any open tabs.

## Base Surface & Tabs

**Base surface** (no tab focused): renders a full mocked data table for `state.selectedProduct`. Every product in the nav gets a real table for phase 1 (columns + rows appropriate to that product, e.g. Appointments: Customer, Vehicle, Date/Time, Status, Advisor).

**Tab strip** is independent of `selectedProduct` and starts empty — no default/pinned tab (unlike today's pinned Overview tab). A tab is created only by:
- Clicking a table row → opens/focuses a **detail tab** for that record (customer or RO, depending on the product's row type). Reuses today's "focus if already open, never duplicate" logic.
- Clicking `+` in the tab strip → opens a search box (customer name/phone/email, or RO number) → selecting a result opens/focuses that record's tab. Same underlying mechanism as today's global-search-to-tab, triggered from `+`.

**Focus switching:** clicking a tab sets `state.activeTabId`. Clicking a left-nav product resets it to `null` (tabs remain open in the strip, just unfocused). Closing a tab (✕) removes it from the array; if it was active, focus falls back to the base surface (`null`), never to another tab.

**Detail tab content** reuses today's widget-based Customer/RO tab content (Vehicles, Open ROs, Appointment History, Payments, etc.) unchanged.

## "More Details" Drawer

Triggered by a details affordance that is not a row click (e.g., an info icon/button on a row, or a link inside a detail tab's widget). Opens as a right-side slide-in overlay, single instance — a second trigger while one is open replaces its contents rather than stacking. Closes via explicit ✕ or backdrop click. Transient state, not persisted across reload.

## State Model

```js
state.navMode = 'collapsed' | 'expanded' | 'hover'   // persisted: mkos-nav-mode
state.navProducts = [...]                             // renamed from homeApps; same marketplace/lock logic
state.selectedProduct = <appId>                        // not persisted — resets to first nav product on reload
state.tabs = []                                        // was seeded with a pinned 'overview' tab; now starts empty
state.activeTabId = null                               // null = base surface; pinned-tab persistence unchanged
state.detailsDrawer = { open: false, ... }              // transient, not persisted
```

## Edge Cases

- Manager removes/locks a product that is currently `selectedProduct` → fall back to the first available nav product.
- Nav list is empty (no products added) → base surface shows the existing "No apps yet" placeholder, pointing at Edit Home Screen.
- Hover-expand: listens on the rail's own `mouseenter`/`mouseleave` (not per-item) to avoid flicker on rapid mouse movement across the boundary.
- Reload with pinned tabs: pinned tabs restore into `state.tabs` as before, but `activeTabId` resets to `null` (base surface) rather than auto-focusing a restored tab.

## Architecture Approach

Refactor the existing Dashboard/tab code in place (rather than building a parallel module). Reuses one codebase path for tabs, marketplace, and manager-lock logic instead of duplicating it — the Overview widget-grid concept is retired in favor of the base-surface/table model described above.

## Out of Scope (Phase 1)

- Dealer-built custom apps via myKaarma APIs.
- Voice interface / in-system AI assistant.
- A generalized "surface stack" abstraction for arbitrary future product types — the nav/tab model above is fixed to today's known product list.
