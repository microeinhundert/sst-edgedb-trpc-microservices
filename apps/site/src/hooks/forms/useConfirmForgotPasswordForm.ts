import { zodResolver } from "@hookform/resolvers/zod";
import type { ConfirmForgotPasswordInput } from "@sst-app/auth/validators";
import { confirmForgotPasswordInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(confirmForgotPasswordInputSchema);

export function useConfirmForgotPasswordForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForgotPasswordInput>({ resolver });

  const mutation = trpc.auth.confirmForgotPassword.useMutation({
    onSuccess: (_, { email }) => {
      navigate("/auth/signIn", { state: { email } });
    },
  });

  const onSubmit: SubmitHandler<ConfirmForgotPasswordInput> = (data) => {
    mutation.mutate({
      email: data.email,
      confirmationCode: data.confirmationCode,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    });
  };

  return {
    register,
    errors,
    mutation,
    onSubmit: handleSubmit(onSubmit),
  };
}
