import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, AuthState } from '../types/user.types';
import { login as apiLogin, signUp as apiSignUp, getCurrentUser } from '../api/authService';
import { clearAuth, isAuthenticated as checkAuth, getUser } from '../utils/authUtils';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (userData: LoginCredentials & { first_name: string; last_name: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: checkAuth(),
    user: getUser(),
    loading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      if (checkAuth()) {
        try {
          const user = await getCurrentUser();
          setState({
            isAuthenticated: !!user,
            user,
            loading: false,
            error: null,
          });
        } catch (error) {
          clearAuth();
          setState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: 'Session expired. Please login again.',
          });
        }
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = await apiLogin(credentials);
      setState({
        isAuthenticated: true,
        user,
        loading: false,
        error: null,
      });
    } catch (error) {
      clearAuth();
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Invalid credentials or network error',
      });
      throw error;
    }
  };

  const signup = async (userData: LoginCredentials & { first_name: string; last_name: string }) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const userRequest = {
        username: userData.username,
        password: userData.password,
        first_name: userData.first_name,
        last_name: userData.last_name,
      };
      
      await apiSignUp(userRequest);
      
      // After signup, automatically log in
      await login({
        username: userData.username,
        password: userData.password,
      });
    } catch (error) {
      setState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Signup failed. Please try again.',
      });
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    setState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};