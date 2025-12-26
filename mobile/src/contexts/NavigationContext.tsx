import React, { createContext, useContext, ReactNode } from 'react';
import { NavigationService } from '@/src/lib/navigation';

interface NavigationContextType {
  navigate: typeof NavigationService;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  return (
    <NavigationContext.Provider value={{ navigate: NavigationService }}>
      {children}
    </NavigationContext.Provider>
  );
};