import { createContext, useContext, useState, type ReactNode } from "react";
export interface LoginData {
  email: string;
  password: string;
}
export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginData) => void;
  register: (data: RegisterData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = (loginData: LoginData) => {
    try {
    } catch (e) {}
  };
  const register = (registerData: RegisterData) => {
    try {
    } catch (e) {}
  };

  const logout = () => {};
  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
