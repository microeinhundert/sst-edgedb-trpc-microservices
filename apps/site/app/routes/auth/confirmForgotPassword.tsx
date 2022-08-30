import { LoaderArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";

import { useConfirmForgotPasswordForm } from "~/hooks/forms/useConfirmForgotPasswordForm";

export async function loader({ request }: LoaderArgs) {
  return {};
}

export default function Route() {
  const transition = useTransition();
  const { register, errors, onSubmit } = useConfirmForgotPasswordForm();

  return (
    <div className="max-w-md space-y-10 p-10">
      <form className="space-y-6" onSubmit={onSubmit}>
        <input {...register("email", { required: true })} type="hidden" />

        <div>
          <label className="mb-2 block" htmlFor="confirmation-code">
            Confirmation Code
          </label>
          <input
            id="confirmation-code"
            {...register("confirmationCode", { required: true })}
            className="w-full"
            type="text"
          />
          {errors.confirmationCode?.message && (
            <span className="block text-red-500">{errors.confirmationCode.message}</span>
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
          {transition.type === "actionSubmission"
            ? "Submitting New Password..."
            : "Submit New Password"}
        </button>
      </form>
    </div>
  );
}
