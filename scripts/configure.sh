#!/bin/zsh
set -e

function fail() {
  echo "[ERROR] $1" >&2
  exit 1
}

echo "Configuring project environment..."

# dependencies
echo "Installing dependencies..."
npm ci || fail "Failed to run 'npm ci'"
npm run ci-all || fail "Failed to run 'npm run ci-all'"

# api
echo "Setting up API..."
cd api || fail "Failed to access 'api' directory"
cp sample.env .env || fail "Failed to copy 'sample.env' to '.env' in 'api'"
echo "Starting Docker..."
docker compose up -d --build || fail "Failed to start Docker Compose in 'api'"
echo "Resetting database..."
npm run db:reset || fail "Failed to run 'npm run db:reset' in 'api'"
cd ../ || fail "Failed to return to parent directory from 'api'"

# admin
echo "Setting up Admin..."
cd admin || fail "Failed to access 'admin' directory"
cp sample.env .env || fail "Failed to copy 'sample.env' to '.env' in 'admin'"
cd ../ || fail "Failed to return to parent directory from 'admin'"

# end
echo "Configuration complete!"
