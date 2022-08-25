import { useNavigate } from "react-router";

import type { AuthCredentials } from "./stores/useAuthStore";
import { useAuthStore } from "./stores/useAuthStore";

export function useAuth() {
  const navigate = useNavigate();
  const authStore = useAuthStore();

  return {
    signIn: (credentials: AuthCredentials) => {
      authStore.signIn(credentials);
      navigate("/");
    },
    signOut: () => {
      authStore.signOut();
      navigate("/");
    },
  };
}
