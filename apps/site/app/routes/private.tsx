import { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authenticate } from "~/server/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticate(request);

  return {
    user,
  };
}

export default function Route() {
  const data = useLoaderData<SerializeFrom<typeof loader>>();

  return (
    <div className="p-10">
      <h1>Welcome, {data.user.email}</h1>
    </div>
  );
}
