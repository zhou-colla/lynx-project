// NavigationContext.tsx

import { createContext, useState, useContext } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

// 1. Define interface
interface NavigationContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

// 2. Create context, with the interface as a generic type parameter
const NavigationContext = createContext<NavigationContextType | null>(null);

// 3. Create a custom hook
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === null) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

// 4. Create the Provider component
interface NavigationProviderProps {
  children: ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const value: NavigationContextType = { currentPage, setCurrentPage };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

