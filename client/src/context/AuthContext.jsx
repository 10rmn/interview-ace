import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = authService.getToken();
    const storedUser = authService.getCurrentUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = async (name, email, password, confirmPassword) => {
    const response = await authService.register(name, email, password, confirmPassword);
    if (response.success) {
      setUser(response.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
