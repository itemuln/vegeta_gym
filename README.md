# Vegete Gym - Fitness Network Management System

A full-stack fitness network management system with a public marketing website and an admin dashboard. All UI is in Mongolian language with a dark athletic theme.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- PostgreSQL database (via Supabase)

### Setup

1. **Clone the repository**
2. **Create a Supabase project** at [supabase.com](https://supabase.com)
3. **Copy `.env.example` to `.env`** and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Push database schema to Supabase**:
   ```bash
   npm run db:push
   ```
6. **Seed the database** (optional but recommended):
   ```bash
   npx tsx server/seed.ts
   ```

### Running the App

```bash
npm run dev
```

The application starts on **port 5000**. Both the frontend and backend are served from the same port.

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

| Variable | Description | Required | Where to Find |
|---|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string from Supabase | Yes | Project Settings → Database → Connection String (use Transaction mode) |
| `SESSION_SECRET` | Secret key for JWT token signing | Yes | Generate a random string |
| `SUPABASE_URL` | Supabase project URL | Optional | Project Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Optional | Project Settings → API → anon/public key |

**Note:** The optional Supabase variables are only needed if you want to use Supabase's real-time, storage, or auth features beyond the database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, TailwindCSS, shadcn/ui |
| Animations | Framer Motion |
| Charts | Recharts |
| Routing | wouter |
| Data Fetching | TanStack Query (React Query) |
| Backend | Express.js |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Authentication | JWT (JSON Web Tokens) |

---

## Project Structure

```
/
├── client/                        # Frontend (React + Vite)
│   └── src/
│       ├── App.tsx                # Main app - routing, layouts, auth guard
│       ├── pages/
│       │   ├── public/            # Public website pages
│       │   │   ├── home.tsx       # Landing page (hero, programs, stats, CTA)
│       │   │   ├── locations.tsx  # 3 gym branch locations
│       │   │   ├── courses.tsx    # 8 training programs
│       │   │   ├── coaches.tsx    # 6 trainer profiles
│       │   │   └── contact.tsx    # Contact form + info cards
│       │   ├── login.tsx          # Admin login page
│       │   ├── dashboard.tsx      # Admin dashboard with KPI cards
│       │   ├── members.tsx        # Member management (CRUD)
│       │   ├── trainers.tsx       # Trainer management
│       │   ├── branches.tsx       # Branch management
│       │   ├── payments.tsx       # Payment tracking
│       │   ├── analytics.tsx      # Performance analytics charts
│       │   └── investor.tsx       # Investor ROI dashboard
│       ├── components/
│       │   ├── public-navbar.tsx   # Public site navigation bar
│       │   ├── public-footer.tsx   # Public site footer
│       │   ├── scroll-animation.tsx # Framer Motion scroll wrapper
│       │   ├── app-sidebar.tsx     # Admin sidebar navigation
│       │   ├── kpi-card.tsx        # Dashboard KPI card component
│       │   └── ui/                 # shadcn/ui components
│       └── lib/
│           ├── auth.tsx           # Auth context (login/logout/JWT)
│           ├── data.ts            # Mongolian labels, formatters
│           ├── queryClient.ts     # TanStack Query setup
│           └── utils.ts           # Utility functions
│
├── server/                        # Backend (Express.js)
│   ├── index.ts                   # Server entry point, starts on port 5000
│   ├── routes.ts                  # All API route handlers
│   ├── storage.ts                 # Database operations (CRUD, analytics)
│   ├── seed.ts                    # Seed data (branches, trainers, members, payments)
│   └── vite.ts                    # Vite dev server integration
│
├── shared/                        # Shared between frontend and backend
│   └── schema.ts                  # Database schema, Zod validation, TypeScript types
│
└── drizzle.config.ts              # Drizzle ORM configuration
```

---

## Routes

### Public Website

| Path | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, programs, animated stats, CTA |
| `/locations` | Locations | 3 gym branch locations with addresses and hours |
| `/courses` | Courses | 8 training programs with details |
| `/coaches` | Coaches | 6 trainer profiles with certifications |
| `/contact` | Contact | Contact form and gym info cards |

### Admin Dashboard

All admin routes require authentication. Navigate to `/admin` to access.

| Path | Page | Description |
|---|---|---|
| `/admin` | Dashboard | Overview with KPI cards and stats |
| `/admin/members` | Members | Add, edit, view gym members |
| `/admin/trainers` | Trainers | Manage trainer profiles |
| `/admin/branches` | Branches | Manage gym branch locations |
| `/admin/payments` | Payments | Track member payments |
| `/admin/analytics` | Analytics | Revenue and performance charts |
| `/admin/investor` | Investor | ROI calculations and projections |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with username/password, returns JWT |
| GET | `/api/members` | List all members |
| POST | `/api/members` | Create a new member |
| GET | `/api/trainers` | List all trainers |
| POST | `/api/trainers` | Create a new trainer |
| GET | `/api/branches` | List all branches |
| POST | `/api/branches` | Create a new branch |
| GET | `/api/payments` | List all payments |
| POST | `/api/payments` | Record a payment |
| GET | `/api/dashboard/stats` | Dashboard KPI statistics |
| GET | `/api/analytics` | Analytics data for charts |
| GET | `/api/investor` | Investor ROI calculations |
| POST | `/api/contact` | Submit contact form |

---

## Database

### Tables

| Table | Description |
|---|---|
| `users` | Admin accounts with roles (super_admin, branch_manager, trainer, viewer) |
| `branches` | Gym locations with address and operating costs |
| `members` | Gym members with membership type, status, fees |
| `trainers` | Trainer profiles with specialty, certification, salary |
| `payments` | Payment records linked to members and branches |
| `attendance` | Member check-in/check-out records |
| `performance_records` | Member performance tracking (weight, lifts) |

### Seed Data

On first run, the database is automatically seeded with:
- 1 admin user (username: `admin`, password: `admin123`)
- 3 branches (Sukhbaatar, Bayangol, Khan-Uul)
- 6 trainers
- 18 members
- 30 payment records

---

## Authentication

- **Default login**: username `admin`, password `admin123`
- JWT tokens are stored in localStorage
- Tokens are sent via `Authorization: Bearer <token>` header
- Admin routes are protected by a frontend auth guard

---

## Design

- Dark mode enabled by default
- Primary accent color: Red (`hsl(0 72% 51%)`)
- Public site uses Framer Motion for scroll-triggered animations
- Admin dashboard uses a collapsible sidebar for navigation
- Fully responsive for mobile, tablet, and desktop
- All text and labels are in Mongolian

---

## Key Formulas (Investor Dashboard)

| Metric | Formula |
|---|---|
| Monthly Revenue | Membership Fee x Active Members |
| Annual Revenue | Monthly Revenue x 12 |
| Monthly Profit | Monthly Revenue - Total Operating Costs |
| ROI | (Annual Profit / Initial Investment) x 100 |

---

## Deployment

### Using Supabase

This project is designed to work seamlessly with Supabase:

1. **Database**: Already configured to use Supabase PostgreSQL
2. **Hosting**: Deploy the frontend/backend to:
   - Vercel
   - Netlify
   - Railway
   - Render
   - Your own VPS

3. **Environment Variables**: Set the following in your hosting platform:
   - `DATABASE_URL`
   - `SESSION_SECRET`

### Benefits of Supabase

- ✅ **Generous Free Tier**: 500MB database, 2GB file storage
- ✅ **Global CDN**: Fast database connections worldwide
- ✅ **Real-time Updates**: WebSocket support for live data
- ✅ **Built-in Authentication**: Can replace custom JWT system
- ✅ **File Storage**: For trainer/member photos
- ✅ **Auto-backups**: Daily backups on paid plans
- ✅ **Dashboard**: Easy database management
- ✅ **Row-Level Security**: Fine-grained access control

---

## Migration from Replit

If you're migrating from Replit, see [SUPABASE_MIGRATION.md](./SUPABASE_MIGRATION.md) for detailed instructions.

