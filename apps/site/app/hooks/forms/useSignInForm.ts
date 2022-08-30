import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "@remix-run/react";
import type { SignInInput } from "@sst-app/auth/validators";
import { signInInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

const resolver = zodResolver(signInInputSchema);

export function useSignInForm() {
  const submit = useSubmit();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver });

  const onSubmit: SubmitHandler<SignInInput> = (data) => {
    submit(data);
  };

  return {
    register,
    errors,
    onSubmit: handleSubmit(onSubmit),
  };
}
