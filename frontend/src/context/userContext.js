"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children, initialUser = null }) {
  const [user, setUser] = useState(initialUser);

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
