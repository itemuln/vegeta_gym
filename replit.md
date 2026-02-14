# Vegete Gym - Фитнессийн сүлжээ удирдлагын систем

## Overview
Full-stack fitness network management system ("Vegete Gym") with Mongolian language UI. Dark athletic theme with black, gray, and red accents. Includes member management, trainer management, multi-branch support, payment tracking, analytics dashboards, and investor ROI calculations.

## Tech Stack
- **Frontend**: React + Vite, TailwindCSS, shadcn/ui, Recharts, Framer Motion, wouter, TanStack Query
- **Backend**: Express.js, drizzle-orm, PostgreSQL
- **Auth**: JWT-based (username/password, default: admin/admin123)
- **Language**: All UI in Mongolian (mn)

## Project Structure
```
shared/schema.ts       - Database schema (7 tables), insert schemas, types
server/index.ts        - Express server entry point with seed call
server/routes.ts       - All API routes (auth, members, trainers, branches, payments, analytics, investor)
server/storage.ts      - DatabaseStorage class with all CRUD and analytics methods
server/seed.ts         - Seed data (3 branches, 6 trainers, 18 members, 30 payments)
client/src/App.tsx     - Main app with auth guard, sidebar layout, dark mode
client/src/pages/      - All pages: login, dashboard, members, trainers, branches, payments, analytics, investor
client/src/lib/auth.tsx - Auth context with login/logout
client/src/lib/data.ts  - Mongolian labels and formatters
client/src/components/  - app-sidebar, kpi-card, UI components
```

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

## Design Choices
- Dark mode enabled by default (class "dark" on html element)
- Primary color: red (hsl 0 72% 51%)
- Sidebar navigation with Mongolian labels
- All data in Mongolian (names, addresses, labels)
