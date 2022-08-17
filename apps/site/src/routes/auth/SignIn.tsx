import { zodResolver } from '@hookform/resolvers/zod';
import type { SignInInput } from "@sst-app/auth/validators";
import { signInInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(signInInputSchema);

export function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver });

  const signInMutation = trpc.useMutation(["auth.signIn"], {
    onSuccess: () => {
      navigate("/");
    }
  });

  const onSubmit: SubmitHandler<SignInInput> = (data) => {
    signInMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" {...register("email", { required: true })} type="email" autoComplete="email" defaultValue={location.state?.email ?? ""} />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <input id="password" {...register("password", { required: true })} type="password" autoComplete="current-password" />
          {errors.password?.message && <span className="block text-red-500">{errors.password.message}</span>}
        </div>

        <button type="submit" className="text-xl">{signInMutation.isLoading ? 'Signing In...' : 'Sign In'}</button>

        <div className="mt-10">
          <Link to="/auth/forgotPassword">Forgot Password</Link>
        </div>
      </form>
    </div>
  );
}
