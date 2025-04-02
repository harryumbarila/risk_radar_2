# Stage 1: Prepare dependencies (to leverage caching)
FROM node:22-alpine3.21 as deps

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Stage 2: Turbo Prune (Removes unnecessary files before build)
FROM node:22-alpine3.21 as pruner

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --from=deps ${APP_WORKDIR}/node_modules ./node_modules
COPY package.json turbo.json yarn.lock ./

RUN yarn turbo prune --scope=@denali/web --docker

# Stage 3: Build Web Application
FROM node:22-alpine3.21 as builder-web

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Copy pruned files instead of everything
COPY --from=pruner ${APP_WORKDIR}/ ./
ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true 

RUN echo "FRONTEGG_ENCRYPTION_PASSWORD=5ab5578cbdad6d7937db3f8f8b3d7d1d32d115e4b6c03de1ce9dcea37cb1ca06" >> /var/www/html/apps/web/.env.local
RUN echo "FRONTEGG_APP_URL=http://localhost:3000" >> /var/www/html/apps/web/.env.local
RUN echo "FRONTEGG_BASE_URL=http://localhost:3000" >> /var/www/html/apps/web/.env.local
RUN echo "FRONTEGG_CLIENT_ID=XXX" >> /var/www/html/apps/web/.env.local
RUN echo "FRONTEGG_APP_ID=XXX" >> /var/www/html/apps/web/.env.local

RUN yarn turbo run build --filter=@denali/web

RUN rm -rv /var/www/html/apps/web/.env || true
RUN rm -rv /var/www/html/apps/web/.env.local || true

# Stage 4: Final runtime image
FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

COPY --from=builder-web /var/www/html/ /var/www/html/
EXPOSE 3000

CMD [ "yarn", "start:web"]
