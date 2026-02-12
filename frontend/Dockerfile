# Use Node.js 24 LTS image (better ARM64 support than Alpine)
FROM node:24-bookworm AS base

# Set work directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci && npm cache clean --force

# Copy project files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:24-bookworm AS runner

# Set environment variables
ENV NODE_ENV=production

# Set work directory
WORKDIR /app

# Create non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nextjs

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from base stage
COPY --from=base --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=base --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=base --chown=nextjs:nodejs /app/public ./public

# Change ownership of the app directory
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
