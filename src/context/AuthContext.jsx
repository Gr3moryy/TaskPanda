import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = useCallback((userRole) => {
    setIsLoggedIn(true);
    setRole(userRole || "client");
    setIsGuest(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setRole(null);
    setIsGuest(false);
  }, []);

  const browseAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, isGuest, login, logout, browseAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
