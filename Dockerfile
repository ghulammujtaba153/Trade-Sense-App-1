# Step 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies WITHOUT running postinstall
COPY package*.json ./
RUN npm install --ignore-scripts

# Copy all project files
COPY . .

# Manually run the icons build script
RUN npm run build:icons

# Build the Next.js app
RUN npm run build

# Step 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Copy from builder
COPY --from=builder /app ./

# Install production deps only
RUN npm install --omit=dev

EXPOSE 3000

# Start the app
CMD ["npm", "start"]
