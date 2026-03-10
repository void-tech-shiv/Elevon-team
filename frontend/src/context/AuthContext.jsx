import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'student' or 'admin'
  const [token, setToken] = useState(localStorage.getItem('elevon_token') || null);
  const [loading, setLoading] = useState(true);

  // Setup axios default auth header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    // If we have a token, we could fetch user profile to verify.
    // For simplicity, we just rely on local storage for role/user until protected route fails.
    const storedUser = localStorage.getItem('elevon_user');
    const storedRole = localStorage.getItem('elevon_role');
    
    if (token && storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    } else {
      logout();
    }
    setLoading(false);
  }, [token]);

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
