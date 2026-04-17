# Use Node.js 18 Alpine for smaller image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Create environment file for build
RUN echo "NEXTAUTH_SECRET=your-secret-key-here" > .env.local
RUN echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
RUN echo "DATABASE_URL=./sqlite.db" >> .env.local

# Build Next.js application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies and database tools
RUN npm install --only=production better-sqlite3

# Create database and run migrations
RUN node scripts/migrate.js

# Create environment file
RUN echo "NEXTAUTH_SECRET=your-secret-key-here" > .env.local
RUN echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
RUN echo "DATABASE_URL=./sqlite.db" >> .env.local

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]