import { useSignUpForm } from "../../hooks/forms/useSignUpForm";

export function SignUp() {
  const { register, errors, isSubmitting, onSubmit } = useSignUpForm();

  return (
    <div className="space-y-10 p-10">
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
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
