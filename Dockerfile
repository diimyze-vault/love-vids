# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:20-slim
WORKDIR /app

# Install 'serve' package globally
RUN npm install -g serve

COPY --from=build /app/dist ./dist

# Use shell form to allow variable expansion
# -s: Single Page App (rewrites to index.html)
# -l: Listen on specific port/host
CMD serve -s dist -l tcp://0.0.0.0:$PORT
