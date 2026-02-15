# Supabase Migration Guide

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase
3. Get your database connection string from: Project Settings → Database → Connection String → URI

## Step 1: Install Supabase Client (Optional)

While you can continue using Drizzle ORM with Supabase's PostgreSQL database, you can optionally install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 2: Update Environment Variables

Replace your Replit database environment variables with Supabase credentials:

### Old (Replit):
```
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=...
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
SESSION_SECRET=your_secret_key
```

### New (Supabase):
```
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=your_secret_key

# Optional: If you want to use Supabase client features
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

**Where to find these:**
- `DATABASE_URL`: Project Settings → Database → Connection String → URI (use "Transaction" mode for Drizzle)
- `SUPABASE_URL`: Project Settings → API → Project URL
- `SUPABASE_ANON_KEY`: Project Settings → API → Project API keys → anon/public

## Step 3: Create .env File

Create a `.env` file in your project root:

```bash
# Supabase Database
DATABASE_URL=your_supabase_connection_string_here

# Session
SESSION_SECRET=your_random_secret_key_here

# Optional: Supabase Client (for real-time, storage, etc.)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Step 4: Update .gitignore

Make sure `.env` is in your `.gitignore`:

```
.env
.env.local
```

## Step 5: Push Database Schema to Supabase

Run the following command to create all tables in your Supabase database:

```bash
npm run db:push
```

This will use Drizzle Kit to push your schema to Supabase PostgreSQL.

## Step 6: Seed Your Database

Run the seed script to populate initial data:

```bash
npx tsx server/seed.ts
```

## Step 7: Test the Application

```bash
npm run dev
```

Visit http://localhost:5000 and test:
- Login with `admin` / `admin123`
- Check if data loads correctly
- Test CRUD operations

## Key Differences: Replit → Supabase

| Feature | Replit DB | Supabase |
|---------|-----------|----------|
| Connection | Auto-configured | Manual setup required |
| Connection Pooling | Basic | Built-in (Supavisor) |
| Real-time | ❌ | ✅ Built-in |
| Storage | Separate | Built-in |
| Auth | Custom JWT | Can use Supabase Auth |
| SSL | Auto | Required (default) |

## Connection Pool Modes

Supabase offers different connection modes:

- **Transaction Mode** (Port 6543) - For Drizzle ORM ✅ Recommended
- **Session Mode** (Port 5432) - For long-running connections
- **Direct Connection** (Port 5432) - No pooler

Use **Transaction Mode** for this application since you're using Drizzle ORM.

## Troubleshooting

### SSL Connection Issues

If you get SSL errors, update `drizzle.config.ts`:

```typescript
dbCredentials: {
  url: process.env.DATABASE_URL,
  ssl: true, // or ssl: { rejectUnauthorized: false }
}
```

### Connection Pool Errors

If you see "too many connections", use the pooled connection string (port 6543).

### Timeout Issues

Supabase free tier pauses after inactivity. The first request might be slow as the database wakes up.

## Optional: Using Supabase Features

If you want to use Supabase's additional features (Auth, Storage, Real-time), you can create a Supabase client:

Create `server/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Migration Checklist

- [ ] Create Supabase project
- [ ] Get connection string
- [ ] Create `.env` file with `DATABASE_URL`
- [ ] Add `.env` to `.gitignore`
- [ ] Run `npm run db:push`
- [ ] Run seed script
- [ ] Test login and CRUD operations
- [ ] Update README.md with Supabase instructions
- [ ] Remove Replit-specific references

## Benefits of Supabase

✅ Better performance with global CDN  
✅ Built-in real-time subscriptions  
✅ Integrated authentication system  
✅ File storage included  
✅ Better free tier (500MB database)  
✅ Row-level security (RLS)  
✅ Auto-generated REST API  
✅ Dashboard for database management  

## Next Steps

After successful migration, consider:
1. Implementing Supabase Auth instead of custom JWT
2. Using real-time subscriptions for live updates
3. Leveraging Row Level Security (RLS) for better security
4. Using Supabase Storage for trainer/member photos
