# Stage 1: Install dependencies (leverages caching)
FROM node:22-alpine3.21 as deps

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Stage 2: Turbo Prune (reduces unnecessary files before build)
FROM node:22-alpine3.21 as pruner

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --from=deps ${APP_WORKDIR}/node_modules ./node_modules
COPY package.json turbo.json yarn.lock ./

RUN yarn turbo prune --scope=@denali/api --docker

# Stage 3: Build API Application
FROM node:22-alpine3.21 as builder-api

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --from=pruner ${APP_WORKDIR}/ ./
ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true
ENV HUSKY 0

RUN node -v
RUN yarn install --frozen-lockfile
RUN yarn turbo run build --filter=@denali/api

RUN rm -rv /var/www/html/apps/api/.env* || true

# Stage 4: Final Runtime Image (Minimized)
FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl (not cached)
RUN apk add --no-cache curl

# Copy only necessary production files (not everything)
COPY --from=builder-api /var/www/html/apps/api/dist /var/www/html/apps/api/dist
COPY --from=builder-api /var/www/html/apps/api/package.json /var/www/html/apps/api/package.json
COPY --from=builder-api /var/www/html/apps/api/node_modules /var/www/html/apps/api/node_modules

EXPOSE 3001

CMD [ "yarn", "start:api" ]