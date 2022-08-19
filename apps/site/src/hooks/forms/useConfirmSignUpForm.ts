import { zodResolver } from "@hookform/resolvers/zod";
import type { ConfirmSignUpInput } from "@sst-app/auth/validators";
import { confirmSignUpInputSchema } from "@sst-app/auth/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(confirmSignUpInputSchema);

export function useConfirmSignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignUpInput>({ resolver });

  const mutation = trpc.useMutation(["auth.confirmSignUp"], {
    onSuccess: () => {
      navigate("/");
    },
  });

  const onSubmit: SubmitHandler<ConfirmSignUpInput> = (data) => {
    mutation.mutate({
      email: data.email,
      confirmationCode: data.confirmationCode,
    });
  };

  return {
    register,
    errors,
    mutation,
    onSubmit: handleSubmit(onSubmit),
  };
}
