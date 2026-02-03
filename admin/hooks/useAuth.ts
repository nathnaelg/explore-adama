import { useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services/auth/auth.service';
import { authApi } from '../services/auth/auth.api';
import { usersApi } from '../services/users/users.api';
import { User } from '../types';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Auth Error Listener
    AuthService.onAuthError(() => {
        setIsAuthenticated(false);
        setUser(null);
    });

    // Initialize Auth
    const initAuth = async () => {
        const token = AuthService.getToken();
        const storedUser = AuthService.getUser();

        try {
            if (token && storedUser?.id) {
                setIsAuthenticated(true);
                setUser(storedUser);

                // SYNC CHECK: Verify status with backend
                try {
                    const response = await usersApi.getById(storedUser.id);
                    const verifiedUser = (response as any).data || response;

                    const isBanned = verifiedUser.banned === true || 
                                     String(verifiedUser.banned).toLowerCase() === 'true' || 
                                     Number(verifiedUser.banned) === 1;

                    if (isBanned) {
                        AuthService.triggerAuthError();
                        return;
                    }

                    setUser(verifiedUser);
                    AuthService.setUser(verifiedUser);
                } catch (e) {
                    console.error("Auth sync failed", e);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } finally {
            // Initialize Theme
            if (typeof window !== 'undefined') {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    setIsDarkMode(true);
                    document.documentElement.classList.add('dark');
                } else {
                    setIsDarkMode(false);
                    document.documentElement.classList.remove('dark');
                }
            }
            setIsLoading(false);
        }
    };

    initAuth();
  }, []);

  const login = useCallback((userData: User) => {
    setIsAuthenticated(true);
    setUser(userData);
    AuthService.setUser(userData);
  }, []);

  const updateUser = useCallback((userData: User) => {
      setUser(userData);
      AuthService.setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      AuthService.clearAuth();
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isDarkMode,
    login,
    logout,
    updateUser,
    toggleTheme
  };
};