import { DataFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { authenticate } from "~/server/auth.server";
import { trpcClient } from "~/utils/trpc";

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticate(request);
  const helloWorld = await trpcClient.demo.helloWorld.query();

  return json({
    user,
    helloWorld,
  });
}

export default function Route() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-10">
      <h1>Welcome, {data.user.email}</h1>
      <p>{data.helloWorld.message}</p>
    </div>
  );
}
