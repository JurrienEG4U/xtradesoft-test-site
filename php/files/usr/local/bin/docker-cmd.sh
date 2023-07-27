#!/usr/bin/env bash

set -eu

[[ -f "composer.json" ]] && composer install --prefer-dist --no-interaction

exec sudo php-fpm
