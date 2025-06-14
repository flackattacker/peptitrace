import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '@/api/auth';
import api from '@/api/api';

interface User {
  _id: string;
  email: string;
  demographics?: any;
  preferences?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          // Validate token by making a request to a protected endpoint
          await api.get('/api/users/validate');
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password);
      
      if (!response?.data?.accessToken || !response?.data?.refreshToken) {
        throw new Error('Invalid login response - missing tokens');
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await apiRegister(email, password);
      
      if (!response?.data?.accessToken || !response?.data?.refreshToken) {
        throw new Error('Invalid registration response - missing tokens');
      }

      // Store tokens and user data
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error?.response?.data?.error || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}