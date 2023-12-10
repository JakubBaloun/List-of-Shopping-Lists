// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

//zařídit abych zůstal přihlášený i po refreshi
  
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUser(null);
  };
  
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
