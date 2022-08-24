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

## Deploying infrastructure

Deploy the infrastructure for development:

```console
npm run sst:start
```

> While developing Lambdas with `npm run sst:start`, apps must be run locally by running `npm run dev` in the root directory.

Deploy the infrastructure:

```console
npm run sst:deploy
```

Remove the infrastructure:

```console
npm run sst:remove
```

## Working with EdgeDB

### Migrations

Before running database migrations, the EdgeDB CLI must be installed locally and linked to the remote EdgeDB instance deployed on AWS.
To do this, run the following command:

```console
npm run edgedb:link
```

Then, modify `default.esdl` inside `packages/edgedb/dbschema` to your liking and run the following command to create the migration for your changes:

```console
npm run edgedb:create-migration
```

To apply the migration, run the following command:

```console
npm run edgedb:migrate
```

> Learn more about migrations from the official [EdgeDB Guide](https://www.edgedb.com/docs/guides/migrations/index).

### Query Builder

To generate the EdgeDB query builder, run the following command:

```console
npm run edgedb:generate-query-builder
```

> The query builder will be written to the `edgedb` package.

### Usage

You can import both query builder (e) and client like this:

```ts
import { e, client } from "@sst-app/edgedb";

// Run your queries against the client
e.insert(e.User, {
  given_name: e.str(given_name),
  family_name: e.str(family_name),
}).run(client);
```

## Creating a new endpoint

This project uses tRPC for end-to-end type-safe APIs. Each service in the `services` directory exposes its own tRPC router with its own queries and mutations.
Each app must have its own router in the `trpc-mux` package, which represents the union of all service routers this app needs in order to fulfill its requirements.

### Creating a mutation (POST Endpoint)

Endpoints which mutate data on the server are called "mutations" in tRPC. To create a mutation, add it to its own file inside `procedures/mutations` in the corresponding service.
Mutations typically look like this:

```ts
// <your_service>/src/procedures/mutations/demo.ts
import { t } from "@sst-app/trpc";
import { demoInputSchema } from "../../validators/demo";

export const demoMutation = t.procedure.input(demoInputSchema).mutation(async ({ input, ctx }) => {
  // Do something, like writing to the database

  // Access the typed input
  console.log(input.firstName);
  console.log(input.lastName);

  // You can also return something which is sent to the client as JSON
  return { success: true };
});
```

> Don't forget to add the mutation to the router inside `router.ts`.

Mutations validate the input sent by the requesting client using a zod schema, which lays inside the `validators` directory of the same service containing the mutation.
A validation schema which checks if the properties `firstName` and `lastName` are strings would look like this:

```ts
// <your_service>/src/validators/demo.ts
import { z } from "zod";
9;
export const demoInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type DemoInput = z.infer<typeof demoInputSchema>;
```

Validators can also be exported in `validators.ts` in the root of the service, which allows apps in the `app` directory to also import and use the same zod schema to validate data client-side.

### Creating a query (GET Endpoint)

Endpoints which query data from the server are called "queries" in tRPC. To create a query, add it to its own file inside `procedures/queries` in the corresponding service.
Queries typically look like this:

```ts
// <your_service>/src/procedures/queries/demo.ts
import { t } from "@sst-app/trpc";
import { demoInputSchema } from "../../validators/demo";

export const demoQuery = t.procedure.input(demoInputSchema).query(async ({ input, ctx }) => {
  // Do something, like reading from the database

  // Return your data
  return { hello: "world" };
});
```

> Don't forget to add the query to the router inside `router.ts`.

Validators work exactly the same way in queries as they do in mutations.
