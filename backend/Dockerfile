# Stage 1: Build step
FROM node:20-slim AS builder
WORKDIR /app

# Install OpenSSL for Prisma's native engine
RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Production execution
FROM node:20-slim
WORKDIR /app

# Install OpenSSL in the production runner as well
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080

# Run migrations/push on startup and start the production build
CMD ["sh", "-c", "npx prisma db push && npm start"]