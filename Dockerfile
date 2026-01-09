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

# FORCE PORT 4000 (Matching Railway Config)
ENV PORT=4000
EXPOSE 4000

# Listen specifically on port 4000 to match Railway setting
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:4000"]
