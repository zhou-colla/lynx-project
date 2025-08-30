import { useState } from '@lynx-js/react'
import './CreateChatDisplay.css'
import { NavBar } from '../TopBar/NavBar.js'

const availableFolders = ['Personal', 'Work', 'Ideas', 'Archive']
const availableMemories = [
    { memoryID: '1', memoryName: 'Default Memory' },
    { memoryID: '2', memoryName: 'Project Ideas' },
    { memoryID: '3', memoryName: 'Travel Plans' },
    { memoryID: '3', memoryName: 'Travel Plans' },
    { memoryID: '3', memoryName: 'Travel Plans' },
    { memoryID: '3', memoryName: 'Travel Plans' },
    { memoryID: '3', memoryName: 'Travel Plans' },
]

export function CreateChatDisplay() {
    const [folder, setFolder] = useState<string>('')
    const [folderDropdown, setFolderDropdown] = useState(false)
    const [chatTitle, setChatTitle] = useState<string>('')
    const [memory, setMemory] = useState<string>('')
    const [memoryDropdown, setMemoryDropdown] = useState(false)

    const handleCreateChat = () => {
        console.log({ folder, chatTitle, memory })
        setFolder('')
        setChatTitle('')
        setMemory('')
    }

    return (
        <view>
            <NavBar />
            <view className="create-chat-container">
                <view className="create-chat-card">
                    <text className="create-chat-title">Create a New Chat</text>

                    {/* Folder Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Select Folder</text>
                        <view className="dropdown-bar" bindtap={() => setFolderDropdown(!folderDropdown)}>
                            <text className="dropdown-text">
                                {folder || "Select a folder"}
                            </text>
                            <text className="dropdown-chevron">{folderDropdown ? "▼" : "▶"}</text>
                        </view>
                        {folderDropdown && (
                            <scroll-view
                                scroll-orientation="vertical"
                                style={{ width: "100%", maxHeight: "140px" }}
                                className="dropdown-list"
                            >
                                <view>
                                    {availableFolders.map(f => (
                                        <view
                                            key={f}
                                            className={`dropdown-list-item${folder === f ? ' selected' : ''}`}
                                            bindtap={() => {
                                                setFolder(f)
                                                setFolderDropdown(false)
                                            }}
                                        >
                                            <text className="dropdown-list-text">{f}</text>
                                        </view>
                                    ))}
                                </view>
                            </scroll-view>
                        )}
                    </view>

                    {/* Chat Title Input */}
                    <view className="form-group">
                        <text className="form-label">Chat Title</text>
                        <input
                            className="form-input"
                            value={chatTitle}
                            placeholder="Enter chat title"
                            bindinput={e => setChatTitle(e.detail.value)}
                        />
                    </view>

                    {/* Memory Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Select Memory</text>
                        <view className="dropdown-bar" bindtap={() => setMemoryDropdown(!memoryDropdown)}>
                            <text className="dropdown-text">
                                {memory
                                    ? availableMemories.find(m => m.memoryID === memory)?.memoryName
                                    : "Select a memory"}
                            </text>
                            <text className="dropdown-chevron">{memoryDropdown ? "▼" : "▶"}</text>
                        </view>
                        {memoryDropdown && (
                            <scroll-view
                                scroll-orientation="vertical"
                                style={{ width: "100%", maxHeight: "140px" }}
                                className="dropdown-list"
                            >
                                <view>
                                    {availableMemories.map(m => (
                                        <view
                                            key={m.memoryID}
                                            className={`dropdown-list-item${memory === m.memoryID ? ' selected' : ''}`}
                                            bindtap={() => {
                                                setMemory(m.memoryID)
                                                setMemoryDropdown(false)
                                            }}
                                        >
                                            <text className="dropdown-list-text">{m.memoryName}</text>
                                        </view>
                                    ))}
                                </view>
                            </scroll-view>
                        )}
                    </view>

                    {/* Create Chat Button */}
                    <view className="form-actions">
                        <view
                            className={`create-chat-btn${!folder || !chatTitle || !memory ? ' disabled' : ''}`}
                            bindtap={(!folder || !chatTitle || !memory) ? undefined : handleCreateChat}
                        >
                            <text>Create Chat</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    )
}