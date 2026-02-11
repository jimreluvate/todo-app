# PostgreSQL Setup Instructions

## 1. Install PostgreSQL
```bash
# On macOS with Homebrew
brew install postgresql
brew services start postgresql

# On Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE todo_app;
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;
\q
```

## 3. Environment Variables
Create `.env.local` file in the backend directory with:
```
DB_NAME=todo_app
DB_USER=todo_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## 4. Install Dependencies
```bash
pip install psycopg2-binary
```

## 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

## 6. Create Superuser
```bash
python manage.py createsuperuser
```
