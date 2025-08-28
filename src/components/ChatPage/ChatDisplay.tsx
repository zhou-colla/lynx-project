import { useEffect, useState } from '@lynx-js/react'
import { UserChatBubble } from './UserChatBubble.js'
import { AssistantChatBubble } from './AssistantChatBubble.js'
import './Chat.css'
// Import the interfaces from your new file
import type { ChatData, Chat, ChatMessage } from "../../data/types.ts";
import data from "../../data/chats.json" with { type: "json" };
const chatData: ChatData = data;

export function ChatDisplay(props: { chatID: string }) {
  const [messages, setMessages] = useState<typeof chatData.chats[0]["messages"]>([])

  useEffect(() => {
    const chat = chatData.chats.find((c: Chat) => c.chatID === props.chatID)
    if (chat) {
      setMessages(chat.messages)
    }
  }, [props.chatID])

  return (
    // add navigation bar here
    // input box also put here + reply logic
    // thinking of how to handle the situation when messages is empty list
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
  )
}
