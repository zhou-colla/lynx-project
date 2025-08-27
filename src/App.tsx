import { useState, useCallback, useEffect } from 'react'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App(props: { onRender?: () => void }) {
  const [alterLogo, setAlterLogo] = useState(false)
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  useEffect(() => {
    console.info('Hello, ReactLynx')
    props.onRender?.()
  }, [])

  // Toggle logo
  const onTap = useCallback(() => {
    setAlterLogo(prev => !prev)
  }, [])

  // Send message to echo server
  const onSend = useCallback(async () => {
    if (!message.trim()) return
    try {
      const res = await fetch('https://postman-echo.com/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ msg: message }),
      })
      const data = await res.json()
      setResponse(data.json?.msg || 'No echo response')
    } catch (err) {
      setResponse('Error: ' + (err as Error).message)
    }
  }, [message])

  return (
    <view>
      {/* Background */}
      <view className='Background' />

      <view className='App'>
        {/* Banner with logo */}
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          <text className='Title'>React</text>
          <text className='Subtitle'>on Lynx</text>
        </view>

        {/* Description section */}
        <view className='Content'>
          <image src={arrow} className='Arrow' />
          <text className='Description'>Tap the logo and have fun!</text>
          <text className='Hint'>
            Edit <text style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>
              src/App.tsx
            </text> to see updates!
          </text>
        </view>

        {/* Input box */}
        <input
          className='TextInput'
          placeholder="Type a message..."
          value={message}
          bindinput={(res: any) => setMessage(res.detail.value)}
        />

        {/* Send button */}
        <view
          className='send-button'
          bindtap={onSend}
        >
          <text style={{ color: '#fff', fontSize: 20 }}>Send</text>
        </view>

        {/* Response display */}
        <view style={{ marginTop: 20 }}>
          <text> Echoed Response</text>
          <text className='response-box'>{response}</text>
        </view>

        <view style={{ flex: 1 }} />
      </view>
    </view>
  )
}
