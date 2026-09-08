import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Siddharth',
    email: 'siddharth@campus.edu',
    role: 'STUDENT', // 'STUDENT' | 'TEACHER' | 'ADMIN'
    dept: 'CSE',
    year: '3rd Year'
  });

  const setRole = (role) => {
    setUser((prev) => ({ ...prev, role }));
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser((prev) => ({ ...prev, role: 'GUEST' }));
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'STUDENT', setUser, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

