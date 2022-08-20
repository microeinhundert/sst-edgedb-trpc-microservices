# EdgeDB

This package contains the EdgeDB schema as well as the auto-generated query builder.

## Usage

To generate the EdgeDB query builder, run the following command:

```console
npm run generate-query-builder
```

> The query builder will be written to the `src/lib/queryBuilder` directory of this package.

You can import both query builder (e) and client like this:

```ts
import { e, client } from "@sst-app/edgedb";
```
