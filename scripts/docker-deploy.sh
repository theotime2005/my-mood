#!/bin/bash
set -e

echo "🚀 My Mood - Docker Deployment Script"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env files exist
if [ ! -f "api/.env" ]; then
    echo "📝 Creating api/.env from sample.env..."
    cp api/sample.env api/.env
else
    echo "✅ api/.env already exists"
fi

if [ ! -f "admin/.env" ]; then
    echo "📝 Creating admin/.env from sample.env..."
    cp admin/sample.env admin/.env
else
    echo "✅ admin/.env already exists"
fi

echo ""
echo "🔨 Building and starting Docker containers..."
docker compose up -d --build

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

echo ""
echo "🗄️ Initializing database..."
docker compose exec api npm run first-deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Services are now available at:"
echo "  🌐 Admin Interface: http://localhost:80"
echo "  🔌 API:            http://localhost:3000"
echo "  🗄️ Database:       localhost:5432"
echo ""
echo "Useful commands:"
echo "  View logs:       docker compose logs -f"
echo "  Stop services:   docker compose down"
echo "  Restart:         docker compose restart"
echo ""
