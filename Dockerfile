# Multi-stage build for GPT Subscription Platform
FROM node:18-alpine AS frontend-build

# Build React frontend
WORKDIR /app/client
COPY package*.json ./
COPY client/ ./
RUN npm ci --production=false
RUN npm run build

FROM node:18-alpine AS backend-build

# Build Node.js backend
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY server/ ./server/
COPY shared/ ./shared/
RUN npm ci --production=false
RUN npm run build

FROM node:18-alpine AS production

# Install production dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --production=true && npm cache clean --force

# Copy built backend
COPY --from=backend-build /app/dist ./dist

# Copy built frontend
COPY --from=frontend-build /app/client/dist ./client/dist

# Copy shared files
COPY shared/ ./shared/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/_version || exit 1

# Start the application
CMD ["node", "dist/index.js"]