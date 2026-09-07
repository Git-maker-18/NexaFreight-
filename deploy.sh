#!/bin/bash

# Configuration
SERVER="root@100.89.48.10"
REMOTE_DIR="/root/nexafreight" # Update to new folder name on server
BRANCH="main"

echo "==================================="
echo "?? Initiating NexaFreight Deployment"
echo "==================================="

# 1. Local Git Workflow
echo "?? Committing local changes..."
git add .
git commit -m "chore: production deployment update"

echo "?? Pushing to origin/$BRANCH..."
git push origin $BRANCH

# 2. Remote Server Workflow
echo "?? Connecting to $SERVER via Tailscale SSH..."
ssh $SERVER << EOF
  set -e
  
  echo "?? Pulling latest code..."
  cd $REMOTE_DIR
  git fetch origin
  git checkout $BRANCH
  git pull origin $BRANCH
  
  echo "?? Tearing down old infrastructure..."
  docker-compose down
  
  echo "??? Building and starting new monorepo stack..."
  docker-compose up -d --build
  
  echo "??? Running database migrations..."
  # Wait a few seconds for Postgres to be fully ready
  sleep 5
  docker-compose exec -T backend alembic upgrade head
  
  echo "? Deployment successful!"
EOF

echo "==================================="
echo "?? NexaFreight is live!"
echo "==================================="
