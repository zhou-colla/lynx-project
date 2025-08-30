import { FIREBASE_DB } from "../../Env.js";

// ChatHistory.ts
export interface ChatPart {
  text: string;
}

export interface ChatEntry {
  role: 'user' | 'model';
  parts: ChatPart[];
}

export default class ChatHistory {
  constructor(chatid: number, chattitle: string) {
    this.chatid = chatid;
    this.chattitle = chattitle;
  }

  private chatid: number = -1;
  private chattitle: string = '';
  private history: ChatEntry[] = [];
  private memory: Record<string, string> = {"1": "[This is for your background information, you do not have to explcily reply it] mood: happy, name: xingye, home: Mars"};

  addUserMessage(message: string) {
    this.history.push({ role: 'user', parts: [{ text: message }] });
    
    // Auto-generate title from first user message if title is default
    if (this.chattitle === `Chat ${this.chatid}` || this.chattitle === 'dummychat') {
      this.chattitle = message.length > 30 ? message.substring(0, 30) + '...' : message;
    }
  }

  addModelMessage(message: string) {
    this.history.push({ role: 'model', parts: [{ text: message }] });
  }

  getLastMessage(): ChatEntry | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  clearHistory() {
    this.history = [];
  }

  //   Memory Management
  setMemory(key: string, value: string) {
    this.memory[key] = "[This is for your background information, you do not have to explcily reply it] " + value;
  }

  deleteMemory(key: string) {
    delete this.memory[key];
  }

  clearMemory() {
    this.memory = {};
  }

  getHistory(): ChatEntry[] {
    return this.history;
  }

  getMemory(): Record<string, string> {
    return this.memory;
  }

  getPrompt(): ChatEntry[] {
    const memoryEntries: ChatEntry[] = Object.entries(this.memory).map(
      ([key, value]) => ({
        role: 'user',
        parts: [{ text: `${key}: ${value}` }],
      })
    );

    return [...memoryEntries, ...this.history];
  }

  getChatId(): number {
    return this.chatid;
  }

  getChatTitle(): string {
    return this.chattitle;
  }

  setChatTitle(title: string) {
    this.chattitle = title;
  }

  async saveToFirebase() {
    await fetch(`${FIREBASE_DB}/chats/${this.chatid}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        title: this.chattitle,
        history: this.history, 
        memory: this.memory 
      }),
    });
  }

  async loadFromFirebase() {
    const res = await fetch(`${FIREBASE_DB}/chats/${this.chatid}.json`);
    if (res.ok) {
      const data = await res.json();
      this.history = data.history || [];
      this.memory = data.memory || {};
      this.chattitle = data.title || `Chat ${this.chatid}`;
    } else {
      console.log("No data found for chat:", this.chatid);
    }
  }

  // Static method to load chat metadata (just ID and title) for menu display
  static async loadChatMetadata(chatId: number): Promise<{id: number, title: string} | null> {
    const res = await fetch(`${FIREBASE_DB}/chats/${chatId}.json`);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          id: chatId,
          title: data.title || `Chat ${chatId}`
        };
      }
    }
    return null;
  }
}