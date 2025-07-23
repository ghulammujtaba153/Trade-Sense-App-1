# ---- Build Stage ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build:icons && npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Copy next.config.mjs if present
COPY --from=builder /app/next.config.mjs ./  

EXPOSE 3000
CMD ["npm", "start"]
