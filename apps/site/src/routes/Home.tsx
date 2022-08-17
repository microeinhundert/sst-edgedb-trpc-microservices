import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="p-10">
      <h1 className="text-4xl mb-6">Hello World</h1>
      <div className="flex gap-10">
        <Link to="/auth/signIn">Sign In</Link>
        <Link to="/auth/signUp">Sign Up</Link>
      </div>
    </div>
  );
}
