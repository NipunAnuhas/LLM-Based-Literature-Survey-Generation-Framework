# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy workspace manifests first so Docker caches the layer
COPY package.json ./
COPY packages/shared/package.json  ./packages/shared/package.json
COPY packages/backend/package.json ./packages/backend/package.json

RUN npm install --workspaces --no-fund --no-audit

# Copy source
COPY packages/shared/src  ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json
COPY packages/backend/src ./packages/backend/src
COPY packages/backend/tsconfig.json ./packages/backend/tsconfig.json
COPY tsconfig.json ./

# Build shared first, then backend
RUN npx tsc -p packages/shared
RUN npx tsc -p packages/backend

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy compiled output + manifests
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared/dist     ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/backend/dist    ./packages/backend/dist
COPY --from=builder /app/packages/backend/package.json ./packages/backend/package.json

WORKDIR /app/packages/backend

EXPOSE 3000

CMD ["node", "dist/index.js"]
