import { useCallback, useState, useEffect } from '@lynx-js/react';
import ChatHistory from './ChatHistory.js';
import { GEMINI_API_KEY } from "../../Env.js";
import './ChatSession.css';

export function ChatSession() {  
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize chat history when component mounts
  useEffect(() => {
    const initChat = async () => {
      try {
        // CORRECT: Properly await the promise
        const history = await ChatHistory.loadFromFirebase(1, "title");
        setChatHistory(history);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        // Fallback to a local chat if Firebase fails
        setChatHistory(new ChatHistory(1, "Local Fallback Chat"));
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, []);

  const onSend = useCallback(async () => {
    if (isLoading || !chatHistory) {
      setResponse('Chat is still loading, please wait...');
      return;
    }
    
    if (!message.trim()) {
      setResponse('Warning: Empty messages are not allowed');
      return;
    }

    // CORRECT: Now chatHistory is a ChatHistory object, not a Promise
    chatHistory.addUserMessage(message);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: chatHistory.getHistory(),
          }),
        }
      );

      const data = await res.json();
      console.log('Gemini raw response:', data);

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from Gemini';
    
      chatHistory.addModelMessage(reply);
      
      // Save to Firebase (properly await the promise)
      await chatHistory.saveToFirebase();

      setResponse(reply);
      setMessage(''); // Clear input
    } catch (err) {
      setResponse('Error: ' + (err as Error).message);
    }
  }, [chatHistory, message, isLoading]);

  if (isLoading) {
    return <text>Loading chat history...</text>;
  }

  if (!chatHistory) {
    return <text>Failed to initialize chat. Please try again.</text>;
  }

  return (
    <view className="chat-container">
      <view className="chat-header">
        <text className="chat-title">Chat Session</text>
      </view>
      
      <view className="response-area">
        <text className="response-label">Response:</text>
        <text className="response-message">{response}</text>
      </view>
      
      <view className="input-container">
        <input
          className="chat-input"
          placeholder="Type your message..."
          value={message}
          bindinput={(e: any) => setMessage(e.detail.value)}
        />
        
        <view
          className="send-button"
          bindtap={onSend}
        >
          <text style={{ color: '#fff' }}>Send</text>
        </view>
      </view>
    </view>
  );
}