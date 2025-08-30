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

export function MenuChat(props: { chatID: number, chatTitle: string, folderId: number }) {
    // when no folder, folderId = -1
    const { navigate, closeMenu } = useNavigation();

    return (
        <view key={props.chatID} className="chat-item">
            <text>{props.chatTitle}</text>
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
                    />
                </view>
            </view>
        </view>
    )
}