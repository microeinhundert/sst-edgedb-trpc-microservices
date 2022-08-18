import { useForgotPasswordForm } from "../../hooks/forms/useForgotPasswordForm";

export function ForgotPassword() {
  const { register, errors, isSubmitting, onSubmit } = useForgotPasswordForm();

  return (
    <div className="space-y-10 p-10">
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
          />
          {errors.email?.message && (
            <span className="block text-red-500">{errors.email.message}</span>
          )}
        </div>

        <button type="submit" className="text-xl">
          {isSubmitting ? "Sending Confirmation Code..." : "Send Confirmation Code"}
        </button>
      </form>
    </div>
  );
}
