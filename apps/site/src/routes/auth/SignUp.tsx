import { zodResolver } from '@hookform/resolvers/zod';
import type { SignUpInput } from "@sst-app/auth/validators";
import { signUpInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(signUpInputSchema);

export function SignUp() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver });

  const signUpMutation = trpc.useMutation(["auth.signUp"], {
    onSuccess: ({ confirmationNeeded }, { email }) => {
      if (confirmationNeeded) {
        navigate("/auth/confirmSignUp", { state: { email } });
      }
    }
  });

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    signUpMutation.mutate({
      givenName: data.givenName,
      familyName: data.familyName,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.password,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="given-name" className="block mb-2">First Name</label>
          <input id="given-name" {...register("givenName", { required: true })} type="text" autoComplete="given-name" />
          {errors.givenName?.message && <span className="block text-red-500">{errors.givenName.message}</span>}
        </div>

        <div>
          <label htmlFor="family-name" className="block mb-2">Last Name</label>
          <input id="family-name" {...register("familyName", { required: true })} type="text" autoComplete="family-name" />
          {errors.familyName?.message && <span className="block text-red-500">{errors.familyName.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" {...register("email", { required: true })} type="email" autoComplete="email" />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <input id="password" {...register("password", { required: true })} type="password" autoComplete="new-password" />
          {errors.password?.message && <span className="block text-red-500">{errors.password.message}</span>}
        </div>

        <div>
          <label htmlFor="password-confirmation" className="block mb-2">Confirm Password</label>
          <input id="password-confirmation" {...register("passwordConfirmation", { required: true })} type="password" autoComplete="new-password" />
          {errors.passwordConfirmation?.message && <span className="block text-red-500">{errors.passwordConfirmation.message}</span>}
        </div>

        <button type="submit" className="text-xl">{signUpMutation.isLoading ? 'Signing Up...' : 'Sign Up'}</button>
      </form>
    </div>
  );
}
