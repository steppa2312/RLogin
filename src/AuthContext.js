import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    fullName: "Mario Rossi",
    role: "ADMIN"
  });

  const logout = () => {
    console.log("Logout eseguito");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};