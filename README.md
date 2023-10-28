# Moe Counter

[Moe-Counter](https://github.com/journey-ad/Moe-Counter) rewritten in TypeScript with using [Dragonfly](https://www.dragonflydb.io/) (or any other [Redis](https://redis.io/) compatable database) and [fastify](https://fastify.dev/).

## Introduction

This project was made for node:20-alpine, however it can be used with almost any node version. Please, use `npm` package manager **instead** of yarn / any other.

## Demo

Demo is available on [count.akame.moe](https://count.akame.moe)

![Counter](https://count.akame.moe/@demo)

## Building docker image

1. Make sure that docker is installed
2. Run `docker build -t tag .` (replace `tag` with your image name)

## Environment

- `WEB_HOSTNAME` - web hostname to listen (default: `127.0.0.1`)
- `WEB_PORT` - web port to listen (default: `3000`)
- `DATABASE_URL` - redis connection url (default: `redis://127.0.0.1:6379`)

## Scripts

- `npm run lint` - run eslint task to check is everything ok
- `npm run dev` - run `src/index.ts` in development mode (using ts-node)
- `npm run build` - build `src/**.ts` files into `dist/**.js`
- `npm run start` - run built `dist/index.js`

## Modules

### Production modules

- `@starkow/logger` - fancy console logger
- `common-tags` - misc string utilities
- `dotenv` - parse .env file
- `fastify` - web server
- `redis` - database connection
- `mime-types` - parsing themes
- `image-size` - parsing image size

### Development modules

- `eslint` - [standardjs](https://standardjs.com/) config with custom rules
- `husky` - git hooks to avoid "style: lint" commits with lint fixes
- `typescript` - used for compiling .ts files
- `ts-node` - used for development
