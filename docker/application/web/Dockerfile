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

RUN yarn turbo prune --scope=@denali/web --docker

# Stage 3: Build Web Application
FROM node:22-alpine3.21 as builder-web

ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

COPY --from=pruner ${APP_WORKDIR}/ ./
ADD dist.tgz ./

ENV NPM_CONFIG_LOGLEVEL warn
ENV CI true
ENV HUSKY 0

RUN echo "FRONTEGG_ENCRYPTION_PASSWORD=5ab5578cbdad6d7937db3f8f8b3d7d1d32d115e4b6c03de1ce9dcea37cb1ca06" >> /var/www/html/apps/web/.env.local && \
  echo "FRONTEGG_APP_URL=http://localhost:3000" >> /var/www/html/apps/web/.env.local && \
  echo "FRONTEGG_BASE_URL=http://localhost:3000" >> /var/www/html/apps/web/.env.local && \
  echo "FRONTEGG_CLIENT_ID=XXX" >> /var/www/html/apps/web/.env.local && \
  echo "FRONTEGG_APP_ID=XXX" >> /var/www/html/apps/web/.env.local

RUN yarn turbo run build --filter=@denali/web

RUN rm -rv /var/www/html/apps/web/.env* || true

# Stage 4: Final Runtime Image (Minimized)
FROM node:22-alpine3.21

ENV NODE_ENV production
ENV APP_WORKDIR=/var/www/html
WORKDIR "${APP_WORKDIR}"

# Install curl (not cached)
RUN apk add --no-cache curl

# Copy only necessary production files (not everything)
COPY --from=builder-web /var/www/html/apps/web/.next /var/www/html/apps/web/.next
COPY --from=builder-web /var/www/html/apps/web/package.json /var/www/html/apps/web/package.json
COPY --from=builder-web /var/www/html/apps/web/node_modules /var/www/html/apps/web/node_modules

EXPOSE 3000

CMD [ "yarn", "start:web" ]
