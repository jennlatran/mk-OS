# Global App Header — Design

## Context

The phase 1 app shell (left nav rail, product-table base surface, tab strip, more-details drawer — see `2026-08-21-app-shell-design.md`) currently has per-screen topbars: Dashboard's `home-topbar` (role icon/name, search, notif bell, Manage Dealership Views), Edit Home Screen's own `home-topbar` (role icon/name only), and Manager/Manager-edit's `manager-header` (back-link + heading). This adds a single global 40px header shared across all post-onboarding screens, consolidating chrome that today is scattered and screen-specific.

This work lands on the same branch/PR as phase 1 (`feature/app-shell-phase1`), before merge.

## Layout

A new top-level region inside `#app-frame`, above whichever post-onboarding screen is active (Edit Home Screen, Dashboard, Manager, Manager-edit). Onboarding screens are unaffected — the header does not render behind them, preserving their current chrome-free, branded-sidebar layout.

```
┌──────────────────────────────────────────────────────────────────┐
│ [myK] [search......] [tab][tab][tab]······  [🔔][❓][JD]         │ 40px
├──────────────────────────────────────────────────────────────────┤
│                         active screen content                     │
```

Flex row, `height: 40px`, `flex-shrink: 0`, full width of the device-frame (narrows with the prototype's tablet/mobile preview toggle, same as the rest of the product chrome — this is NOT the dev-only proto-toolbar, which stays outside the device frame). `border-bottom: 1px solid var(--border)`.

Left to right: logo (fixed width, small icon+wordmark ~20px icon), search bar (fixed ~240px, ~26px tall, 13px text), tabs (`flex: 1`, horizontally scrollable — same overflow pattern as today's `.dash-tab-list`), then a fixed-width right-aligned icon cluster: notifications, help, avatar. All elements shrink from current sizing to fit 40px (tab chips ~28px tall, icon buttons ~28×28px, avatar a 24px circle). Notification/help/avatar dropdown panels still render at normal size below the header — only the trigger row is compressed.

**Per-screen topbar changes:**
- **Edit Home Screen**: loses its `home-topbar` role icon/name row entirely; "Edit your products — remove with the ✕, or add more below." plus the Done button move to a plain in-content header below the global bar.
- **Dashboard**: loses its `home-topbar` entirely (search/bell/manage-views already live in the global header now); left nav rail and base surface/tab content are untouched, still sitting below the header.
- **Manager / Manager-edit**: keep their existing back-link + heading, now rendered below the global header instead of at the screen's very top.

## Search Unification

The tab strip's `+` popover (`bindTabAddSearch`, and the `matchCustomers`/`matchROs` helpers it shares with the global search) is removed entirely. The header's single search bar keeps today's `renderSearchResults`/`handleSearchResultClick` behavior unchanged: customer/RO results open or focus a tab via `openTab` (existing dedupe-by-id logic, unchanged); an app result calls `focusNavProduct`, which now also needs to navigate to the Dashboard screen first if searched from elsewhere (see below).

## Tabs Relocation & Cross-Screen Navigation

Tabs move into the header, rendered by the same `renderTabStrip()` now targeting a new `#app-header-tabs` mount instead of `#dashboard-tab-strip`. A new top-level `renderAppHeader()` runs on every screen transition (called from `showScreen()` or immediately after it), not just from `renderDashboard()`, so the header (logo, search, tabs, notif badge, avatar) stays current regardless of which screen is showing.

Since `state.tabs` is already global in-memory state, a tab opened from the Dashboard remains visible in the header on every other screen. `setActiveTab(tabId)` gains a `showScreen('dashboard')` call so clicking a tab from a non-Dashboard screen both focuses it and navigates to where its content is visible. This applies uniformly, including from Manager-edit — clicking a tab mid-edit navigates away immediately. This introduces no new data-loss risk: Manager-edit's `state.managerEditSelected` isn't persisted until "Save view" is clicked, identical to today's existing back-link behavior.

## Notifications, Help, Avatar

- **Notifications**: existing `renderNotifBell()`/`renderNotifPanel()` relocate into the header's icon cluster, unchanged in behavior — just a smaller trigger button.
- **Help**: a new stub icon button — `showToast("Help isn't available in this prototype yet.")`, consistent with the existing pattern for other not-yet-real actions (e.g. "Request Widget").
- **Avatar**: a 24px circle with mocked initials ("JD", matching the onboarding sidebar's existing "Welcome, John!" mock user). Click opens a dropdown (reusing the notif panel's styling) containing:
  - Read-only "Signed in as: {role name}" line — replaces the old role icon/name display.
  - **Manage Dealership Views** — real, shown only for `manager-admin` (same `state.role !== 'manager-admin'` gate used today), navigates to the existing Manager screen.
  - **Reset password** / **Edit profile** — stub entries, each a toast, since no backend exists.

## State Model

```js
state.headerAvatarOpen = false   // avatar dropdown open/closed, transient — not persisted
```
The notif panel keeps its existing open/closed toggle, reused as-is. Only one of {search results, notif panel, avatar dropdown} is open at a time — opening one closes the others, matching today's existing single-instance-popover pattern.

## Edge Cases

- Manager-only avatar item hidden via the same role check already in use.
- Tabs remain clickable and navigate away from every screen, including Manager-edit — deliberately not special-cased per-screen, since disabling only introduces inconsistent, undocumented behavior for a case that carries no actual data-loss risk.
- Popover mutual exclusivity (search / notif / avatar) prevents overlapping open panels.

## Out of Scope

- Real password reset / profile editing flows (stubs only).
- Real help content.
- Changes to the left nav rail, product tables, more-details drawer, or onboarding screens — all carried over unchanged from phase 1.
