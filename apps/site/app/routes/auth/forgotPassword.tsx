import { LoaderArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";

import { useForgotPasswordForm } from "~/hooks/forms/useForgotPasswordForm";

export async function loader({ request }: LoaderArgs) {
  return {};
}

export default function Route() {
  const transition = useTransition();
  const { register, errors, onSubmit } = useForgotPasswordForm();

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

        <button className="text-xl" type="submit">
          {transition.type === "actionSubmission"
            ? "Sending Confirmation Code..."
            : "Send Confirmation Code"}
        </button>
      </form>
    </div>
  );
}
