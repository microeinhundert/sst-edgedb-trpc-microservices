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
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfirmSignUpInput>({ resolver });

  const mutation = trpc.useMutation(["auth.confirmSignUp"], {
    onSuccess: () => {
      navigate("/");
    },
    onError: (error) => {
      if (error.data?.stack?.startsWith("CodeMismatchException")) {
        setError("confirmationCode", {
          type: "custom",
          message: "The code you entered is not valid",
        });
      }
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
    isSubmitting: mutation.isLoading,
    onSubmit: handleSubmit(onSubmit),
  };
}
