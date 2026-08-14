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

## What's Built

### Prototype toolbar
A demo-only bar (not part of the product) for reviewing the flow: jump directly to any screen, toggle the preview between Desktop / Tablet / Mobile device-frame widths, and reset the whole session.

### Onboarding
- **Pick a role** — BDC Rep, Parts Rep, Service Advisor, Service Manager or Dealership Admin, Technician. Select-then-confirm (tap a role, then **Next**), with a branded welcome sidebar shown only on this step.
- **Choose how to start** — a myKaarma-recommended app set for the role, or start from scratch.
- **Start from scratch** — an AI-prompt box ("tell mkOS what you want to do") suggests apps from a mocked keyword match, plus the full app marketplace to browse and pick manually.

### Edit Home Screen
Always-editable app tile grid (no separate "customize mode") — remove apps with the ✕, add more from the marketplace below. **Done** advances to the Dashboard.

### Dashboard
The real landing screen once setup is done:
- **Global search** — find a customer (name/phone/email), a repair order (RO number), or jump to an app, all from one box.
- **Notification bell** — a unified feed across vehicle updates, customer messages awaiting response, and internal peer communication. Filterable by type; the badge counts action-required items only; resolving one clears it.
- **Tab strip** — Chrome-style. Opening a customer or RO always adds a tab (or focuses it if already open, never duplicates). Pin a tab to keep it across reloads (persisted via `localStorage`); unpinned tabs reset every session.
- **Overview tab** — the app widget grid, each widget resizable between a compact **Small** stat and a fuller **Large** card/table. Sizes persist across reloads independent of anything a manager has locked at the content level.
- **Customer / RO tabs** — intentionally minimal functional placeholders (contact info + open ROs for a customer; status + vehicle for an RO) so the tab and cross-linking mechanics can be demoed. The real content design for these is still being worked out.

### App Marketplace
Replaces the old "pick from a list" catalog everywhere apps are added (Edit Home Screen, the scratch builder, and Manager's Edit view):
- Search and filter by **Category**, **Pricing** (Free / Add to Plan), **Created By** (myKaarma / Partner / You), and **Label** (Best Seller / Spotlight).
- **Add** (free apps, instant) vs. **Add to Plan** (sends a mocked request to sales, button becomes "Requested").
- **Create Your Own App** — a lightweight form (name, category, and a checklist of mocked API endpoints/data sources) that adds a custom app tagged "Created by: You".

### Manager / IT View
Reachable from the Dashboard (manager-admin role only). Set a default app view per role dealership-wide, and choose per-role whether that's an **editable default** individual users can adjust, or **locked**.

## Design System

Carries over the myKaarma token set (`--brand`, `--bg-surface`, `--text-primary`, spacing/radius scale, `mk-button` variants, etc.) from the order-status prototype for visual consistency, scoped to `#shell.light`.

## Project Structure

```
mk-OS/
├── index.html      # All screens: onboarding, Edit Home Screen, Dashboard, Manager views, Create App modal
├── styles.css      # Design tokens, layout, and every component's styling
└── app.js          # Mock data, app state, rendering, and all event handling
```

## Mock Data

Everything — apps, roles, recommended sets, customers, repair orders, notifications, widget content — is hardcoded in `app.js` for demo purposes. `localStorage` is used for two things only: pinned dashboard tabs and per-widget size preference, so those two specifically survive a page reload; everything else resets.
