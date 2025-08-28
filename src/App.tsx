import { useCallback, useEffect, useState } from '@lynx-js/react'
import { useNavigate } from 'react-router'

import './App.css'
import arrow from './assets/arrow.png'
import lynxLogo from './assets/lynx-logo.png'
import reactLynxLogo from './assets/react-logo.png'

export function App(props: {
  onRender?: () => void
}) {
  const [alterLogo, setAlterLogo] = useState(false)
  const [response, setResponse] = useState('')
  const [message, setMessage] = useState('Hello Default Greeting')
  const nav = useNavigate();

  useEffect(() => {
    console.info('Hello, ReactLynx')
  }, [])
  props.onRender?.()

    // Send message to echo server
  const onSend = useCallback(async () => {
    // if (!message.trim()) return
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

  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(prevAlterLogo => !prevAlterLogo)
  }, [])

  return (
    <view>
      <view className='Background' />
      <view className='App'>
        <view className='Banner'>
          <view className='Logo' bindtap={onTap}>
            {alterLogo
              ? <image src={reactLynxLogo} className='Logo--react' />
              : <image src={lynxLogo} className='Logo--lynx' />}
          </view>
          <text className='Title'>React</text>
          <text className='Subtitle'>on Lynx</text>
        </view>
        <view className='Content'>
          <image src={arrow} className='Arrow' />
          <text className='Description'>Tap the logo and have fun!</text>
          <text className='Hint'>
            Edit<text
              style={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              {' src/App.tsx '}
            </text>
            to see updates!
          </text>
        </view>

        {/* Send button */}
        <view
          className='send-button'
          bindtap={onSend}
        >
          <text style={{ color: '#fff', fontSize: 20 }}>Send</text>
        </view>

        <view className='Response'>
          <text className='Response-Title'>Response:</text>
          <text className='Response-Message'>{response}</text>
        </view>

        <view
          className='Memory'
          bindtap={() => nav('/memory')}
        >
          <text>Memory</text>'
        </view>

        <view style={{ flex: 1 }} />
      </view>
    </view>
  )
}
