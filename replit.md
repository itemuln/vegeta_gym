# Vegete Gym - Фитнессийн сүлжээ удирдлагын систем

## Overview
Full-stack fitness network management system ("Vegete Gym") with Mongolian language UI. Dark athletic theme with black, gray, and red accents. Two separate interfaces: (1) Public marketing website with 5 pages and animations, (2) Admin dashboard with member management, trainer management, multi-branch support, payment tracking, analytics dashboards, and investor ROI calculations.

## Tech Stack
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Recharts, Framer Motion, wouter, TanStack Query
- **Backend**: Express.js, drizzle-orm, PostgreSQL
- **Auth**: JWT-based (username/password, default: admin/admin123)
- **Language**: All UI in Mongolian (mn)

## Project Structure
```
shared/schema.ts       - Database schema (7 tables), insert schemas, types
server/index.ts        - Express server entry point with seed call
server/routes.ts       - All API routes (auth, members, trainers, branches, payments, analytics, investor, contact)
server/storage.ts      - DatabaseStorage class with all CRUD and analytics methods
server/seed.ts         - Seed data (3 branches, 6 trainers, 18 members, 30 payments)
client/src/App.tsx     - Main app with dual layout: public + admin, auth guard, dark mode

-- Public Website --
client/src/pages/public/home.tsx      - Hero, programs, animated stats, CTA sections
client/src/pages/public/locations.tsx - 3 branch locations with details
client/src/pages/public/courses.tsx   - 8 training programs
client/src/pages/public/coaches.tsx   - 6 trainer profiles
client/src/pages/public/contact.tsx   - Contact form + info cards
client/src/components/public-navbar.tsx - Fixed top navbar with responsive mobile menu
client/src/components/public-footer.tsx - 4-column footer with links
client/src/components/scroll-animation.tsx - Framer Motion scroll animation wrapper

-- Admin Dashboard --
client/src/pages/dashboard.tsx   - KPI cards and overview
client/src/pages/members.tsx     - Member CRUD management
client/src/pages/trainers.tsx    - Trainer management
client/src/pages/branches.tsx    - Branch management
client/src/pages/payments.tsx    - Payment tracking
client/src/pages/analytics.tsx   - Performance analytics
client/src/pages/investor.tsx    - Investor ROI dashboard
client/src/pages/login.tsx       - Admin login page
client/src/components/app-sidebar.tsx - Admin sidebar navigation
client/src/lib/auth.tsx          - Auth context with login/logout
client/src/lib/data.ts           - Mongolian labels and formatters
```

## Routing
- **Public**: `/` (home), `/locations`, `/courses`, `/coaches`, `/contact`
- **Admin**: `/admin` (dashboard), `/admin/members`, `/admin/trainers`, `/admin/branches`, `/admin/payments`, `/admin/analytics`, `/admin/investor`

## Database Tables
- users (auth, roles: super_admin, branch_manager, trainer, viewer)
- branches (name, address, operating cost)
- members (name, phone, membership type/status, monthly fee, branch, trainer)
- trainers (name, specialty, certification, salary, branch)
- payments (member, amount, month/year, branch)
- attendance (member check-in/out)
- performance_records (weight, lifts)

## Key Formulas (Investor Dashboard)
- Monthly Revenue = Membership Fee x Active Members
- Annual Revenue = Monthly Revenue x 12
- ROI = (Annual Profit / Initial Investment) x 100

## API Endpoints
- POST /api/auth/login
- GET/POST /api/members
- GET/POST /api/trainers
- GET/POST /api/branches
- GET/POST /api/payments
- GET /api/dashboard/stats
- GET /api/analytics
- GET /api/investor
- POST /api/contact

## Design Choices
- Dark mode enabled by default (class "dark" on html element)
- Primary color: red (hsl 0 72% 51%)
- Public site: dark athletic theme with Framer Motion scroll animations, animated counter stats
- Admin: sidebar navigation with Mongolian labels
- All data in Mongolian (names, addresses, labels)
