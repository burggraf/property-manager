FROM --platform=linux/amd64 ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    libwebkit2gtk-4.1-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    wget \
    software-properties-common \
    gcc-mingw-w64 \
    libssl-dev \
    pkg-config \
    fuse \
    libfuse2 \
    squashfs-tools \
    file \
    llvm \
    clang \
    nsis

# Install wine
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y wine wine32 wine64

# Verify NSIS installation
RUN which makensis
RUN makensis -VERSION

# Set up FUSE
RUN modprobe fuse || true
RUN groupadd fuse
RUN usermod -a -G fuse root

# Install appimagetool
RUN wget https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-x86_64.AppImage -O /usr/local/bin/appimagetool \
    && chmod +x /usr/local/bin/appimagetool

# Set environment variables
ENV OPENSSL_LIB_DIR=/usr/lib/x86_64-linux-gnu
ENV OPENSSL_INCLUDE_DIR=/usr/include/openssl
ENV PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
ENV PATH="/usr/local/bin:/usr/bin:${PATH}"
ENV CARGO_XWIN_ARCH=x86_64

# Install Node.js 20.x (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Add Rust targets
RUN rustup target add x86_64-pc-windows-gnu
RUN rustup target add x86_64-pc-windows-msvc
RUN rustup target add x86_64-unknown-linux-gnu

# Install cargo-xwin
RUN cargo install cargo-xwin

WORKDIR /app
COPY . .

# Install npm dependencies including Tauri CLI
RUN npm install --legacy-peer-deps
RUN npm install @tauri-apps/cli@latest --legacy-peer-deps
RUN npm install @tauri-apps/cli-linux-x64-gnu@latest --legacy-peer-deps --save-dev

# Ensure the Tauri CLI is in the PATH
ENV PATH="/app/node_modules/.bin:${PATH}"

# Build command for Windows
CMD ["tauri", "build", "--target", "x86_64-pc-windows-msvc"]
