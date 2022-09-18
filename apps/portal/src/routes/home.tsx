import { trpc } from "../utils/trpc";

export function Home() {
  const query = trpc.demo.helloWorld.useQuery();

  return (
    <div className="p-10">
      <h1 className="mb-5 text-4xl">Welcome to the `portal` app</h1>
      {query.isLoading ? <p>Loading...</p> : <p>{query.data?.message}</p>}
    </div>
  );
}
