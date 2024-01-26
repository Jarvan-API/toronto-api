# Toronto API

## Technology stack

- [TypeScript](https://www.typescriptlang.org/docs/)
- [NPM](https://www.npmjs.com/)
- [NestJS](https://docs.nestjs.com/)
- [Docker](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/es)

## Pre requirements

- **Install NestJS globally.**
- **Install MongoDB Compass [here](https://www.mongodb.com/es/products/tools/compass)**
- **Install Docker and Docker-compose**

## Set environment variables

Copy the `.env.example` file and replace values for local environment

```bash
cp .env.example .env
```

## Up docker-compose

In local development we need to up docker-compose **local**.
The docker-compose has `mongodb` image.

```bash
docker-compose -f ./local-docker-compose.yml up -d
```

## Install dependencies

```bash
$ npm install
```

## Running the app

```bash
# Development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Using MongoDB Compass

In MongoDB Compass connect to `localhost:27017`
After running the app, you should see the Toronto collection available
