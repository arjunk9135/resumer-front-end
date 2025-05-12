#!/bin/bash
set -e # Exit on error

# Clean node_modules and reinstall
rm -rf node_modules package-lock.json
npm ci --no-audit

# Build the project
npm run build