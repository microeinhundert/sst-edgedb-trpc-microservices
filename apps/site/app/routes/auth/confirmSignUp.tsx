import { LoaderArgs } from "@remix-run/node";
import { useTransition } from "@remix-run/react";

import { useConfirmSignUpForm } from "~/hooks/forms/useConfirmSignUpForm";

export async function loader({ request }: LoaderArgs) {
  return {};
}

export default function Route() {
  const transition = useTransition();
  const { register, errors, onSubmit } = useConfirmSignUpForm();

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

        <button className="text-xl" type="submit">
          {transition.type === "actionSubmission" ? "Confirming Sign Up..." : "Confirm Sign Up"}
        </button>
      </form>
    </div>
  );
}
