# Sri Venkata Sai Furniture Works - Catalog & Enquiry Portal

A professional, full-stack digital catalog and enquiry management workflow system built for **SRI VENKATA SAI FURNITURE WORKS**. This portal enables customers and dealers to browse furniture items, filter by material/price, and submit structural enquiries. Admin users can log remarks, update statuses, and manage the product inventory.

---

## Technology Stack

- **Frontend**: React (Vite) + Vanilla CSS (Custom design tokens, serif typography, responsive layouts) + Lucide React Icons
- **Backend**: Node.js + Express.js REST API + JWT Sessions
- **Database**: SQLite (No local setup required; database tables bootstrap and seed automatically on startup)
- **Execution**: Concurrently (Runs client and backend servers in parallel with a single command)

---

## Folder Layout

```text
├── backend/
│   ├── config/          # Database loader and ORM helper
│   ├── controllers/     # Request logic (Auth, Products, Enquiries, Stats)
│   ├── middleware/      # Authentication validation
│   ├── routes/          # API route bindings
│   ├── server.js        # Server bootstrap entry
│   └── package.json
├── frontend/
│   ├── public/          
│   ├── src/
│   │   ├── components/  # Layout elements (Navbar, Footer, Protected Route, Toast)
│   │   ├── pages/       # Portal views (Home, Catalog, Detail, Form, Login, Dashboard)
│   │   ├── api.js       # Global API utility classes
│   │   ├── App.jsx      # Navigation routing and context
│   │   ├── index.css    # Premium CSS styling tokens
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js   # Dev configuration (fixed port 3000)
├── database/
│   ├── schema.sql       # Table schema rules (DDL)
│   ├── seed.sql         # Seed catalog datasets
│   └── furniture.db     # SQLite DB file (autocreated on start)
├── docs/
│   ├── api.md           # API endpoint specifications
│   └── testing.md       # Manual verification checklists
├── package.json         # Root coordination package.json
└── README.md            # Main project setup guide
```

---

## Setup & Startup Instructions

### Prerequisites
- Node.js installed (v16.0 or higher is recommended)

### Step 1: Install Dependencies
Run the install command in the root project folder. This will automatically trigger `npm install` in the root workspace, `/backend` directory, and `/frontend` directory:
```bash
npm run install:all
```

### Step 2: Start Development Servers
Run the development runner in the root folder to start the Express server (port `5000`) and the Vite client (port `3000`) concurrently:
```bash
npm run dev
```

The portal will open locally at:
- **Client App URL**: [http://localhost:3000/](http://localhost:3000/)
- **Backend API URL**: [http://localhost:5000/](http://localhost:5000/)

---

## Demo Administrator Credentials

To access the administrative dashboard, inventory panels, and follow-up tools:
- **Email**: `admin@svsfurniture.com`
- **Password**: `admin123`

---

## Key Features

### Customer Features
- **Visual Grid Catalog**: Categorized products with clean images, sizing details, and price ranges.
- **Advanced Filtering**: Live filter by Category tab, search keywords, wood material types, and availability status.
- **Prefilled Enquiries**: Clicking "Enquire Now" on a product details page pre-fills that specific item in the submission sheet.
- **Submit Receipt**: Clean confirmation display with a reference ID (e.g. `#SVS-12`) and links to message SVS Works directly on WhatsApp.

### Administrator Features
- **Key Metrics Dashboard**: Analytics cards for new, in-progress, and converted enquiries.
- **Product Inventory Management**: CRUD forms to upload new items, modify dimensions, adjust price limits, or toggle homepage pin highlights.
- **Enquiry Tracking Timeline**: Manage customer queries, modify status workflows, and log follow-up notes in a chronological log timeline.
- **Direct Dialing**: Integrated click-to-email and click-to-WhatsApp links to contact prospective leads.
