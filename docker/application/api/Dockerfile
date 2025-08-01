# Reusable base image
ARG APP_DIR=/app
FROM node:22-alpine3.21 AS base

# Stage 1: Prepare the workspace using Turbo Prune
FROM base AS prunner

ARG APP_DIR
WORKDIR ${APP_DIR}

COPY . .

RUN yarn global add turbo && turbo prune --scope=@denali/api --docker

# Stage 2: Cache dependencies
FROM base AS deps

ARG APP_DIR
WORKDIR ${APP_DIR}

COPY --from=prunner ${APP_DIR}/out/json ./
COPY --from=prunner ${APP_DIR}/out/yarn.lock ./

# Prefer offline install to avoid network download if possible
RUN yarn install --frozen-lockfile --prefer-offline

# Stage 3: Cache only prod dependencies and clean cache for a lighter image
FROM base AS prod-deps

ARG APP_DIR
WORKDIR ${APP_DIR}

COPY --from=prunner ${APP_DIR}/out/json ./
COPY --from=prunner ${APP_DIR}/out/yarn.lock ./

# Prefer offline install to avoid network download if possible
RUN yarn install --frozen-lockfile --production --prefer-offline && yarn cache clean

# Stage 4: Build with the pruned dependencies & code
FROM base AS builder

ARG APP_DIR
WORKDIR ${APP_DIR}

COPY --from=prunner ${APP_DIR}/package.json ./
COPY --from=prunner ${APP_DIR}/yarn.lock ./
COPY --from=prunner ${APP_DIR}/out/full/ ./
COPY --from=deps ${APP_DIR} ./

ENV HUSKY=0
ENV CI=true

RUN yarn turbo run build --filter=@denali/api
RUN rm -rv ${APP_DIR}/apps/api/.env || true

# Stage 5: Runner (final image) 
FROM base AS runner

ARG APP_DIR
WORKDIR ${APP_DIR}

EXPOSE 3001

COPY --from=builder ${APP_DIR}/apps/api/dist ./apps/api/dist
COPY --from=prunner ${APP_DIR}/package.json ./
COPY --from=prod-deps ${APP_DIR} ./

ENV NODE_ENV=production

CMD ["node", "apps/api/dist/apps/api/src/main"]