// ChatDisplay.tsx
import { useEffect, useState } from '@lynx-js/react'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import { UserChatBubble } from './UserChatBubble.js'
import { AssistantChatBubble } from './AssistantChatBubble.js'
import { NavBar } from '../TopBar/NavBar.js'
import { MemoryBar } from '../TopBar/MemoryBar.js'
import './Chat.css'
// Import the interfaces from your new file
import type { ChatData, Chat, ChatMessage } from "../../data/types.ts";
import data from "../../data/chats.json" with { type: "json" };
const chatData: ChatData = data;

export function ChatDisplay(props: { chatID: string }) {
  const [messages, setMessages] = useState<typeof chatData.chats[0]["messages"]>([])

  const [memoryID, setMemoryID] = useState("")

  useEffect(() => {
    const chat = chatData.chats.find((c: Chat) => c.chatID === props.chatID)
    if (chat) {
      setMessages(chat.messages);
      setMemoryID(chat.memoryID);
    }
  }, [props.chatID])

  

  return (
    // add navigation bar here
    // input box also put here + reply logic
    // thinking of how to handle the situation when messages is empty list
    // later need to change the message part as scrollable part
    <view>
      <NavBar />
      <MemoryBar memoryID={memoryID} setMemoryID={setMemoryID}/>
      <view className="chat-display">
        {messages.length === 0 ? (
          <text className="centered-text">What can I help with</text>
        ) : (
          messages.map((msg: ChatMessage) =>
            msg.role === "user" ? (
              <UserChatBubble key={msg.messageID} text={msg.text} />
            ) : (
              <AssistantChatBubble key={msg.messageID} text={msg.text} />
            )
          )
        )}
      </view>
    </view>
    
  )
}
