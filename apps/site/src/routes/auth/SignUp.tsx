import { zodResolver } from '@hookform/resolvers/zod/dist/zod.js';
import type { SignUpInput } from "@sst-app/service-one/validators";
import { signUpInputSchema } from "@sst-app/service-one/validators";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { trpc } from "../../utils/trpc";

const resolver = zodResolver(signUpInputSchema);

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver });

  const signUpMutation = trpc.useMutation(["serviceOne.signUp"], {
    onSuccess: () => {
      navigate("/auth/confirmSignUp");
    }
  });

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
          <label htmlFor="firstName" className="block mb-2">First Name</label>
          <input id="firstName" {...register("firstName", { required: true })} type="text" />
          {errors.firstName?.message && <span className="block text-red-500">{errors.firstName.message}</span>}
        </div>

        <div>
          <label htmlFor="lastName" className="block mb-2">Last Name</label>
          <input id="lastName" {...register("lastName", { required: true })} type="text" />
          {errors.lastName?.message && <span className="block text-red-500">{errors.lastName.message}</span>}
        </div>

        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input id="email" {...register("email", { required: true })} type="email" />
          {errors.email?.message && <span className="block text-red-500">{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Password</label>
          <input id="password" {...register("password", { required: true })} type="password" />
          {errors.password?.message && <span className="block text-red-500">{errors.password.message}</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
