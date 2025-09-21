// Token storage utilities for JWT authentication

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Token storage interface
export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  getUser(): any | null;
  setUser(user: any): void;
  removeUser(): void;
  clear(): void;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe localStorage wrapper that handles SSR
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // Silent error handling
    }
  },
  
  removeItem: (key: string): void => {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Silent error handling
    }
  },
};

// Token storage implementation
export const tokenStorage: TokenStorage = {
  getToken(): string | null {
    return safeLocalStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string): void {
    safeLocalStorage.setItem(TOKEN_KEY, token);
  },

  removeToken(): void {
    safeLocalStorage.removeItem(TOKEN_KEY);
  },

  getUser(): any | null {
    const userJson = safeLocalStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      return null;
    }
  },

  setUser(user: any): void {
    try {
      safeLocalStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      // Silent error handling
    }
  },

  removeUser(): void {
    safeLocalStorage.removeItem(USER_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  },
};

// Utility functions for token validation
export const isTokenExpired = (token: string): boolean => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration time
    if (!payload.exp) return false;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

export const getTokenPayload = (token: string): any | null => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    return null;
  }
};
