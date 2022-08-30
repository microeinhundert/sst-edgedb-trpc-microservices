import { LoaderArgs } from "@remix-run/node";
import { Link, useTransition } from "@remix-run/react";

import { useSignInForm } from "~/hooks/forms/useSignInForm";

export async function loader({ request }: LoaderArgs) {
  return {};
}

export default function Route() {
  const transition = useTransition();
  const { register, errors, onSubmit } = useSignInForm();

  return (
    <div className="max-w-md space-y-10 p-10">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            {...register("email", { required: true })}
            autoComplete="email"
            className="w-full"
            type="email"
          />
          {errors.email?.message && (
            <span className="block text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label className="mb-2 block" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            {...register("password", { required: true })}
            autoComplete="current-password"
            className="w-full"
            type="password"
          />
          {errors.password?.message && (
            <span className="block text-red-500">{errors.password.message}</span>
          )}
        </div>

        <button className="text-xl" type="submit">
          {transition.type === "actionSubmission" ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-10">
          <Link to="/auth/forgotPassword">Forgot Password</Link>
        </div>
      </form>
    </div>
  );
}
