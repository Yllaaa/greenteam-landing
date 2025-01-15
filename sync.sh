#!/bin/bash
echo "Fetching latest changes from origin greenTeam..."
git fetch origin
git pull origin main

echo "Pushing changes to deploy green test..."
git push deploy main --force

echo "Sync complete!"
