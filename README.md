# 🎓 HostelHub — College Hostel Academic Resource Sharing Platform

> **"If a hostel student needs something for their CT or exam, they should be able to find it on HostelHub."**

HostelHub is a platform designed for hostel students to easily share, discover, bookmark, and download lecture notes, handwritten summaries, PYQs, video lectures, and formula sheets, with a dedicated **CT Zone** for class test preparation.

---

## 🌟 Key Features

- **🏠 Home Dashboard:** Good morning greeting, upcoming class tests countdown, quick actions bento grid, and categorized latest study materials with instant search & filter tabs.
- **⚡ CT Zone:** Active preparation subject cards with progress meters, subject switcher (COA, DSA, DBMS), and an interactive preparation checklist (Key Topics, Teacher Notes, PYQs, Videos) with real-time percentage completion.
- **📤 Upload Resource:** Drag-and-drop file upload with animated upload progression, category & subject tags, and format validation.
- **📚 Library & Saved:** Browse by subject, format (PDFs, Videos), bookmark materials, and access revision lists.
- **💬 Discussions & Announcements:** Official hostel notifications and peer study threads.
- **📱 Fully Responsive:** Optimized desktop and mobile layouts matching Google Stitch design specifications.

---

## 🏗️ Architecture & Project Structure

```text
HostelHub/
├── frontend/                        # React + Tailwind CSS + React Router + Vite
│   ├── src/
│   │   ├── components/layout/       # Sidebar, TopHeader, BottomNav, AppLayout
│   │   ├── components/common/       # CTCard, ResourceItem, QuickActions
│   │   ├── pages/                   # HomePage, CTZonePage, UploadPage, NotesPage, etc.
│   │   └── context/                 # AppContext state management
│   ├── package.json
│   └── vite.config.js
│
└── backend/                         # Node.js + Express + Supabase PostgreSQL & Auth REST API
    ├── src/
    │   ├── config/                  # Supabase clients & Zod-validated environment config
    │   ├── controllers/             # Auth, User, Resource, Upload, Bookmark, Comment, CT, Announcement
    │   ├── middleware/              # JWT auth, RBAC roles, Zod validation, error handler, rate limit
    │   ├── routes/                  # REST route modules mounted under /api/v1
    │   ├── services/                # Database queries, Supabase Storage management, Business logic
    │   ├── utils/                   # Structured logger, ApiResponse, ApiError, Pagination
    │   ├── validators/              # Zod validation schemas
    │   ├── app.js                   # Express app with Helmet, CORS, and Middlewares
    │   └── server.js                # Server entry point & graceful shutdown
    ├── migrations/
    │   └── 001_initial_schema.sql   # PostgreSQL Schema, RLS Policies, Triggers, Indexes & Seed Data
    ├── tests/                       # Vitest / Supertest automated test suite (11/11 Passing)
    ├── .env.example                 # Environment configuration template
    ├── API.md                       # Complete REST API specification
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase](https://supabase.com) account (free tier)

### 2. Backend Setup
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env

# Run database migrations in your Supabase SQL Editor
# (Copy and run contents of backend/migrations/001_initial_schema.sql)

# Start backend server
npm run dev
# -> Running on http://localhost:5000/api/v1
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Start frontend dev server
npm run dev
# -> Live on http://localhost:3000
```

---

## 🧪 Testing

```bash
# Run backend test suite
cd backend
npm test
```

---

## 📄 License
MIT
