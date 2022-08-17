import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import type { ConfirmSignUpInput } from "@sst-app/service-one/validators";
import { confirmSignUpInputSchema } from "@sst-app/service-one/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(confirmSignUpInputSchema);

export function ConfirmSignUp() {
  const navigate = useNavigate();
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
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" {...register("email", { required: true })} type="email" />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="confirmationCode" className="block mb-2">Confirmation Code</label>
          <input id="confirmationCode" {...register("confirmationCode", { required: true })} type="text" />
          {errors.confirmationCode?.message && <span className="block text-red-500">{errors.confirmationCode.message}</span>}
        </div>

        <button type="submit">Confirm Sign Up</button>
      </form>
    </div>
  );
}
