# HostelHub Backend API

Production-ready, secure, and scalable REST API backend for **HostelHub** — the college hostel academic resource sharing platform.

Built with **Node.js**, **Express**, **Supabase PostgreSQL**, **Supabase Auth**, and **Supabase Storage**.

---

## 🛠️ Tech Stack & Architecture

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (ES Modules)
- **Database:** Supabase PostgreSQL with Row-Level Security (RLS) & Full-Text Search
- **Authentication:** Supabase Auth (JWT Bearer tokens)
- **File Storage:** Supabase Storage (`hostelhub-resources` bucket)
- **Validation:** Zod
- **Security:** Helmet, CORS, Express-Rate-Limit, Sanitized inputs
- **Testing:** Vitest & Supertest

---

## 📁 Directory Structure

```text
backend/
├── src/
│   ├── config/              # Environment config & Supabase client initialization
│   ├── controllers/         # Thin HTTP request handlers
│   ├── middleware/          # JWT auth, RBAC roles, Zod validation, error handler, rate limit
│   ├── routes/              # Express API route modules
│   ├── services/            # Core business logic & database queries
│   ├── utils/               # Structured logger, standardized ApiResponse & ApiError, pagination
│   ├── validators/          # Zod schema definitions
│   ├── app.js               # Express application setup
│   └── server.js            # Server entry point & graceful shutdown
├── migrations/
│   └── 001_initial_schema.sql # Complete PostgreSQL schema, RLS, Indexes, Triggers, Seed data
├── tests/                   # Automated Vitest/Supertest test suites
├── .env.example             # Template for environment variables
├── API.md                   # Complete REST API specification
├── package.json
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Supabase

1. Create a free project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open [`migrations/001_initial_schema.sql`](./migrations/001_initial_schema.sql), copy its content, and execute it.
   - This sets up all tables, indexes, triggers, and Row Level Security policies.
4. Go to **Storage** -> **New Bucket**:
   - Bucket Name: `hostelhub-resources`
   - Public: `true` (or configure authenticated RLS policies)
   - Allowed MIME Types: `application/pdf`, `image/jpeg`, `image/png`, `image/webp`, `video/mp4`, `video/webm`
   - Maximum File Size: `100MB`

### 3. Setup Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials:
```env
PORT=5000
NODE_ENV=development
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
SUPABASE_STORAGE_BUCKET=hostelhub-resources
```

### 4. Run Locally
```bash
# Start development server with auto-reload
npm run dev

# Start in production mode
npm start
```

### 5. Run Automated Tests
```bash
npm test
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health and uptime | No |
| `GET` | `/api/v1/dashboard` | Unified homepage data & statistics | Optional |
| `POST` | `/api/v1/auth/register` | Register new student account | No |
| `POST` | `/api/v1/auth/login` | Login and obtain JWT session | No |
| `POST` | `/api/v1/auth/logout` | Invalidate current session | Yes |
| `GET` | `/api/v1/auth/me` | Current user profile | Yes |
| `GET` | `/api/v1/resources` | List/filter study materials | Optional |
| `GET` | `/api/v1/resources/search`| Full-text search resources | Optional |
| `POST` | `/api/v1/resources` | Create study resource metadata | Yes |
| `GET` | `/api/v1/resources/:id` | Get resource & increment views | Optional |
| `PATCH`| `/api/v1/resources/:id` | Update resource (Owner/Admin) | Yes |
| `DELETE`|`/api/v1/resources/:id`| Delete resource & storage file | Yes |
| `GET` | `/api/v1/resources/:id/download` | Get signed download URL | Optional |
| `POST` | `/api/v1/resources/:id/bookmark` | Bookmark study resource | Yes |
| `DELETE`|`/api/v1/resources/:id/bookmark`| Remove resource from bookmarks | Yes |
| `POST` | `/api/v1/uploads/signed-url` | Generate storage upload URL | Yes |
| `POST` | `/api/v1/uploads/direct` | Upload multipart file buffer | Yes |
| `GET` | `/api/v1/cts/upcoming` | Upcoming class tests with countdowns | Optional |
| `GET` | `/api/v1/cts/:id/resources` | Preparation resources for a CT | Optional |
| `GET` | `/api/v1/announcements`| Published hostel notices | Optional |

*For complete request/response schemas, refer to [API.md](./API.md).*

---

## 🔒 Security Best Practices Implemented

1. **Row-Level Security (RLS):** Policies in PostgreSQL enforce that students can only modify or delete their own resources, comments, and profile data.
2. **Never Storing Plaintext Passwords:** Supabase Auth handles bcrypt hashing and secure session management.
3. **No Service-Role Key on Frontend:** All privileged database mutations and admin checks are handled strictly on this backend server.
4. **File Path Sanitization:** Filenames are sanitized and prepended with random UUIDs to prevent directory traversal and overwrite collisions.
5. **Rate Limiting:** Protects authentication endpoints from brute force and upload endpoints from spam.

---

## 🚢 Deployment (Render / Railway)

1. Set the **Build Command**: `npm install`
2. Set the **Start Command**: `npm start`
3. Add Environment Variables in your hosting dashboard (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`, `NODE_ENV=production`).
4. Health check path: `/api/v1/health`.
