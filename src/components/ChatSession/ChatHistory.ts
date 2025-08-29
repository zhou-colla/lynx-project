import { db } from "./firebase.js";
import { ref, set, get, child } from "firebase/database";

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
  private memory: Record<string, string> = {"1": "mood: happy", "2": "name: xingye", "3": "home: Mars"};

  addUserMessage(message: string) {
    this.history.push({ role: 'user', parts: [{ text: message }] });
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
    this.memory[key] = value;
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

    // 🔹 Save chat + memory to Firebase
  async saveToFirebase() {
    const chatRef = ref(db, `chats/${this.chatid}`);
    await set(chatRef, {
      history: this.history,
      memory: this.memory,
    });
  }

  // 🔹 Load chat + memory from Firebase
  async loadFromFirebase() {
    const chatRef = ref(db);
    const snapshot = await get(child(chatRef, `chats/${this.chatid}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      this.history = data.history || [];
      this.memory = data.memory || {};
    } else {
      console.log("No data found for chat:", this.chatid);
    }
  }


}
