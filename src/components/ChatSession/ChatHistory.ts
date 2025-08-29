import { db } from "./firebase.js";
import { ref, set, get, child } from "firebase/database";
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

  async saveToFirebase() {
    await fetch(`${FIREBASE_DB}/chats/${this.chatid}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: this.history, memory: this.memory }),
    });
  }

  async loadFromFirebase() {
    const res = await fetch(`${FIREBASE_DB}/chats/${this.chatid}.json`);
    if (res.ok) {
      const data = await res.json();
      this.history = data.history || [];
      this.memory = data.memory || {};
    } else {
      console.log("No data found for chat:", this.chatid);
    }
  }


}

