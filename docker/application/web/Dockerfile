FROM node:22-alpine3.21 as builder-web

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN node -v
RUN yarn --frozen-lockfile

ENV CI true 

RUN echo "FRONTEGG_ENCRYPTION_PASSWORD=5ab5578cbdad6d7937db3f8f8b3d7d1d32d115e4b6c03de1ce9dcea37cb1ca06" >> /var/www/html/apps/web/.env.local

RUN yarn turbo run build --filter=@denali/web

RUN rm -rv /var/www/html/apps/web/.env || true
RUN rm -rv /var/www/html/apps/web/.env.local || true

FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

COPY --from=builder-web /var/www/html/ /var/www/html/
EXPOSE 3000

CMD [ "yarn", "start:web"]