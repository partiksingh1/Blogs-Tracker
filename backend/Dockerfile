# =========================
# 1️⃣ Builder stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Needed for bcrypt + Prisma
RUN apk add --no-cache openssl libc6-compat python3 g++ make

# Copy dependency files and install all deps
COPY package.json package-lock.json* ./
RUN npm install

# Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copy all source code
COPY . .

# Build TS → JS
RUN npm run build

# =========================
# 2️⃣ Runtime stage
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

# Needed for bcrypt + Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package.json only (for clarity)
COPY package.json package-lock.json* ./

# Copy **node_modules** from builder (includes everything runtime needs)
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled files & Prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8000

CMD ["node", "dist/index.js"]
