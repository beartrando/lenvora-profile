# ---------- BASE ----------
FROM node:22 AS base

WORKDIR /usr/src/app

COPY shared ./shared
COPY pnpm-lock.yaml ./
COPY turbo.json ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY tsconfig.json ./
COPY services/profile/package*.json ./services/profile/
COPY services/profile/jest.config.js ./services/profile/
COPY services/profile/tsconfig.json ./services/profile/
COPY services/profile/src ./services/profile/src/
COPY services/profile/__tests__ ./services/profile/__tests__/
COPY services/profile/prisma ./services/profile/prisma/


# ---------- DEV ----------
FROM base AS dev
ENV NODE_ENV=development

USER root
RUN corepack enable && pnpm install
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["pnpm", "--filter", "profile", "start"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1


# ---------- PROD ----------
FROM base AS prod
ENV NODE_ENV=production

USER root
RUN corepack enable && pnpm install --frozen-lockfile --prod && pnpm run --filter profile build
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 50051

CMD ["node", "services/profile/dist/app.js"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost 50051 || exit 1
