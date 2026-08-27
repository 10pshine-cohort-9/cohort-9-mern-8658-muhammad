"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const UserContext = createContext();

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);

  const logout = useCallback(() => {
    setUser(null);
  }, []);
  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      logout,
    }),
    [user, logout],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
