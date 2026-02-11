#!/bin/bash

# Django development server with SQLite
# Usage: ./run_sqlite.sh [port]

PORT=${1:-8000}

echo "Starting Django server with SQLite on port $PORT..."
export USE_SQLITE=True
python3 manage.py runserver localhost:$PORT
