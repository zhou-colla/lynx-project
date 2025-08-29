import { useState } from '@lynx-js/react'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'
import type { ReactNode } from '@lynx-js/react';

import { NavigationProvider } from './components/NavigationContext.jsx';
import { useNavigation } from './components/NavigationContext.jsx';

import { App } from './App.jsx'
import { ChatDisplay } from './components/ChatPage/ChatDisplay.jsx'
import { Memory } from './components/MemoryPage/MemoryDisplay.js'
import { ChatSession } from './components/ChatSession/ChatSession.jsx'
import { MenuPage } from './components/MenuPage/MenuDisplay.jsx'

import './index.css'

function SafeAreaWrapper({ children }: { children: ReactNode }) {
  return (
    <view className="safe-area-wrapper">
      {children}
    </view>
  );
}

function MainApp() {
  // Use the hook to get the state from the NavigationProvider
  const { currentPage } = useNavigation();
  
  // The rest of your logic remains the same, but without the need for setCurrentPage
  if (currentPage === 'home') {
    return <App />; // No more onNavigateTo prop
  } else if (currentPage === 'chatdisplay') {
    return <ChatDisplay chatID="chat-1" />; // No more setCurrentPage prop
  } else if (currentPage === 'memory') {
    return <Memory />;
  } else if (currentPage === 'chatsession') {
    return <ChatSession />;
  } else if (currentPage === 'menudisplay') {
    return <MenuPage />;
  }

  return <view><text>404 Page Not Found</text></view>;
}


root.render(
  <NavigationProvider>
    <SafeAreaWrapper>
      <MainApp />
    </SafeAreaWrapper>
  </NavigationProvider>
);



if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}