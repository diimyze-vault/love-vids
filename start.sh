#!/bin/sh
set -e

PORT=${PORT:-80}

echo "=== DEBUG ==="
echo "PORT: $PORT"
echo "Files in /usr/share/nginx/html:"
ls -la /usr/share/nginx/html/
echo "============="

cat > /etc/nginx/nginx.conf << 'NGINXCONF'
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
    
    error_log /dev/stderr debug;
    access_log /dev/stdout;

    server {
        listen PORT_PLACEHOLDER;
        server_name localhost;

        root /usr/share/nginx/html;
        index index.html;

        location /health {
            return 200 'OK';
        }

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /assets/ {
            expires 1y;
        }
    }
}
NGINXCONF

# Replace the port placeholder
sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/nginx.conf

echo "=== NGINX CONFIG ==="
cat /etc/nginx/nginx.conf
echo "===================="

exec nginx -g 'daemon off;'
