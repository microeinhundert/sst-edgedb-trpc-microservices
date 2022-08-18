import { zodResolver } from "@hookform/resolvers/zod";
import type { ForgotPasswordInput } from "@sst-app/auth/validators";
import { forgotPasswordInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(forgotPasswordInputSchema);

export function useForgotPasswordForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver });

  const mutation = trpc.useMutation(["auth.forgotPassword"], {
    onSuccess: (_, { email }) => {
      navigate("/auth/confirmForgotPassword", { state: { email } });
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = (data) => {
    mutation.mutate({
      email: data.email,
    });
  };

  return {
    register,
    errors,
    isSubmitting: mutation.isLoading,
    onSubmit: handleSubmit(onSubmit),
  };
}
