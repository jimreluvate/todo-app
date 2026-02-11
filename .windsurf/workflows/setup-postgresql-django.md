---
description: Setup PostgreSQL Database with Django Backend and Google OAuth
---

# PostgreSQL Database Setup with Django Backend and Google OAuth

This workflow will help you set up a complete PostgreSQL database with Django backend including user authentication and Google OAuth integration.

## Prerequisites

- PostgreSQL installed and running
- Django project created
- Google OAuth credentials ready

## Step 1: Setup PostgreSQL Database

First, create the PostgreSQL database and user:

```bash
# Connect to PostgreSQL as superuser
psql postgres

# Create database
CREATE DATABASE todo_app;

# Create user (optional, can use current user)
CREATE USER todo_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;

# Exit PostgreSQL
\q
```

## Step 2: Configure Django Settings

Update your `backend/settings.py` to use PostgreSQL:

```python
# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'todo_app',
        'USER': 'todo_user',  # or your current user
        'PASSWORD': 'your_secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Custom User Model
AUTH_USER_MODEL = 'users.CustomUser'

# Google OAuth Configuration
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ.get('GOOGLE_AUTH_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ.get('GOOGLE_AUTH_SECRET_KEY')
SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]
SOCIAL_AUTH_GOOGLE_OAUTH2_EXTRA_DATA = ['first_name', 'last_name']

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True

# Djoser Configuration
DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': 'password-reset/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'USER_CREATE_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserRegistrationSerializer',
        'user': 'users.serializers.CustomUserSerializer',
        'current_user': 'users.serializers.CustomUserSerializer',
    }
}
```

## Step 3: Environment Variables

Create `backend/.env.local` with your credentials:

```bash
# Database Configuration
DB_NAME=todo_app
DB_USER=todo_user
DB_PASSWORD=your_secure_password
DB_HOST=localhost
DB_PORT=5432

# Google OAuth Configuration
GOOGLE_AUTH_KEY=your_google_client_id
GOOGLE_AUTH_SECRET_KEY=your_google_client_secret

# Django Settings
DJANGO_SECRET_KEY=your-django-secret-key
DEBUG=True
```

## Step 4: Install Dependencies

```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Install required packages
pip install djangorestframework django-cors-headers djoser social-auth-app-django python-dotenv resend
```

## Step 5: Run Migrations

```bash
# Create migrations for custom user model
python manage.py makemigrations users

# Create migrations for todo app
python manage.py makemigrations todos

# Apply all migrations
python manage.py migrate
```

## Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

## Step 7: Test Database Connection

```bash
# Test Django server
python manage.py runserver localhost:8000

# Test database connection
python manage.py dbshell
```

## Step 8: Frontend Integration

Update frontend environment variables in `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Step 9: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API and Google OAuth2 API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to your `.env.local`

## Step 10: User Authentication Features

The setup includes:

### First Page - Authentication:
- User registration with email verification
- Google OAuth integration
- Login with email/password
- Password reset functionality
- Remember me option

### Second Page - CRUD Operations:
- User-specific todo items
- Persistent user sessions
- User profile management
- Authentication-protected routes

## Step 11: Testing

Test the complete setup:

```bash
# Start backend
cd backend
python manage.py runserver localhost:8000

# Start frontend (new terminal)
cd frontend
npm run dev
```

Test these endpoints:
- `http://localhost:8000/api/users/register/` - User registration
- `http://localhost:8000/api/users/login/` - User login
- `http://localhost:8000/api/todos/` - Todo CRUD
- `http://localhost:8000/admin/` - Django admin

## Troubleshooting

### Common Issues:

1. **Connection Refused**: Ensure PostgreSQL is running
   ```bash
   brew services start postgresql
   ```

2. **Password Authentication Failed**: Check database credentials in settings

3. **Migration Errors**: Drop and recreate database
   ```bash
   psql postgres -c "DROP DATABASE IF EXISTS todo_app;"
   psql postgres -c "CREATE DATABASE todo_app;"
   ```

4. **Google OAuth Errors**: Verify redirect URIs in Google Console

5. **CORS Issues**: Check CORS_ALLOWED_ORIGINS in settings

## Security Notes

- Use strong passwords for database
- Set DEBUG=False in production
- Use environment variables for secrets
- Enable HTTPS in production
- Review Django security settings

## Next Steps

After setup, you'll have:
- ✅ PostgreSQL database connected to Django
- ✅ Custom user model with authentication
- ✅ Google OAuth integration
- ✅ Email verification system
- ✅ CRUD operations with user persistence
- ✅ Remember me functionality
