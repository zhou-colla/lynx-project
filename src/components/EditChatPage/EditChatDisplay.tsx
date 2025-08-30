import { useState, useEffect } from '@lynx-js/react'
import '../CreateChatPage/CreateChatDisplay.css'
import { NavBar } from '../TopBar/NavBar.js'
import type { Memory, Folder, Chat } from '../../data/types.ts';
import { defaultMemory } from '../MemoryPage/MemoryDisplay.js';
import { useNavigation } from '../NavigationContext.js';
import { FIREBASE_DB } from '../../Env.js'
import ChatHistory from '../ChatSession/ChatHistory.js';

interface EditChatDisplayProps {
    folderID: string;
    chatID: string;
    chatTitle: string;
}

export function EditChatDisplay({ folderID, chatID, chatTitle }: EditChatDisplayProps) {
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
    const [folderDropdown, setFolderDropdown] = useState(false)
    const [editedTitle, setEditedTitle] = useState<string>(chatTitle)
    const [selectedMemory, setSelectedMemory] = useState<Memory>(defaultMemory)
    const [memoryDropdown, setMemoryDropdown] = useState(false)
    const [availableMemories, setAvailableMemories] = useState<Memory[]>([])
    const [availableFolders, setAvailableFolders] = useState<Folder[]>([])
    const [originalMemory, setOriginalMemory] = useState<Memory | null>(null)
    const [originalFolder, setOriginalFolder] = useState<Folder | null>(null)

    const { navigate } = useNavigation();

    // Load all folders and memories once
    useEffect(() => {
        loadMemoriesFromFirebase();
        loadFoldersFromFirebase();
    }, []);

    // Reference loaded folders/memories to find original chat/memory
    useEffect(() => {
        const fetchData = async () => {
            if (availableFolders.length === 0 || availableMemories.length === 0) return;

            // Find original folder
            const folder = availableFolders.find(f => f.folderID === folderID);
            setOriginalFolder(folder || null);
            setSelectedFolder(folder || null);

            // Find original chat in folder
            const chatObj = await ChatHistory.loadFromFirebase(parseInt(chatID), chatTitle);
            const originalTitle = chatObj.getTitle();
            setEditedTitle(originalTitle);

            // Find original memory
            const memory = chatObj.getMemory();
            setOriginalMemory(memory || defaultMemory);
            setSelectedMemory(memory || defaultMemory);
        };

        fetchData();
    }, [availableFolders, availableMemories, folderID, chatID, chatTitle]);

    const loadMemoriesFromFirebase = async () => {
        let loadedMemories: Memory[] = [];
        let index = 1;
        let emptyCount = 0;

        while (true) {
            const res = await fetch(`${FIREBASE_DB}/memories/${index}.json`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) break;

            const memory = await res.json();
            if (!memory || Object.keys(memory).length === 0) {
                emptyCount++;
                if (emptyCount > 3) break;
                index++;
                continue
            }

            loadedMemories.push(memory);
            index++;
        }

        setAvailableMemories(loadedMemories.length > 0 ? loadedMemories : [defaultMemory]);
    }

    const loadFoldersFromFirebase = async () => {
        let loadedFolders: Folder[] = [];
        let index = 1;
        let emptyCount = 0;

        while (true) {
            const res = await fetch(`${FIREBASE_DB}/folders/${index}.json`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) {
                emptyCount++;
                if (emptyCount > 3) break;
                index++;
                continue;
            }

            const data = await res.json();
            if (!data || Object.keys(data).length === 0) {
                emptyCount++;
                if (emptyCount > 3) break;
                index++;
                continue;
            }

            emptyCount = 0;

            if (data && data.id && data.name) {
                loadedFolders.push({
                    folderID: data.id.toString(),
                    folderName: data.name,
                    chats: data.chats
                        ? Object.values(data.chats).map((chat: any) => ({
                            chatID: (chat.chatID ?? chat.chatid ?? '').toString(),
                            chatName: chat.chatName ?? chat.chattitle ?? '',
                            memoryID: chat.memoryID ?? chat.memoryid ?? '',
                            messages: chat.messages ?? []
                        }))
                        : []
                });
            }
            index++;
        }

        setAvailableFolders(loadedFolders);
    }

    const handleEditChat = async () => {
        // If no folder was originally assigned, just add to the selected folder
        if (!originalFolder && selectedFolder) {
            // Add chat to selected folder
            const folderRes = await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`);
            let folderData = await folderRes.json();
            if (!folderData.chats) folderData.chats = [];
            // Remove any existing chat with the same id (avoid duplicates)
            folderData.chats = folderData.chats.filter((chat: any) => (chat.id ?? chat.chatid ?? '').toString() !== chatID);
            folderData.chats.push({
                id: chatID,
                title: editedTitle,
            });
            await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(folderData),
            });
        }
        // Remove chat from original folder if folder changed
        else if (selectedFolder && originalFolder && selectedFolder.folderID !== originalFolder.folderID) {
            // Remove chat from original folder
            const res = await fetch(`${FIREBASE_DB}/folders/${originalFolder.folderID}.json`);
            let folderData = await res.json();
            let folderChats = folderData.chats
            const filteredFolderChats = folderChats.filter((chat: any) => (chat.id ?? chat.chatid ?? '').toString() !== chatID);
            // delete all chats in the folder
            await fetch(`${FIREBASE_DB}/folders/${originalFolder.folderID}/chats.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([]),
            });
            // add back filtered chats to new folder
            await fetch(`${FIREBASE_DB}/folders/${originalFolder.folderID}/chats.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filteredFolderChats),
            });

            // Add chat to new folder
            const newFolderRes = await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`);
            let newFolderData = await newFolderRes.json();
            if (!newFolderData.chats) newFolderData.chats = [];
            newFolderData.chats.push({
                id: chatID,
                title: editedTitle,
            });
            await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFolderData),
            });
        } else if (selectedFolder) {
            // Update chat in the same folder
            const res = await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`);
            let folderData = await res.json();
            if (folderData.chats) {
                folderData.chats = Object.values(folderData.chats).map((chat: any) => {
                    if ((chat.id ?? chat.chatid ?? '').toString() === chatID) {
                        return {
                            ...chat,
                            title: editedTitle,
                        };
                    }
                    return chat;
                });
                await fetch(`${FIREBASE_DB}/folders/${selectedFolder.folderID}.json`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(folderData),
                });
            }
        }

        // Update chat memory/title in chat object
        const chatRes = await ChatHistory.loadFromFirebase(parseInt(chatID), chatTitle);
        chatRes.setTitle(editedTitle);
        chatRes.setMemory(selectedMemory.memoryID, selectedMemory.memoryName, selectedMemory.content);

        // Save changes to Firebase
        await chatRes.saveToFirebase();

        // Navigate to the edited chat
        navigate('chatdisplay', { chatID: chatID });
    }

    return (
        <view>
            <NavBar />
            <view className="create-chat-container">
                <view className="create-chat-card">
                    <text className="create-chat-title">Edit Chat</text>

                    {/* Folder Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Folder</text>
                        <view className="dropdown-bar" bindtap={() => setFolderDropdown(!folderDropdown)}>
                            <text className="dropdown-text">
                                {selectedFolder ? selectedFolder.folderName : originalFolder?.folderName || "Select a folder"}
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
                                            key={f.folderID}
                                            className={`dropdown-list-item${selectedFolder?.folderID === f.folderID ? ' selected' : ''}`}
                                            bindtap={() => {
                                                setSelectedFolder(f)
                                                setFolderDropdown(false)
                                            }}
                                        >
                                            <text className="dropdown-list-text">{f.folderName}</text>
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
                            value={editedTitle}
                            placeholder={chatTitle}
                            bindinput={e => setEditedTitle(e.detail.value)}
                        />
                    </view>

                    {/* Memory Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Memory</text>
                        <view className="dropdown-bar" bindtap={() => setMemoryDropdown(!memoryDropdown)}>
                            <text className="dropdown-text">
                                {selectedMemory ? selectedMemory.memoryName : originalMemory?.memoryName || "Select a memory"}
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
                                            className={`dropdown-list-item${selectedMemory?.memoryID === m.memoryID ? ' selected' : ''}`}
                                            bindtap={() => {
                                                setSelectedMemory(m)
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

                    {/* Edit Chat Button */}
                    <view className="form-actions">
                        <view
                            className={`create-chat-btn${!selectedFolder || !editedTitle || !selectedMemory ? ' disabled' : ''}`}
                            bindtap={(!selectedFolder || !editedTitle || !selectedMemory) ? undefined : handleEditChat}
                        >
                            <text>Save</text>
                        </view>
                    </view>
                </view>

            </view>
        </view>
    )
}
