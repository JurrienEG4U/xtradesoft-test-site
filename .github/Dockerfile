FROM alpine:3.18

RUN apk add --no-cache --upgrade --no-progress \
        openssh \
        rsync

ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
