#!/bin/bash
set -e

echo "========================================="
echo "  Setting up Local Demo Environment..."
echo "========================================="

# Move to root of monorepo
cd "$(dirname "$0")/../.."

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

# 1. Start Database
echo "1. Starting PostgreSQL Database..."
docker compose -f infra/docker/docker-compose.dev.yml up -d
sleep 5 # Wait a bit for db to be ready

# 2. Setup API
echo "2. Setting up API..."
cd apps/api
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

echo "3. Running Migrations..."
alembic upgrade head

echo "4. Seeding basic roles..."
python -m src.db.seed

echo "5. Seeding demo data..."
python -m src.db.seed_demo
cd ../..

# 3. Setup Frontend
echo "6. Installing workspace dependencies..."
pnpm install

echo "========================================="
echo "  Setup Complete!"
echo "  You can now run: ./infra/scripts/start_demo.sh"
echo "========================================="
