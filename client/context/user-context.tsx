import { createContext, useState, ReactNode, useContext } from "react";
import { TCurrentUser } from "../@types/auth";

interface TAuthContext {
  currentUser: TCurrentUser | null;
  setCurrentUser: (currentUser: TCurrentUser) => void;
}

const defaultValue: TAuthContext = {
  currentUser: null,
  setCurrentUser: () => {},
};

export const AuthContext = createContext<TAuthContext>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(defaultValue.currentUser);

  const value = {
    currentUser,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
