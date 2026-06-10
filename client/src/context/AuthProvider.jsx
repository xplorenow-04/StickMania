import { createContext, useState, useCallback } from "react";

export const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isAdmin = user?.role === "admin";

  const login = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <authContext.Provider
      value={{ user, setUser, isLoggedIn, setIsLoggedIn, isAdmin, login, logout }}
    >
      {children}
    </authContext.Provider>
  );
};
