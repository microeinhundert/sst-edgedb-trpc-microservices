import { LoaderArgs } from "@remix-run/node";

import { authenticate } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  await authenticate(request);
}
