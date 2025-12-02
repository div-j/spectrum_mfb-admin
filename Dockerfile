# Stage 1: Build Next.js
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN pnpm run build

# Stage 2: Production container
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
