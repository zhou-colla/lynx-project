// ChatDisplay.tsx
import { useEffect, useState } from '@lynx-js/react';
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import { UserChatBubble } from './UserChatBubble.js';
import { AssistantChatBubble } from './AssistantChatBubble.js';
import { NavBar } from '../TopBar/NavBar.js';
import { MemoryBar } from '../TopBar/MemoryBar.js';
import './Chat.css';

// Import chat session
import ChatHistory from '../ChatSession/ChatHistory.js';
import type { ChatEntry } from '../ChatSession/ChatHistory.js';

// Import static chat data (optional for memoryID)
import type { ChatData, Chat } from "../../data/types.ts";
import data from "../../data/chats.json" with { type: "json" };
const chatData: ChatData = data;

export function ChatDisplay(props: { chatID: string }) {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [memoryID, setMemoryID] = useState("");
  const [isLoadingChatHistory, setIsLoadingChatHistory] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // Load chat from Firebase
        // To Sirui: If you wanna test it change 1 below to chatID
        const chatInstance = await ChatHistory.loadFromFirebase(1, "title");
        const history = chatInstance.getHistory();
        setMessages(history);

        // Optionally set memoryID from static chat data (isn't this compulsory?)
        const chat: Chat | undefined = chatData.chats.find((c: Chat) => c.chatID === props.chatID); 
        if (chat) setMemoryID(chat.memoryID);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([]);
      } finally {
        setIsLoadingChatHistory(false);
      }
    };

    fetchChatHistory();
  }, [props.chatID]);

  if (isLoadingChatHistory) {
    return <text className="centered-text">Loading chat history...</text>;
  } // newly added

  const lastIndex : number = (messages.length)-1
 
  return (
    <view>
      <NavBar />
      <MemoryBar memoryID={memoryID} setMemoryID={setMemoryID} />
      <view className="dialog-display-and-input">
        <list 
        className="dialog-display"
        scroll-orientation="vertical"
        initial-scroll-index={lastIndex}
      >
        {messages.length === 0 ? (
          <list-item item-key="empty">
            <text className="centered-text">What can I help with</text>
          </list-item>
        ) : (
          messages.map((msg: ChatEntry, index) => (
            <list-item 
              key={index}
              item-key={index.toString()}
              className="dialog-list-item"
            >
              {msg.role === "user" ? (
                <UserChatBubble text={msg.parts[0].text} />
              ) : (
                <AssistantChatBubble text={msg.parts[0].text} />
              )}
            </list-item>
          ))
        )}
      </list>
      </view>
    </view>
  );
}
