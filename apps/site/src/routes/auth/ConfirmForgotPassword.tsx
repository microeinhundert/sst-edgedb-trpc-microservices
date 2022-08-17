import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmForgotPasswordInput } from '@sst-app/service-one/src/validators/confirmForgotPassword';
import { confirmForgotPasswordInputSchema } from '@sst-app/service-one/src/validators/confirmForgotPassword';
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(confirmForgotPasswordInputSchema);

export function ConfirmForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForgotPasswordInput>({ resolver });

  const confirmForgotPasswordMutation = trpc.useMutation(["serviceOne.confirmForgotPassword"], {
    onSuccess: (_, { email }) => {
      navigate("/auth/signIn", { state: { email } });
    },
    onError: (error) => {
      if (error.data?.stack?.startsWith('CodeMismatchException')) {
        setError('confirmationCode', { type: "custom", message: "The code you entered is not valid" });
      }
    }
  });

  const onSubmit: SubmitHandler<ConfirmForgotPasswordInput> = (data) => {
    confirmForgotPasswordMutation.mutate({
      email: data.email,
      confirmationCode: data.confirmationCode,
      password: data.password,
      passwordConfirmation: data.password,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email", { required: true })} type="hidden" defaultValue={location.state?.email ?? ""} />

        <div>
          <label htmlFor="confirmation-code" className="block mb-2">Confirmation Code</label>
          <input id="confirmation-code" {...register("confirmationCode", { required: true })} type="text" />
          {errors.confirmationCode?.message && <span className="block text-red-500">{errors.confirmationCode.message}</span>}
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

        <button type="submit" className="text-xl">{confirmForgotPasswordMutation.isLoading ? 'Submitting New Password...' : 'Submit New Password'}</button>
      </form>
    </div>
  );
}
