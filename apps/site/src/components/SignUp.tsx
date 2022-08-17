import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import type { SignUpInput } from "@sst-app/service-one/validators";
import { signUpInputSchema } from "@sst-app/service-one/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { trpc } from "../utils/trpc.js";

const resolver = zodResolver(signUpInputSchema);

export function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver });

  const signUpMutation = trpc.useMutation(["serviceOne.signUp"]);

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    signUpMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="space-y-10 p-10">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register("firstName", { required: true })} type="text" />
          {errors.firstName?.message && <span className="block text-red-500">{errors.firstName.message}</span>}
        </div>

        <div>
          <input {...register("lastName", { required: true })} type="text" />
          {errors.lastName?.message && <span className="block text-red-500">{errors.lastName.message}</span>}
        </div>

        <div>
          <input {...register("email", { required: true })} type="email" />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <input {...register("password", { required: true })} type="password" />
          {errors.password?.message && <span className="block text-red-500">{errors.password.message}</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
