#!/bin/bash

# Ensure we're in the project root
cd "$(dirname "$0")"

# Install dependencies
npm install --force

# Build the Svelte app
npm run build

# Build the Tauri app for macOS
npm run tauri build

# The built app will be in src-tauri/target/release/bundle/macos/
echo "MacOS app built successfully. You can find it in src-tauri/target/release/bundle/macos/"
