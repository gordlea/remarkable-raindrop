FROM node:17-alpine as setup

RUN mkdir -p /opt/remarkable-raindrop
WORKDIR /opt/remarkable-raindrop
COPY .yarn ./.yarn
COPY yarn.lock ./yarn.lock
COPY .pnp* yarn.lock .yarnrc.yml package.json ./
RUN yarn
COPY lib ./lib

FROM node:17-alpine

RUN apk add --no-cache tini \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont && \
    adduser -h /app -D puppeteer && \
    rm -rf /etc/periodic

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    RMKDROP_CRON="*/10 * * * *" \
    RMKDROP_LOG_LEVEL=info \
    RMKDROP_RAINDROP_TEST_TOKEN="" \
    RMKDROP_REMARKABLE_DEVICE_TOKEN=""

COPY --from=setup /opt/remarkable-raindrop /opt/remarkable-raindrop
COPY docker_entrypoint.sh docker_run.sh /

WORKDIR /opt/remarkable-raindrop
ENTRYPOINT ["/sbin/tini", "--", "/docker_entrypoint.sh"]
CMD ["crond", "-f", "-l", "2"]