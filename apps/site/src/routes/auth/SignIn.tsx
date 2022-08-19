import { Link, useLocation } from "react-router-dom";

import { useSignInForm } from "../../hooks/forms/useSignInForm";

export function SignIn() {
  const location = useLocation();
  const { register, errors, mutation, onSubmit } = useSignInForm();

  return (
    <div className="space-y-10 p-10 max-w-md">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            id="email"
            {...register("email", { required: true })}
            type="email"
            autoComplete="email"
            defaultValue={location.state?.email ?? ""}
            className="w-full"
          />
          {errors.email?.message && (
            <span className="block text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>
          <input
            id="password"
            {...register("password", { required: true })}
            type="password"
            autoComplete="current-password"
            className="w-full"
          />
          {errors.password?.message && (
            <span className="block text-red-500">{errors.password.message}</span>
          )}
        </div>

        {mutation.error?.message && <div className="bg-red-50 text-red-500 text-center p-5">{mutation.error.message}</div>}

        <button type="submit" className="text-xl">
          {mutation.isLoading ? "Signing In..." : "Sign In"}
        </button>

        <div className="mt-10">
          <Link to="/auth/forgotPassword">Forgot Password</Link>
        </div>
      </form>
    </div>
  );
}
