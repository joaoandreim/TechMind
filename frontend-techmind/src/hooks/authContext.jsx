'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import * as auth from '../lib/auth';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadStorageData = () => {
      const storedToken = auth.getToken();
      const storedUser = auth.getUser();

      if (storedToken && storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadStorageData();
  }, []);

  const login = async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    
    const { token, user: userData } = response.data;

    auth.setToken(token);
    auth.setUser(userData);
    setUser(userData);
    
    return userData;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}