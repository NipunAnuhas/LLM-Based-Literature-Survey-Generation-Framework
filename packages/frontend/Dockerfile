# ── Stage 1: build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY packages/shared/package.json  ./packages/shared/package.json
COPY packages/frontend/package.json ./packages/frontend/package.json

RUN npm install --workspaces --no-fund --no-audit

COPY packages/shared/src    ./packages/shared/src
COPY packages/shared/tsconfig.json ./packages/shared/tsconfig.json
COPY packages/frontend/src  ./packages/frontend/src
COPY packages/frontend/index.html  ./packages/frontend/index.html
COPY packages/frontend/tsconfig.json  ./packages/frontend/tsconfig.json
COPY packages/frontend/tsconfig.node.json ./packages/frontend/tsconfig.node.json
COPY packages/frontend/vite.config.ts ./packages/frontend/vite.config.ts
COPY packages/frontend/tailwind.config.js ./packages/frontend/tailwind.config.js
COPY packages/frontend/postcss.config.js ./packages/frontend/postcss.config.js
COPY tsconfig.json ./

ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app/packages/frontend
RUN npx vite build

# ── Stage 2: serve ────────────────────────────────────────────────────────────
FROM nginx:alpine AS runtime

COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
