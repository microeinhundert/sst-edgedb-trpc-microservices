import { LoaderArgs } from "@remix-run/node";

import { authenticate } from "~/server/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
  await authenticate(request);
};
