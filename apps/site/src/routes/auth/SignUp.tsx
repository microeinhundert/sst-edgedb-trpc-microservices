import { useSignUpForm } from "../../hooks/forms/useSignUpForm";

export function SignUp() {
  const { register, errors, mutation, onSubmit } = useSignUpForm();

  return (
    <div className="space-y-10 p-10 max-w-md">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="given-name" className="mb-2 block">
            First Name
          </label>
          <input
            id="given-name"
            {...register("givenName", { required: true })}
            type="text"
            autoComplete="given-name"
            className="w-full"
          />
          {errors.givenName?.message && (
            <span className="block text-red-500">{errors.givenName.message}</span>
          )}
        </div>

        <div>
          <label htmlFor="family-name" className="mb-2 block">
            Last Name
          </label>
          <input
            id="family-name"
            {...register("familyName", { required: true })}
            type="text"
            autoComplete="family-name"
            className="w-full"
          />
          {errors.familyName?.message && (
            <span className="block text-red-500">{errors.familyName.message}</span>
          )}
        </div>

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

        <div>
          <label htmlFor="password" className="mb-2 block">
            Password
          </label>
          <input
            id="password"
            {...register("password", { required: true })}
            type="password"
            autoComplete="new-password"
            className="w-full"
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
            className="w-full"
          />
          {errors.passwordConfirmation?.message && (
            <span className="block text-red-500">{errors.passwordConfirmation.message}</span>
          )}
        </div>

        {mutation.error?.message && <div className="bg-red-50 text-red-500 text-center p-5">{mutation.error.message}</div>}

        <button type="submit" className="text-xl">
          {mutation.isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
