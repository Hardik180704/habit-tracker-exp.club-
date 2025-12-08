FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies from the root context

# Install OpenSSL (Required for Prisma on Alpine)
RUN apk add --no-cache openssl

COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm install

# Copy backend source code
COPY backend/ .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 5001

CMD ["npm", "run", "start"]
