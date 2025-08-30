// NavigationContext.tsx

import { createContext, useState, useContext } from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

// 1. Define interface with params support
interface NavigationContextType {
  currentPage: string;
  params: any;
  setCurrentPage: (page: string) => void;
  navigate: (page: string, params?: any) => void;

  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
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
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [lastChatIdWhenMenuOpened, setLastChatIdWhenMenuOpened] = useState<string>("");

  const navigate = (page: string, newParams?: any) => {
    setCurrentPage(page);
    setParams(newParams || null);
  };

  
  const openMenu = () => {
    if (currentPage === "chatdisplay") {
      setLastChatIdWhenMenuOpened(params?.chatID || "");
    } else {
      setLastChatIdWhenMenuOpened("");
    }
    setIsMenuOpen(true);
  };
  const closeMenu = () => setIsMenuOpen(false);

  const handleDeleteChat = (id: string) => {
    if (lastChatIdWhenMenuOpened === id) {
      navigate("createchat"); // menu still opening
    }
  };

  const value: NavigationContextType = { 
    currentPage,
    setCurrentPage,
    params, 
    navigate,
    isMenuOpen,
    openMenu,
    closeMenu,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
