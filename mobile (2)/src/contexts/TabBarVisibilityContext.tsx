import React, { createContext, useContext } from 'react';
import { SharedValue, useSharedValue } from 'react-native-reanimated';

type ContextType = {
  translateY: SharedValue<number>;
};

const TabBarVisibilityContext = createContext<ContextType | null>(null);

export function TabBarVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const translateY = useSharedValue(0); // 0 = visible

  return (
    <TabBarVisibilityContext.Provider value={{ translateY }}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) {
    throw new Error('useTabBarVisibility must be used inside TabBarVisibilityProvider');
  }
  return ctx;
}
