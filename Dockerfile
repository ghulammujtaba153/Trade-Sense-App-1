# --------- Build Stage ---------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    # Install dependencies (no postinstall scripts)
    COPY package*.json ./
    RUN npm ci --ignore-scripts
    
    # Copy project files
    COPY . .
    
    # Build icons and app
    RUN npm run build:icons
    RUN npm run build
    
    # --------- Production Stage ---------
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copy only what's needed for production
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package*.json ./
    COPY --from=builder /app/next.config.js ./
    COPY --from=builder /app/tsconfig.json ./
    # Copy other necessary configs if any (like .env.production if used)
    
    # Install only production dependencies
    RUN npm ci --omit=dev --ignore-scripts
    
    EXPOSE 3000
    
    # Start the Next.js app
    CMD ["npm", "start"]
    