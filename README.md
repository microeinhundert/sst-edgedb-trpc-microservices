# SST Microservices Architecture

## Provisioning Infrastructure

Deploy the infrastructure for development:

```console
npm run sst-start
```

> In development, apps must be run locally by running `npm run dev` in the app's root directory.

Deploy the infrastructure:

```console
npm run sst-deploy
```

Remove the infrastructure:

```console
npm run sst-remove
```

## Directories

### /apps

Contains user-facing apps.

### /functions

Contains Lambda functions not accessible over the public network.

### /packages

Contains packages used by apps, services and functions.

### /services

Contains Lambda microservices.
