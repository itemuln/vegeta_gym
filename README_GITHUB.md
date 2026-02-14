# 🏋️‍♂️ Vegeta Gym - Fitness Network Management System

[![CI/CD Pipeline](https://github.com/itemuln/vegeta_gym/actions/workflows/ci.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/ci.yml)
[![Security Scan](https://github.com/itemuln/vegeta_gym/actions/workflows/security.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/security.yml)
[![Docker Build](https://github.com/itemuln/vegeta_gym/actions/workflows/docker.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/docker.yml)

A modern, full-stack fitness network management system with a public marketing website and an admin dashboard. Built with React, TypeScript, Express, and PostgreSQL. All UI is in Mongolian language with a sleek dark athletic theme.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)

---

## ✨ Features

### 🌐 Public Website
- **Landing Page** - Hero section, programs showcase, statistics, and call-to-action
- **Locations** - Interactive display of 3 gym branch locations with maps
- **Courses** - Detailed information about 8 training programs (Yoga, CrossFit, Boxing, etc.)
- **Coaches** - Profile pages for 6 professional trainers
- **Contact** - Contact form with gym information cards

### 📊 Admin Dashboard
- **Overview Dashboard** - Real-time KPI cards and metrics
- **Member Management** - Full CRUD operations for gym members
- **Trainer Management** - Manage trainer profiles and assignments
- **Branch Management** - Multi-location gym branch administration
- **Payment Tracking** - Comprehensive payment records and analytics
- **Analytics** - Performance charts and business insights
- **Investor Dashboard** - ROI tracking and financial reporting

### 🔐 Security Features
- JWT-based authentication
- Session management
- Secure password handling
- Environment variable configuration
- Docker secrets support

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 20 or higher
- **Docker** and Docker Compose (recommended)
- **PostgreSQL** 16+ (if running locally without Docker)

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/itemuln/vegeta_gym.git
   cd vegeta_gym
   ```

2. **Start with Docker Compose**
   ```bash
   docker compose up --build -d
   ```

3. **Initialize the database**
   ```bash
   docker compose exec server npm run db:push
   ```

4. **Access the application**
   - Website: http://localhost:3000
   - Admin Login: http://localhost:3000/login

### Option 2: Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/itemuln/vegeta_gym.git
   cd vegeta_gym
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL** (if not already running)

4. **Initialize database**
   ```bash
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access at** http://localhost:5000

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TypeScript |
| **UI Components** | shadcn/ui, Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Routing** | wouter |
| **Data Fetching** | TanStack Query (React Query) |
| **Backend** | Express.js, Node.js |
| **Database** | PostgreSQL 16 |
| **ORM** | Drizzle ORM |
| **Authentication** | JWT (JSON Web Tokens) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Security Scanning** | CodeQL, Trivy, Dependabot |

---

## 📁 Project Structure

```
vegeta_gym/
├── .github/
│   ├── workflows/          # GitHub Actions CI/CD pipelines
│   └── dependabot.yml      # Automated dependency updates
├── client/                 # Frontend React application
│   ├── public/            # Static assets and images
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components (public & admin)
│       ├── hooks/         # Custom React hooks
│       └── lib/           # Utilities and configurations
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database operations
│   └── seed.ts           # Database seeding
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Database schema & validation
├── db/                   # Database configuration
│   └── password.txt      # PostgreSQL password (not in git)
├── compose.yaml          # Docker Compose configuration
├── Dockerfile           # Docker image definition
└── drizzle.config.ts    # Drizzle ORM configuration
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5000) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | TypeScript type checking |
| `npm run db:push` | Push database schema changes |

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose up --build -d

# Run database migrations
docker compose exec server npm run db:push

# Access PostgreSQL
docker compose exec db psql -U postgres -d gymhub
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `PGHOST` | Database host | Yes |
| `PGPORT` | Database port | Yes |
| `PGUSER` | Database username | Yes |
| `PGPASSWORD` | Database password | Yes |
| `PGDATABASE` | Database name | Yes |
| `SESSION_SECRET` | JWT signing secret | Yes |
| `PORT` | Application port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |

---

## 🧪 Testing & CI/CD

### GitHub Actions Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Linting and type checking
   - Build verification
   - Database integration tests
   - Docker build testing

2. **Security Scanning** (`.github/workflows/security.yml`)
   - CodeQL analysis for code vulnerabilities
   - Trivy container scanning
   - npm audit for dependency vulnerabilities
   - Gitleaks for secret detection
   - OWASP dependency check

3. **Docker Image CI** (`.github/workflows/docker.yml`)
   - Multi-platform image builds (amd64, arm64)
   - Automated push to GitHub Container Registry
   - Version tagging
   - Security scanning of images

### Running Tests Locally

```bash
# Type checking
npm run check

# Build test
npm run build

# Security audit
npm audit
```

---

## 🛡️ Security

This project implements multiple layers of security:

- **Automated Security Scans**: CodeQL, Trivy, npm audit
- **Dependency Management**: Dependabot for automatic updates
- **Secret Detection**: Gitleaks prevents committed secrets
- **Container Security**: Regular Docker image scanning
- **OWASP Compliance**: Dependency vulnerability checking

### Reporting Security Issues

Please report security vulnerabilities by emailing the maintainer directly. Do not create public issues for security concerns.

---

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - Admin authentication
- **members** - Gym member records
- **trainers** - Trainer/coach profiles
- **branches** - Gym location information
- **payments** - Payment transaction records

Schema is managed with Drizzle ORM and can be found in `shared/schema.ts`.

---

## 🚀 Deployment

### Docker Deployment

1. Build and push the Docker image to your registry
2. Set up PostgreSQL database (or use managed service)
3. Configure environment variables with production values
4. Deploy using Docker Compose or Kubernetes

### Traditional Deployment

1. Set up Node.js 20+ on your server
2. Install PostgreSQL 16+
3. Clone repository and run `npm ci --production`
4. Build the application: `npm run build`
5. Start with: `npm start`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All PRs will automatically run through CI/CD checks including:
- Type checking
- Build verification
- Security scanning
- Dependency review

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **itemuln** - *Initial work* - [@itemuln](https://github.com/itemuln)

---

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) components
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- Charts with [Recharts](https://recharts.org/)

---

## 📞 Support

For questions and support, please open an issue on GitHub.

---

**Made with ❤️ for the fitness community**
