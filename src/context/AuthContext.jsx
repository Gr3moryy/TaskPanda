import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  const login = useCallback((userRole) => {
    setIsLoggedIn(true);
    setRole(userRole || "client");
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole(null);
  }, []);

  const verify = useCallback(() => {
    setIsVerified(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, isVerified, login, logout, verify }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
