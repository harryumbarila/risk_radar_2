FROM node:22-alpine3.21 as builder-nest

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN node -v
RUN yarn install

FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

COPY --from=builder-nest /var/www/html/ /var/www/html/
EXPOSE 3001

CMD [ "yarn", "start:api" ]