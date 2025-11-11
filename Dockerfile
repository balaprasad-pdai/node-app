# Use an official Node.js LTS image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Expose the port (optional but good practice)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
