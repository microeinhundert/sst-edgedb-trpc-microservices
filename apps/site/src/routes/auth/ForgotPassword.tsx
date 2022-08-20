import { useForgotPasswordForm } from "../../hooks/forms/useForgotPasswordForm";

export function ForgotPassword() {
  const { register, errors, mutation, onSubmit } = useForgotPasswordForm();

  return (
    <div className="max-w-md space-y-10 p-10">
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
            className="w-full"
          />
          {errors.email?.message && (
            <span className="block text-red-500">{errors.email.message}</span>
          )}
        </div>

        {mutation.error?.message && (
          <div className="bg-red-50 p-5 text-center text-red-500">{mutation.error.message}</div>
        )}

        <button type="submit" className="text-xl">
          {mutation.isLoading ? "Sending Confirmation Code..." : "Send Confirmation Code"}
        </button>
      </form>
    </div>
  );
}
