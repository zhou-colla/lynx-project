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
import { CreateChatDisplay } from './components/CreateChatPage/CreateChatDisplay.jsx'

import './index.css'

function MenuOverlay() {
  const { isMenuOpen, closeMenu } = useNavigation();

  if (!isMenuOpen) return null;

  return (
    <view className="menu-overlay" bindtap={closeMenu}>
      <view
        className="menu-container"
        bindtap={(e) => e.stopPropagation()} // 阻止冒泡，点击菜单本身不会关闭
      >
        <MenuPage />
      </view>
    </view>
  );
}

function SafeAreaWrapper({ children }: { children: ReactNode }) {
  return (
    <view className="safe-area-wrapper">
      {children}
    </view>
  );
}

function MainApp() {
  const { currentPage } = useNavigation();

  return (
    <view className="app-container">
      {currentPage === "home" && <App />}
      {currentPage === "chatdisplay" && <ChatDisplay chatID="chat-1" />}
      {currentPage === "memory" && <Memory />}
      {currentPage === "chatsession" && <ChatSession />}
      {currentPage === "createchat" && <CreateChatDisplay />}
      <MenuOverlay />
    </view>
  );
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