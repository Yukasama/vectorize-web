ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim AS base

ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@latest --activate

# --------------------------------------------------------
# Stage 1: Install dependencies
# --------------------------------------------------------
FROM base AS deps
WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# --------------------------------------------------------
# Stage 2: Build the application
# --------------------------------------------------------
FROM base AS builder
WORKDIR /app

ARG NEXT_PUBLIC_HOST_URL

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/pnpm-lock.yaml ./

COPY next.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./
COPY components.json ./
COPY public ./public
COPY src ./src

RUN pnpm build
  
# --------------------------------------------------------
# Stage 3: Run the application
# --------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Create a non-root user
RUN groupadd -r nextjs && useradd --no-log-init -r -g nextjs nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_NO_WARNINGS=1 \
    NODE_OPTIONS=--max-old-space-size=2048 \
    NEXT_SHARP_PATH=/app/node_modules/sharp

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN chown -R nextjs:nextjs /app

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]