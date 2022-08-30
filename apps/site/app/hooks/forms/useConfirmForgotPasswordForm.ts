import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { ConfirmForgotPasswordInput } from "@sst-app/auth/validators";
import { confirmForgotPasswordInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const resolver = zodResolver(confirmForgotPasswordInputSchema);

export function useConfirmForgotPasswordForm() {
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmForgotPasswordInput>({ resolver });

  const onSubmit: SubmitHandler<ConfirmForgotPasswordInput> = (data) => {
    submit(data);
  };

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
  };
}
