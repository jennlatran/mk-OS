/* ============================================================
   DATA — app catalog, roles, per-role recommendations
   ============================================================ */
// pricing: 'free' | 'plan' ("Request App"/"Request Widget" sends a request to sales instead of adding instantly)
// createdBy: 'myKaarma' | 'Partner' | 'You' — 'You' is unused for now; "Create Your Own App" is hidden
// label: null | 'bestseller' | 'spotlight' — a mix of install-driven ranking and myKaarma team curation
const APPS = [
  { id: 'messages',         name: 'Messages',           icon: 'chat',           cat: 'Communication', pricing: 'free', createdBy: 'myKaarma', label: 'bestseller', desc: 'Text, call, and message customers from one thread, synced to the repair order.' },
  { id: 'appointments',     name: 'Appointments',       icon: 'event',          cat: 'Appointments',  pricing: 'free', createdBy: 'myKaarma', label: 'bestseller', desc: 'Online and phone booking with real-time bay/tech capacity.' },
  { id: 'payments',         name: 'Payments',           icon: 'payments',       cat: 'Payments',      pricing: 'plan', createdBy: 'myKaarma', label: 'bestseller', desc: 'Collect payment in-person, online, or by text with surcharge and split-tender support.' },
  { id: 'inspect',          name: 'Inspect',            icon: 'fact_check',     cat: 'Inspection',    pricing: 'plan', createdBy: 'myKaarma', label: 'spotlight', desc: 'Guided digital inspections, with workflows and statuses configurable per dealer.' },
  { id: 'video',            name: 'Video',              icon: 'videocam',       cat: 'Inspection',    pricing: 'plan', createdBy: 'myKaarma', label: null, desc: 'Customer and loaner walkarounds, plus technician video inspections, in one place.' },
  { id: 'pickup-delivery',  name: 'Pickup & Delivery',  icon: 'local_shipping', cat: 'Logistics',     pricing: 'plan', createdBy: 'Partner',  label: null, desc: 'Dispatch and track pickup, delivery, and loaner-swap trips from a live board.' },
  { id: 'follow-up',        name: 'Follow Up',          icon: 'campaign',       cat: 'Marketing',     pricing: 'plan', createdBy: 'myKaarma', label: 'spotlight', desc: 'Automated reminders and win-back campaigns based on service history.' },
  { id: 'uber',             name: 'Uber',               icon: 'local_taxi',     cat: 'Logistics',     pricing: 'plan', createdBy: 'Partner',  label: null, desc: 'Book and manage rideshare trips for customers waiting on service.' },
  { id: 'mobile-service',   name: 'Mobile Service',     icon: 'build',          cat: 'Logistics',     pricing: 'plan', createdBy: 'Partner',  label: null, desc: 'Dispatch a technician to the customer for on-site service and payment.' },
  { id: 'vehicle-tracking', name: 'Vehicle Tracking',   icon: 'my_location',    cat: 'Operations',    pricing: 'plan', createdBy: 'myKaarma', label: null, desc: 'Live location for loaner, shuttle, and service vehicles.' },
];

const CATEGORIES = ['Appointments', 'Payments', 'Inspection', 'Communication', 'Marketing', 'Logistics', 'Operations'];

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
  { id: 'loaner-manager', name: 'Loaner Manager',                      icon: 'car_rental' },
];

// Parts Rep and Loaner Manager lost the apps their old defaults leaned on
// (Parts Lookup/Ordering, Transportation, Customer Directory, Reporting — all
// dropped from the catalog). These are best-fit substitutes from the new 10,
// not a like-for-like replacement — flagged for a app/role conversation,
// not something this prototype can resolve on its own.
const RECOMMENDED = {
  'bdc-rep':          ['messages', 'appointments', 'follow-up', 'pickup-delivery'],
  'parts-rep':        ['messages', 'appointments', 'payments'],
  'service-advisor':  ['messages', 'appointments', 'payments', 'inspect', 'video', 'follow-up'],
  'manager-admin':    ['appointments', 'payments', 'follow-up', 'messages'],
  'technician':       ['inspect', 'video', 'vehicle-tracking', 'mobile-service'],
  'loaner-manager':   ['pickup-delivery', 'vehicle-tracking', 'messages', 'mobile-service'],
};

// Rough keyword → app mapping for the "start from scratch" AI prompt (mocked, no real model).
const AI_KEYWORDS = {
  messages:            ['text', 'call', 'message', 'customer', 'chat'],
  appointments:        ['schedule', 'appointment', 'book'],
  payments:            ['pay', 'payment', 'invoice', 'charge', 'bill'],
  inspect:             ['inspect', 'multipoint', 'mpi', 'commercial van'],
  video:               ['walkaround', 'video', 'record', 'technician inspection'],
  'pickup-delivery':   ['pickup', 'delivery', 'tow', 'shuttle', 'dispatch', 'trip'],
  'follow-up':         ['follow up', 'follow-up', 'campaign', 'remind', 'entice'],
  uber:                ['uber', 'ride', 'rideshare'],
  'mobile-service':    ['mobile', 'onsite', 'on-site', 'at home', 'lead'],
  'vehicle-tracking':  ['track', 'gps', 'location', 'tracking'],
};

// Mocked live-data line shown on each app's dashboard widget (no backing data source).
const WIDGET_PREVIEW = {
  messages:            '3 unread messages',
  appointments:        '5 appointments today',
  payments:            '$1,240 collected today',
  inspect:             '2 inspections pending review',
  video:               '4 walkarounds this week',
  'pickup-delivery':   '2 trips in route',
  'follow-up':         '12 active campaigns',
  uber:                '1 ride in progress',
  'mobile-service':    '1 mobile job today',
  'vehicle-tracking':  '4 vehicles tracked live',
};

// Richer per-app rows shown when a widget is toggled to the Large preset.
const WIDGET_DETAIL = {
  messages: [
    { label: 'Jane Smith', value: '"When will my car be ready?"' },
    { label: 'Mike Johnson', value: '"Thanks for the update!"' },
    { label: 'Aisha Patel', value: '"Can I add an oil change?"' },
  ],
  appointments: [
    { label: '9:00 AM', value: 'Jane Smith — Oil Change' },
    { label: '11:30 AM', value: 'Carlos Rivera — Brake Inspection' },
    { label: '2:00 PM', value: 'Aisha Patel — 30k Service' },
  ],
  payments: [
    { label: 'RO-10198', value: '$412.50 · Paid' },
    { label: 'RO-10212', value: '$89.00 · Pending' },
    { label: 'RO-10231', value: '$1,204.00 · Paid' },
  ],
  inspect: [
    { label: 'RO-10267', value: 'Brakes flagged — needs approval' },
    { label: 'RO-10198', value: 'Passed, no issues' },
  ],
  video: [
    { label: 'Jane Smith', value: 'Customer walkaround sent' },
    { label: 'Loaner 3', value: 'Loaner walkaround recorded' },
  ],
  'pickup-delivery': [
    { label: 'Trip — Jane Smith', value: 'In route, ETA 12 min' },
    { label: 'Trip — Mike Johnson', value: 'In route, ETA 6 min' },
  ],
  'follow-up': [
    { label: 'Win-back campaign', value: '48 customers · 12 responded' },
    { label: '6-month reminder', value: '112 customers · 30 responded' },
  ],
  uber: [
    { label: 'Jane Smith', value: 'Ride ongoing, ETA 8 min' },
  ],
  'mobile-service': [
    { label: 'Carlos Rivera', value: 'On-site oil change, 1:00 PM' },
  ],
  'vehicle-tracking': [
    { label: 'Loaner 3', value: 'Moving — Main St & 5th Ave' },
    { label: 'Shuttle 1', value: 'Moving — near dealership' },
  ],
};

// Per-app table shown on the base surface (left-nav selection) when no tab is
// focused. rows() returns { cells, linkType, linkId } — linkType null means the row
// has no backing customer/RO record, so it isn't clickable.
function custName(id) { return MOCK_CUSTOMERS.find(c => c.id === id).name; }

// rows() helpers shared by the WIDGET_DETAIL-backed tables below. Every row must be
// clickable (opens a tab), so rows with no real backing customer get a synthetic,
// stable-per-row id instead of leaving linkId null.
const plainRows = key => WIDGET_DETAIL[key].map((row, i) => ({ cells: [row.label, row.value], linkType: 'row', linkId: `${key}-${i}` }));
const customerLinkedRows = key => WIDGET_DETAIL[key].map((row, i) => {
  const cust = MOCK_CUSTOMERS.find(c => c.name === row.label);
  return { cells: [row.label, row.value], linkType: cust ? 'customer' : 'row', linkId: cust ? cust.id : `${key}-${i}` };
});

// Flat apps — one table, no sub-navigation.
const APP_TABLES = {
  appointments: {
    columns: ['Customer', 'Vehicle', 'Service', 'Date', 'Status'],
    rows: () => MOCK_APPOINTMENTS.map(a => ({
      cells: [custName(a.customerId), a.vehicle, a.service, a.date, a.upcoming ? 'Upcoming' : 'Completed'],
      linkType: 'customer', linkId: a.customerId,
    })),
  },
  messages: {
    columns: ['Customer', 'Last Message'],
    rows: () => customerLinkedRows('messages'),
  },
  'follow-up': {
    columns: ['Campaign', 'Detail'],
    rows: () => plainRows('follow-up'),
  },
  'vehicle-tracking': {
    columns: ['Vehicle', 'Type', 'Assigned To', 'Status', 'Location'],
    rows: () => MOCK_VEHICLE_TRACKING.map(v => ({
      cells: [v.vehicleLabel, v.type, v.assignedTo || '—', v.status, v.location],
      linkType: 'row', linkId: v.id,
    })),
  },
};

// Fallback for any app without a APP_TABLES entry (e.g. a custom app created
// via "Create Your Own App") — an empty-state table rather than a missing render.
function appTableFor(appId) {
  return APP_TABLES[appId] || { columns: ['Detail'], rows: () => [] };
}

/* ============================================================
   APP SUB-TABS — some apps are an umbrella over several
   distinct workflows/views rather than one flat table. Every
   sub-tab is one of:
     'table'      — same {columns, rows()} shape as APP_TABLES
     'calendar'   — events grouped by date (Mobile Service's Schedule
                    renders the same underlying data as its Appointments
                    table, just grouped by day instead of listed as rows)
     'map'        — pins only, no list (Mobile Service's Global Map)
     'map-split'  — a table alongside a map that plots only a subset of
                    its rows (Pickup & Delivery's Trips: the table lists
                    every trip including ones that haven't started yet;
                    the map only plots trips currently in route, which is
                    the only pin position that means anything in real time)
   ============================================================ */
const APP_SUBTABS = {
  payments: [
    { id: 'pay-now', name: 'Pay Now', view: 'table' },
    { id: 'payment-request', name: 'Payment Request', view: 'table' },
    { id: 'order-status', name: 'Order Status', view: 'table' },
    { id: 'payment-report', name: 'Payment Report', view: 'table' },
  ],
  // Workflow names are configured per dealer in the real app — these two
  // are fillers standing in for whatever a given dealership has set up.
  inspect: [
    { id: 'customer-mpi', name: 'Customer MPI', view: 'table' },
    { id: 'commercial-vans', name: 'Commercial Vans', view: 'table' },
  ],
  video: [
    { id: 'customer-walkaround', name: 'Customer Walkaround', view: 'table' },
    { id: 'loaner-walkaround', name: 'Loaner Walkaround', view: 'table' },
    { id: 'technician-inspections', name: 'Technician Inspections', view: 'table' },
  ],
  'pickup-delivery': [
    { id: 'trips', name: 'Trips', view: 'map-split' },
    { id: 'vehicles', name: 'Vehicles', view: 'table' },
    { id: 'drivers', name: 'Drivers', view: 'table' },
    { id: 'driver-payment', name: 'Driver Payment', view: 'table' },
  ],
  'mobile-service': [
    { id: 'schedule', name: 'Schedule', view: 'calendar' },
    { id: 'appointments', name: 'Appointments', view: 'table' },
    { id: 'leads', name: 'Leads', view: 'table' },
    { id: 'technicians', name: 'Technicians', view: 'table' },
    { id: 'vehicles', name: 'Vehicles', view: 'table' },
    { id: 'global-map', name: 'Global Map', view: 'map' },
  ],
  uber: [
    { id: 'book-rides', name: 'Book Rides', view: 'table' },
    { id: 'vouchers-issued', name: 'Vouchers Issued', view: 'table' },
    { id: 'ongoing-rides', name: 'Ongoing Rides', view: 'table' },
    { id: 'past-booked', name: 'Past Booked', view: 'table' },
    { id: 'billed', name: 'Billed', view: 'table' },
  ],
};

function appHasSubtabs(appId) { return Object.prototype.hasOwnProperty.call(APP_SUBTABS, appId); }
function getSubtabs(appId) { return APP_SUBTABS[appId] || []; }
function getSubtabDef(appId, subtabId) { return getSubtabs(appId).find(s => s.id === subtabId); }

// 'table'-view sub-tabs, keyed "appId:subtabId". 'calendar'/'map'/'map-split'
// sub-tabs are rendered by dedicated functions further down instead — see
// renderSubtabContent.
const SUBTAB_TABLES = {
  'payments:pay-now': {
    columns: ['Customer', 'RO', 'Amount Due', 'Method'],
    rows: () => MOCK_INVOICES.filter(inv => inv.status === 'Pending').map(inv => ({
      cells: [custName(inv.customerId), inv.roNumber, `$${inv.amount.toFixed(2)}`, 'Card on file'],
      linkType: 'customer', linkId: inv.customerId,
    })),
  },
  'payments:payment-request': {
    columns: ['Customer', 'RO', 'Amount', 'Sent'],
    rows: () => MOCK_INVOICES.map(inv => ({
      cells: [custName(inv.customerId), inv.roNumber, `$${inv.amount.toFixed(2)}`, inv.date],
      linkType: 'customer', linkId: inv.customerId,
    })),
  },
  'payments:order-status': {
    columns: ['Invoice', 'Customer', 'RO', 'Amount', 'Status'],
    rows: () => MOCK_INVOICES.map(inv => ({
      cells: [inv.id.toUpperCase(), custName(inv.customerId), inv.roNumber, `$${inv.amount.toFixed(2)}`, inv.status],
      linkType: 'customer', linkId: inv.customerId,
    })),
  },
  'payments:payment-report': {
    columns: ['Metric', 'Value'],
    rows: () => [
      { cells: ['Collected today', '$1,705.50'], linkType: 'row', linkId: 'payrep-1' },
      { cells: ['Pending', '$89.00'], linkType: 'row', linkId: 'payrep-2' },
      { cells: ['Refunded this week', '$0.00'], linkType: 'row', linkId: 'payrep-3' },
    ],
  },
  'inspect:customer-mpi': {
    columns: ['RO', 'Customer', 'Vehicle', 'Date', 'Status'],
    rows: () => MOCK_INSPECTIONS.map(i => {
      const ro = MOCK_ROS.find(r => r.customerId === i.customerId);
      return { cells: [ro ? ro.number : '—', custName(i.customerId), i.vehicle, i.date, i.status], linkType: 'customer', linkId: i.customerId };
    }),
  },
  'inspect:commercial-vans': {
    columns: ['Vehicle', 'Fleet Account', 'Date', 'Status'],
    rows: () => MOCK_VAN_INSPECTIONS.map(v => ({ cells: [v.vehicle, v.fleetAccount, v.date, v.status], linkType: 'row', linkId: v.id })),
  },
  'video:customer-walkaround': {
    columns: ['Customer', 'Vehicle', 'Sent'],
    rows: () => MOCK_INSPECTIONS.map(i => ({ cells: [custName(i.customerId), i.vehicle, i.date], linkType: 'customer', linkId: i.customerId })),
  },
  'video:loaner-walkaround': {
    columns: ['Loaner Vehicle', 'Assigned To', 'Recorded'],
    rows: () => MOCK_FLEET_VEHICLES.filter(v => v.type === 'Loaner').map(v => ({ cells: [v.label, v.assignedTo || '—', '2026-08-20'], linkType: 'row', linkId: v.id })),
  },
  'video:technician-inspections': {
    columns: ['Customer', 'Vehicle', 'Status'],
    rows: () => MOCK_INSPECTIONS.map(i => ({ cells: [custName(i.customerId), i.vehicle, i.status.includes('flagged') ? 'Needs grading' : 'Graded'], linkType: 'customer', linkId: i.customerId })),
  },
  'pickup-delivery:vehicles': {
    columns: ['Vehicle', 'Type', 'Status'],
    rows: () => MOCK_FLEET_VEHICLES.map(v => ({ cells: [v.label, v.type, v.status], linkType: 'row', linkId: v.id })),
  },
  'pickup-delivery:drivers': {
    columns: ['Driver', 'Status', 'Trips Today'],
    rows: () => MOCK_DRIVERS.map(d => ({ cells: [d.name, d.status, String(d.tripsToday)], linkType: 'row', linkId: d.id })),
  },
  'pickup-delivery:driver-payment': {
    columns: ['Driver', 'Period', 'Amount', 'Status'],
    rows: () => MOCK_DRIVER_PAYMENTS.map(p => ({
      cells: [(MOCK_DRIVERS.find(d => d.id === p.driverId) || {}).name || '—', p.period, `$${p.amount.toFixed(2)}`, p.status],
      linkType: 'row', linkId: p.id,
    })),
  },
  'mobile-service:appointments': {
    columns: ['Customer', 'Vehicle', 'Service', 'When', 'Status'],
    rows: () => MOCK_MOBILE_APPTS.map(a => ({
      cells: [custName(a.customerId), a.vehicle, a.service, `${a.date} · ${a.time}`, a.status],
      linkType: 'customer', linkId: a.customerId,
    })),
  },
  'mobile-service:leads': {
    columns: ['Name', 'Phone', 'Interested In', 'Status'],
    rows: () => MOCK_LEADS.map(l => ({ cells: [l.name, l.phone, l.service, l.status], linkType: 'row', linkId: l.id })),
  },
  'mobile-service:technicians': {
    columns: ['Technician', 'Status', 'Jobs Today'],
    rows: () => MOCK_MOBILE_TECHS.map(t => ({ cells: [t.name, t.status, String(t.jobsToday)], linkType: 'row', linkId: t.id })),
  },
  'mobile-service:vehicles': {
    columns: ['Vehicle', 'Type', 'Status'],
    rows: () => MOCK_FLEET_VEHICLES.map(v => ({ cells: [v.label, v.type, v.status], linkType: 'row', linkId: v.id })),
  },
  'uber:book-rides': {
    columns: ['Customer', 'Pickup', 'Dropoff'],
    rows: () => MOCK_CUSTOMERS.slice(0, 3).map(c => ({ cells: [c.name, 'Dealership', 'Home'], linkType: 'customer', linkId: c.id })),
  },
  'uber:vouchers-issued': {
    columns: ['Customer', 'Amount', 'Status', 'Issued'],
    rows: () => MOCK_VOUCHERS.map(v => ({ cells: [custName(v.customerId), `$${v.amount.toFixed(2)}`, v.status, v.issuedDate], linkType: 'customer', linkId: v.customerId })),
  },
  'uber:ongoing-rides': {
    columns: ['Customer', 'Status', 'ETA'],
    rows: () => MOCK_UBER_RIDES.filter(r => r.status === 'Ongoing').map(r => ({ cells: [custName(r.customerId), r.status, r.eta || '—'], linkType: 'customer', linkId: r.customerId })),
  },
  'uber:past-booked': {
    columns: ['Customer', 'Date', 'Cost', 'Status'],
    rows: () => MOCK_UBER_RIDES.filter(r => r.status === 'Completed' || r.status === 'Billed').map(r => ({ cells: [custName(r.customerId), r.requestedAt, `$${r.cost.toFixed(2)}`, r.status], linkType: 'customer', linkId: r.customerId })),
  },
  'uber:billed': {
    columns: ['Customer', 'Cost', 'Billed On'],
    rows: () => MOCK_UBER_RIDES.filter(r => r.status === 'Billed').map(r => ({ cells: [custName(r.customerId), `$${r.cost.toFixed(2)}`, r.requestedAt], linkType: 'customer', linkId: r.customerId })),
  },
};

function subtabTableFor(appId, subtabId) {
  return SUBTAB_TABLES[`${appId}:${subtabId}`] || { columns: ['Detail'], rows: () => [] };
}

/* ============================================================
   MOCK DATA — customers, ROs, notifications (for tabs + the bell)
   ============================================================ */
const MOCK_CUSTOMERS = [
  { id: 'cust-1', name: 'Jane Smith', phone: '(555) 123-4567', email: 'jane.smith@example.com', vehicles: ['2021 Honda Accord', '2019 Toyota RAV4'] },
  { id: 'cust-2', name: 'Mike Johnson', phone: '(555) 234-5678', email: 'mike.johnson@example.com', vehicles: ['2020 Ford F-150'] },
  { id: 'cust-3', name: 'Aisha Patel', phone: '(555) 345-6789', email: 'aisha.patel@example.com', vehicles: ['2022 Subaru Outback'] },
  { id: 'cust-4', name: 'Carlos Rivera', phone: '(555) 456-7890', email: 'carlos.rivera@example.com', vehicles: ['2018 Chevrolet Malibu', '2023 Kia Sportage'] },
];

const MOCK_ROS = [
  { id: 'ro-10231', number: 'RO-10231', customerId: 'cust-1', vehicle: '2021 Honda Accord', status: 'Awaiting Parts' },
  { id: 'ro-10245', number: 'RO-10245', customerId: 'cust-1', vehicle: '2019 Toyota RAV4', status: 'In Progress' },
  { id: 'ro-10198', number: 'RO-10198', customerId: 'cust-2', vehicle: '2020 Ford F-150', status: 'Ready for Pickup' },
  { id: 'ro-10267', number: 'RO-10267', customerId: 'cust-3', vehicle: '2022 Subaru Outback', status: 'Inspection' },
  { id: 'ro-10212', number: 'RO-10212', customerId: 'cust-4', vehicle: '2018 Chevrolet Malibu', status: 'Awaiting Approval' },
];

const MOCK_APPOINTMENTS = [
  { id: 'appt-1', customerId: 'cust-1', vehicle: '2021 Honda Accord', service: 'Oil Change', date: '2026-08-20', upcoming: true },
  { id: 'appt-2', customerId: 'cust-1', vehicle: '2019 Toyota RAV4', service: 'Tire Rotation', date: '2026-06-10', upcoming: false },
  { id: 'appt-3', customerId: 'cust-2', vehicle: '2020 Ford F-150', service: 'Brake Inspection', date: '2026-08-22', upcoming: true },
  { id: 'appt-4', customerId: 'cust-3', vehicle: '2022 Subaru Outback', service: '30k Service', date: '2026-07-01', upcoming: false },
  { id: 'appt-5', customerId: 'cust-4', vehicle: '2023 Kia Sportage', service: 'First Service', date: '2026-08-25', upcoming: true },
  { id: 'appt-6', customerId: 'cust-4', vehicle: '2018 Chevrolet Malibu', service: 'Battery Replacement', date: '2026-05-14', upcoming: false },
];

const MOCK_INSPECTIONS = [
  { id: 'mpi-1', customerId: 'cust-1', vehicle: '2021 Honda Accord', date: '2026-08-10', status: 'Passed, no issues' },
  { id: 'mpi-2', customerId: 'cust-3', vehicle: '2022 Subaru Outback', date: '2026-08-12', status: 'Brakes flagged — needs approval' },
  { id: 'mpi-3', customerId: 'cust-2', vehicle: '2020 Ford F-150', date: '2026-07-28', status: 'Passed, no issues' },
];

const MOCK_INVOICES = [
  { id: 'inv-1', customerId: 'cust-1', roNumber: 'RO-10231', date: '2026-08-05', amount: 1204.00, status: 'Paid' },
  { id: 'inv-2', customerId: 'cust-2', roNumber: 'RO-10198', date: '2026-08-01', amount: 412.50, status: 'Paid' },
  { id: 'inv-3', customerId: 'cust-4', roNumber: 'RO-10212', date: '2026-08-13', amount: 89.00, status: 'Pending' },
];

/* ============================================================
   MOCK DATA — app-specific (Inspect, Video, Pickup & Delivery,
   Mobile Service, Uber, Vehicle Tracking)
   ============================================================ */
const MOCK_VAN_INSPECTIONS = [
  { id: 'van-1', vehicle: '2023 Ford Transit #4', fleetAccount: 'Acme Delivery Co.', date: '2026-08-18', status: 'Passed, no issues' },
  { id: 'van-2', vehicle: '2022 Mercedes Sprinter #2', fleetAccount: 'Metro Courier', date: '2026-08-19', status: 'Brake wear flagged' },
];

// Shared by Pickup & Delivery's Vehicles sub-tab, Mobile Service's Vehicles
// sub-tab, and Video's Loaner Walkaround table.
const MOCK_FLEET_VEHICLES = [
  { id: 'fleet-1', label: '2024 Chevrolet Equinox (Loaner 3)', type: 'Loaner', status: 'In Use', assignedTo: 'Jane Smith' },
  { id: 'fleet-2', label: '2023 Ford Transit (Shuttle 1)', type: 'Shuttle', status: 'Available', assignedTo: null },
  { id: 'fleet-3', label: '2024 Toyota Camry (Loaner 7)', type: 'Loaner', status: 'In Use', assignedTo: 'Mike Johnson' },
  { id: 'fleet-4', label: 'Service Van 2', type: 'Service Vehicle', status: 'Available', assignedTo: null },
];

const MOCK_DRIVERS = [
  { id: 'drv-1', name: 'Marcus Lee', status: 'On Trip', tripsToday: 4 },
  { id: 'drv-2', name: 'Sam Ortiz', status: 'On Trip', tripsToday: 3 },
  { id: 'drv-3', name: 'Priya Nair', status: 'Available', tripsToday: 2 },
];

const MOCK_DRIVER_PAYMENTS = [
  { id: 'paydrv-1', driverId: 'drv-1', period: 'Week of Aug 17', amount: 412.00, status: 'Paid' },
  { id: 'paydrv-2', driverId: 'drv-2', period: 'Week of Aug 17', amount: 356.50, status: 'Paid' },
  { id: 'paydrv-3', driverId: 'drv-3', period: 'Week of Aug 24', amount: 198.00, status: 'Pending' },
];

// Pickup & Delivery's Trips (map-split): the table lists every trip regardless
// of status; only 'In Route' trips carry map coordinates, since that's the
// only status a live map position means anything for.
const MOCK_TRIPS = [
  { id: 'trip-1', customerId: 'cust-1', vehicle: '2021 Honda Accord', type: 'Pickup', status: 'In Route', driverId: 'drv-1', eta: '12 min', mapX: 32, mapY: 46 },
  { id: 'trip-2', customerId: 'cust-2', vehicle: '2020 Ford F-150', type: 'Delivery', status: 'In Route', driverId: 'drv-2', eta: '6 min', mapX: 63, mapY: 27 },
  { id: 'trip-3', customerId: 'cust-3', vehicle: '2022 Subaru Outback', type: 'Loaner Swap', status: 'Upcoming', driverId: null, eta: null, mapX: null, mapY: null },
  { id: 'trip-4', customerId: 'cust-4', vehicle: '2018 Chevrolet Malibu', type: 'Pickup', status: 'Pending Approval', driverId: null, eta: null, mapX: null, mapY: null },
  { id: 'trip-5', customerId: 'cust-1', vehicle: '2019 Toyota RAV4', type: 'Delivery', status: 'Completed', driverId: 'drv-1', eta: null, mapX: null, mapY: null },
];

const MOCK_UBER_RIDES = [
  { id: 'uber-1', customerId: 'cust-1', status: 'Ongoing', eta: '8 min', cost: 18.40, requestedAt: '2026-08-24' },
  { id: 'uber-2', customerId: 'cust-2', status: 'Completed', eta: null, cost: 22.10, requestedAt: '2026-08-20' },
  { id: 'uber-3', customerId: 'cust-3', status: 'Billed', eta: null, cost: 15.75, requestedAt: '2026-08-15' },
];

const MOCK_VOUCHERS = [
  { id: 'vch-1', customerId: 'cust-4', amount: 25.00, status: 'Issued', issuedDate: '2026-08-22' },
  { id: 'vch-2', customerId: 'cust-2', amount: 15.00, status: 'Redeemed', issuedDate: '2026-08-10' },
];

const MOCK_LEADS = [
  { id: 'lead-1', name: 'Dana Reyes', phone: '(555) 987-6543', service: 'Mobile Oil Change', status: 'New' },
  { id: 'lead-2', name: 'Tom Becker', phone: '(555) 876-5432', service: 'Battery Replacement', status: 'Contacted' },
  { id: 'lead-3', name: 'Priya Shah', phone: '(555) 765-4321', service: 'Brake Service', status: 'Scheduled' },
];

// Also the pin source for Mobile Service's Global Map — only technicians
// currently out (En Route / On Site) carry map coordinates.
const MOCK_MOBILE_TECHS = [
  { id: 'mtech-1', name: 'Carlos Diaz', status: 'On Site', jobsToday: 3, mapX: 45, mapY: 62 },
  { id: 'mtech-2', name: 'Wendy Park', status: 'En Route', jobsToday: 2, mapX: 71, mapY: 34 },
  { id: 'mtech-3', name: 'Reggie Fox', status: 'Available', jobsToday: 0, mapX: null, mapY: null },
];

// Backs both Mobile Service sub-tabs that show appointments: 'Schedule'
// (grouped by date) and 'Appointments' (flat table) render this same data.
const MOCK_MOBILE_APPTS = [
  { id: 'mappt-1', customerId: 'cust-1', vehicle: '2021 Honda Accord', service: 'Mobile Oil Change', date: '2026-08-24', time: '9:00 AM', techId: 'mtech-1', status: 'In Progress' },
  { id: 'mappt-2', customerId: 'cust-3', vehicle: '2022 Subaru Outback', service: 'Battery Replacement', date: '2026-08-24', time: '11:30 AM', techId: 'mtech-2', status: 'Scheduled' },
  { id: 'mappt-3', customerId: 'cust-4', vehicle: '2023 Kia Sportage', service: 'Brake Inspection', date: '2026-08-25', time: '1:00 PM', techId: null, status: 'Scheduled' },
];

const MOCK_VEHICLE_TRACKING = [
  { id: 'vt-1', vehicleLabel: 'Loaner 3 — Chevrolet Equinox', type: 'Loaner', assignedTo: 'Jane Smith', status: 'Moving', location: 'Main St & 5th Ave' },
  { id: 'vt-2', vehicleLabel: 'Shuttle 1 — Ford Transit', type: 'Shuttle', assignedTo: 'Marcus Lee', status: 'Moving', location: 'Near dealership' },
  { id: 'vt-3', vehicleLabel: 'Loaner 7 — Toyota Camry', type: 'Loaner', assignedTo: 'Mike Johnson', status: 'Parked', location: 'Customer address' },
  { id: 'vt-4', vehicleLabel: 'Service Van 2', type: 'Service Vehicle', assignedTo: null, status: 'Idle', location: 'Dealership lot' },
];

/* ============================================================
   MOCK DATA — Settings > User Management (manager-admin only)
   ============================================================ */
// authority: 'Standard' | 'Admin' — a per-user permission level, separate
// from role (which app view they get) and from managerConfig's per-role
// lock/default toggle.
const MOCK_STAFF_USERS = [
  { id: 'usr-1', name: 'Jane Kim', roleId: 'service-advisor', authority: 'Standard' },
  { id: 'usr-2', name: 'Marcus Lee', roleId: 'technician', authority: 'Standard' },
  { id: 'usr-3', name: 'Priya Nair', roleId: 'bdc-rep', authority: 'Standard' },
  { id: 'usr-4', name: 'Sam Ortiz', roleId: 'parts-rep', authority: 'Standard' },
  { id: 'usr-5', name: 'Dana Reyes', roleId: 'loaner-manager', authority: 'Admin' },
];

/* ============================================================
   MOCK DATA — What's New / System Status, My Performance, Insights
   ============================================================ */
const MOCK_CHANGELOG = [
  { id: 'cl-1', date: '2026-08-28', title: 'Book Uber rides for waiting customers', detail: 'Book and track rideshare trips right from the Uber tab.' },
  { id: 'cl-2', date: '2026-08-21', title: 'Redesigned app shell', detail: 'New left nav rail, global tab strip, and unified search.' },
  { id: 'cl-3', date: '2026-08-14', title: 'Dark mode', detail: 'Toggle light/dark from the prototype toolbar.' },
];

// state: 'operational' | 'degraded' | 'down'. incidents is empty when operational.
const MOCK_SYSTEM_STATUS = { state: 'operational', incidents: [] };

// Personal metrics shown in "My Performance" — every role except manager-admin
// sees their own numbers here instead of the aggregate Insights dashboard.
// Technician's Video Grading Score is where the old "Tech Video Grader" app's
// metric lives now — it's a personal stat, not a app tab.
const MY_PERFORMANCE = {
  technician: [
    { label: 'Video Grading Score', value: '94%' },
    { label: 'Inspections Completed (7d)', value: '18' },
    { label: 'Avg Grading Time', value: '3m 40s' },
  ],
  'service-advisor': [
    { label: 'CSI Score', value: '4.8 / 5' },
    { label: 'ROs Closed (7d)', value: '32' },
    { label: 'Upsell Rate', value: '21%' },
  ],
  'bdc-rep': [
    { label: 'Appointments Booked (7d)', value: '46' },
    { label: 'Avg Response Time', value: '4 min' },
  ],
  'parts-rep': [
    { label: 'Orders Fulfilled (7d)', value: '58' },
    { label: 'Fill Rate', value: '92%' },
  ],
  'loaner-manager': [
    { label: 'Loaners Dispatched (7d)', value: '21' },
    { label: 'Avg Turnaround', value: '1h 12m' },
  ],
};
function myPerformanceFor(roleId) { return MY_PERFORMANCE[roleId] || [{ label: 'No metrics yet', value: '—' }]; }

// Aggregate, dealership-wide — manager-admin only.
const MOCK_INSIGHTS = [
  { label: 'Revenue This Week', value: '$42,180' },
  { label: 'CSI (Dealership Avg)', value: '4.7 / 5' },
  { label: 'ROs In Progress', value: '27' },
  { label: 'Technician Utilization', value: '86%' },
];

// Available content widgets per tab type — what a Customer or RO tab can be built
// from. Every open tab gets its own independent widgets list + sizes, so two
// different customers' tabs can look completely different.
const TAB_WIDGET_CATALOG = {
  customer: [
    { id: 'vehicles', name: 'Vehicles', icon: 'directions_car' },
    { id: 'open-ros', name: 'Open Repair Orders', icon: 'assignment' },
    { id: 'appointments', name: 'Appointment History', icon: 'event' },
    { id: 'inspections', name: 'Multipoint Inspections', icon: 'fact_check' },
    { id: 'payments', name: 'Payments & Invoices', icon: 'receipt_long' },
  ],
  ro: [
    { id: 'ro-details', name: 'RO Details', icon: 'directions_car' },
    { id: 'ro-customer', name: 'Customer', icon: 'person' },
  ],
};

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
  navApps: [],   // was homeApps — same marketplace/manager-lock mechanism, now a nav list
  scratchSelected: new Set(),
  device: 'desktop',
  managerConfig: {},        // { [roleId]: { appIds: [...], mode: 'default' | 'locked' } }
  managerEditingRoleId: null,
  managerEditSelected: new Set(),

  theme: 'light',    // 'light' | 'dark' — persisted: mkos-theme

  // Dashboard — nav rail, tabs, widget sizes, and notification filter
  navMode: 'expanded',   // 'collapsed' | 'expanded' | 'hover'
  selectedApp: null, // appId shown on the base surface; not persisted, resets on reload
  selectedSubTab: null,  // sub-tab id within selectedApp, for apps with APP_SUBTABS
  tabs: [],               // record-detail tabs only — no seeded "overview" tab
  activeTabId: null,      // null = show selectedApp's table; else a tab id
  notifFilter: '',   // '' | 'vehicle' | 'customer' | 'internal'
  focusedTripId: null,    // Pickup & Delivery Trips map-split: which active trip is highlighted

  // Header — presence, updates & system status panel
  presence: 'available',   // 'available' | 'ooo' — persisted: mkos-presence
  oooReturnDate: '',        // set via Settings > Out of Office
  updatesPanelOpen: false,
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
// Edit Home Screen is about arranging your own app list, not working a
// record — search (which opens record tabs) and the tab strip itself aren't
// relevant there, so the header shows without them on this one screen.
const HIDE_HEADER_SEARCH_AND_TABS_SCREENS = ['home'];

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
  const hideSearchAndTabs = HIDE_HEADER_SEARCH_AND_TABS_SCREENS.includes(id);
  document.querySelector('.app-header-search').hidden = hideSearchAndTabs;
  document.getElementById('dashboard-tab-strip').hidden = hideSearchAndTabs;
  renderAppHeader();

  document.getElementById('app-frame').scrollTop = 0;
  window.scrollTo(0, 0);
}

// Brings the Dashboard screen into view if it isn't already showing — used
// whenever focusing a tab needs to guarantee its content is actually visible,
// since tabs (in the header) and their content (on the Dashboard screen) can
// now be interacted with from any screen.
function ensureDashboardScreen() {
  if (document.getElementById('screen-dashboard').hasAttribute('hidden')) {
    showScreen('dashboard');
  }
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
  ensureManagerConfig();
  document.getElementById('path-myk-recommended-thumb').innerHTML = schematicThumbHTML(RECOMMENDED[roleId]);
  document.getElementById('path-dealer-recommended-thumb').innerHTML = schematicThumbHTML(state.managerConfig[roleId].appIds);
  showScreen('onboarding-path');
}

// Simple schematic (icons in a mini grid) standing in for a real layout preview —
// good enough for early review, not meant as a final-fidelity mockup.
function schematicThumbHTML(appIds) {
  return appIds.slice(0, 6).map(id => `<span class="path-thumb-block material-icons">${getApp(id).icon}</span>`).join('');
}

/* ============================================================
   ONBOARDING — PATH CHOICE
   ============================================================ */
function choosePathMykRecommended() {
  state.navApps = [...RECOMMENDED[state.role]];
  homeAddAppOpen = false;
  renderHome();
  showScreen('home');
}

function choosePathDealerRecommended() {
  ensureManagerConfig();
  state.navApps = [...state.managerConfig[state.role].appIds];
  homeAddAppOpen = false;
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
let homeAddAppOpen = false;            // Edit Home Screen's marketplace panel — hidden until "Add App" is clicked

// A "context" is any screen that lets a user add apps — each owns its own selection
// of app ids, so the marketplace just needs to know which one it's serving. Tab
// contexts are identified as "tab:<tabId>" and resolve to that tab's own widgets list,
// so every open Customer/RO tab gets the exact same marketplace experience as Edit
// Home Screen, just scoped to its own widget set instead of state.navApps.
function resolveTabContext(context) {
  return context.startsWith('tab:') ? state.tabs.find(t => t.id === context.slice(4)) : null;
}

function getContextSelection(context) {
  if (context === 'home') return state.navApps;
  if (context === 'scratch') return [...state.scratchSelected];
  if (context === 'manager-edit') return [...state.managerEditSelected];
  const tab = resolveTabContext(context);
  return tab ? tab.widgets : [];
}

function addToContext(context, appId) {
  if (context === 'home') { if (!state.navApps.includes(appId)) state.navApps.push(appId); return; }
  if (context === 'scratch') { state.scratchSelected.add(appId); return; }
  if (context === 'manager-edit') { state.managerEditSelected.add(appId); return; }
  const tab = resolveTabContext(context);
  if (tab && !tab.widgets.includes(appId)) tab.widgets.push(appId);
}

function removeFromContext(context, appId) {
  if (context === 'home') { state.navApps = state.navApps.filter(id => id !== appId); return; }
  if (context === 'scratch') { state.scratchSelected.delete(appId); return; }
  if (context === 'manager-edit') { state.managerEditSelected.delete(appId); return; }
  const tab = resolveTabContext(context);
  if (tab) tab.widgets = tab.widgets.filter(id => id !== appId);
}

// Re-renders whichever screen owns this context — kept in one place since every
// add/remove touches both the "your apps" list and the marketplace below it.
function refreshContext(context) {
  if (context === 'home') { renderHome(); return; }
  if (context === 'scratch') { renderScratchSection(); return; }
  if (context === 'manager-edit') { renderManagerEditSection(); return; }
  if (resolveTabContext(context)) renderDashboardTabContent();
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

// "Widget" only applies to what a Customer/RO tab renders (small, resizable
// cards); every other context is adding a full app to a nav/selection list.
function marketActionNoun(context) { return context.startsWith('tab:') ? 'Widget' : 'App'; }

function marketActionHTML(context, app) {
  const noun = marketActionNoun(context);
  if (getContextSelection(context).includes(app.id)) {
    return `<button class="mk-button functional-mk-button market-action-btn" disabled><span class="material-icons">check</span> Added</button>`;
  }
  if (app.pricing === 'plan') {
    if (marketRequestedPlan.has(app.id)) {
      return `<button class="mk-button functional-mk-button market-action-btn" disabled><span class="material-icons">schedule</span> Requested</button>`;
    }
    return `<button class="mk-button secondary-mk-button market-action-btn market-plan-btn" data-app-id="${app.id}">Request ${noun}</button>`;
  }
  return `<button class="mk-button primary-mk-button market-action-btn market-add-btn" data-app-id="${app.id}">Add ${noun}</button>`;
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

// Best Sellers first, then Spotlight, then everything else — alphabetical
// within each tier. Uses the curation signal the catalog already carries
// instead of leaving list order to be whatever APPS happened to be defined in.
const MARKET_LABEL_RANK = { bestseller: 0, spotlight: 1 };
function filteredMarketApps(extraApps = []) {
  const q = marketState.search.toLowerCase().trim();
  return [...extraApps, ...APPS]
    .filter(app => {
      if (q && !app.name.toLowerCase().includes(q)) return false;
      if (marketState.category && app.cat !== marketState.category) return false;
      if (marketState.pricing && app.pricing !== marketState.pricing) return false;
      if (marketState.createdBy && app.createdBy !== marketState.createdBy) return false;
      if (marketState.label && app.label !== marketState.label) return false;
      return true;
    })
    .sort((a, b) => {
      const rankDiff = (MARKET_LABEL_RANK[a.label] ?? 2) - (MARKET_LABEL_RANK[b.label] ?? 2);
      return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name);
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
        <option value="plan"${marketState.pricing === 'plan' ? ' selected' : ''}>Paid</option>
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

// "Create Your Own App" is hidden everywhere for now — building custom apps
// isn't a workflow being built yet, not just an onboarding-specific carve-out.
// extraApps lets a caller merge in additional catalog-shaped entries (e.g. a tab's
// page-info widgets) so they browse/search/filter identically to real apps.
function renderMarketplace(mountId, context, extraApps = []) {
  const mount = document.getElementById(mountId);
  const apps = filteredMarketApps(extraApps);
  const showCreateCard = false;
  mount.innerHTML = `
    ${marketToolbarHTML()}
    <div class="market-count myk-body2">Showing ${apps.length} app${apps.length === 1 ? '' : 's'}</div>
    <div class="market-grid">
      ${showCreateCard ? `
        <button class="market-card market-card--create" id="market-create-card">
          <span class="material-icons">add_circle</span>
          <div class="market-card-name">Create Your Own App</div>
          <p class="market-card-desc">Build a custom app using myKaarma's APIs and data.</p>
        </button>
      ` : ''}
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
  if (showCreateCard) {
    mount.querySelector('#market-create-card').addEventListener('click', () => openCreateAppModal(context));
  }
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
  state.navApps = state.scratchSelected.size > 0
    ? [...state.scratchSelected]
    : [...RECOMMENDED[state.role]];
  homeAddAppOpen = false;
  renderHome();
  renderDashboard();
  showScreen('dashboard');
}

/* ============================================================
   HOME SCREEN
   ============================================================ */
// One-time banner shown when a manager has newly locked this role's default view —
// clears itself once shown so it doesn't reappear until locked again.
function renderLockNotice() {
  ensureManagerConfig();
  const banner = document.getElementById('lock-notice-banner');
  const cfg = state.managerConfig[state.role];
  if (cfg && cfg.lockNoticePending) {
    document.getElementById('lock-notice-text').textContent =
      `Your dealership admin has set a new default view for the ${getRole(state.role).name} role.`;
    banner.hidden = false;
  } else {
    banner.hidden = true;
  }
}

function dismissLockNotice() {
  const cfg = state.managerConfig[state.role];
  if (cfg) cfg.lockNoticePending = false;
  document.getElementById('lock-notice-banner').hidden = true;
}

// Edit Home Screen — always editable, no separate customize mode/toggle.
// Tiles are draggable to reorder your own nav rail; the app marketplace stays
// collapsed until "Add App" is clicked, same pattern as a tab's widget picker.
function renderHome() {
  renderLockNotice();

  const grid = document.getElementById('home-grid');
  grid.innerHTML = state.navApps.map(id => {
    const app = getApp(id);
    return `
      <div class="app-tile" data-app-id="${app.id}" draggable="true">
        <span class="material-icons app-tile-drag-handle" title="Drag to reorder">drag_indicator</span>
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
      state.navApps = state.navApps.filter(id => id !== btn.dataset.removeId);
      renderHome();
    });
  });
  bindDragReorder(grid, '.app-tile', () => state.navApps, list => { state.navApps = list; }, renderHome);

  document.getElementById('home-add-app-toggle-btn').hidden = homeAddAppOpen;
  document.getElementById('home-add-catalog').hidden = !homeAddAppOpen;
  if (homeAddAppOpen) renderMarketplace('home-marketplace', 'home');
}

/* ============================================================
   DASHBOARD — the actual landing screen
   ============================================================ */
function renderDashboard() {
  renderNavRail();
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
  renderDashboardTabContent();
}

// Runs on every screen transition. Keeps the header's role display, manage-views
// visibility, tab strip, and notification state current regardless of which
// screen is active — the header persists across screens, unlike renderDashboard().
function renderAppHeader() {
  if (!state.role) return; // nothing to show before a role is picked
  const role = getRole(state.role);
  document.getElementById('app-header-avatar-role').textContent = `Signed in as: ${role.name}`;
  const isManager = state.role === 'manager-admin';
  const insightsBtn = document.getElementById('app-header-insights-btn');
  insightsBtn.title = isManager ? 'Insights' : 'My Performance';
  insightsBtn.querySelector('.material-icons').textContent = isManager ? 'bar_chart' : 'insights';
  // Settings is now a manager-only product/user configuration console —
  // personal account settings live under the avatar instead.
  document.getElementById('app-header-settings-btn').hidden = !isManager;
  applyPresence();
  renderTabStrip();
  renderNotifBell();
  renderNotifPanel();
  renderUpdatesBadge();
}

/* ---- Theme (light / dark) — real in-app toggle lives in the avatar
   dropdown's Appearance section; the prototype toolbar's button is a
   reviewer-only shortcut to the same state, not a separate setting. ---- */
function loadTheme() {
  const saved = localStorage.getItem('mkos-theme');
  state.theme = saved === 'dark' ? 'dark' : 'light';
  applyTheme();
}

function applyTheme() {
  document.getElementById('shell').dataset.theme = state.theme;
  document.getElementById('proto-theme-icon').textContent = state.theme === 'dark' ? 'light_mode' : 'dark_mode';
  document.querySelectorAll('.avatar-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === state.theme);
  });
}

function setTheme(value) {
  state.theme = value;
  localStorage.setItem('mkos-theme', state.theme);
  applyTheme();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mkos-theme', state.theme);
  applyTheme();
}

/* ---- Presence (Available / Out of Office) — a dot on the avatar, like a
   chat app's active/away indicator. Quick-toggle from the header; scheduling
   a future return date lives in Settings. ---- */
function loadPresence() {
  const saved = localStorage.getItem('mkos-presence');
  state.presence = saved === 'ooo' ? 'ooo' : 'available';
  applyPresence();
}

// Drives the presence dot, the avatar dropdown's toggle buttons, and its
// "currently Out of Office" line — called on load and on every change, so
// all three stay in sync regardless of whether the dropdown is open.
function applyPresence() {
  const dot = document.getElementById('app-header-presence-dot');
  if (dot) dot.classList.toggle('ooo', state.presence === 'ooo');
  document.querySelectorAll('.settings-presence-btn[data-presence]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.presence === state.presence);
  });
  const currentEl = document.getElementById('avatar-ooo-current');
  if (currentEl) {
    if (state.presence === 'ooo' && state.oooReturnDate) {
      currentEl.hidden = false;
      currentEl.textContent = `Currently Out of Office — back ${state.oooReturnDate}.`;
    } else {
      currentEl.hidden = true;
    }
  }
}

function setPresence(value) {
  state.presence = value;
  if (value === 'available') state.oooReturnDate = '';
  localStorage.setItem('mkos-presence', value);
  applyPresence();
}

function togglePresenceQuick() {
  setPresence(state.presence === 'available' ? 'ooo' : 'available');
}

/* ---- Settings screen (manager-admin only — product + user configuration) ---- */
function renderSettingsScreen() {
  const isManager = state.role === 'manager-admin';
  document.getElementById('settings-admin-section').hidden = !isManager;
  if (isManager) renderSettingsUserList();
}

function renderSettingsUserList() {
  const list = document.getElementById('settings-user-list');
  list.innerHTML = MOCK_STAFF_USERS.map(u => `
    <div class="settings-user-row">
      <div>
        <div class="settings-row-label">${escHtml(u.name)}</div>
        <p class="myk-body2 settings-row-sub">${escHtml(getRole(u.roleId).name)}</p>
      </div>
      <select class="settings-user-authority" data-user-id="${u.id}">
        <option value="Standard"${u.authority === 'Standard' ? ' selected' : ''}>Standard</option>
        <option value="Admin"${u.authority === 'Admin' ? ' selected' : ''}>Admin</option>
      </select>
    </div>
  `).join('');

  list.querySelectorAll('.settings-user-authority').forEach(sel => {
    sel.addEventListener('change', () => {
      const user = MOCK_STAFF_USERS.find(u => u.id === sel.dataset.userId);
      if (!user) return;
      user.authority = sel.value;
      showToast(`${user.name}'s authority set to ${user.authority}.`);
    });
  });
}

/* ---- Insights (manager-admin) / My Performance (everyone else) — same
   header icon slot and screen, content swapped by role. ---- */
function renderInsightsScreen() {
  const isManager = state.role === 'manager-admin';
  document.getElementById('insights-heading').textContent = isManager ? 'Insights' : 'My Performance';
  document.getElementById('insights-sub').textContent = isManager
    ? 'Aggregate performance across the dealership.'
    : 'Your own performance metrics — visible only to you.';
  const tiles = isManager ? MOCK_INSIGHTS : myPerformanceFor(state.role);
  document.getElementById('insights-tile-grid').innerHTML = tiles.map(t => `
    <div class="insights-tile">
      <div class="insights-tile-value">${escHtml(t.value)}</div>
      <div class="insights-tile-label myk-body2">${escHtml(t.label)}</div>
    </div>
  `).join('');
}

/* ---- Updates & System Status (combined header icon) ---- */
function systemStatusHTML() {
  if (MOCK_SYSTEM_STATUS.state === 'operational') {
    return `<div class="system-status-row system-status-row--ok"><span class="material-icons">check_circle</span> All systems operational</div>`;
  }
  const label = MOCK_SYSTEM_STATUS.state === 'degraded' ? 'Degraded performance' : 'Service disruption';
  return `
    <div class="system-status-row system-status-row--warn"><span class="material-icons">error_outline</span> ${escHtml(label)}</div>
    ${MOCK_SYSTEM_STATUS.incidents.map(inc => `
      <div class="system-status-incident">
        <div class="system-status-incident-title">${escHtml(inc.title)}</div>
        <p class="myk-body2">${escHtml(inc.detail)}</p>
        <span class="myk-body2 system-status-incident-time">Since ${escHtml(inc.since)}</span>
      </div>
    `).join('')}
  `;
}

function changelogListHTML() {
  return MOCK_CHANGELOG.map(c => `
    <div class="notif-item">
      <span class="material-icons notif-item-icon">celebration</span>
      <div class="notif-item-body">
        <div class="notif-item-title">${escHtml(c.title)}</div>
        <div class="notif-item-detail">${escHtml(c.detail)}</div>
        <div class="myk-body2 changelog-date">${escHtml(c.date)}</div>
      </div>
    </div>
  `).join('');
}

function renderUpdatesPanel() {
  document.getElementById('app-header-system-status').innerHTML = systemStatusHTML();
  document.getElementById('app-header-changelog-list').innerHTML = changelogListHTML();
  renderUpdatesBadge();
}

// The badge is a health signal, not a "you have unread items" counter — it
// only appears when something's actually wrong, so it stays trustworthy.
function renderUpdatesBadge() {
  const badge = document.getElementById('app-header-updates-badge');
  if (badge) badge.hidden = MOCK_SYSTEM_STATUS.state === 'operational';
}

function toggleUpdatesPanel(show) {
  const panel = document.getElementById('app-header-updates-panel');
  const nextOpen = show === undefined ? panel.hidden : show;
  closeAllHeaderPopovers();
  panel.hidden = !nextOpen;
}

/* ---- Left app nav rail (collapsed / expanded / hover modes) ---- */
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

function selectApp(appId) {
  state.selectedApp = appId;
  state.activeTabId = null;
  state.selectedSubTab = appHasSubtabs(appId) ? getSubtabs(appId)[0].id : null;
  state.focusedTripId = null;
  renderNavRail();
  renderTabStrip();
  renderDashboardTabContent();
}

function renderNavRail() {
  const rail = document.getElementById('dash-nav-rail');
  rail.dataset.mode = state.navMode;

  // Fall back to the first available app if the current selection was
  // removed from the nav (e.g. a manager re-locked the role's app list).
  if (!state.navApps.includes(state.selectedApp)) {
    state.selectedApp = state.navApps[0] || null;
  }

  document.getElementById('dash-nav-rail-list').innerHTML = state.navApps.map(id => {
    const app = getApp(id);
    const active = id === state.selectedApp && state.activeTabId === null;
    return `
      <button class="dash-nav-rail-item${active ? ' active' : ''}" data-app-id="${app.id}" title="${escHtml(app.name)}">
        <span class="material-icons">${app.icon}</span>
        <span class="dash-nav-rail-item-label">${escHtml(app.name)}</span>
      </button>
    `;
  }).join('');

  document.getElementById('dash-nav-rail-list').querySelectorAll('.dash-nav-rail-item').forEach(btn => {
    btn.addEventListener('click', () => selectApp(btn.dataset.appId));
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

/* ---- Tabs (Chrome-style: Customer/RO tabs, pin to persist) ---- */
function persistPinnedTabs() {
  const pinned = state.tabs.filter(t => t.pinned);
  localStorage.setItem('mkos-pinned-tabs', JSON.stringify(pinned));
}

function loadPinnedTabs() {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem('mkos-pinned-tabs') || '[]'); } catch (e) { saved = []; }
  saved.forEach(t => {
    if (!state.tabs.find(x => x.id === t.id)) state.tabs.push(t);
  });
}

const MAX_TABS = 10;

// Opens a tab for this customer/RO, or focuses it if already open — never duplicates.
function openTab(type, targetId, label) {
  const existing = state.tabs.find(t => t.type === type && t.targetId === targetId);
  if (existing) {
    state.activeTabId = existing.id;
  } else {
    if (state.tabs.length >= MAX_TABS) {
      showToast(`You can have up to ${MAX_TABS} tabs open at once — close one to open another.`);
      return;
    }
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

function setActiveTab(tabId) {
  state.activeTabId = tabId;
  ensureDashboardScreen();
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
    // 'customer'/'ro' tabs (opened via the header search) show a person/car icon;
    // any other tab.type is a app id (opened via a app-table row click),
    // so show that app's own icon instead.
    const typeIcon = tab.type === 'customer' ? 'person' : tab.type === 'ro' ? 'directions_car' : (getApp(tab.type) || {}).icon || 'widgets';
    return `<div class="dash-tab${active ? ' active' : ''}${tab.pinned ? ' pinned' : ''}" data-tab-id="${tab.id}" tabindex="0" role="button" aria-current="${active}">
      <span class="material-icons dash-tab-type-icon">${typeIcon}</span>
      ${tab.pinned ? '' : `<span class="dash-tab-label">${escHtml(tab.label)}</span>`}
      <button class="dash-tab-pin-btn${tab.pinned ? ' pinned' : ''}" data-tab-id="${tab.id}" title="${tab.pinned ? 'Unpin' : 'Pin'} tab">
        <span class="material-icons">push_pin</span>
      </button>
      ${tab.pinned ? '' : `<button class="dash-tab-close-btn" data-tab-id="${tab.id}" title="Close tab"><span class="material-icons">close</span></button>`}
    </div>`;
  }).join('');

  strip.innerHTML = `<div class="dash-tab-list">${tabsHTML}</div>`;

  strip.querySelectorAll('.dash-tab').forEach(el => {
    el.addEventListener('click', () => setActiveTab(el.dataset.tabId));
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveTab(el.dataset.tabId);
      }
    });
  });
  strip.querySelectorAll('.dash-tab-pin-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); togglePinTab(btn.dataset.tabId); });
  });
  strip.querySelectorAll('.dash-tab-close-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); closeTab(btn.dataset.tabId); });
  });
}

/* ---- Tab content: app table (base surface), Customer, RO ---- */
function renderDashboardTabContent() {
  const container = document.getElementById('dashboard-tab-content');

  if (state.activeTabId === null) {
    renderBaseSurface(container);
    return;
  }

  const tab = state.tabs.find(t => t.id === state.activeTabId);
  if (!tab) { state.activeTabId = null; renderDashboardTabContent(); return; }

  if (tab.type === 'customer' || tab.type === 'ro') {
    container.innerHTML = tabWidgetGridHTML(tab);
    bindTabWidgetGrid(container, tab);
    renderMarketplace('tab-widget-marketplace', `tab:${tab.id}`, pageInfoPseudoApps(tab.type));
    return;
  }

  // A app-table row's tab (tab.type is a app id, not 'customer'/'ro') —
  // no real per-row detail view exists yet, so this is a filler until it does.
  container.innerHTML = appTabFillerHTML(tab);
}

function appTabFillerHTML(tab) {
  const app = getApp(tab.type);
  return `
    <div class="dashboard-placeholder">
      <span class="material-icons">${app.icon}</span>
      <div class="dashboard-placeholder-title">${escHtml(app.name)}</div>
      <p class="myk-body2">Detail view for this record is coming soon.</p>
    </div>
  `;
}

// Base surface = whatever the selected app renders when no tab is
// focused: a flat table, or — for apps in APP_SUBTABS — a sub-tab
// row plus whichever view type (table/calendar/map/map-split) is active.
function renderBaseSurface(container) {
  const appId = state.selectedApp;
  if (!appId) {
    container.innerHTML = `<div class="dashboard-placeholder">
      <span class="material-icons">dashboard</span>
      <div class="dashboard-placeholder-title">No apps yet</div>
      <p class="myk-body2">Add apps from the rail's Edit button to see them here.</p>
    </div>`;
    return;
  }
  if (appHasSubtabs(appId)) {
    container.innerHTML = appSubtabShellHTML(appId);
    bindAppSubtabs(container, appId);
    renderSubtabContent(appId);
    return;
  }
  container.innerHTML = appTableHTML(appId);
  bindAppTable(container, appId);
}

function tableViewHTML(title, table) {
  const rows = table.rows();
  return `
    <div class="app-table-wrap">
      <h2 class="myk-h6">${escHtml(title)}</h2>
      ${rows.length === 0 ? `<p class="myk-body2">No records yet.</p>` : `
        <table class="app-table">
          <thead><tr>${table.columns.map(c => `<th>${escHtml(c)}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row => `
              <tr class="${row.linkId ? 'clickable' : ''}"${row.linkId ? ` data-link-id="${row.linkId}" tabindex="0"` : ''}>
                ${row.cells.map(cell => `<td>${escHtml(cell)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;
}

// Shared by every clickable-row view (tables, calendar events, map pins) —
// selector varies by view type, but Enter/Space always mirrors a click.
function bindClickableRows(container, selector, onClick) {
  container.querySelectorAll(selector).forEach(el => {
    const handler = () => onClick(el.dataset.linkId);
    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });
}

function appTableHTML(appId) {
  return tableViewHTML(getApp(appId).name, appTableFor(appId));
}

// Opens a tab identified by this app (icon + name), not by the row's
// underlying customer/RO — tabs still dedupe per row (type=appId + targetId=linkId),
// they just don't show the customer/RO's own detail view. See appTabFillerHTML.
function bindAppTable(container, appId) {
  const app = getApp(appId);
  bindClickableRows(container, 'tr.clickable', linkId => openTab(appId, linkId, app.name));
}

/* ---- App sub-tabs (Payments, Inspect, Video, Pickup & Delivery, Mobile Service, Uber) ---- */
// No page title here — the left nav rail already shows which app is
// selected, so repeating its name above the sub-tab row would just be a
// second label for the same thing while eating vertical space the sub-tabs
// (the real navigation for this screen) could use instead.
function appSubtabShellHTML(appId) {
  const subtabs = getSubtabs(appId);
  if (!subtabs.find(s => s.id === state.selectedSubTab)) state.selectedSubTab = subtabs[0].id;
  return `
    <div class="app-table-wrap app-subtab-wrap">
      <div class="app-subtab-row" role="tablist">
        ${subtabs.map(s => `
          <button class="app-subtab${s.id === state.selectedSubTab ? ' active' : ''}" data-subtab-id="${s.id}" role="tab" aria-selected="${s.id === state.selectedSubTab}">${escHtml(s.name)}</button>
        `).join('')}
      </div>
      <div class="app-subtab-content" id="app-subtab-content"></div>
    </div>
  `;
}

function bindAppSubtabs(container, appId) {
  container.querySelectorAll('.app-subtab').forEach(btn => {
    btn.addEventListener('click', () => selectSubTab(appId, btn.dataset.subtabId));
  });
}

function selectSubTab(appId, subtabId) {
  state.selectedSubTab = subtabId;
  state.focusedTripId = null;
  document.querySelectorAll('.app-subtab').forEach(btn => {
    const active = btn.dataset.subtabId === subtabId;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  renderSubtabContent(appId);
}

function renderSubtabContent(appId) {
  const mount = document.getElementById('app-subtab-content');
  const app = getApp(appId);
  const def = getSubtabDef(appId, state.selectedSubTab);
  if (!def) { mount.innerHTML = ''; return; }

  if (def.view === 'table') {
    mount.innerHTML = tableViewHTML(def.name, subtabTableFor(appId, def.id));
    bindClickableRows(mount, 'tr.clickable', linkId => openTab(appId, linkId, app.name));
    return;
  }
  if (def.view === 'calendar') {
    mount.innerHTML = mobileScheduleCalendarHTML();
    bindClickableRows(mount, '.mkos-cal-event', linkId => openTab(appId, linkId, app.name));
    return;
  }
  if (def.view === 'map') {
    mount.innerHTML = mobileGlobalMapHTML();
    bindClickableRows(mount, '.mkos-map-pin', linkId => openTab(appId, linkId, app.name));
    return;
  }
  if (def.view === 'map-split') {
    mount.innerHTML = tripsMapSplitHTML();
    bindTripsMapSplit(mount);
    return;
  }
}

function formatCalDate(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

// Mobile Service's "Schedule" sub-tab — same underlying data as its
// "Appointments" table sub-tab, grouped by date instead of listed flat.
function mobileScheduleCalendarHTML() {
  const byDate = {};
  MOCK_MOBILE_APPTS.forEach(a => { (byDate[a.date] = byDate[a.date] || []).push(a); });
  const dates = Object.keys(byDate).sort();
  return `
    <div class="mkos-calendar">
      ${dates.map(date => `
        <div class="mkos-calendar-day">
          <div class="mkos-calendar-day-label">${escHtml(formatCalDate(date))}</div>
          ${byDate[date].map(a => `
            <button class="mkos-cal-event" data-link-id="${a.customerId}">
              <span class="mkos-cal-event-time">${escHtml(a.time)}</span>
              <span class="mkos-cal-event-title">${escHtml(custName(a.customerId))} — ${escHtml(a.service)}</span>
              <span class="mkos-cal-event-status">${escHtml(a.status)}</span>
            </button>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

// Mobile Service's "Global Map" sub-tab — every technician currently out
// (En Route / On Site) as a pin; Available techs have no location to plot.
function mobileGlobalMapHTML() {
  const active = MOCK_MOBILE_TECHS.filter(t => t.mapX != null);
  return `
    <div class="mkos-map-pane mkos-map-standalone">
      <div class="mkos-map-mock">
        ${active.map(t => `
          <button class="mkos-map-pin" data-link-id="${t.id}" style="left:${t.mapX}%; top:${t.mapY}%;" title="${escHtml(t.name)} — ${escHtml(t.status)}">
            <span class="material-icons">build</span>
            <span class="mkos-map-pin-label">${escHtml(t.name)}</span>
          </button>
        `).join('')}
      </div>
      <p class="myk-body2 mkos-map-caption">${active.length} of ${MOCK_MOBILE_TECHS.length} technicians are currently out on a job.</p>
    </div>
  `;
}

// Pickup & Delivery's "Trips" sub-tab — the table lists every trip regardless
// of status; the map only plots trips currently In Route, since that's the
// only status a live position means anything for. Clicking an active row
// highlights its pin (select/focus) rather than opening a tab — the whole
// point of this view is the live table↔map correlation, not navigating away
// from it. Upcoming/Pending Approval rows have nothing to plot, so they
// aren't interactive here.
function tripsMapSplitHTML() {
  const active = MOCK_TRIPS.filter(t => t.mapX != null);
  return `
    <div class="mkos-map-split">
      <div class="mkos-map-split-table">
        <table class="app-table">
          <thead><tr><th>Customer</th><th>Vehicle</th><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            ${MOCK_TRIPS.map(t => `
              <tr class="${t.mapX != null ? 'clickable mkos-trip-row-active' : ''}${state.focusedTripId === t.id ? ' trip-focused' : ''}" data-trip-id="${t.id}"${t.mapX != null ? ' tabindex="0"' : ''}>
                <td>${escHtml(custName(t.customerId))}</td>
                <td>${escHtml(t.vehicle)}</td>
                <td>${escHtml(t.type)}</td>
                <td>${escHtml(t.status)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="mkos-map-pane">
        <div class="mkos-map-mock">
          ${active.map(t => `
            <div class="mkos-map-pin${state.focusedTripId === t.id ? ' focused' : ''}" data-trip-id="${t.id}" style="left:${t.mapX}%; top:${t.mapY}%;" title="${escHtml(custName(t.customerId))} — ${escHtml(t.eta)} away">
              <span class="material-icons">local_shipping</span>
              <span class="mkos-map-pin-label">${escHtml(custName(t.customerId))}</span>
            </div>
          `).join('')}
        </div>
        <p class="myk-body2 mkos-map-caption">${active.length} of ${MOCK_TRIPS.length} trips are currently in route and shown on the map.</p>
      </div>
    </div>
  `;
}

function bindTripsMapSplit(mount) {
  mount.querySelectorAll('.mkos-trip-row-active').forEach(tr => {
    const focus = () => {
      state.focusedTripId = tr.dataset.tripId;
      mount.querySelectorAll('tr[data-trip-id]').forEach(r => r.classList.toggle('trip-focused', r.dataset.tripId === state.focusedTripId));
      mount.querySelectorAll('.mkos-map-pin').forEach(pin => pin.classList.toggle('focused', pin.dataset.tripId === state.focusedTripId));
    };
    tr.addEventListener('click', focus);
    tr.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); focus(); } });
  });
}

// Used by Customer/RO tab content widgets (via contentWidgetCardHTML) to render
// each widget's body content for a given app.
function appWidgetBodyHTML(app, size) {
  const detail = WIDGET_DETAIL[app.id];
  if (size === 'large' && detail) {
    return `<div class="dash-widget-table">${detail.map(row => `
      <div class="dash-widget-row"><span>${escHtml(row.label)}</span><span>${escHtml(row.value)}</span></div>
    `).join('')}</div>`;
  }
  return `<div class="dash-widget-stat">${escHtml(WIDGET_PREVIEW[app.id] || `Open ${app.name}`)}</div>`;
}

/* ---- Shared widget-card shell + generic drag/resize/remove wiring ----
   Used by Customer/RO tab content widgets (via contentWidgetCardHTML):
   each tab instance carries its own `widgets` list + `widgetSizes`, so two
   different customers' tabs can have completely different arrangements. */
function dashWidgetShellHTML({ id, icon, name, size, body, removable }) {
  return `
    <div class="dash-widget dash-widget--${size}" data-app-id="${id}" draggable="true">
      <div class="dash-widget-header">
        <span class="material-icons dash-widget-drag-handle" title="Drag to reorder">drag_indicator</span>
        <div class="dash-widget-icon material-icons">${icon}</div>
        <div class="dash-widget-name">${escHtml(name)}</div>
        <button class="dash-widget-size-btn" data-app-id="${id}" title="${size === 'large' ? 'Shrink' : 'Expand'} widget">
          <span class="material-icons">${size === 'large' ? 'close_fullscreen' : 'open_in_full'}</span>
        </button>
        ${removable ? `
          <button class="dash-widget-remove-btn" data-app-id="${id}" title="Remove widget">
            <span class="material-icons">close</span>
          </button>
        ` : ''}
      </div>
      ${body}
    </div>
  `;
}

function bindWidgetGrid(container, { getList, setList, getSize, setSize, onRemove, onChange }) {
  container.querySelectorAll('.dash-widget-size-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.dataset.appId;
      setSize(id, (getSize(id) || 'small') === 'large' ? 'small' : 'large');
      onChange();
    });
  });

  if (onRemove) {
    container.querySelectorAll('.dash-widget-remove-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        onRemove(btn.dataset.appId);
        onChange();
      });
    });
  }

  bindDragReorder(container, '.dash-widget', getList, setList, onChange);
}

// Shared by any draggable, app-id-keyed grid (Customer/RO tab widgets, and
// Edit Home Screen's app tiles) — reorders getList()/setList() on drop.
function bindDragReorder(container, itemSelector, getList, setList, onChange) {
  let draggedId = null;
  container.querySelectorAll(itemSelector).forEach(el => {
    el.addEventListener('dragstart', () => {
      draggedId = el.dataset.appId;
      el.classList.add('dragging');
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
      draggedId = null;
    });
    el.addEventListener('dragover', e => {
      e.preventDefault();
      if (el.dataset.appId !== draggedId) el.classList.add('drag-over');
    });
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const targetId = el.dataset.appId;
      if (!draggedId || draggedId === targetId) return;
      const list = getList();
      const from = list.indexOf(draggedId);
      const to = list.indexOf(targetId);
      if (from === -1 || to === -1) return;
      list.splice(from, 1);
      list.splice(to, 0, draggedId);
      setList(list);
      onChange();
    });
  });
}

/* ---- Customer / RO tabs — content widgets (Vehicles, Appointments, etc.) ---- */
function listRowHTML(icon, main, meta) {
  return `
    <div class="cust-list-row">
      <span class="material-icons">${icon}</span>
      <span class="cust-list-main">${main}</span>
      <span class="cust-list-meta">${meta || ''}</span>
    </div>
  `;
}

function emptyRowHTML(text) {
  return `<p class="myk-body2">${text}</p>`;
}

function apptRowHTML(a) {
  return listRowHTML('event', `${escHtml(a.service)} — ${escHtml(a.vehicle)}`, escHtml(a.date));
}

function contentWidgetBodyHTML(tab, widgetId, size) {
  if (tab.type === 'customer') {
    const custId = tab.targetId;
    const cap = size === 'large' ? Infinity : 2;

    if (widgetId === 'vehicles') {
      const cust = MOCK_CUSTOMERS.find(c => c.id === custId);
      return cust.vehicles.slice(0, cap).map(v => listRowHTML('directions_car', escHtml(v), '')).join('') || emptyRowHTML('No vehicles on file.');
    }
    if (widgetId === 'open-ros') {
      const ros = MOCK_ROS.filter(r => r.customerId === custId);
      if (ros.length === 0) return emptyRowHTML('No open ROs.');
      return `<div class="tab-ro-list">${ros.slice(0, cap).map(r => `
        <button class="tab-ro-row" data-ro-id="${r.id}">
          <span class="material-icons">directions_car</span>
          <span class="tab-ro-row-label">${escHtml(r.vehicle)} — ${escHtml(r.number)}</span>
          <span class="tab-ro-status">${escHtml(r.status)}</span>
        </button>
      `).join('')}</div>`;
    }
    if (widgetId === 'appointments') {
      const appts = MOCK_APPOINTMENTS.filter(a => a.customerId === custId);
      const upcoming = appts.filter(a => a.upcoming);
      const past = appts.filter(a => !a.upcoming);
      if (size !== 'large') {
        return upcoming[0] ? apptRowHTML(upcoming[0]) : emptyRowHTML('No upcoming appointments.');
      }
      return `
        <div class="cust-subsection-label myk-body2">Upcoming</div>
        ${upcoming.length > 0 ? upcoming.map(apptRowHTML).join('') : emptyRowHTML('No upcoming appointments.')}
        <div class="cust-subsection-label myk-body2">Past</div>
        ${past.length > 0 ? past.map(apptRowHTML).join('') : emptyRowHTML('No past appointments.')}
      `;
    }
    if (widgetId === 'inspections') {
      const list = MOCK_INSPECTIONS.filter(i => i.customerId === custId);
      return list.slice(0, cap).map(i => listRowHTML('fact_check', `${escHtml(i.vehicle)} — ${escHtml(i.status)}`, escHtml(i.date))).join('') || emptyRowHTML('No inspections on file.');
    }
    if (widgetId === 'payments') {
      const list = MOCK_INVOICES.filter(i => i.customerId === custId);
      return list.slice(0, cap).map(i => listRowHTML('receipt_long', `${escHtml(i.roNumber)} — $${i.amount.toFixed(2)}`, escHtml(i.status))).join('') || emptyRowHTML('No payment history.');
    }
  }

  if (tab.type === 'ro') {
    const ro = MOCK_ROS.find(r => r.id === tab.targetId);
    if (widgetId === 'ro-details') {
      return listRowHTML('directions_car', escHtml(ro.vehicle), '')
        + listRowHTML('info', escHtml(ro.status), '')
        + `<button class="tab-more-details-btn" data-ro-id="${ro.id}"><span class="material-icons">open_in_new</span> More details</button>`;
    }
    if (widgetId === 'ro-customer') {
      const cust = MOCK_CUSTOMERS.find(c => c.id === ro.customerId);
      return `<button class="tab-customer-link" data-customer-id="${cust.id}"><span class="material-icons">person</span> ${escHtml(cust.name)}</button>`;
    }
  }

  return '';
}

// A tab widget is either a page-info type (Vehicles, Appointments, ...) from
// TAB_WIDGET_CATALOG, or any app from the full catalog added alongside them.
function contentWidgetCardHTML(tab, widgetId) {
  const catalogMeta = (TAB_WIDGET_CATALOG[tab.type] || []).find(w => w.id === widgetId);
  const app = catalogMeta ? null : getApp(widgetId);
  if (!catalogMeta && !app) return '';
  const size = tab.widgetSizes[widgetId] || 'small';
  const meta = catalogMeta || app;
  const body = catalogMeta ? contentWidgetBodyHTML(tab, widgetId, size) : appWidgetBodyHTML(app, size);
  return dashWidgetShellHTML({
    id: widgetId, icon: meta.icon, name: meta.name, size, body, removable: true,
  });
}

function tabHeaderHTML(tab) {
  if (tab.type === 'customer') {
    const cust = MOCK_CUSTOMERS.find(c => c.id === tab.targetId);
    if (!cust) return `<p class="myk-body2">Customer not found.</p>`;
    return `<div class="tab-widget-header"><h2 class="myk-h6">${escHtml(cust.name)}</h2><p class="myk-body2">${escHtml(cust.phone)} · ${escHtml(cust.email)}</p></div>`;
  }
  const ro = MOCK_ROS.find(r => r.id === tab.targetId);
  if (!ro) return `<p class="myk-body2">RO not found.</p>`;
  return `<div class="tab-widget-header"><h2 class="myk-h6">${escHtml(ro.number)} — ${escHtml(ro.vehicle)}</h2><p class="myk-body2">Status: ${escHtml(ro.status)}</p></div>`;
}

// Lets a tab's page-info types (Vehicles, Appointments, ...) browse/search/filter
// in the marketplace exactly like real apps, by shaping them the same way.
function pageInfoPseudoApps(tabType) {
  return (TAB_WIDGET_CATALOG[tabType] || []).map(w => ({
    id: w.id, name: w.name, icon: w.icon, cat: 'Page Info',
    pricing: 'free', createdBy: 'myKaarma', label: null,
    desc: `Shows this record's ${w.name.toLowerCase()}.`,
  }));
}

function tabWidgetGridHTML(tab) {
  return `
    <div class="tab-widget-page">
    ${tabHeaderHTML(tab)}
    <div class="dash-widget-grid tab-widget-grid">${tab.widgets.map(wid => contentWidgetCardHTML(tab, wid)).join('')}</div>

    <button class="mk-button functional-mk-button tab-widget-toggle-btn" ${tab._showMarketplace ? 'hidden' : ''}>
      <span class="material-icons">add</span> Add Widget
    </button>

    <div class="home-add-catalog" ${tab._showMarketplace ? '' : 'hidden'}>
      <div class="tab-widget-add-header">
        <div class="myk-subtitle1">Add a Widget</div>
        <button class="mk-button tertiary-mk-button tab-widget-close-btn">
          <span class="material-icons">close</span> Close
        </button>
      </div>
      <div id="tab-widget-marketplace"></div>
    </div>
    </div>
  `;
}

function bindTabWidgetGrid(container, tab) {
  container.querySelector('.tab-widget-toggle-btn').addEventListener('click', () => {
    tab._showMarketplace = true;
    renderDashboardTabContent();
  });
  container.querySelector('.tab-widget-close-btn').addEventListener('click', () => {
    tab._showMarketplace = false;
    renderDashboardTabContent();
  });

  bindWidgetGrid(container, {
    getList: () => tab.widgets,
    setList: list => { tab.widgets = list; },
    getSize: id => tab.widgetSizes[id] || 'small',
    setSize: (id, size) => { tab.widgetSizes[id] = size; },
    onRemove: id => { tab.widgets = tab.widgets.filter(w => w !== id); },
    onChange: renderDashboardTabContent,
  });

  container.querySelectorAll('.tab-ro-row').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const ro = MOCK_ROS.find(r => r.id === btn.dataset.roId);
      openTab('ro', ro.id, `${ro.number} · ${ro.vehicle}`);
    });
  });
  container.querySelectorAll('.tab-customer-link').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const cust = MOCK_CUSTOMERS.find(c => c.id === btn.dataset.customerId);
      openTab('customer', cust.id, cust.name);
    });
  });
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
}

// bodyHTML is trusted, pre-escaped HTML (via escHtml on any interpolated values) — not raw user input.
function openDetailsDrawer(title, bodyHTML) {
  document.getElementById('details-drawer-title').textContent = title;
  document.getElementById('details-drawer-body').innerHTML = bodyHTML;
  document.getElementById('details-drawer-overlay').hidden = false;
}

function closeDetailsDrawer() {
  document.getElementById('details-drawer-overlay').hidden = true;
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

function closeAllHeaderPopovers() {
  document.getElementById('dashboard-notif-panel').hidden = true;
  document.getElementById('app-header-updates-panel').hidden = true;
  document.getElementById('dashboard-search-results').hidden = true;
  document.getElementById('app-header-avatar-menu').hidden = true;
}

function toggleNotifPanel(show) {
  const panel = document.getElementById('dashboard-notif-panel');
  const nextOpen = show === undefined ? panel.hidden : show;
  closeAllHeaderPopovers();
  panel.hidden = !nextOpen;
}

function toggleAvatarMenu(show) {
  const menu = document.getElementById('app-header-avatar-menu');
  const nextOpen = show === undefined ? menu.hidden : show;
  closeAllHeaderPopovers();
  menu.hidden = !nextOpen;
}

/* ---- Global search (customers / ROs / apps) ---- */
// Shared by the global dashboard search and the tab-add popover search.
function matchCustomers(query, limit = 5) {
  const q = query.trim().toLowerCase();
  return MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q) || c.phone.includes(query.trim()) || c.email.toLowerCase().includes(q)
  ).slice(0, limit);
}
function matchROs(query, limit = 5) {
  const q = query.trim().toLowerCase();
  return MOCK_ROS.filter(r => r.number.toLowerCase().includes(q)).slice(0, limit);
}

function renderSearchResults(query) {
  const results = document.getElementById('dashboard-search-results');
  const q = query.trim().toLowerCase();
  if (!q) { results.hidden = true; results.innerHTML = ''; return; }

  closeAllHeaderPopovers();

  const customers = matchCustomers(query);
  const ros = matchROs(query);
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
    focusNavApp(id);
  }
  document.getElementById('dashboard-search-input').value = '';
  document.getElementById('dashboard-search-results').hidden = true;
}

function focusNavApp(appId) {
  if (state.navApps.includes(appId)) {
    selectApp(appId);
  } else {
    showToast(`Add "${getApp(appId).name}" to your nav to see it here.`);
  }
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
      const cfg = state.managerConfig[roleId];
      const wasLocked = cfg.mode === 'locked';
      cfg.mode = btn.dataset.mode;
      // Only newly-locking a previously-editable view needs to notify that role's users.
      if (!wasLocked && cfg.mode === 'locked') cfg.lockNoticePending = true;
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

  document.getElementById('role-next-btn').addEventListener('click', confirmRoleSelection);

  document.getElementById('app-header-signout-item').addEventListener('click', () => {
    toggleAvatarMenu(false);
    showToast('Sign out isn\'t available in this prototype yet.');
  });
  document.getElementById('app-header-edit-profile-item').addEventListener('click', () => {
    toggleAvatarMenu(false);
    showToast('Profile editing isn\'t available in this prototype yet.');
  });
  document.getElementById('app-header-reset-password-item').addEventListener('click', () => {
    toggleAvatarMenu(false);
    showToast('Password reset isn\'t available in this prototype yet.');
  });
  document.getElementById('app-header-avatar-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleAvatarMenu();
  });
  // The presence dot toggles status directly on click — it shouldn't also
  // open the avatar menu underneath it.
  document.getElementById('app-header-presence-dot').addEventListener('click', e => {
    e.stopPropagation();
    togglePresenceQuick();
  });

  document.getElementById('app-header-help-btn').addEventListener('click', () => {
    showToast('Help isn\'t available in this prototype yet.');
  });

  document.getElementById('app-header-settings-btn').addEventListener('click', () => {
    renderSettingsScreen();
    showScreen('settings');
  });
  document.getElementById('app-header-insights-btn').addEventListener('click', () => {
    renderInsightsScreen();
    showScreen('insights');
  });
  document.getElementById('app-header-updates-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleUpdatesPanel();
    renderUpdatesPanel();
  });

  document.querySelectorAll('.settings-presence-btn[data-presence]').forEach(btn => {
    btn.addEventListener('click', () => setPresence(btn.dataset.presence));
  });
  document.querySelectorAll('.avatar-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });
  document.getElementById('avatar-ooo-set-btn').addEventListener('click', () => {
    const value = document.getElementById('avatar-ooo-date').value;
    if (!value) return;
    state.oooReturnDate = value;
    setPresence('ooo');
  });
  document.getElementById('settings-manage-views-btn').addEventListener('click', () => {
    renderManagerRoleList();
    showScreen('manager');
  });

  document.querySelectorAll('.dash-nav-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => setNavMode(btn.dataset.mode));
  });
  document.getElementById('dash-nav-rail-edit-btn').addEventListener('click', () => {
    homeAddAppOpen = false;
    renderHome();
    showScreen('home');
  });
  document.getElementById('home-add-app-toggle-btn').addEventListener('click', () => {
    homeAddAppOpen = true;
    renderHome();
  });
  document.getElementById('home-add-app-close-btn').addEventListener('click', () => {
    homeAddAppOpen = false;
    renderHome();
  });
  bindNavRailHover();
  loadNavMode();
  loadTheme();
  loadPresence();
  document.getElementById('proto-theme-btn').addEventListener('click', toggleTheme);

  document.querySelectorAll('[data-back-to]').forEach(btn => {
    btn.addEventListener('click', () => showScreen(btn.dataset.backTo));
  });

  document.getElementById('path-myk-recommended-card').addEventListener('click', choosePathMykRecommended);
  document.getElementById('path-dealer-recommended-card').addEventListener('click', choosePathDealerRecommended);
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
  document.getElementById('lock-notice-dismiss-btn').addEventListener('click', dismissLockNotice);

  document.getElementById('manager-edit-save-btn').addEventListener('click', saveManagerEdit);

  document.getElementById('create-app-cancel-btn').addEventListener('click', closeCreateAppModal);
  document.getElementById('create-app-submit-btn').addEventListener('click', submitCreateApp);
  document.getElementById('create-app-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('create-app-overlay')) closeCreateAppModal();
  });

  document.getElementById('details-drawer-close-btn').addEventListener('click', closeDetailsDrawer);
  document.getElementById('details-drawer-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('details-drawer-overlay')) closeDetailsDrawer();
  });

  document.getElementById('dashboard-bell-btn').addEventListener('click', e => {
    e.stopPropagation();
    toggleNotifPanel();
  });
  document.getElementById('dashboard-search-input').addEventListener('input', e => {
    renderSearchResults(e.target.value);
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.notif-bell-wrap')) {
      document.getElementById('dashboard-notif-panel').hidden = true;
      document.getElementById('app-header-updates-panel').hidden = true;
    }
    if (!e.target.closest('.dash-search')) document.getElementById('dashboard-search-results').hidden = true;
    if (!e.target.closest('.app-header-avatar-wrap')) document.getElementById('app-header-avatar-menu').hidden = true;
  });

  /* Prototype toolbar */
  document.getElementById('proto-jump-select').addEventListener('change', e => {
    const target = e.target.value;
    if (['home', 'dashboard', 'settings', 'insights'].includes(target) && !state.role) {
      state.role = 'service-advisor';
      state.navApps = [...RECOMMENDED['service-advisor']];
    }
    if (target === 'home') { homeAddAppOpen = false; renderHome(); }
    if (target === 'dashboard') renderDashboard();
    if (target === 'manager') renderManagerRoleList();
    if (target === 'settings') renderSettingsScreen();
    if (target === 'insights') renderInsightsScreen();
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
