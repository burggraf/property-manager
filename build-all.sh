#!/bin/bash

# Build for macOS ARM (uncomment if you're on a Mac with Apple Silicon)
npm run tauri build

# Build for macOS x64 (uncomment if you're on a Mac)
npm run tauri build -- --target x86_64-apple-darwin

# Build Docker image for Linux and Windows builds
echo "************************************************"
echo "Building Docker image for Linux and Windows builds"
echo "************************************************"
docker build --platform linux/amd64 -t tauri-cross-compiler .

# Build for Linux
echo "************************************************"
echo "Building for Linux"
echo "************************************************"
docker run --rm --privileged --platform linux/amd64 -v ${PWD}:/app tauri-cross-compiler tauri build --target x86_64-unknown-linux-gnu --bundles deb,appimage

# Build for Windows
echo "************************************************"
echo "Building for Windows"
echo "************************************************"
docker run --rm --privileged --platform linux/amd64 -v ${PWD}:/app tauri-cross-compiler \
  tauri build --runner cargo-xwin --target x86_64-pc-windows-msvc

# Optional: Build for Windows (32-bit)
# echo "************************************************"
# echo "Building for Windows (32-bit)"
# echo "************************************************"
# docker run --rm --privileged --platform linux/amd64 -v ${PWD}:/app tauri-cross-compiler tauri build --target i686-pc-windows-msvc
