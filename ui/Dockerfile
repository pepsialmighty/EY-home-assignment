# Stage 1: build
# Context is repo root (monorepo — package-lock.json lives at root)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY api/package.json ./api/
COPY ui/package.json ./ui/
RUN npm ci --workspace=ui
COPY ui/ ./ui/
RUN npm run build --workspace=ui

# Stage 2: serve
FROM nginx:alpine
COPY --from=builder /app/ui/dist /usr/share/nginx/html
COPY ui/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
