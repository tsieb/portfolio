FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:20-alpine as production

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app from build stage
COPY --from=build /app/dist ./dist

# Copy environment variables
COPY .env.example .env

# Expose port
EXPOSE 5000

# Start the app
CMD ["node", "dist/server.js"]