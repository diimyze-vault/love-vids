# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serving
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx native support for env vars in templates (since 1.19)
# It will look for .template files here and output to /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80
ENV PORT=80

# The default nginx:alpine entrypoint handles the envsubst automatically
CMD ["nginx", "-g", "daemon off;"]
