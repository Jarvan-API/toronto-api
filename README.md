# Toronto API

## Technology stack

- [TypeScript](https://www.typescriptlang.org/docs/)
- [NPM](https://www.npmjs.com/)
- [NestJS](https://docs.nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [MySQL](https://www.mysql.com/products/enterprise/document_store.html)
- [Redis](https://redis.io/)
- [Swagger](https://docs.nestjs.com/openapi/introduction)
- [Docker](https://www.docker.com/)

## Pre requirements

- **Install NestJS globally.**
- **Install MySQL**
- **Install Docker and Docker-compose**
- **Install MySQL Tool** (optional) [here](https://dev.mysql.com/downloads/workbench/5.2.html)

## Set environment variables

Copy the `.env.example` file and replace values for local environment

```bash
cp .env.example .env
```

## Up docker-compose

In local development we need to up docker-compose **local**.
The docker-compose has `mySQL` and `Redis` image.

:warning: **DON'T USE "ROOT" AS A NAME IN THE `MYSQL_USER` ENVIRONMENT VARIABLE**.

That setting can throw errors when the image is running

```bash
docker-compose -f ./local-docker-compose.yml up -d
```

## Install dependencies

```bash
$ npm install
```

## Running the migrations

To run a migration use the following command:

```bash
npm run migrition:run
```

This command automatically verify and execute the migrations.

:information_source: If you need to revert migrations run this command:

```bash
npm run migration:revert
```

This command revert the last migration in order.

## Running the app

```bash
# Development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Migrations

[TypeORM Documentation](https://typeorm.io/migrations)

### Create migration

To create a new table in the database use the following command:

```bash
npm run typeorm migration:create ./database/migrations/${MigrationName}
```

:warning: You need to replace **${MigrationName}** with the name that you want to add in the migration file

This commando will create a new migration file in the `./database/migrations` folder.
