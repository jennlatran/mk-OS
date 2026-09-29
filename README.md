# mkOS

A clickable prototype for **mkOS** — an Android-like, service-oriented app shell for myKaarma's dealership software. Pure HTML, CSS, and vanilla JavaScript with no build step or external dependencies beyond Google Material Icons and the Inter typeface.

## Background

mkOS is a greenfield concept: instead of one fixed dealership UI, users pick a role and get a customizable, opinionated-by-default home screen built from individual "apps" (Communication, Payments, Inspections, Appointment Scheduler, Follow Up, Transportation, Mobile Service, etc.). The philosophy — no sacred spaces, strongly opinionated defaults, everything customizable — mirrors Android's service-oriented app model. A future platform step (not yet part of this prototype) lets dealers build their own apps against myKaarma's APIs.

This repo is the first pass built for design review: a fast, honest way to click through the model before investing in real design/engineering.

## Running Locally

Open `index.html` directly in a browser — no server or build step required.

```bash
open index.html
```

## Rollout Showcase (V0 / V1 / V2)

To walk stakeholders through the planned rollout, the repo is published to **GitHub Pages** with one folder per version. Every page has a version-switcher pill in the bottom-right corner for jumping between them.

| Version | Folder | Live URL | What it is |
|---|---|---|---|
| **V0** | `v0/` | https://jennlatran.github.io/mk-OS/v0/ | Pixel-accurate recreation of today's live production UI (horizontal nav) — the baseline everyone currently uses. Includes a "Try New View" button linking to V1. |
| **V1 — Vertical Nav** | `v1/` | https://jennlatran.github.io/mk-OS/v1/ | Draft concept: same Customer-tab content as V0, but with the nav moved to a collapsible/hover-expand vertical rail, a dealer-group switcher, dark mode, an "Ask MK" AI entry point, and a "Switch to Old View" button that prompts for feedback before navigating back to V0 (logged to `localStorage` for now — no backend yet). |
| **V2 — Current Prototype** | `/` (this repo's root, described below) | https://jennlatran.github.io/mk-OS/ | The actively-developed mkOS shell prototype. |

V0 and V1 are self-contained single-file pages (their own inline CSS/JS) so they render correctly as static GitHub Pages content independent of this root prototype's `app.js`/`styles.css` — V1 does link to the root `styles.css` for its header/nav-rail styling, matching the real app's design tokens.

## What's Built

### Prototype toolbar
A demo-only bar (not part of the product) for reviewing the flow: jump directly to any screen, toggle the preview between Desktop / Tablet / Mobile device-frame widths, and reset the whole session.

### Onboarding
- **Pick a role** — BDC Rep, Parts Rep, Service Advisor, Service Manager or Dealership Admin, Technician, Loaner Manager. Select-then-confirm (tap a role, then **Next**), with a branded welcome sidebar shown only on this step.
- **Choose how to start** — three options: **myKaarma Recommended** and **Dealer Recommended** (the dealership's own configured default for that role, set via Manager's Edit view — same as myKaarma's until a manager customizes it), each with a schematic thumbnail preview of the layout, and **Start from Scratch** de-emphasized to a plain text link below.
- **Start from scratch** — an AI-prompt box ("tell mkOS what you want to do") suggests apps from a mocked keyword match, plus the app marketplace to browse and pick manually. "Create Your Own App" is intentionally excluded here — building apps isn't part of initial setup.

### Edit Home Screen
Always-editable product tile grid (no separate "customize mode") — remove products with the ✕, add more from the marketplace below. **Done** advances to the Dashboard. A one-time dismissible banner appears here if a manager has just locked this role's default view.

### Global App Header
A 40px bar shown on every post-onboarding screen (Edit Home Screen, Dashboard, Manager views) — onboarding keeps its own chrome-free, branded-sidebar layout instead:
- **myKaarma logo**, far left.
- **Search** — find a customer (name/phone/email) or a repair order (RO number) and open/focus its detail tab, or jump to a product already in your nav rail. This is the only way to open a customer/RO detail tab; there's no separate "add tab" control.
- **Tab strip** — Chrome-style, global (not scoped to the Dashboard). Opening a customer or RO always adds a tab (or focuses it if already open, never duplicates). Tabs stay visible and clickable from any screen; clicking one navigates back to the Dashboard and focuses it. Pin a tab to keep it across reloads (persisted via `localStorage`); unpinned tabs reset every session.
- **Notification bell** — a unified feed across vehicle updates, customer messages awaiting response, and internal peer communication. Filterable by type; the badge counts action-required items only; resolving one clears it.
- **Help button** — stub, shows a toast (no real help content in this prototype).
- **User avatar** — mocked initials; opens a menu with your current role, **Manage Dealership Views** (manager-admin only), and stub **Reset password** / **Edit profile** entries.
- Search results, the notification panel, and the avatar menu are mutually exclusive — opening one closes the others.

### Dashboard
The real landing screen once setup is done:
- **Left product nav rail** — lists the products in your current view. Three display modes, set via the toggle at the bottom of the rail and persisted via `localStorage`: **Keep collapsed** (icons only), **Keep expanded** (icons + labels), or **Expand on hover** (collapsed by default, expands in place on mouseenter, collapses on mouseleave without shifting the content beside it). An **Edit** button opens Edit Home Screen to change which products appear.
- **Base surface** — selecting a product renders a full data table for it (every product has one). Clicking a row opens a tab labeled with that product's own icon and name — not the underlying customer/RO's — showing a placeholder page for now (a future pass will show real per-row detail there). Each row still opens its own distinct tab (never duplicating on re-click); selecting the product again returns focus to its table without closing any tabs you've opened.
- **Customer / RO detail tabs** (opened via the header search, not from a product-table row) — a generalized widget system: Vehicles, Open Repair Orders, Appointment History, Multipoint Inspections, and Payments & Invoices (Customer), or RO Details and Customer (RO) all render as draggable, resizable, removable widgets. Every open tab has its own independent widget list and sizes — two different customers' tabs can look completely different. An **Add Widget** button (hidden by default, with a **Close** to collapse it again) reveals the same app marketplace used everywhere else, letting you add page-info widgets *or* any app as an embedded widget on that record — minus "Create Your Own App," which doesn't apply inside a tab's picker. An RO tab's **RO Details** widget has a **More details** link that opens a single-instance slide-in drawer on the right; a second trigger replaces its content rather than stacking.

### App Marketplace
One shared component reused everywhere apps get added — Edit Home Screen, the scratch builder, Manager's Edit view, and each Customer/RO tab's Add Widget picker:
- Search and filter by **Category**, **Pricing** (Free / Paid), **Created By** (myKaarma / Partner / You), and **Label** (Best Seller / Spotlight).
- **Add Widget** (free apps, instant) vs. **Request Widget** (sends a mocked request to sales, button becomes "Requested").
- **Create Your Own App** — a lightweight form (name, category, and a checklist of mocked API endpoints/data sources) that adds a custom app tagged "Created by: You". Hidden during onboarding and inside tab widget pickers, where creating a new app isn't contextually relevant.

### Manager / IT View
Reachable from the header's avatar menu (manager-admin role only). Set a default app view per role dealership-wide, and choose per-role whether that's an **editable default** individual users can adjust, or **locked**. Newly locking a role triggers the one-time banner on that role's Edit Home Screen.

## Design System

Carries over the myKaarma token set (`--brand`, `--bg-surface`, `--text-primary`, spacing/radius scale, `mk-button` variants, etc.) from the order-status prototype for visual consistency, scoped to `#shell.light`.

## Project Structure

```
mk-OS/
├── index.html      # V2 — All screens: onboarding, Edit Home Screen, Dashboard, Manager views, Create App modal
├── styles.css      # Design tokens, layout, and every component's styling
├── app.js          # Mock data, app state, rendering, and all event handling
├── v0/
│   └── index.html  # V0 — self-contained recreation of today's production horizontal-nav UI
└── v1/
    └── index.html  # V1 — self-contained "Vertical Nav" draft (links to the root styles.css)
```

## Mock Data

Everything — apps, roles, recommended sets, customers, vehicles, repair orders, appointments, inspections, invoices, notifications, per-product table rows, widget content — is hardcoded in `app.js` for demo purposes. `localStorage` persists two things across a reload: the nav rail's display mode, and pinned tabs; everything else (including a Customer/RO tab's own widget arrangement, and the currently-selected product) resets on reload unless a tab is pinned.
