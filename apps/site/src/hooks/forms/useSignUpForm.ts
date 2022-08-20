import { zodResolver } from "@hookform/resolvers/zod";
import type { SignUpInput } from "@sst-app/auth/validators";
import { signUpInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(signUpInputSchema);

export function useSignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver });

  const mutation = trpc.auth.signUp.useMutation({
    onSuccess: ({ confirmationNeeded }, { email }) => {
      if (confirmationNeeded) {
        navigate("/auth/confirmSignUp", { state: { email } });
      } else {
        navigate("/");
      }
    },
  });

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    mutation.mutate({
      givenName: data.givenName,
      familyName: data.familyName,
      email: data.email,
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
