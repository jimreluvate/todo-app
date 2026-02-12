# Docker Development Guide

## Environment Setup

Create a `.env` file with the following variables:

```bash
# Django Backend
DJANGO_SECRET_KEY=your-secret-key-here

# Next.js Frontend
NEXTAUTH_SECRET=your-nextauth-secret-here
```

**Note**: The system automatically uses your existing `.env.local` files:
- `./backend/.env.local` for Django backend
- `./frontend/.env.local` for Next.js frontend

## Development Environment

Start all development services:
```bash
docker compose --profile development up -d
```

This will start:
- PostgreSQL database (port 5433 - changed to avoid conflicts with local PostgreSQL)
- Redis cache (port 6379) 
- Django backend with hot reload (port 8000)
- Next.js frontend with hot reload (port 3000)

## Production Environment

Start all production services:
```bash
docker compose --profile production up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Django backend with Gunicorn (port 8000)
- Next.js frontend (port 3000)
- Nginx reverse proxy (ports 80, 443)

## Individual Services

### Database only
```bash
docker compose up -d db
```

### Development backend only
```bash
docker compose --profile development up -d backend-dev db redis
```

### Development frontend only
```bash
docker compose --profile development up -d frontend-dev backend-dev db redis
```

## Hot Reloading

The development setup includes:
- **Backend**: Django's runserver with auto-reload on code changes
- **Frontend**: Next.js dev server with file watching and Docker sync
- **File Sync**: Changes in `./frontend/src` are synced to container
- **Auto-rebuild**: Changes to `package.json` trigger container rebuild

## Environment Variables

### Development
- `DEBUG=True` for Django
- `NODE_ENV=development` for Next.js
- Uses your existing `.env.local` files for all configuration

### Production  
- `DEBUG=False` for Django
- `NODE_ENV=production` for Next.js
- Requires production secret keys

## Database Configuration

**Development Database:**
- Host: `localhost:5433` (port 5433 to avoid conflicts)
- Database: `todo_app`
- User: `jimang`
- Password: `jianmings`

**Docker Internal:**
- Host: `db` (within Docker network)
- Port: `5432`

## Ports

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Database: localhost:5433
- Redis: localhost:6379
- Nginx (production): http://localhost:80

## Built Images

✅ **Development Images:**
- `todo-app-backend-dev:latest` - Django development server
- `todo-app-frontend-dev:latest` - Next.js development server

✅ **Production Images:**
- `todo-app-backend:latest` - Django with Gunicorn
- `todo-app-frontend:latest` - Next.js standalone build

## Troubleshooting

### Port Conflicts
If you have local PostgreSQL running, the Docker database uses port 5433 instead of 5432.

### Database Issues
If database authentication fails:
```bash
docker compose down -v
docker volume rm todo-app_postgres_data
docker compose --profile development up -d
```

### LightningCSS Issues
Fixed by using `node:24-bookworm` instead of Alpine for better ARM64 support.
