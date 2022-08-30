import { LoaderArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";

import { useSignUpForm } from "~/hooks/forms/useSignUpForm";

export async function loader({ request }: LoaderArgs) {
  return {};
}

export default function Route() {
  const transition = useTransition();
  const { register, errors, onSubmit } = useSignUpForm();

  return (
    <div className="max-w-md space-y-10 p-10">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block" htmlFor="given-name">
            First Name
          </label>
          <input
            id="given-name"
            {...register("givenName", { required: true })}
            autoComplete="given-name"
            className="w-full"
            type="text"
          />
          {errors.givenName?.message && (
            <span className="block text-red-500">{errors.givenName.message}</span>
          )}
        </div>

        <div>
          <label className="mb-2 block" htmlFor="family-name">
            Last Name
          </label>
          <input
            id="family-name"
            {...register("familyName", { required: true })}
            autoComplete="family-name"
            className="w-full"
            type="text"
          />
          {errors.familyName?.message && (
            <span className="block text-red-500">{errors.familyName.message}</span>
          )}
        </div>

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
            autoComplete="new-password"
            className="w-full"
            type="password"
          />
          {errors.password?.message && (
            <span className="block text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label className="mb-2 block" htmlFor="password-confirmation">
            Confirm Password
          </label>
          <input
            id="password-confirmation"
            {...register("passwordConfirmation", { required: true })}
            autoComplete="new-password"
            className="w-full"
            type="password"
          />
          {errors.passwordConfirmation?.message && (
            <span className="block text-red-500">{errors.passwordConfirmation.message}</span>
          )}
        </div>

        <button className="text-xl" type="submit">
          {transition.type === "actionSubmission" ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
