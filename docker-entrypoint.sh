#!/bin/bash
set -e

# Configure Apache port based on Render's $PORT environment variable (defaults to 80)
PORT=${PORT:-80}
sed -i "s/80/$PORT/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Discover packages and cache configurations, routes, and views for optimal performance
php artisan package:discover --ansi || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations if database connection is available
php artisan migrate --force || true

# Start Apache in the foreground
exec apache2-foreground
