import { LoaderArgs } from "@remix-run/node";

import { unauthenticate } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  await unauthenticate(request);
}
