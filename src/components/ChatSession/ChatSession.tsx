import { useCallback, useState } from '@lynx-js/react'
import ChatHistory from './ChatHistory.js';
import { GEMINI_API_KEY } from "../../Env.js";
import './ChatSession.css'

const chatHistory = new ChatHistory(1, 'dummychat');

export function ChatSession() {  
  const [response, setResponse] = useState('')
  const [message, setMessage] = useState('')
  

const onSend = useCallback(async () => {
  if (!message.trim()) {
    setResponse('Warning: Empty messages are not allowed')
    return
  }

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
    )

    const data = await res.json()
    console.log('Gemini raw response:', data)

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No response from Gemini'
  
    chatHistory.addModelMessage(reply);
    chatHistory.saveToFirebase();

    setResponse(reply)
    setMessage('') // Clear input
  } catch (err) {
    setResponse('Error: ' + (err as Error).message)
  }
}, [message])

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
  )
}