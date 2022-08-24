import create from "zustand";

export interface AuthCredentials {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  issuedAt: number | null;
}

export interface AuthState extends AuthCredentials {
  signIn: (credentials: AuthCredentials) => void;
  signOut: () => void;
}

const initialState = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  issuedAt: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  signIn: (credentials) => {
    return set((state) => ({ ...state, ...credentials }));
  },
  signOut: () => {
    return set((state) => ({ ...state, ...initialState }));
  },
}));
