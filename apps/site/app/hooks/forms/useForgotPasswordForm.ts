import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { ForgotPasswordInput } from "@sst-app/auth/validators";
import { forgotPasswordInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const resolver = zodResolver(forgotPasswordInputSchema);

export function useForgotPasswordForm() {
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver });

  const onSubmit: SubmitHandler<ForgotPasswordInput> = (data) => {
    submit(data);
  };

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
  };
}
