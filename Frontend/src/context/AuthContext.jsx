import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('hrm_token');
    const storedUser  = localStorage.getItem('hrm_user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('hrm_token');
        localStorage.removeItem('hrm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const { token: tok, user: usr } = await authAPI.login(credentials);
    setToken(tok);
    setUser(usr);
    localStorage.setItem('hrm_token', tok);
    localStorage.setItem('hrm_user', JSON.stringify(usr));
    return usr;
  }, []);

  const register = useCallback(async (data) => {
    const { token: tok, user: usr } = await authAPI.register(data);
    setToken(tok);
    setUser(usr);
    localStorage.setItem('hrm_token', tok);
    localStorage.setItem('hrm_user', JSON.stringify(usr));
    return usr;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hrm_token');
    localStorage.removeItem('hrm_user');
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('hrm_user', JSON.stringify(updated));
  }, [user]);

  const value = { user, token, loading, login, register, logout, updateUser, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
