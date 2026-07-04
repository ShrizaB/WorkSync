# WorkSync — HR Management System

WorkSync is a full-stack Human Resource Management (HRM) application for managing
employees, attendance, leave requests, and payroll — with a built-in AI HR
Assistant powered by Google's free Gemini API.

---

## ✨ Features

- **Role-based dashboards** — separate views for Admins and Employees
- **Employee management** — add, edit, search, filter, and remove employee records
- **Attendance tracking** — daily check-in/check-out, monthly calendar view, history, and stats
- **Leave management** — apply for leave, track balances, admin approval/rejection workflow
- **Payroll** — salary breakdowns (HRA, PF, TDS, etc.), payslip generation, monthly summaries
- **AI HR Assistant** — a floating chat widget powered by Google Gemini's free tier that answers
  HR/workplace questions and helps polish leave request reasons
- **JWT authentication** — secure login/register with bcrypt-hashed passwords

---

## 🏗️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS, React Router, React Hook Form + Zod, Recharts, Axios |
| Backend | Node.js, Express, Node's built-in `node:sqlite` (no native build step required) |
| Auth | JSON Web Tokens (JWT) + bcrypt |
| AI | Google Gemini API (free tier, via direct REST call — no paid SDK) |

---

## 📁 Project Structure

```
WorkSync/
├── Frontend/          React + Vite single-page app
│   └── src/
│       ├── api/       HTTP client modules (axios) that call the Backend
│       ├── components/
│       ├── pages/
│       └── routes/
└── Backend/           Express REST API
    └── src/
        ├── db/        SQLite schema + demo data seeding
        ├── middleware/  JWT auth + role guards
        ├── routes/    auth, employees, attendance, leaves, payroll, dashboard, ai
        └── utils/     Gemini API wrapper
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 22.5+** (needed for the backend's built-in SQLite support)

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
JWT_SECRET=replace-with-a-long-random-string
GEMINI_API_KEY=          # optional — get a free key at https://aistudio.google.com/apikey
```

```bash
npm run seed   # creates worksync.db and loads demo employees/leaves/payroll
npm start      # runs on http://localhost:8000
```

**Demo logins** (printed by the seed script):
| Role | Email | Password |
|---|---|---|
| Admin | `admin@worksync.com` | `admin123` |
| Employee | `employee@worksync.com` | `emp123` |

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8000/api
npm run dev              # runs on http://localhost:5173
```

Open **http://localhost:5173** and log in with one of the demo accounts above.

---

## 🔌 API Reference

All endpoints are prefixed with `/api`. Except for `/auth/login`, `/auth/register`,
and `/health`, every route requires an `Authorization: Bearer <token>` header.

| Area | Endpoints |
|---|---|
| **Auth** | `POST /auth/login` · `POST /auth/register` · `GET /auth/profile` |
| **Employees** | `GET/POST /employees` · `GET/PUT/DELETE /employees/:id` · `GET /employees/departments/list` |
| **Attendance** | `GET /attendance/today` · `POST /attendance/checkin` · `POST /attendance/checkout` · `GET /attendance/history` · `GET /attendance/calendar` · `GET /attendance/stats` |
| **Leaves** | `POST /leaves` · `GET /leaves/my` · `GET /leaves` (admin) · `GET /leaves/pending` (admin) · `PUT /leaves/:id/approve` · `PUT /leaves/:id/reject` · `GET /leaves/balance` |
| **Payroll** | `GET /payroll` (admin) · `GET /payroll/my` · `GET /payroll/summary` (admin) · `POST /payroll/:id/generate` (admin) · `GET /payroll/months` |
| **Dashboard** | `GET /dashboard/admin-stats` · `/attendance-trend` · `/department-distribution` · `/monthly-payroll` · `/recent-activity` (admin only) |
| **AI Assistant** | `POST /ai/assistant` — Gemini-powered HR chatbot · `POST /ai/leave-reason-helper` — polishes a leave request reason |

---

## 🔐 Environment Variables

**Backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the API runs on (default `8000`) |
| `CLIENT_ORIGIN` | Allowed CORS origin (your frontend URL) |
| `JWT_SECRET` | Secret used to sign auth tokens — set this to something random |
| `JWT_EXPIRES_IN` | Token lifetime (default `1d`) |
| `DB_PATH` | Path to the SQLite database file |
| `GEMINI_API_KEY` | Free API key from https://aistudio.google.com/apikey (optional) |
| `GEMINI_MODEL` | Gemini model name (default `gemini-2.5-flash`) |

**Frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API (default `http://localhost:8000/api`) |

> `.env` files are gitignored on purpose — never commit real secrets. Use `.env.example` as the template.

---

## 🗄️ Resetting Demo Data

```bash
cd Backend
npm run seed
```
This drops and recreates all tables, then reloads the original demo employees, leaves, attendance, and payroll records.

---

## 🤖 About the AI Assistant

The AI Assistant widget (bottom-right sparkle icon) calls Google's Gemini API
free tier directly via its REST endpoint — no paid SDK, no credit card needed
to get a key. If `GEMINI_API_KEY` isn't set on the backend, the rest of the app
works normally; only the assistant will show a clear "not configured" message.

---

## 📄 License

See `LICENSE`.
