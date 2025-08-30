// NavigationContext.tsx

import { createContext, useState, useContext } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

// 1. Define interface with params support
interface NavigationContextType {
  currentPage: string;
  params: any;
  setCurrentPage: (page: string) => void;
  navigate: (page: string, params?: any) => void;
}

// 2. Create context
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
  const [params, setParams] = useState<any>(null);

  const navigate = (page: string, newParams?: any) => {
    setCurrentPage(page);
    setParams(newParams || null);
  };

  const value: NavigationContextType = { 
    currentPage, 
    params, 
    setCurrentPage, 
    navigate 
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
