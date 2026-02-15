#!/bin/bash

# Script to clone iliadwebdev/bridge-ghost-theme and extract to current directory
# This will overwrite existing files with the same name

set -e  # Exit on error

REPO_URL="https://github.com/iliadwebdev/bridge-ghost-theme.git"
TEMP_DIR=$(mktemp -d)

echo "Cloning repository to temporary directory..."
git clone "$REPO_URL" "$TEMP_DIR"

echo "Copying files to current directory..."
# Copy all files including hidden ones, overwriting existing files
cp -rf "$TEMP_DIR"/. .

# Get version from package.json
if [ -f "package.json" ]; then
    VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
else
    VERSION="unknown"
fi

echo "Cleaning up temporary directory..."
rm -rf "$TEMP_DIR"

echo "✓ Repository cloned successfully to current directory"
echo "✓ All files have been updated"
echo "✓ Downloaded version: $VERSION"


