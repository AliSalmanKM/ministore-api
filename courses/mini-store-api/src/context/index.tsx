import React, {
  createContext,
  useMemo,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define the types for the user and auth state
export interface User {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window !== "undefined") {
      let user: User | null = null;
      let access_token: string | null = null;

      try {
        const userJson = localStorage.getItem("user");
        if (userJson) {
          user = JSON.parse(userJson) as User;
        }
      } catch (jsonError) {
        console.error(jsonError);
      }

      try {
        access_token = localStorage.getItem("token");
      } catch (error) {
        console.error(error);
      }

      return { user, access_token };
    }

    return { user: null, access_token: null };
  });

  const value = useMemo(() => ({ auth, setAuth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
