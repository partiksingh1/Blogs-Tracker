# =========================
# 1️⃣ Builder Stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools (for native modules & Prisma)
RUN apk add --no-cache python3 g++ make libc6-compat openssl

# Copy package files
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm ci

# Copy Prisma schema and generate Prisma client for Alpine OpenSSL 3
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy rest of the source code
COPY . .

# Build TypeScript to /dist
RUN npm run build

# Remove devDependencies, keep only runtime dependencies
RUN npm prune --omit=dev

# =========================
# 2️⃣ Production Stage
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install runtime dependencies for native modules
RUN apk add --no-cache libc6-compat openssl

# Copy package.json + production node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled TypeScript code and Prisma client
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose application port
EXPOSE 8000

# Start the application
CMD ["node", "dist/index.js"]
