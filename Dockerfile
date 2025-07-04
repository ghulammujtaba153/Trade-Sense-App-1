# ---- Build Stage ----
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci --ignore-scripts
    
    COPY . .
    
    RUN npm run build:icons
    RUN npm run build
    
    # ---- Production Stage ----
    FROM node:18-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/next.config.js ./
    # Copy other required files if needed (tsconfig.json, env files, etc.)
    
    RUN npm ci --omit=dev --ignore-scripts
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    