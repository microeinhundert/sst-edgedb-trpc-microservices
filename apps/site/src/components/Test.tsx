import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";

import { trpc } from "../utils/trpc";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

function Test() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const signUpMutation = trpc.useMutation(["serviceOne.signUp"]);

  const greet = trpc.useQuery(["serviceOne.greet", "Test"]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    signUpMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="p-10 space-y-10">
      {greet.data ? <div className="text-md">{greet.data.message}</div> : <div className="text-md">Loading...</div>}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input {...register("firstName", { required: true })} type="text" />
          {errors.firstName && <span className="block text-red-500">This field is required</span>}
        </div>

        <div>
          <input {...register("lastName", { required: true })} type="text" />
          {errors.lastName && <span className="block text-red-500">This field is required</span>}
        </div>

        <div>
          <input {...register("email", { required: true })} type="email" />
          {errors.email && <span className="block text-red-500">This field is required</span>}
        </div>

        <div>
          <input {...register("password", { required: true })} type="password" />
          {errors.password && <span className="block text-red-500">This field is required</span>}
        </div>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export { Test };
