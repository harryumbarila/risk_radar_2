# Stage 1: Turbo Prune (reduces unnecessary files before build)
FROM node:22-alpine3.21 AS pruner

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --chown=node:node . .

RUN yarn global add turbo && turbo prune --scope=@denali/web-v2 --docker

USER node

# Stage 2: Install dependencies for build
FROM node:22-alpine3.21 AS build-deps

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --chown=node:node --from=pruner ${APP_WORKDIR}/out/json ./
COPY --chown=node:node --from=pruner ${APP_WORKDIR}/out/yarn.lock ./

RUN yarn install --frozen-lockfile --prefer-offline

USER node

# Stage 3: Build Web Application
FROM node:22-alpine3.21 AS builder-web

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --chown=node:node --from=pruner ${APP_WORKDIR}/package.json ./
COPY --chown=node:node --from=pruner ${APP_WORKDIR}/yarn.lock ./
COPY --chown=node:node --from=pruner ${APP_WORKDIR}/out/full/ ./
COPY --chown=node:node --from=build-deps ${APP_WORKDIR}/node_modules ./node_modules

ENV NPM_CONFIG_LOGLEVEL=warn
ENV CI=true
ENV HUSKY=0

# Ensure devDependencies are installed for build tools (autoprefixer, postcss, tailwindcss)
# Re-run yarn install to ensure all devDependencies are available for the build
RUN yarn install --frozen-lockfile --prefer-offline

# RUN echo "FRONTEGG_ENCRYPTION_PASSWORD=5ab5578cbdad6d7937db3f8f8b3d7d1d32d115e4b6c03de1ce9dcea37cb1ca06" >> /var/www/html/apps/web-v2/.env.local && \
#   echo "FRONTEGG_APP_URL=http://localhost:3000" >> /var/www/html/apps/web-v2/.env.local && \
#   echo "FRONTEGG_BASE_URL=http://localhost:3000" >> /var/www/html/apps/web-v2/.env.local && \
#   echo "FRONTEGG_CLIENT_ID=XXX" >> /var/www/html/apps/web-v2/.env.local && \
#   echo "FRONTEGG_APP_ID=XXX" >> /var/www/html/apps/web-v2/.env.local

RUN yarn turbo run build --filter=@denali/web-v2

RUN rm -rv /var/www/html/apps/web-v2/.env* || true

USER node

# Stage 4: Install production dependencies
FROM node:22-alpine3.21 AS prod-deps

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --chown=node:node --from=pruner ${APP_WORKDIR}/out/json ./
COPY --chown=node:node --from=pruner ${APP_WORKDIR}/out/yarn.lock ./

RUN yarn install --frozen-lockfile --production --prefer-offline && yarn cache clean

USER node

# Stage 5: Final Runtime Image (Minimized)
FROM node:22-alpine3.21

ENV NODE_ENV=production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl (not cached)
RUN apk add --no-cache curl

# Copy only necessary production files (not everything)
COPY --chown=node:node --from=builder-web /var/www/html/apps/web-v2/.next /var/www/html/apps/web-v2/.next
COPY --chown=node:node --from=builder-web /var/www/html/apps/web-v2/package.json /var/www/html/apps/web-v2/package.json
COPY --chown=node:node --from=pruner /var/www/html/package.json ./package.json
COPY --chown=node:node --from=prod-deps /var/www/html/node_modules ./node_modules

# Copy workspace-level files needed for yarn commands
COPY --chown=node:node --from=pruner /var/www/html/yarn.lock ./yarn.lock

EXPOSE 3001

USER node

CMD [ "yarn", "--cwd", "apps/web-v2", "start" ]
