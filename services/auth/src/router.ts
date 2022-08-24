import { t } from "@sst-app/trpc";

import { confirmForgotPassword } from "./procedures/mutations/confirmForgotPassword";
import { confirmSignUp } from "./procedures/mutations/confirmSignUp";
import { forgotPassword } from "./procedures/mutations/forgotPassword";
import { signIn } from "./procedures/mutations/signIn";
import { signOut } from "./procedures/mutations/signOut";
import { signUp } from "./procedures/mutations/signUp";

export const router = t.router({
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  forgotPassword,
  confirmForgotPassword,
});
