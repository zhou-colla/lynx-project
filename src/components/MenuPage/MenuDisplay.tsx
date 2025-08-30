import { useState, useEffect } from '@lynx-js/react'
import './MenuDisplay.css'
import { Folder } from './Folder.js'
import { FIREBASE_DB } from '../../Env.js'

interface ChatMetadata {
  id: number
  title: string
  folderId?: number
}

export function MenuPage() {
  const [openFolder, setOpenFolder] = useState<number | null>(null)
  const [openMemory, setOpenMemory] = useState<string | null>('Default Memory')
  const [folders, setFolders] = useState<Folder[]>([])
  const [allChats, setAllChats] = useState<ChatMetadata[]>([])
  const [unassignedChats, setUnassignedChats] = useState<ChatMetadata[]>([])
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)

  useEffect(() => {
    async function loadData() {
      const allFolders = await Folder.getAllFromFirebase()
      const allChatsData = await loadAllChatsFromFirebase()
      
      setFolders(allFolders)
      setAllChats(allChatsData)
      
      // Get all chat IDs that are assigned to folders
      const assignedChatIds = new Set<number>()
      allFolders.forEach(folder => {
        folder.chats.forEach(chat => {
          assignedChatIds.add(chat.id)
        })
      })
      
      // Filter out chats that are already in folders
      const unassigned = allChatsData.filter(chat => !assignedChatIds.has(chat.id))
      setUnassignedChats(unassigned)
    }
    loadData()
  }, [])

  const handleCreateNewFolder = async () => {
    // Find the next available folder ID by checking what's already used
    const existingIds = folders.map(f => f.id)
    let nextFolderId = 1
    while (existingIds.includes(nextFolderId)) {
      nextFolderId++
    }
    
    const newFolderName = `Folder ${nextFolderId}`
    const newFolder = new Folder(nextFolderId, newFolderName)

    try {
      await newFolder.saveToFirebase()
      setFolders([...folders, newFolder])
      console.log(`Created new folder with ID ${nextFolderId}`)
    } catch (error) {
      console.error('Failed to create new folder:', error)
    }
  }

  const handleDeleteFolder = async (folderId: number) => {
    const folderToDelete = folders.find(folder => folder.id === folderId)
    if (folderToDelete) {
      try {
        await folderToDelete.deleteFromFirebase()
        setFolders(folders.filter(folder => folder.id !== folderId))
        console.log(`Deleted folder with ID ${folderId}`)
      } catch (error) {
        console.error('Failed to delete folder from Firebase:', error)
      }
    }
  }

  const loadAllChatsFromFirebase = async (): Promise<ChatMetadata[]> => {
    let loadedChats: ChatMetadata[] = [];
    let index = 1;
    let emptyCount = 0;
    
    while (true) {
      const res = await fetch(`${FIREBASE_DB}/chats/${index}.json`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!res.ok) break;
      
      const chatData = await res.json();
      if (!chatData || Object.keys(chatData).length === 0) {
        emptyCount++;
        if (emptyCount > 3) break;
        index++;
        continue;
      }
      
      // Use the actual chat title from Firebase, fallback to default
      const chatTitle = chatData.title || `Chat ${index}`;
      loadedChats.push({
        id: index,
        title: chatTitle,
      });
      index++;
    }
    
    return loadedChats;
  }

  const handleCreateNewChat = async () => {
    // Find next available chat ID
    const existingChatIds = allChats.map(chat => chat.id)
    let nextChatId = 1
    while (existingChatIds.includes(nextChatId)) {
      nextChatId++
    }
    
    const newChat: ChatMetadata = {
      id: nextChatId,
      title: `New Chat ${nextChatId}`,
    }
    
    // Add to unassigned chats
    setAllChats([...allChats, newChat])
    setUnassignedChats([...unassignedChats, newChat])
    
    console.log(`Created new chat with ID ${nextChatId}`)
  }

  const assignChatToFolder = async (chatId: number, folderId: number) => {
    const chat = allChats.find(c => c.id === chatId)
    if (!chat) return
    
    const folder = folders.find(f => f.id === folderId)
    if (!folder) return
    
    // Add chat to folder
    const updatedChats = [...folder.chats, { id: chat.id, title: chat.title }]
    const updatedFolder = new Folder(folder.id, folder.name, updatedChats)
    
    try {
      await updatedFolder.updateChatsInFirebase()
      
      // Update local state
      setFolders(folders.map(f => f.id === folderId ? updatedFolder : f))
      setUnassignedChats(unassignedChats.filter(c => c.id !== chatId))
      
      console.log(`Assigned chat ${chatId} to folder ${folderId}`)
    } catch (error) {
      console.error('Failed to assign chat to folder:', error)
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
          <text className="section-title">Chats ({folders.length} folders, {allChats.length} total chats)</text>
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
                <text>{folder.name} ({folder.chats.length})</text>
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
        
        {/* Unassigned Chats Section */}
        {unassignedChats.length > 0 && (
          <view className="unassigned-section">
            <view className="unassigned-header">
              <text className="section-title">Unassigned Chats ({unassignedChats.length})</text>
            </view>
            {unassignedChats.map(chat => (
              <view key={chat.id} className="chat-item unassigned-chat">
                <text>{chat.title}</text>
                <view className="chat-options">
                  <view 
                    className="dropdown-trigger"
                    bindtap={() => setOpenDropdown(openDropdown === chat.id ? null : chat.id)}
                  >
                    <text>Move ▾</text>
                  </view>
                  {openDropdown === chat.id && (
                    <view className="dropdown-menu">
                      {folders.map(folder => (
                        <view 
                          key={folder.id} 
                          className="dropdown-item"
                          bindtap={() => {
                            assignChatToFolder(chat.id, folder.id)
                            setOpenDropdown(null)
                          }}
                        >
                          <text>{folder.name}</text>
                        </view>
                      ))}
                    </view>
                  )}
                </view>
              </view>
            ))}
          </view>
        )}
        
        {/* Debug info at bottom */}
        <view style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
          <text style={{ fontSize: '12px', color: '#666' }}>
            Debug: Folders={folders.length}, Chats={allChats.length}, Unassigned={unassignedChats.length}
          </text>
        </view>
      </view>
    </view>
  )
}