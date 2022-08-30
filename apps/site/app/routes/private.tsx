import { LoaderArgs, SerializeFrom } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authenticate } from "~/server/auth.server";
import { trpcProxyClient } from "~/utils/trpc";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticate(request);
  const helloWorld = await trpcProxyClient.demo.helloWorld.query();

  return {
    helloWorld,
    user,
  };
}

export default function Route() {
  const data = useLoaderData<SerializeFrom<typeof loader>>();

  return (
    <div className="p-10">
      <h1>
        {data.helloWorld.message}, {data.user.email}
      </h1>
    </div>
  );
}
