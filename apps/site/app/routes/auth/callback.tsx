import type { LoaderArgs } from "@remix-run/node";

import { authenticateUser } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  await authenticateUser(request);
}
