import { createContext, useState, ReactNode, useContext } from "react";

interface AuthContext {
  currentUser: string;
  setCurrentUser?: (user: string) => void;
}

const defaultValue = {
  currentUser: "",
};

export const AuthContext = createContext<AuthContext>(defaultValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(defaultValue.currentUser);
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
