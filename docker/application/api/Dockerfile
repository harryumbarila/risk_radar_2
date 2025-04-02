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

RUN yarn turbo prune --scope=@denali/api --docker

# Stage 3: Build API Application
FROM node:22-alpine3.21 as builder-nest

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Copy pruned files instead of everything
COPY --from=pruner ${APP_WORKDIR}/ ./
ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN node -v
RUN yarn --frozen-lockfile
RUN yarn turbo run build --filter=@denali/api
RUN rm -rv /var/www/html/apps/api/.env || true

# Stage 4: Final runtime image
FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl
RUN apk add --no-cache curl

COPY --from=builder-nest /var/www/html/ /var/www/html/
EXPOSE 3001

CMD [ "yarn", "start:api" ]
