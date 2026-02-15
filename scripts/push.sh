#!/bin/bash

# Script to automatically commit and push changes to the repository

set -e  # Exit on error

# Get commit message from argument or use default with timestamp
if [ -z "$1" ]; then
    COMMIT_MSG="Update theme - $(date '+%Y-%m-%d %H:%M:%S')"
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
echo "✓ Commit message: $COMMIT_MSG"
