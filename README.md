# SST Microservices Architecture

## Directories

### /apps

Contains user-facing apps.

### /functions

Contains Lambda functions not accessible over the public network.

### /packages

Contains packages used by apps, services and functions.

### /services

Contains Lambda microservices.

## Deploying Infrastructure

Deploy the infrastructure for development:

```console
npm run sst:start
```

> While developing locally with `npm run sst:start`, apps must be run locally by running `npm run dev` in the root directory.

Deploy the infrastructure:

```console
npm run sst:deploy
```

Remove the infrastructure:

```console
npm run sst:remove
```

## Running EdgeDB Migrations

Before running database migrations, the EdgeDB CLI must be installed locally and linked to the remote EdgeDB instance deployed on AWS.
To do this, run the following command:

```console
npm run edgedb:link
```

Then, modify `dbschema/default.esdl` to your liking and run the following command to create the migration for your changes:

```console
npm run edgedb:create-migration
```

To apply the migration, run the following command:

```console
npm run edgedb:migrate
```

> Learn more about migrations from the official [EdgeDB Guide](https://www.edgedb.com/docs/guides/migrations/index).

To generate the EdgeDB query builder, run the following command:

```console
npm run edgedb:generate-query-builder
```

> The query builder will be written to the `edgedb` package.

You can import both query builder (e) and client like this:

```ts
import { e, client } from "@sst-app/edgedb";
```
