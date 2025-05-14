/**
 * AuthContext.js
 * 
 * This file defines the authentication context and provider for the NutriBot application.
 * It manages user authentication state using React Context and provides login/logout functionality.
 * The authentication state is persisted in localStorage and synchronized across browser tabs.
 * 
 * Author(s): Eli Goldberger & Matthew Thao
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isLoggedIn') === 'true');

  useEffect(() => {
    const handler = () => setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 