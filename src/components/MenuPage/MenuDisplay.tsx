import { useState } from '@lynx-js/react'
import './MenuDisplay.css'

export function MenuPage() {
  const [openFolder, setOpenFolder] = useState<string | null>(null)
  const [openMemory, setOpenMemory] = useState<string | null>('Default Memory')

  const folders = [
    { name: 'Folder 1', chats: ['Chat 1', 'Chat 2'] },
    { name: 'Folder 2', chats: [] },
    { name: 'Folder 3', chats: ['Chat 3'] },
  ]

  return (
    <view className="menu-container">
      {/* Header */}
      <view className="menu-header">
        <text className="menu-title">Menu</text>
        <view className="close-btn">✕</view>
      </view>

      {/* New Chat + My Memory */}
      <view className="menu-actions">
        <view className="menu-action">＋ New Chat</view>
        <view className="menu-action">🧠 My Memory</view>
      </view>

      {/* Chat Folders */}
      <view className="menu-section">
        <text className="section-title">Chats</text>
        {folders.map((folder, idx) => (
          <view key={idx} className="folder">
            <view
              className="folder-header"
              bindtap={() =>
                setOpenFolder(openFolder === folder.name ? null : folder.name)
              }
            >
              <text>{folder.name}</text>
              <text>{openFolder === folder.name ? '▾' : '▸'}</text>
            </view>
            {openFolder === folder.name && (
              <view className="folder-chats">
                {folder.chats.length === 0 ? (
                  <text className="empty-text">No chats</text>
                ) : (
                  folder.chats.map((chat, cIdx) => (
                    <view key={cIdx} className="chat-item">
                      <text>{chat}</text>
                      <view className="chat-options">⋮</view>
                    </view>
                  ))
                )}
              </view>
            )}
          </view>
        ))}
      </view>
    </view>
  )
}
