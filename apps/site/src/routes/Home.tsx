import { trpc } from "../utils/trpc";

export function Home() {
  const data = trpc.demo.helloWorld.useQuery();

  console.log(data);

  return (
    <div className="p-10">
      <h1 className="mb-6 text-4xl">Hello World</h1>
    </div>
  );
}
