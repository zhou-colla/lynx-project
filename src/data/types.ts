// Define the structure of a message
export interface ChatMessage {
  messageID: string;
  role: string;
  text: string;
}

// Define the structure of a single chat object
export interface Chat {
  chatID: string;
  chatName: string;
  memoryID: string;
  messages: ChatMessage[];
}

// Define the structure of the entire chatData object
export interface ChatData {
  chats: Chat[];
}

// Define the structure of a single memory object
export interface Memory {
  memoryID: string;
  memoryName: string;
  content: string;
}

// Define the structure of the entire memoryData object
export interface MemoryData {
  memories: Memory[];
}

// Define the structure of a single folder object
export interface Folder {
  folderID: string;
  folderName: string;
  chats: Chat[];
}