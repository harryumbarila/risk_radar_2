FROM node:22-alpine3.21 as builder-web

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN node -v
RUN yarn install
RUN yarn turbo run build --filter=@denali/web

RUN rm -rv /var/www/html/apps/web/.env || true

FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

COPY --from=builder-web /var/www/html/ /var/www/html/
EXPOSE 3000

CMD [ "yarn", "start:web"]