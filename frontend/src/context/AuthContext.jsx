import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('railway_token');
    const savedUser = localStorage.getItem('railway_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('railway_token', data.token);
        localStorage.setItem('railway_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed.' };
      }
    } catch (error) {
      console.error('[AUTH CONTEXT] Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Invalid email or password.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      if (data.success) {
        // Automatically log in after registration for a smoother UX
        // Using a dummy token for registration:
        const dummyToken = 'dummy-user-token';
        const registeredUser = data.user;
        setUser(registeredUser);
        setToken(dummyToken);
        localStorage.setItem('railway_token', dummyToken);
        localStorage.setItem('railway_user', JSON.stringify(registeredUser));
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed.' };
      }
    } catch (error) {
      console.error('[AUTH CONTEXT] Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error occurred during registration.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('railway_token');
    localStorage.removeItem('railway_user');
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
