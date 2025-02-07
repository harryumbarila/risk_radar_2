FROM node:20-alpine3.19 as builder-nest

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN node -v
RUN npm ci --only=production
RUN npm install -g @nestjs/cli
RUN npm run build

FROM node:20-alpine3.19

ENV PM2_HOME /var/www/html
ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

RUN npm install pm2 -g
RUN npm install -g ts-node
RUN npm install tsconfig-paths

COPY --from=builder-nest /var/www/html/ /var/www/html/
EXPOSE 3000

CMD [ "pm2-runtime", "start", "/var/www/html/pm2.json" ]