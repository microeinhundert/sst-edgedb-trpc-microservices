import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { ConfirmSignUpInput } from "@sst-app/auth/validators";
import { confirmSignUpInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const resolver = zodResolver(confirmSignUpInputSchema);

export function useConfirmSignUpForm() {
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignUpInput>({ resolver });

  const onSubmit: SubmitHandler<ConfirmSignUpInput> = (data) => {
    submit(data);
  };

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
  };
}
