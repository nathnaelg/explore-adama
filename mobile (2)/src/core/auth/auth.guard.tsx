import { LoadingScreen } from '@/src/components/feedback/LoadingScreen';
import { useAuth } from '@/src/features/auth/contexts/AuthContext';
import { router } from 'expo-router';
import React, { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Use replace to prevent going back to the protected page
      router.replace('/(auth)/login');
    }
  }, [isLoading, isAuthenticated]);

  // Show loading while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Return null while redirecting or if not authenticated
  if (!isAuthenticated) {
    return null; // or you can return a loading indicator
  }

  // User is authenticated, render children
  return <>{children}</>;
};