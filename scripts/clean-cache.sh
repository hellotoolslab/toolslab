#!/bin/bash

echo "🧹 Cleaning Next.js cache and build files..."

# Remove Next.js cache and build
rm -rf .next
rm -rf .vercel
rm -rf out
rm -rf dist
rm -rf build

# Remove TypeScript cache
rm -f *.tsbuildinfo
rm -f .tsbuildinfo
rm -rf node_modules/.cache

# Remove other caches
rm -rf .turbo
rm -rf .cache
rm -rf .temp

echo "✅ Cache cleaned successfully!"