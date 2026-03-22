# ---- Base Stage ----
FROM node:20-alpine AS base
WORKDIR /app

# ---- Dependencies Stage ----
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---- Build Stage ----
FROM deps AS build
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main"]
