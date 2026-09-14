import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const login = useCallback((userRole) => {
    setIsLoggedIn(true);
    setRole(userRole || "client");
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
