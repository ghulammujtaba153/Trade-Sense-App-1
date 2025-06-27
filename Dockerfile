# Step 1: Use Node.js image to build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Use a lighter image to serve the app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --production

# Expose port (default for Next.js)
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
