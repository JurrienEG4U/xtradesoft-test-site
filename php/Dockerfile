ARG COMPOSER_VERSION=latest
ARG PHP_VERSION=latest
FROM composer:${COMPOSER_VERSION} as composer
FROM php:${PHP_VERSION} as base

RUN apt-get update \
    && apt-get install --assume-yes \
        libzip-dev \
        zip \
    && docker-php-ext-install -j "$(nproc --all)" \
        pdo_mysql \
        exif \
        zip \
    # cleanup
    && rm -rf /var/www/* \
    && apt-get autoremove --assume-yes \
    && apt-get clean --assume-yes \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

WORKDIR /var/www

COPY ./php/files /

CMD ["docker-cmd.sh"]

FROM base as dev

RUN apt-get update \
    && apt-get install --assume-yes sudo \
    # cleanup
    && rm -rf /var/www/* \
    && apt-get autoremove --assume-yes \
    && apt-get clean --assume-yes \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

COPY --from=composer /usr/bin/composer /usr/local/bin/composer

FROM dev as devcontainer

RUN apt-get update \
    && apt-get install --assume-yes git \
    # create a user
    && groupadd --gid 1000 appgroup \
    && adduser \
        --uid 1000 \
        --gid 1000 \
        --disabled-password \
        --shell /bin/bash \
        --gecos "appuser" \
        appuser \
    && usermod -aG sudo appuser \
    && echo "appuser ALL=NOPASSWD:ALL" >> /etc/sudoers \
    # cleanup
    && rm -rf /var/www/* \
    && apt-get autoremove --assume-yes \
    && apt-get clean --assume-yes \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/*

USER appuser
