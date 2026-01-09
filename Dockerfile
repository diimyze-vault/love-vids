# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Node.js
FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js ./

CMD ["node", "server.js"]
