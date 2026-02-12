# Digital Ocean Production Deployment Guide

## Environment Setup

### 1. Create Production Environment File

Create `.env.production` with your production values:

```bash
# Database Configuration
DB_USER=todo_user
DB_PASSWORD=your_secure_db_password_here
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=8000
DJANGO_SECRET_KEY=your_very_long_secure_django_secret_key_here
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,localhost
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
DOMAIN=your-domain.com
AUTH_COOKIE_SECURE=True

# Google OAuth (Backend)
GOOGLE_AUTH_KEY=your_google_oauth_client_id
GOOGLE_AUTH_SECRET_KEY=your_google_oauth_client_secret

# Frontend Configuration
FRONTEND_PORT=3000
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Google OAuth (Frontend)
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Redis
REDIS_PORT=6379
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 Client IDs:
   - **Backend**: Use `https://your-domain.com/auth/google/callback/`
   - **Frontend**: Use `https://your-domain.com/api/auth/callback/google`

### 3. Digital Ocean Deployment

#### Option A: Using Docker Compose (Recommended)

```bash
# On Digital Ocean Droplet
git clone your-repo
cd todo-app

# Copy production environment
cp .env.production .env

# Build and start production services
docker compose --profile production up -d

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### Option B: Using Digital Ocean App Platform

1. Create `app.yaml` for App Platform
2. Connect your GitHub repository
3. Configure environment variables
4. Deploy

### 4. Nginx Configuration

The Nginx reverse proxy handles:
- SSL termination
- Static file serving
- API routing
- Frontend routing

### 5. Security Checklist

- [ ] Change all default passwords
- [ ] Set up SSL certificates
- [ ] Configure firewall (only ports 80, 443)
- [ ] Set up database backups
- [ ] Monitor logs
- [ ] Update dependencies regularly

### 6. Domain Configuration

Point your domain to Digital Ocean droplet:
- A record: `@` → droplet_ip
- A record: `www` → droplet_ip
- CNAME: `api` → `@` (optional)

## Production Commands

```bash
# Start production
docker compose --profile production up -d

# View logs
docker compose logs -f

# Update deployment
git pull
docker compose --profile production build
docker compose --profile production up -d

# Database backup
docker exec todo-app-db pg_dump -U todo_user todo_app > backup.sql
```

## Why Separate Dev/Prod Images?

### Development Images (`-dev`):
- **Hot Reloading**: Instant code changes without rebuilding
- **Volume Mounts**: Live code editing from host machine
- **Debug Tools**: Verbose logging, error pages
- **Development Servers**: Django runserver, Next.js dev mode
- **Performance**: Not optimized, includes dev dependencies

### Production Images:
- **Optimized Builds**: Standalone Next.js, Gunicorn WSGI
- **Security**: No volume mounts, minimal attack surface
- **Performance**: Smaller image size, faster startup
- **Stability**: Production-grade servers, proper error handling
- **Scalability**: Ready for horizontal scaling

This separation ensures:
1. **Fast Development**: No rebuilds during coding
2. **Production Security**: No dev tools in production
3. **Environment Isolation**: Different configs per environment
4. **Deployment Safety**: Production images are tested and stable
