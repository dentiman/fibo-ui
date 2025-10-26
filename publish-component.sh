#!/bin/bash

# Script to build and publish @fibo-ui/components to npm
set -e

echo "📦 Building @fibo-ui/components for npm..."
echo ""

# Navigate to the workspace root
cd "$(dirname "$0")"

# Step 1: Build CDK first
echo "🔨 Step 1: Building @fibo-ui/cdk..."
npx ng build @fibo-ui/cdk

# Step 2: Build components with production tsconfig
echo "🔨 Step 2: Building @fibo-ui/components..."
npx ng build @fibo-ui/components --ts-config tsconfig.prod.json

# Step 3: Publish to npm
echo "📤 Step 3: Publishing to npm..."
cd dist/fibo-ui/components
npm publish --access public

echo ""
echo "✅ Successfully published @fibo-ui/components to npm!"

