#!/bin/sh
set -e

# Replace __PORT__ placeholder with actual PORT value (default 80)
sed -i "s/__PORT__/${PORT:-80}/g" /etc/nginx/nginx.conf

# Start nginx
exec nginx -g 'daemon off;'
