'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '@/lib/api';
import { tokenStorage, isTokenExpired } from './token-storage';
import type { AuthState, UserResponse, LoginRequest } from '@/lib/types';

// Authentication context interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize authentication state from storage
  const initializeAuth = useCallback(async () => {
    try {
      const token = tokenStorage.getToken();
      const user = tokenStorage.getUser();

      if (!token || isTokenExpired(token)) {
        // Token is missing or expired, clear storage
        tokenStorage.clear();
        setState(prev => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
        }));
        return;
      }

      // Token exists and is valid, verify with server
      try {
        const currentUser = await authApi.getProfile();
        setState(prev => ({
          ...prev,
          user: currentUser,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        // Profile fetch failed, clear storage
        tokenStorage.clear();
        setState(prev => ({
          ...prev,
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Session expired',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize authentication',
      }));
    }
  }, []);

  // Login function
  const login = useCallback(async (credentials: LoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login(credentials);
      
      // Store token and user data
      tokenStorage.setToken(response.token);
      tokenStorage.setUser(response.user);

      setState(prev => ({
        ...prev,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    tokenStorage.clear();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!state.isAuthenticated || !state.token) return;

    try {
      const currentUser = await authApi.getProfile();
      tokenStorage.setUser(currentUser);
      setState(prev => ({
        ...prev,
        user: currentUser,
        error: null,
      }));
    } catch (error: any) {
      // Don't logout on refresh failure, just handle silently
    }
  }, [state.isAuthenticated, state.token]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Context value
  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user is authenticated
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

// Hook to get current user
export function useCurrentUser(): UserResponse | null {
  const { user } = useAuth();
  return user;
}
