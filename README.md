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
- **Pick a role** — BDC Rep, Parts Rep, Service Advisor, Service Manager or Dealership Admin, Technician, Loaner Manager. Select-then-confirm (tap a role, then **Next**), with a branded welcome sidebar shown only on this step.
- **Choose how to start** — three options: **myKaarma Recommended** and **Dealer Recommended** (the dealership's own configured default for that role, set via Manager's Edit view — same as myKaarma's until a manager customizes it), each with a schematic thumbnail preview of the layout, and **Start from Scratch** de-emphasized to a plain text link below.
- **Start from scratch** — an AI-prompt box ("tell mkOS what you want to do") suggests apps from a mocked keyword match, plus the app marketplace to browse and pick manually. "Create Your Own App" is intentionally excluded here — building apps isn't part of initial setup.

### Edit Home Screen
Always-editable app tile grid (no separate "customize mode") — remove apps with the ✕, add more from the marketplace below. **Done** advances to the Dashboard. A one-time dismissible banner appears here if a manager has just locked this role's default view.

### Dashboard
The real landing screen once setup is done:
- **Global search** — find a customer (name/phone/email), a repair order (RO number), or jump to an app, all from one box.
- **Notification bell** — a unified feed across vehicle updates, customer messages awaiting response, and internal peer communication. Filterable by type; the badge counts action-required items only; resolving one clears it.
- **Tab strip** — Chrome-style. Opening a customer or RO always adds a tab (or focuses it if already open, never duplicates). Pin a tab to keep it across reloads (persisted via `localStorage`); unpinned tabs reset every session.
- **Overview tab** — the app widget grid. Each widget is resizable (**Small** stat / **Large** card or table) and **drag-to-reorder**; both size and order persist across reloads via `localStorage`, independent of anything a manager has locked at the content level.
- **Customer / RO tabs** — built on the same generalized widget system as Overview: Vehicles, Open Repair Orders, Appointment History, Multipoint Inspections, and Payments & Invoices (Customer), or RO Details and Customer (RO) all render as draggable, resizable, removable widgets. Every open tab has its own independent widget list and sizes — two different customers' tabs can look completely different. An **Add Widget** button (hidden by default, with a **Close** to collapse it again) reveals the same app marketplace used everywhere else, letting you add page-info widgets *or* any app as an embedded widget on that record — minus "Create Your Own App," which doesn't apply inside a tab's picker.

### App Marketplace
One shared component reused everywhere apps get added — Edit Home Screen, the scratch builder, Manager's Edit view, and each Customer/RO tab's Add Widget picker:
- Search and filter by **Category**, **Pricing** (Free / Paid), **Created By** (myKaarma / Partner / You), and **Label** (Best Seller / Spotlight).
- **Add Widget** (free apps, instant) vs. **Request Widget** (sends a mocked request to sales, button becomes "Requested").
- **Create Your Own App** — a lightweight form (name, category, and a checklist of mocked API endpoints/data sources) that adds a custom app tagged "Created by: You". Hidden during onboarding and inside tab widget pickers, where creating a new app isn't contextually relevant.

### Manager / IT View
Reachable from the Dashboard (manager-admin role only). Set a default app view per role dealership-wide, and choose per-role whether that's an **editable default** individual users can adjust, or **locked**. Newly locking a role triggers the one-time banner on that role's Edit Home Screen.

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

Everything — apps, roles, recommended sets, customers, vehicles, repair orders, appointments, inspections, invoices, notifications, widget content — is hardcoded in `app.js` for demo purposes. `localStorage` persists three things across a reload: pinned dashboard tabs, Overview widget sizes, and Overview widget order; everything else (including a Customer/RO tab's own widget arrangement) resets on reload unless that tab is pinned.
