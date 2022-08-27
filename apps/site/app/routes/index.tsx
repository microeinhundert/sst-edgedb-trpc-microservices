import type { LoaderFunction } from "@remix-run/node";

import { authenticate } from "~/authentication.server";

export const loader: LoaderFunction = ({ request }) => {
  return authenticate(request);
};

export default function Route() {
  return (
    <div className="p-10">
      <h1>Welcome to Remix</h1>
    </div>
  );
}
