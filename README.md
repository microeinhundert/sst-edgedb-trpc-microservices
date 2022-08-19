# SST Microservices Architecture

## Directories

### /dbschema

Contains the EdgeDB schema.

### /apps

Contains user-facing apps.

### /functions

Contains Lambda functions not accessible over the public network.

### /packages

Contains packages used by apps, services and functions.

### /services

Contains Lambda microservices.

## Provisioning Infrastructure

Deploy the infrastructure for development:

```console
npm run sst-start
```

> While developing locally with `npm run sst-start`, apps must be run locally by running `npm run dev` in the app's root directory.

Deploy the infrastructure:

```console
npm run sst-deploy
```

Remove the infrastructure:

```console
npm run sst-remove
```

## Running EdgeDB Migrations

Before running migrations, the EdgeDB CLI must be installed locally and linked to the remote EdgeDB instance deployed on AWS.
To get credentials for the remote instance, run the following AWS CLI command:

```console
sh scripts/get-edgedb-dsn.sh
```
