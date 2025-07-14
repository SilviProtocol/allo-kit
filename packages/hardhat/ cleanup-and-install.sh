#!/bin/bash

# Complete cleanup script for monorepo
echo "🧹 Starting complete cleanup of monorepo..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to safely remove directories
safe_remove() {
    local dir=$1
    if [ -d "$dir" ]; then
        echo -e "${YELLOW}Removing $dir...${NC}"
        rm -rf "$dir"
        echo -e "${GREEN}✅ Removed $dir${NC}"
    else
        echo -e "${YELLOW}$dir not found, skipping...${NC}"
    fi
}

# Stop any running processes that might be locking files
echo -e "${YELLOW}🛑 Stopping any running Node processes...${NC}"
pkill -f node || true
pkill -f npm || true

# Remove all node_modules directories recursively
echo -e "${YELLOW}📦 Removing all node_modules directories...${NC}"
find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true

# Remove all package-lock.json files
echo -e "${YELLOW}🔒 Removing all package-lock.json files...${NC}"
find . -name "package-lock.json" -type f -delete 2>/dev/null || true

# Remove yarn.lock if it exists
safe_remove "yarn.lock"

# Remove npm cache
echo -e "${YELLOW}🗑️  Clearing npm cache...${NC}"
npm cache clean --force

# Clear any npm temporary files
safe_remove "$HOME/.npm/_cacache"

echo -e "${GREEN}✅ Cleanup completed!${NC}"
echo -e "${YELLOW}📦 Installing dependencies...${NC}"

# Install with legacy peer deps
if npm install --legacy-peer-deps; then
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
else
    echo -e "${RED}❌ Installation failed. Trying alternative approach...${NC}"
    
    # Try with force flag
    echo -e "${YELLOW}🔄 Trying with --force flag...${NC}"
    if npm install --force; then
        echo -e "${GREEN}🎉 Installation completed with --force!${NC}"
    else
        echo -e "${RED}❌ Installation still failed. Manual intervention needed.${NC}"
        echo -e "${YELLOW}Try the following:${NC}"
        echo "1. Check if you have the latest Node.js version"
        echo "2. Try: npm install --legacy-peer-deps --verbose"
        echo "3. Or try: npm install --force --verbose"
        exit 1
    fi
fi