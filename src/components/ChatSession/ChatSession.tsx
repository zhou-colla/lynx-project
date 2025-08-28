import { useCallback, useState } from '@lynx-js/react'
import './ChatSession.css'

export function ChatSession() {
  const [response, setResponse] = useState('')
  const [message, setMessage] = useState('')
  
  const onSend = useCallback(async () => {
    if (!message.trim()) {
      setResponse('Warning: Empty messages are not allowed')
      return
    }
    
    try {
      const res = await fetch('https://postman-echo.com/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: message }),
      })
      const data = await res.json()
      setResponse(data.json?.msg || 'No echo response')
      // Clear input after sending
      setMessage('')
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