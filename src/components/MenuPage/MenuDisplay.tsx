import { useState, useEffect } from '@lynx-js/react'
import './MenuDisplay.css'
import { Folder } from './Folder.js'
import { FIREBASE_DB } from '../../Env.js'

import EditIcon from '../../assets/edit-icon.png';
import DeleteIcon from '../../assets/delete-icon.png';
import CrossIcon from '../../assets/cross-icon.png';
import AddIcon from '../../assets/menu-add-icon.png';
import MemoryIcon from '../../assets/memory-icon.png';

import { MenuChat } from './MenuChat.js';

import { useNavigation } from '../NavigationContext.jsx';

interface ChatMetadata {
  id: number
  title: string
  folderId?: number
}

export function MenuPage() {
  const { navigate, setCurrentPage, closeMenu } = useNavigation();

  const [openFolder, setOpenFolder] = useState<number | null>(null)
  const [openMemory, setOpenMemory] = useState<string | null>('Default Memory')
  const [folders, setFolders] = useState<Folder[]>([])
  const [allChats, setAllChats] = useState<ChatMetadata[]>([])
  const [unassignedChats, setUnassignedChats] = useState<ChatMetadata[]>([])
  const [openDropdown, setOpenDropdown] = useState<number | null>(null)
  const [showEditDropdown, setShowEditDropdown] = useState<boolean>(false)
  const [renamingFolderId, setRenamingFolderId] = useState<number | null>(null)
  const [renameValue, setRenameValue] = useState<string>('')
  const [isRenameMode, setIsRenameMode] = useState<boolean>(false)

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
      setShowEditDropdown(false) // Close dropdown after creating
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

  const handleStartRename = (folderId: number, currentName: string) => {
    if (!isRenameMode) return // Only allow rename if in rename mode
    setRenamingFolderId(folderId)
    setRenameValue(currentName)
  }

  const handleEnterRenameMode = () => {
    setIsRenameMode(true)
    setShowEditDropdown(false)
  }

  const handleExitRenameMode = () => {
    setIsRenameMode(false)
    setRenamingFolderId(null)
    setRenameValue('')
  }

  const handleRenameFolder = async (folderId: number) => {
    if (!renameValue.trim()) return

    const folder = folders.find(f => f.id === folderId)
    if (!folder) return

    const updatedFolder = new Folder(folder.id, renameValue.trim(), folder.chats)

    try {
      await updatedFolder.saveToFirebase()
      setFolders(folders.map(f => f.id === folderId ? updatedFolder : f))
      setRenamingFolderId(null)
      setRenameValue('')
      console.log(`Renamed folder ${folderId} to "${renameValue.trim()}"`)
    } catch (error) {
      console.error('Failed to rename folder:', error)
    }
  }

  const handleCancelRename = () => {
    setRenamingFolderId(null)
    setRenameValue('')
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
        <image 
          className="close-btn-img" 
          src={CrossIcon} 
          style={{ width: "25px", height: "25px" }}
          bindtap={() => closeMenu()}
        />
      </view>

      <view class="menu-actions">
        <view class="menu-action" bindtap={() => {navigate("createchat"); closeMenu();}}>
          <image
              src={AddIcon}
              style={{ width: "40px", height: "40px", marginRight: "5px" }}
          />
          <text>Create New Chat</text>
        </view>
        <view class="menu-action" bindtap={() => {navigate("memory"); closeMenu();}}>
          <image
              src={MemoryIcon}
              style={{ width: "32px", height: "32px", marginLeft: "6px", marginRight: "8px" }}
          />
          <text>My Memory</text>
        </view>
      </view>

      <view className="menu-section">
        <scroll-view scroll-orientation="vertical" style={{ height: "100%", borderRadius: "10px" }}>
          <view className="chats-header">
            <text className="section-title">Chats ({folders.length} folders, {allChats.length} total chats)</text>

            {/* Show Done Renaming button when in rename mode */}
            {isRenameMode ? (
              <view className="done-renaming-btn" bindtap={handleExitRenameMode}>
                <text className="done-renaming-text">✓</text>
              </view>
            ) : (
              <view className="edit-folder-container">
                <view
                  className="edit-folder"
                  bindtap={() => setShowEditDropdown(!showEditDropdown)}
                >
                  <image
                    className="edit-folder__icon"
                    src={require('../../assets/edit-icon.png')}
                  />
                </view>
                {showEditDropdown && (
                  <view className="edit-dropdown-menu">
                    <view className="edit-dropdown-item" bindtap={handleCreateNewFolder}>
                      <text>➕ Add Folder</text>
                    </view>
                    <view className="edit-dropdown-divider"></view>
                    <view className="edit-dropdown-item" bindtap={handleEnterRenameMode}>
                      <text>✏️ Rename</text>
                    </view>
                  </view>
                )}
              </view>
            )}
          </view>

          {folders.map(folder => (
            <view key={folder.id} className="folder">
              <view className="folder-header">
                <view
                  bindtap={() => {
                    if (isRenameMode && renamingFolderId !== folder.id) {
                      handleStartRename(folder.id, folder.name)
                    } else if (!isRenameMode) {
                      setOpenFolder(openFolder === folder.id ? null : folder.id)
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                    cursor: isRenameMode ? 'pointer' : 'default'
                  }}
                >
                  {renamingFolderId === folder.id ? (
                    <view className="rename-input-container">
                      <input
                        className="rename-input"
                        value={renameValue}
                        placeholder="Enter folder name"
                        bindinput={(e: { detail: { value: string } }) => setRenameValue(e.detail.value)}
                      />
                      <view className="rename-actions">
                        <view
                          className="rename-action rename-save"
                          bindtap={() => handleRenameFolder(folder.id)}
                        >
                          <text>✓</text>
                        </view>
                        <view
                          className="rename-action rename-cancel"
                          bindtap={handleCancelRename}
                        >
                          <text>✕</text>
                        </view>
                      </view>
                    </view>
                  ) : (
                    <>
                      <text style={{
                        color: isRenameMode ? '#3b82f6' : 'inherit',
                        textDecoration: isRenameMode ? 'underline' : 'none'
                      }}>
                        {folder.name} ({folder.chats.length})
                      </text>
                      {!isRenameMode && (
                        <text style={{ marginLeft: '8px' }}>{openFolder === folder.id ? '▾' : '▸'}</text>
                      )}
                      {isRenameMode && (
                        <text style={{ marginLeft: '8px', fontSize: '12px', color: '#6b7280' }}>
                          Click to rename
                        </text>
                      )}
                    </>
                  )}
                </view>
                {renamingFolderId !== folder.id && !isRenameMode && (
                  <view
                    className="chat-options"
                    bindtap={() => handleDeleteFolder(folder.id)}
                  >
                    <text>DELETE</text>
                  </view>
                )}
              </view>
              {openFolder === folder.id && (
                <view className="folder-chats">
                  {folder.chats.length === 0 ? (
                    <text className="empty-text">No chats</text>
                  ) : (
                    folder.chats.map(chat => (
                      <MenuChat
                        chatID={chat.id}
                        chatTitle={chat.title}
                        folderId={folder.id}
                        onDelete={() => {
                          // Remove chat from folder in local state
                          setFolders(folders =>
                            folders.map(f =>
                              f.id === folder.id
                                ? new Folder(f.id, f.name, f.chats.filter(c => c.id !== chat.id))
                                : f
                            )
                          );
                          // Remove chat from allChats and unassignedChats if needed
                          setAllChats(allChats => allChats.filter(c => c.id !== chat.id));
                          setUnassignedChats(unassignedChats => unassignedChats.filter(c => c.id !== chat.id));
                        }} />
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
                <MenuChat
                  chatID={chat.id}
                  chatTitle={chat.title}
                  folderId={-1}
                  onDelete={() => {
                    setAllChats(allChats => allChats.filter(c => c.id !== chat.id));
                    setUnassignedChats(unassignedChats => unassignedChats.filter(c => c.id !== chat.id));
                  }} />
              ))}
            </view>
          )}

          {/* Debug info at bottom */}
          <view style={{ padding: '20px', background: '#f0f0f0', margin: '20px', borderRadius: '8px' }}>
            <text style={{ fontSize: '12px', color: '#666' }}>
              Debug: Folders={folders.length}, Chats={allChats.length}, Unassigned={unassignedChats.length}
            </text>
          </view>
        </scroll-view>
      </view>
    </view>
  )
}

/* Original unassigned chats
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

 */