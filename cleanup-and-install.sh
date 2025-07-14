#!/bin/bash

echo "🧹 Starting complete cleanup..."

# Stop processes
sudo pkill -f node 2>/dev/null || true
sudo pkill -f npm 2>/dev/null || true

# Remove all node_modules
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove all package-lock.json
find . -name "package-lock.json" -type f -delete 2>/dev/null || true

# Clear npm cache
npm cache clean --force

echo "✅ Cleanup completed!"
echo "📦 Installing dependencies..."

# Install
npm install --legacy-peer-deps
