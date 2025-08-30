import { useState, useEffect } from '@lynx-js/react'

import './CreateChatDisplay.css'
import { NavBar } from '../TopBar/NavBar.js'
import type { Memory, Folder, Chat } from '../../data/types.ts';
import { defaultMemory } from '../MemoryPage/MemoryDisplay.js';
import ChatHistory from '../ChatSession/ChatHistory.js';
import { useNavigation } from '../NavigationContext.js';

import { FIREBASE_DB } from '../../Env.js'

export function CreateChatDisplay() {
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
    const [folderDropdown, setFolderDropdown] = useState(false)
    const [chatTitle, setChatTitle] = useState<string>('')
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
    const [memoryDropdown, setMemoryDropdown] = useState(false)
    const [availableMemories, setAvailableMemories] = useState<Memory[]>([])
    const [availableFolders, setAvailableFolders] = useState<Folder[]>([])

    const { navigate } = useNavigation();

    const loadMemoriesFromFirebase = async () => {
        let loadedMemories: Memory[] = [];
        let index = 1;
        let emptyCount = 0;

        while (true) {
            const res = await fetch(`${FIREBASE_DB}/memories/${index}.json`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) break; // Stop if not found or error

            const memory = await res.json();
            if (!memory || Object.keys(memory).length === 0) {
                emptyCount++;
                if (emptyCount > 3) break; // Stop after 3 empty responses
                index++;
                continue
            }

            loadedMemories.push(memory);
            index++;
        }

        if (loadedMemories.length > 0) {
            setAvailableMemories(loadedMemories);
        } else {
            setAvailableMemories([defaultMemory]);
        }
    }

    const loadFoldersFromFirebase = async () => {
        let loadedFolders = [];
        let index = 1;

        while (true) {
            const res = await fetch(`${FIREBASE_DB}/folders/${index}.json`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!res.ok) break; // Stop if not found or error

            const data = await res.json();

            if (!data || Object.keys(data).length === 0) break;

            // Only check for id and name, chats can be empty
            if (data && data.id && data.name) {
                loadedFolders.push({
                    folderID: data.id.toString(),
                    folderName: data.name,
                    // Initialize empty array if no chats exist
                    chats: data.chats
                        ? Object.values(data.chats).map((chat: any) => ({
                            chatID: chat.chatid?.toString() || '',
                            chatName: chat.chattitle || '',
                            memoryID: chat.memoryid || '',
                            messages: chat.messages || []
                        }))
                        : []
                });
            }


            index++;
        }

        if (loadedFolders.length > 0) {
            setAvailableFolders(loadedFolders)
        }
    }

    // load folders and memories from firebase on component mount
    useEffect(() => {
        loadMemoriesFromFirebase();
        loadFoldersFromFirebase();
    }, []);

    const handleCreateChat = async () => {
        const chatID = await ChatHistory.getGlobalCounter() + 1;
        await ChatHistory.saveGlobalCounter(chatID);

        const folderID = selectedFolder?.folderID;
        const folderName = selectedFolder?.folderName;

        const memoryID = selectedMemory?.memoryID;
        const memoryName = selectedMemory?.memoryName;
        const memoryContent = selectedMemory?.content;

        const newChat = new ChatHistory(
            chatID,
            chatTitle,
            [],
            {
                memoryID: memoryID ?? "0",
                memoryName: memoryName ?? "",
                content: memoryContent ?? ""
            }
        );
        await newChat.saveToFirebase();

        // save chat to folder as well
        if (folderID) {
            // Fetch the folder from Firebase
            const res = await fetch(`${FIREBASE_DB}/folders/${folderID}.json`);
            let folderData = await res.json();
            if (!folderData.chats) folderData.chats = [];
            folderData.chats.push({ chatid: chatID, chattitle: chatTitle });
            // Save updated folder back to Firebase
            await fetch(`${FIREBASE_DB}/folders/${folderID}.json`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(folderData),
            });
        }

        navigate('chatdisplay', { chatID: chatID.toString() });
    }

    return (
        <view>
            <NavBar />
            <view className="create-chat-container">
                <view className="create-chat-card">
                    <text className="create-chat-title">Create a New Chat</text>

                    {/* Folder Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Folder</text>
                        <view className="dropdown-bar" bindtap={() => setFolderDropdown(!folderDropdown)}>
                            <text className="dropdown-text">
                                {selectedFolder ? selectedFolder.folderName : "Select a folder"}
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
                                            className={`dropdown-list-item${selectedFolder?.folderName === f.folderName ? ' selected' : ''}`}
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
                            value={chatTitle}
                            placeholder="Enter chat title"
                            bindinput={e => setChatTitle(e.detail.value)}
                        />
                    </view>

                    {/* Memory Dropdown */}
                    <view className="form-group">
                        <text className="form-label">Memory</text>
                        <view className="dropdown-bar" bindtap={() => setMemoryDropdown(!memoryDropdown)}>
                            <text className="dropdown-text">
                                {selectedMemory ? selectedMemory.memoryName : "Select a memory"}
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

                    {/* Create Chat Button */}
                    <view className="form-actions">
                        <view
                            className={`create-chat-btn${!selectedFolder || !chatTitle || !selectedMemory ? ' disabled' : ''}`}
                            bindtap={(!selectedFolder || !chatTitle || !selectedMemory) ? undefined : handleCreateChat}
                        >
                            <text>Create</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    )
}