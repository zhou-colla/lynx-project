import { useState, useEffect } from '@lynx-js/react'
import './MenuDisplay.css'
import { Folder } from './Folder.js'
import { FIREBASE_DB } from '../../Env.js'

import EditIcon from '../../assets/edit-icon.png';
import DeleteIcon from '../../assets/delete-icon.png';

import { useNavigation } from '../NavigationContext.jsx';

interface ChatMetadata {
    id: number
    title: string
    folderId?: number
}

export function MenuChat(props: { chatID: number, chatTitle: string, folderId: number, onDelete?: () => void}) {
    // when no folder, folderId = -1
    const { navigate, closeMenu } = useNavigation();

    const handleDeleteChat = async () => {
        // Delete chat from folder if it has one
        if (props.folderId !== undefined && props.folderId !== -1) {
            // Fetch folder data
            const folderRes = await fetch(`${FIREBASE_DB}/folders/${props.folderId}.json`);
            const folderData = await folderRes.json();
            // Remove chat from folder's chats
            if (folderData.chats) {
                folderData.chats = folderData.chats.filter((chat: any) =>
                    (chat.id ?? chat.chatid ?? '').toString() !== props.chatID.toString()
                );
                await fetch(`${FIREBASE_DB}/folders/${props.folderId}.json`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(folderData),
                });
            }
        }
        // Delete chat from chat table
        await fetch(`${FIREBASE_DB}/chats/${props.chatID}.json`, {
            method: "DELETE",
        });
        if (props.onDelete) props.onDelete();
    };

    return (
        <view 
            key={props.chatID} 
            className="chat-item"
        >
            <view
                className="text-container"
                style={{ flex: 1 }}
                bindtap={() => {
                    navigate("chatdisplay", {chatID: props.chatID.toString()});
                    closeMenu();
                }}
            >
                <text>{props.chatTitle}</text>
            </view>
            <view className="chat-options">
                <view className="image-container">
                    <image
                        src={EditIcon}
                        style={{ width: "25px", height: "25px", marginRight: "8px" }}
                        bindtap={() => {
                            navigate("editchat", {
                                folderID: props.folderId !== undefined ? props.folderId.toString() : "",
                                chatID: props.chatID.toString(),
                                chatTitle: props.chatTitle
                            });
                            closeMenu();
                        }}
                    />
                    <image
                        src={DeleteIcon}
                        style={{ width: "25px", height: "25px" }} /* can use the setUnassignedChats in MenuDisplay */
                        bindtap={handleDeleteChat}
                    />
                </view>
            </view>
        </view>
    )
}