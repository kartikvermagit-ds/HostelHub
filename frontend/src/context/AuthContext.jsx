import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'user-kartik-1',
  full_name: 'Kartik Sharma',
  email: 'kartik.sharma@hostel.edu',
  role: 'STUDENT',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
  branch: 'Computer Science',
  year: 2,
  hostel: 'Hostel 4',
  room_number: 'B-204',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hostelhub_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hostelhub_token');
      const savedUser = localStorage.getItem('hostelhub_user');

      if (savedToken) {
        try {
          // Attempt verification with backend
          const res = await apiClient('/auth/me');
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          } else if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch {
          // If offline/fallback, retain cached profile if available
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              setUser(DEFAULT_USER);
            }
          } else {
            setUser(DEFAULT_USER);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.success && res.data) {
        const sessionUser = res.data.user;
        const accessToken = res.data.session?.access_token || 'mock_jwt_token';

        setUser(sessionUser);
        setToken(accessToken);

        if (rememberMe) {
          localStorage.setItem('hostelhub_token', accessToken);
          localStorage.setItem('hostelhub_user', JSON.stringify(sessionUser));
        } else {
          sessionStorage.setItem('hostelhub_token', accessToken);
        }

        return { success: true, user: sessionUser };
      }
      throw new Error(res.message || 'Login failed');
    } catch (error) {
      // Fallback for development / mock mode if backend returns error or is offline
      if (error.isNetworkError || error.message?.includes('connect')) {
        const mockUser = {
          ...DEFAULT_USER,
          email,
          full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        };
        setUser(mockUser);
        setToken('dev_mock_token');
        localStorage.setItem('hostelhub_token', 'dev_mock_token');
        localStorage.setItem('hostelhub_user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      throw error;
    }
  };

  const register = async (formData) => {
    try {
      const res = await apiClient('/auth/register', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success && res.data) {
        const newUser = res.data.user;
        const accessToken = res.data.session?.access_token || 'mock_jwt_token';

        setUser(newUser);
        setToken(accessToken);

        localStorage.setItem('hostelhub_token', accessToken);
        localStorage.setItem('hostelhub_user', JSON.stringify(newUser));

        return { success: true, user: newUser };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (error) {
      if (error.isNetworkError || error.message?.includes('connect')) {
        const mockNewUser = {
          id: `user-${Date.now()}`,
          full_name: formData.full_name,
          email: formData.email,
          branch: formData.branch || 'Computer Science',
          year: formData.year || 1,
          hostel: formData.hostel || 'Hostel 4',
          room_number: formData.room_number || 'A-101',
          role: 'STUDENT',
          avatar_url: DEFAULT_USER.avatar_url,
        };
        setUser(mockNewUser);
        setToken('dev_mock_token');
        localStorage.setItem('hostelhub_token', 'dev_mock_token');
        localStorage.setItem('hostelhub_user', JSON.stringify(mockNewUser));
        return { success: true, user: mockNewUser };
      }
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      await apiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }).catch(() => {});
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  const resetPassword = async (newPassword) => {
    try {
      await apiClient('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ password: newPassword }),
      }).catch(() => {});
      return { success: true };
    } catch {
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await apiClient('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('hostelhub_token');
      localStorage.removeItem('hostelhub_user');
      sessionStorage.removeItem('hostelhub_token');
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
