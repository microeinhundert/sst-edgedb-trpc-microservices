import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="p-10">
      <h1 className="mb-6 text-4xl">Hello World</h1>
      <div className="flex gap-10">
        <Link to="/auth/signIn">Sign In</Link>
        <Link to="/auth/signUp">Sign Up</Link>
      </div>
    </div>
  );
}
