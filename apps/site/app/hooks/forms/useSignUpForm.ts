import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { SignUpInput } from "@sst-app/auth/validators";
import { signUpInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const resolver = zodResolver(signUpInputSchema);

export function useSignUpForm() {
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver });

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    submit(data);
  };

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
  };
}
