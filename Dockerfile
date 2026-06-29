# ---------- BASE ----------
FROM node:22 AS base

WORKDIR /usr/src/app

COPY shared ./shared
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY proto ./proto

COPY services/profile/package*.json ./services/profile/
COPY services/profile/jest.config.js ./services/profile/
COPY services/profile/tsconfig.json ./services/profile/
COPY services/profile/prisma ./services/profile/prisma/
COPY services/profile/src ./services/profile/src/
COPY services/profile/__tests__ ./services/profile/__tests__/

# ---------- BUILD ----------
FROM base AS build

ENV NODE_ENV=development

RUN apt-get update && apt-get install -y protobuf-compiler

RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm run --filter profile proto:generate
RUN pnpm run --filter profile build
RUN pnpm install --prod

# ---------- DEV ----------
FROM build AS dev

ENV NODE_ENV=development

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "profile", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1

# ---------- PROD ----------
FROM node:22 AS prod

WORKDIR /usr/src/app

ENV NODE_ENV=production

#RUN pnpm deploy --filter profile /out

##COPY --from=build /usr/src/app /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/services/profile/node_modules ./services/profile/node_modules
COPY --from=build /usr/src/app/services/profile/dist ./services/profile/dist
COPY --from=build /usr/src/app/shared ./shared


USER node

EXPOSE 50051

CMD ["node", "./services/profile/dist/app.js"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1
