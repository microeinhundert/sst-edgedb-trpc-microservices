import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInInput } from "@sst-app/auth/validators";
import { signInInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { trpc } from "../../utils/trpc";
import { useAuth } from "../useAuth";

const resolver = zodResolver(signInInputSchema);

export function useSignInForm() {
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver });

  const mutation = trpc.auth.signIn.useMutation({
    onSuccess: (credentials) => {
      auth.signIn(credentials);
    },
  });

  const onSubmit: SubmitHandler<SignInInput> = (data) => {
    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return {
    register,
    errors,
    mutation,
    onSubmit: handleSubmit(onSubmit),
  };
}
