# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Remove all default configs and entrypoint scripts
RUN rm -rf /etc/nginx/conf.d/* /docker-entrypoint.d/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4000

# Bypass default entrypoint, run nginx directly
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
