FROM oven/bun:1.1.31-alpine AS base

ENV NODE_ENV=production

WORKDIR /app

# Build layers
FROM base AS build

WORKDIR /app

ENV NODE_ENV=production

# Build Rust modules
RUN apk add cargo just
COPY Justfile ./
COPY sum ./sum
RUN just release

# Install packages
COPY package.json bun.lockb ./
RUN bun install

# Build application
COPY . .
RUN bun run build

# Copy over artifacts
FROM base

WORKDIR /app

ENV NODE_ENV=production

COPY migrations /app/migrations
COPY --from=build /app/build /app/build
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/*.so /app/

# Start the server
EXPOSE 3000
CMD [ "bun", "./build/index.js" ]
