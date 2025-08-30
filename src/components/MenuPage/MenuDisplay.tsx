import { useState, useEffect } from '@lynx-js/react'
import './MenuDisplay.css'
import { Folder } from './Folder.js'

export function MenuPage() {
  const [openFolder, setOpenFolder] = useState<number | null>(null)
  const [openMemory, setOpenMemory] = useState<string | null>('Default Memory')
  const [folders, setFolders] = useState<Folder[]>([])

  useEffect(() => {
    async function loadFolders() {
      const allFolders = await Folder.getAllFromFirebase()
      setFolders(allFolders)
    }
    loadFolders()
  }, [])

  const handleCreateNewFolder = async () => {
    const nextFolderId = folders.length > 0 ? Math.max(...folders.map(f => f.id)) + 1 : 1
    const newFolderName = `Folder ${nextFolderId}`
    const newFolder = new Folder(nextFolderId, newFolderName)

    await newFolder.saveToFirebase()
    setFolders([...folders, newFolder])
  }

  const handleDeleteFolder = async (folderId: number) => {
    const folderToDelete = folders.find(folder => folder.id === folderId)
    if (folderToDelete) {
      setFolders(folders.filter(folder => folder.id !== folderId))

      try {
        await folderToDelete.deleteFromFirebase()
      } catch (error) {
        console.error('Failed to delete folder from Firebase:', error)
      }
    }
  }

  const handleCreateNewChat = async () => {
    if (folders.length > 0) {
      const folderToUpdate = folders[0]
      const nextChatId = folderToUpdate.chats.length > 0 ? Math.max(...folderToUpdate.chats.map(chat => chat.id)) + 1 : 1
      const newChat = {
        id: nextChatId,
        title: `New Chat ${nextChatId}`,
      }

      const updatedChats = [...folderToUpdate.chats, newChat]
      const updatedFolder = new Folder(folderToUpdate.id, folderToUpdate.name, updatedChats)
      
      try {
        // Use the new method to update just the chats array
        await updatedFolder.updateChatsInFirebase()
        setFolders(folders.map(folder => 
          folder.id === updatedFolder.id ? updatedFolder : folder
        ))
      } catch (error) {
        console.error('Failed to update folder with new chat:', error)
      }
    }
  }

  return (
    <view className="menu-container">
      <view className="menu-header">
        <text className="menu-title">Menu</text>
        <view className="close-btn">✕</view>
      </view>

      <view className="menu-actions">
        <view className="menu-action" bindtap={handleCreateNewChat}>＋ New chat</view>
        <view className="menu-action">🧠 My Memory</view>
      </view>

      <view className="menu-section">
        <view className="chats-header">
          <text className="section-title">Chats</text>
          <view className="add-folder" bindtap={handleCreateNewFolder}>
            <image
              className="add-folder__icon"
              src={require('../../assets/add-icon-circle.png')}
            />
          </view>
        </view>
        {folders.map(folder => (
          <view key={folder.id} className="folder">
            <view className="folder-header">
              <view
                bindtap={() => setOpenFolder(openFolder === folder.id ? null : folder.id)}
                style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}
              >
                <text>{folder.name}</text>
                <text style={{ marginLeft: '8px' }}>{openFolder === folder.id ? '▾' : '▸'}</text>
              </view>
              <view
                className="chat-options"
                bindtap={() => handleDeleteFolder(folder.id)}
              >
                <text>DELETE</text>
              </view>
            </view>
            {openFolder === folder.id && (
              <view className="folder-chats">
                {folder.chats.length === 0 ? (
                  <text className="empty-text">No chats</text>
                ) : (
                  folder.chats.map(chat => (
                    <view key={chat.id} className="chat-item">
                      <text>{chat.title}</text>
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