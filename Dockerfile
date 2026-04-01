FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
    npx ts-node --compiler-options '{"module":"CommonJS"}' \
    -e "require('./prisma.config.ts')" 2>/dev/null || true

RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

RUN chown -R nextjs:nodejs /app/node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "node node_modules/.bin/prisma migrate deploy && node server.js"]