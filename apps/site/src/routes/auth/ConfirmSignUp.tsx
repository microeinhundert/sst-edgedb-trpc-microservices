import { useLocation } from "react-router-dom";

import { useConfirmSignUpForm } from "../../hooks/forms/useConfirmSignUpForm";

export function ConfirmSignUp() {
  const location = useLocation();
  const { register, errors, mutation, onSubmit } = useConfirmSignUpForm();

  return (
    <div className="space-y-10 p-10 max-w-md">
      <form className="space-y-6" onSubmit={onSubmit}>
        <input
          {...register("email", { required: true })}
          type="hidden"
          defaultValue={location.state?.email ?? ""}
        />

        <div>
          <label htmlFor="confirmation-code" className="mb-2 block">
            Confirmation Code
          </label>
          <input
            id="confirmation-code"
            {...register("confirmationCode", { required: true })}
            type="text"
            className="w-full"
          />
          {errors.confirmationCode?.message && (
            <span className="block text-red-500">{errors.confirmationCode.message}</span>
          )}
        </div>

        {mutation.error?.message && <div className="bg-red-50 text-red-500 text-center p-5">{mutation.error.message}</div>}

        <button type="submit" className="text-xl">
          {mutation.isLoading ? "Confirming Sign Up..." : "Confirm Sign Up"}
        </button>
      </form>
    </div>
  );
}
