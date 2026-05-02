import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@ERP:token');
    const savedUser = localStorage.getItem('@ERP:user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('@ERP:token', token);
    localStorage.setItem('@ERP:user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('@ERP:token');
    localStorage.removeItem('@ERP:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
