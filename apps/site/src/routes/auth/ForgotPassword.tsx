import { zodResolver } from '@hookform/resolvers/zod';
import type { ForgotPasswordInput } from '@sst-app/auth/src/validators/forgotPassword';
import { forgotPasswordInputSchema } from '@sst-app/auth/src/validators/forgotPassword';
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(forgotPasswordInputSchema);

export function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver });

  const forgotPasswordMutation = trpc.useMutation(["auth.forgotPassword"], {
    onSuccess: (_, { email }) => {
      navigate("/auth/confirmForgotPassword", { state: { email } });
    }
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = (data) => {
    forgotPasswordMutation.mutate({
      email: data.email,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" {...register("email", { required: true })} type="email" autoComplete="email" />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <button type="submit" className="text-xl">{forgotPasswordMutation.isLoading ? 'Sending Confirmation Code...' : 'Send Confirmation Code'}</button>
      </form>
    </div>
  );
}
