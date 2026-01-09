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
COPY nginx.conf /etc/nginx/nginx.conf.template

ENTRYPOINT []
CMD ["sh", "-c", "sed -i 's/__PORT__/'${PORT:-80}'/g' /etc/nginx/nginx.conf.template && cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf && exec nginx -g 'daemon off;'"]
