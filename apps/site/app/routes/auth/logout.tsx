import { LoaderArgs } from "@remix-run/node";

import { logoutUser } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  await logoutUser(request);
}
