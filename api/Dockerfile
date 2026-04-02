# Stage 1: build
# Context is repo root (monorepo — package-lock.json lives at root)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY api/package.json ./api/
COPY ui/package.json ./ui/
RUN npm ci --workspace=api
COPY api/ ./api/
RUN npm run build --workspace=api

# Stage 2: runtime
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
COPY api/package.json ./api/
COPY ui/package.json ./ui/
RUN npm ci --workspace=api --omit=dev
COPY --from=builder /app/api/dist ./api/dist
EXPOSE 5000
CMD ["node", "api/dist/index.js"]
