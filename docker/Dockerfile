FROM node:20.17.0-alpine3.19 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN corepack enable

#------------------#

FROM base AS build

COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

#------------------#

FROM base AS release

COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prod

COPY --from=build /app/build /app/build

EXPOSE 3000

CMD ["node_modules/.bin/remix-serve", "build/server/index.js"]