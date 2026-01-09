# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app

# Define ARG variables for build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL

# Fail if these ARGs are not provided
RUN test -n "$VITE_SUPABASE_URL" || (echo "VITE_SUPABASE_URL not set" && exit 1)
RUN test -n "$VITE_SUPABASE_ANON_KEY" || (echo "VITE_SUPABASE_ANON_KEY not set" && exit 1)

COPY package*.json ./
RUN npm install
COPY . .

# Pass ARGs as ENVs to the build command
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve
FROM node:20-slim
WORKDIR /app

RUN npm install -g serve
COPY --from=build /app/dist ./dist

# FORCE PORT 4000
ENV PORT=4000
EXPOSE 4000

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:4000"]
