# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

RUN rm -rf /etc/nginx/conf.d/* /docker-entrypoint.d/*

COPY --from=build /app/dist /usr/share/nginx/html
COPY start.sh /start.sh
RUN chmod +x /start.sh

ENTRYPOINT []
CMD ["/start.sh"]
