import { useLocation } from "react-router-dom";

import { useConfirmForgotPasswordForm } from "../../hooks/forms/useConfirmForgotPasswordForm";

export function ConfirmForgotPassword() {
  const location = useLocation();
  const { register, errors, isSubmitting, onSubmit } = useConfirmForgotPasswordForm();

  return (
    <div className="space-y-10 p-10">
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
          />
          {errors.confirmationCode?.message && (
            <span className="block text-red-500">{errors.confirmationCode.message}</span>
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
            autoComplete="new-password"
          />
          {errors.password?.message && (
            <span className="block text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="password-confirmation" className="mb-2 block">
            Confirm Password
          </label>
          <input
            id="password-confirmation"
            {...register("passwordConfirmation", { required: true })}
            type="password"
            autoComplete="new-password"
          />
          {errors.passwordConfirmation?.message && (
            <span className="block text-red-500">{errors.passwordConfirmation.message}</span>
          )}
        </div>

        <button type="submit" className="text-xl">
          {isSubmitting ? "Submitting New Password..." : "Submit New Password"}
        </button>
      </form>
    </div>
  );
}