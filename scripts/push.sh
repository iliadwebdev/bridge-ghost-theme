#!/bin/bash

# Script to automatically commit and push changes to the repository
# Auto-increments the patch version in package.json

set -e  # Exit on error

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is required but not installed"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Auto-increment patch version
echo "Incrementing version..."
npm version patch --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
echo "New version: $NEW_VERSION"

# Get commit message from argument or use default with version
if [ -z "$1" ]; then
    COMMIT_MSG="Update theme to v$NEW_VERSION"
else
    COMMIT_MSG="$1"
fi

echo "Staging all changes..."
git add .

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "No changes to commit"
    exit 0
fi

echo "Committing changes..."
git commit -m "$COMMIT_MSG"

echo "Pushing to remote repository..."
git push

echo "✓ Changes committed and pushed successfully"
echo "✓ Version: $CURRENT_VERSION → $NEW_VERSION"
echo "✓ Commit message: $COMMIT_MSG"
