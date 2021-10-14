# ================ #
#    Base Stage    #
# ================ #

FROM node:16-buster-slim as base

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node package.json .

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

COPY --chown=node:node tsconfig.json tsconfig.json
COPY --chown=node:node src/ src/

RUN pnpm install
RUN pnpm run build

# ================ #
#   Runner Stage   #
# ================ #

FROM base AS runner

COPY --chown=node:node src/.env src/.env
COPY --chown=node:node --from=builder /usr/src/app/dist dist

CMD [ "pnpm", "run", "start"]