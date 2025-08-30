# Contextual

## Overview
Contextual is a **mobile-first application** built with **Lynx JS** and **TypeScript** for managing chat sessions, folders, and memories. It leverages **Firebase** for persistent cloud storage and is designed to provide a seamless, intuitive experience for organizing conversations and contextual information on mobile devices.

---

## Problem Statement
Modern messaging and collaboration tools often lack robust organization and context features, making it difficult for users to keep track of important conversations, reference materials, and project notes. As chats accumulate, finding relevant information and maintaining structure becomes challenging, especially on mobile platforms.

Modern AI tools are often designed for one-off interactions, lacking continuity, context, or memory. This makes them inefficient for real-world professional work, where projects involve multiple tasks, ongoing conversations, and specific knowledge domains. Users frequently have to repeat information, manually organize content, and manage scattered chat histories, which reduces productivity and the perceived usefulness of AI.

Our project addresses this challenge by creating a specialized, context-aware AI platform. It provides persistent memory, project-based folders, and retrieval-augmented generation, enabling AI to act as a highly specialized assistant. The platform is designed to deliver a seamless experience across mobile devices, supporting both iOS and Android, while offering robust, performant interactions powered by Lynx, JavaScript, and React.

**Contextual** addresses this problem by enabling users to:
- Group chats into folders for easy organization.
- Attach contextual memories to chats for quick reference.
- Move, edit, and manage chats and folders with a simple, mobile-friendly interface.

---

## Features & Functionality

### Chat Management
- **Create, Edit, and Delete Chats:** Start new conversations, update titles, and remove chats as needed.
- **Chat History:** View and manage message history for each chat session.
- **Move Chats:** Assign chats to folders or mark them as unassigned.

### Folder Organization
- **Create and Manage Folders:** Organize chats into folders, rename folders, and delete folders.
- **Assign & Unassign Chats:** Easily move chats between folders or keep them unassigned for later organization.
- **Bulk Operations:** Efficiently update folder contents and move multiple chats.

### Memory Management
- **Create and Edit Memories:** Add contextual notes or instructions to be referenced in chats.
- **Assign Memories to Chats:** Link memories to chats for enhanced context and productivity.
- **Browse & Select Memories:** Use dropdowns to view and select memories when creating or editing chats.

### Navigation & User Experience
- **Mobile-Optimized UI:** Built with Lynx JS for smooth mobile interactions.
- **Custom Navigation:** Quickly switch between chat, folder, and memory views.
- **Rich Iconography:** Visual cues for actions like add, edit, delete, and navigation.

### Persistent Cloud Storage
- **Firebase Integration:** All data is stored and synced in the cloud, ensuring reliability and access across devices.

---

## How It Works

- **Start a Chat:** Create a chat, select a folder and memory, and begin messaging.
- **Organize Conversations:** Move chats between folders or keep them unassigned for later sorting.
- **Add Context:** Attach memories to chats for quick reference and guidance.
- **Edit & Manage:** Update chat details, folder assignments, and memories as your needs change.
- **Delete & Clean Up:** Remove chats or folders to keep your workspace organized.

---

## Closing Statement

Contextual delivers a seamless and intuitive mobile experience for managing conversations, folders, and memories. Leveraging Lynx JS, TypeScript, and Firebase, it empowers users to stay organized, enhance productivity, and make every chat more meaningful—whether for personal use or team collaboration. Unlike many general-purpose AI chatbots that provide generic responses, our platform creates specialized AI assistants that retain domain-specific memories and knowledge, offering personalized and contextually relevant guidance. With planned retrieval-augmented generation, the AI will not only respond intelligently but also ground its answers in accurate, relevant information, enabling professional-grade, expert-level assistance.

---

## Getting Started

### Requirements
- Node.js **18.19** or higher

### Installation & Running
For detailed instructions on installing dependencies, running the app, and using the iOS simulator, refer to the official Lynx guide:  
[Quick Start Guide](https://lynxjs.org/guide/start/quick-start.html#ios-simulator-platform=macos-arm64,explorer-platform=ios-simulator)

### Basic Steps
1. **Install dependencies:**  
   ```bash
   npm install

2. **Run the app**  
   ```bash
   npm start

3. **Configure Firebase**
   Update your Firebase credentials in Env.tsx.

---

## Folder Structure
Folder Structure
src/

├── components/   # UI components for chats, folders, memories, navigation, etc.

├── data/         # Type definitions

├── assets/       # Icons and images

├── services/     # API and backend logic

├── tests/        # Unit tests

├── App.tsx       # Main app entry point

├── index.tsx     # App bootstrap

└── ...           # Other supporting files



---
## License

© 2025 TeamFalcon (Xingye Zhou, Chai Yin, Sirui, Izzat).  

This project is not open-source. All rights reserved. You may not redistribute or modify this project without explicit permission from the TeamFalcon members.