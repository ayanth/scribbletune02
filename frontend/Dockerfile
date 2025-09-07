# Simple development Dockerfile for ScribbleTune02
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies (including dev dependencies for development mode)
RUN npm ci --include=dev

# Verify vite is installed
RUN npm list vite || echo "vite not found in node_modules"
RUN ls -la node_modules/.bin/ | grep vite || echo "vite binary not found"

# Copy source code
COPY frontend/ ./

# Ensure we're using the container-installed node_modules
RUN npm list @sveltejs/kit || echo "@sveltejs/kit not found, reinstalling..."
RUN npm ci --include=dev --force

# Copy configuration file
COPY db.json ./db.json

# Create output directory for MIDI files
RUN mkdir -p /app/duo/full

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]