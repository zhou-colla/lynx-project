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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        // Load chat from Firebase
        const chatInstance = await ChatHistory.loadFromFirebase(1, "title");
        const history = chatInstance.getHistory();
        setMessages(history);

        // Optionally set memoryID from static chat data
        const chat: Chat | undefined = chatData.chats.find((c: Chat) => c.chatID === props.chatID);
        if (chat) setMemoryID(chat.memoryID);
      } catch (err) {
        console.error("Failed to load chat history:", err);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [props.chatID]);

  if (isLoading) {
    return <text>Loading chat history...</text>;
  }

  return (
    <view>
      <NavBar />
      <MemoryBar memoryID={memoryID} setMemoryID={setMemoryID} />
      <view className="chat-display">
        {messages.length === 0 ? (
          <text className="centered-text">What can I help with</text>
        ) : (
          messages.map((msg: ChatEntry, index) =>
            msg.role === "user" ? (
              <UserChatBubble key={index} text={msg.parts[0].text} />
            ) : (
              <AssistantChatBubble key={index} text={msg.parts[0].text} />
            )
          )
        )}
      </view>
    </view>
  );
}
