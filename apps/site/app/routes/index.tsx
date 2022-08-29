import { Link } from "@remix-run/react";

export default function Route() {
  return (
    <div className="p-10">
      <h1 className="mb-10 text-4xl">Welcome</h1>
      <Link className="font-bold underline" to="/private">Go to private route</Link>
    </div>
  );
}
