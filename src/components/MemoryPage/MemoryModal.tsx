import { useState, useEffect } from '@lynx-js/react'

import './MemoryDisplay.css'

export function MemoryModal(props: {
  title: string
  initialName?: string
  initialContent?: string
  onConfirm: (name: string, content: string) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(props.initialName || '')
  const [content, setContent] = useState(props.initialContent || '')

  useEffect(() => {
    setName(props.initialName || '')
    setContent(props.initialContent || '')
  }, [props.initialName, props.initialContent])

  return (
    <view className="AddMemoryModal">
      <view>
        <text>Memory name</text>
        <input
          value={name}
          placeholder={name}
          bindinput={e => setName(e.detail.value)}
        />
      </view>
      <view>
        <text>Memory content</text>
        <textarea
          value={content}
          placeholder={content}
          bindinput={e => setContent(e.detail.value)}
          rows={1}
        />
      </view>
      <view className="ButtonRow">
        <view bindtap={() => props.onConfirm(name, content)}><text>Confirm</text></view>
        <view bindtap={props.onCancel}><text>Cancel</text></view>
      </view>
    </view>
  )
}