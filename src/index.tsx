import { useState } from '@lynx-js/react'
import '@lynx-js/react/debug'
import { root } from '@lynx-js/react'

import { App } from './App.jsx'
import { ChatDisplay } from './components/ChatPage/ChatDisplay.jsx'
import { Memory } from './components/MemoryPage/MemoryDisplay.js'
import { ChatSession } from './components/ChatSession/ChatSession.jsx'

function MainApp() {
  const [currentPage, setCurrentPage] = useState('home');
  
  if (currentPage === 'home') {
    return <App onNavigateTo={setCurrentPage} />;
  } else if (currentPage === 'chatdisplay') {
    return <ChatDisplay chatID="chat-1" />;
  } else if (currentPage === 'memory') {
    return <Memory />;
  }else if (currentPage === 'chatsession') {
    return <ChatSession />;
  }

  return <view><text>404 Page Not Found</text></view>;
}


root.render(<MainApp />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}