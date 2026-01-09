#!/bin/sh
set -e

# Get the port, default to 80
PORT=${PORT:-80}

echo "Starting nginx on port $PORT"

# Create the config with the correct port
cat > /etc/nginx/nginx.conf << EOF
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;
    gzip on;

    server {
        listen $PORT;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        location /health {
            return 200 'OK';
        }

        location / {
            try_files \$uri \$uri/ /index.html;
        }

        location /assets/ {
            expires 1y;
        }
    }
}
EOF

# Start nginx
exec nginx -g 'daemon off;'
