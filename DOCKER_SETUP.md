# Docker Setup Guide for Gym-Hub

## 🎯 What We've Set Up

Your Gym-Hub application now has a complete Docker setup with:
- **PostgreSQL Database** running in a container
- **Node.js Application** containerized and connected to the database
- **Persistent Data Storage** so your database data survives container restarts
- **Automatic Health Checks** to ensure the database is ready before the app starts

## 📁 Files Created

1. **`db/password.txt`** - Contains the database password (keep this secure!)
2. **`compose.yaml`** - Updated to include PostgreSQL database service
3. **`Dockerfile`** - Fixed to build the app correctly
4. **`.env.example`** - Example environment variables

## 🚀 How to Run

### Step 1: Start the Application
```bash
docker compose up --build
```

This command will:
1. Build your Node.js application image
2. Start the PostgreSQL database container
3. Wait for the database to be healthy
4. Start your application container
5. Connect the app to the database

### Step 2: Run Database Migrations (First Time Only)
In a new terminal window, run:
```bash
docker compose exec server npm run db:push
```

This will create all the necessary tables in your database.

### Step 3: Access Your Application
Open your browser and go to:
- **Application**: http://localhost:3000

## 🛑 How to Stop

Press `Ctrl+C` in the terminal, then run:
```bash
docker compose down
```

To also remove the database data (careful - this deletes everything!):
```bash
docker compose down -v
```

## 🔧 Useful Commands

### View Logs
```bash
# View all logs
docker compose logs

# View only app logs
docker compose logs server

# View only database logs
docker compose logs db

# Follow logs in real-time
docker compose logs -f
```

### Rebuild After Code Changes
```bash
docker compose up --build
```

### Run Commands Inside the Container
```bash
# Access the server container shell
docker compose exec server sh

# Run npm commands
docker compose exec server npm run build
docker compose exec server npm run check
```

### Connect to the Database
```bash
# Using psql inside the container
docker compose exec db psql -U postgres -d gymhub

# Common psql commands:
# \dt - list tables
# \q - quit
```

### Seed the Database
```bash
docker compose exec server node -e "import('./dist/seed.cjs')"
```

## 📊 Database Details

- **Host**: `db` (internal Docker network) or `localhost` (from your machine)
- **Port**: `5432`
- **Database Name**: `gymhub`
- **Username**: `postgres`
- **Password**: `gymhub_secure_password_2026` (stored in `db/password.txt`)

## 🔐 Security Notes

⚠️ **Before deploying to production:**

1. Change the database password in `db/password.txt`
2. Change `SESSION_SECRET` to a strong random value
3. Never commit `db/password.txt` to git (add it to `.gitignore`)
4. Use environment-specific secrets management

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is already in use, change it in `compose.yaml`:
```yaml
ports:
  - 8080:3000  # Change 3000 to another port like 8080
```

### Database Connection Issues
Check if the database is healthy:
```bash
docker compose ps
```

View database logs:
```bash
docker compose logs db
```

### Build Errors
Clean everything and rebuild:
```bash
docker compose down -v
docker system prune -f
docker compose up --build
```

### Permission Errors
The Dockerfile now copies files before switching to the `node` user, which prevents permission issues.

## 📝 Development Workflow

1. Make code changes in your editor
2. Rebuild and restart: `docker compose up --build`
3. Test your changes at http://localhost:3000
4. Check logs if something doesn't work: `docker compose logs -f`

## 🎓 Next Steps

1. **Seed the database** with initial data (see above)
2. **Test the admin login** at http://localhost:3000/login
3. **Customize** the database password and session secret
4. **Add** to `.gitignore`: `db/password.txt` and `.env`

Happy coding! 🚀
