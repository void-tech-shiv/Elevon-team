import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('elevon_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('elevon_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      return null;
    }
  });
  const [role, setRole] = useState(localStorage.getItem('elevon_role') || null);
  const [loading, setLoading] = useState(true);

  // Setup axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    
    // Check if token and basic info exist
    if (!token || !user || !role) {
      // If any essential part is missing, ensure clean state but don't force logout 
      // if we are still initializing (unless strictly required).
      // For now, we'll just set loading to false.
    }
    
    setLoading(false);
  }, [token, user, role]);

  const login = (newToken, newUser, newRole) => {
    localStorage.setItem('elevon_token', newToken);
    localStorage.setItem('elevon_user', JSON.stringify(newUser));
    localStorage.setItem('elevon_role', newRole);
    setToken(newToken);
    setUser(newUser);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem('elevon_token');
    localStorage.removeItem('elevon_user');
    localStorage.removeItem('elevon_role');
    setToken(null);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
