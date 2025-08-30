// ChatDisplay.tsx
import { useEffect, useState, useCallback, useLynxGlobalEventListener } from '@lynx-js/react';
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import { UserChatBubble } from './UserChatBubble.js';
import { AssistantChatBubble } from './AssistantChatBubble.js';
import { NavBar } from '../TopBar/NavBar.js';
import { MemoryBar } from '../TopBar/MemoryBar.js';
import CrossIcon from '../../assets/cross-icon.png';
import { GEMINI_API_KEY } from "../../Env.js";
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
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessageText, setReplyMessageText] = useState("");
  const [chatInstance, setChatInstance] = useState<ChatHistory | null>(null);
  const [message, setMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('Ask me any question');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useLynxGlobalEventListener(
    "keyboardstatuschanged",
    (status, height) => {
      setKeyboardHeight(status === "on" ? height : 0);
    }
  );

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatIdNum = parseInt(props.chatID);
        const chatInstance = await ChatHistory.loadFromFirebase(chatIdNum, "title");
        setChatInstance(chatInstance);
        setMessages(chatInstance.getHistory());
        setMemoryID(chatInstance.getMemory().id);

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

  const lastIndex: number = (messages.length) - 1


  const onSend = useCallback(async () => {
    if (isLoadingChatHistory || !chatInstance) {
      return;
    }

    if (!message.trim()) {
      setPlaceholder('⚠️ Empty messages are not allowed');
      return;
    }
    setPlaceholder('')

    chatInstance.addUserMessage(message);
    setMessages([...chatInstance.getHistory()]); // update UI immediately

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: chatInstance.getPrompt(),
          }),
        }
      );

      const data = await res.json();
      console.log('Gemini raw response:', data);

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from Gemini';

      chatInstance.addModelMessage(reply);
      setMessages([...chatInstance.getHistory()]); // refresh UI

      await chatInstance.saveToFirebase();

      setMessage('');
    } catch (err) {
      setMessage('Error: ' + (err as Error).message);
    }
  }, [chatInstance, message, isLoadingChatHistory]);

  // 100px is for NavBar
  return (
    <view className="page-container">
      <NavBar />
      <MemoryBar memoryID={memoryID} setMemoryID={setMemoryID} />
      <view className="dialog-display-and-input"
        style={{
          marginBottom: `${keyboardHeight}px`
        }}
      >
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
                  <AssistantChatBubble
                    text={msg.parts[0].text}
                    chatInstance={chatInstance}
                    setIsReplying={setIsReplying}
                    setReplyMessageText={setReplyMessageText} />
                )}
              </list-item>
            ))
          )}
        </list>
        {/* Let the optional text only show the first five line and scrollable*/}
        {isReplying && (
          <view className="optional-reply-bar">
            <scroll-view className="optional-text">
              <text>{replyMessageText}</text>
            </scroll-view>
            <image
              src={CrossIcon}
              className="close-reply-icon"
              bindtap={() => {
                setIsReplying(false);
                setReplyMessageText("");
                chatInstance?.setReplying(false);

              }}
            />
          </view>
        )}
        <view className="input-box-container">
          <input
            value={message}
            placeholder={placeholder}
            bindinput={e => setMessage(e.detail.value)}
          />
          <view
            className="send-button"
            bindtap={onSend}
          >
            <text className='send-button-text'>Send</text>
          </view>
        </view>
      </view>
    </view>
  );
}
