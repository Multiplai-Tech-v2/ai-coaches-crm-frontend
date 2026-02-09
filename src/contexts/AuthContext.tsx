import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, LoginResponse } from '@/types/auth';
import api, { initCsrfToken } from '@/lib/api';
import { setAuthToken, getAuthToken, removeAuthToken } from '@/lib/cookies';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // Check if we have a token in cookies
      const token = getAuthToken();
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Verify token by getting user data
      const response = await api.get('/user');
      setUser(response.data);
    } catch (error) {
      // Token is invalid, clear it
      removeAuthToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      // Get CSRF token first (for Sanctum compatibility)
      await initCsrfToken();
      
      // Attempt login and get token
      const response = await api.post<LoginResponse>('/login', credentials);
      
      // The backend should return a token in the response
      // Adjust the path based on your API response structure (token or access_token)
      const token = response.data.token || response.data.access_token;
      
      if (!token) {
        throw new Error('No authentication token received from server');
      }

      // Store token in cookie
      setAuthToken(token, credentials.remember || false);
      
      // Get user data - either from login response or fetch separately
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        const userResponse = await api.get<User>('/user');
        setUser(userResponse.data);
      }
    } catch (error: any) {
      // Clean up any partial state
      removeAuthToken();
      setUser(null);
      
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if token exists
      const token = getAuthToken();
      if (token) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state and token
      removeAuthToken();
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
