import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import type { ConfirmSignUpInput } from "@sst-app/service-one/validators";
import { confirmSignUpInputSchema } from "@sst-app/service-one/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(confirmSignUpInputSchema);

export function ConfirmSignUp() {
  const navigate = useNavigate();
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignUpInput>({ resolver });

  const confirmSignUpMutation = trpc.useMutation(["serviceOne.confirmSignUp"], {
    onSuccess: () => {
      navigate("/");
    }
  });

  const onSubmit: SubmitHandler<ConfirmSignUpInput> = (data) => {
    confirmSignUpMutation.mutate({
      email: data.email,
      confirmationCode: data.confirmationCode,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email", { required: true })} type="hidden" defaultValue={location.state.email} />

        <div>
          <label htmlFor="confirmation-code" className="block mb-2">Confirmation Code</label>
          <input id="confirmation-code" {...register("confirmationCode", { required: true })} type="text" />
          {errors.confirmationCode?.message && <span className="block text-red-500">{errors.confirmationCode.message}</span>}
        </div>

        <button type="submit">{confirmSignUpMutation.isLoading ? 'Confirming Sign Up...' : 'Confirm Sign Up'}</button>
      </form>
    </div>
  );
}
