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

  constructor(chatid: number, chattitle: string = "Untitled Chat", history: ChatEntry[] = [], memory: Record<string, string> = {}) {
    this.chatid = chatid;
    this.chattitle = chattitle;
    this.history = history;
    this.memory = memory;
    this.saveTitleIdToFirebase();
  }

  private isReplying: boolean = false;
  private chatid: number = -1;
  private chattitle: string = '';
  private history: ChatEntry[] = [];
  private memory: Record<string, string> = {"1": "[This is for your background information, you do not have to explcily reply it] mood: happy, name: xingye, home: Mars"};
  private replyMessage: ChatEntry = { role: 'user', parts: [{ text: '' }] };

  setReplyMessage(message: string) {
    this.replyMessage.parts[0].text = "[ The user is replying to: " + message + " ]";
  }

  setReplying(value: boolean) {
    this.isReplying = value;
  }

  getReplyMessage(): ChatEntry {
    return this.replyMessage;
  }

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

  if (this.isReplying) {
  return [...memoryEntries, ...this.history, this.replyMessage];
    }

  return [...memoryEntries, ...this.history];
}

  static async saveGlobalCounter(count: number) {
    const res = await fetch(`${FIREBASE_DB}/global_counter.json`, {
      method: 'PUT', // PUT overwrites the value
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(count),
    });

    if (!res.ok) {
      console.error('Failed to save global counter', await res.text());
    }
  }

  async saveTitleIdToFirebase() {
    await fetch(`${FIREBASE_DB}/menu/${this.chatid}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: this.chattitle }),
    });
  }

  async saveToFirebase() {
    await fetch(`${FIREBASE_DB}/chats/${this.chatid}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: this.history, memory: this.memory }),
    });
  }

  static async loadFromFirebase(chatid: number, title: string):Promise<ChatHistory> {
    const res = await fetch(`${FIREBASE_DB}/chats/${chatid}.json`);
    if (res.ok) {
      const data = await res.json();
      const history = data.history || [];
      const memory = data.memory || {};
      return new ChatHistory(chatid, title, history, memory);
    } else {
      console.log("No data found for chat:", chatid);
      return new ChatHistory(chatid, title);
    }
  }

  // // Add this method inside your ChatHistory class
  static async getGlobalCounter(): Promise<number> {
    try {
      const res = await fetch(`${FIREBASE_DB}/global_counter.json`);
      
      // Handle Firebase's "null" response for non-existing data
      if (res.status === 200) {
        const data = await res.json();
        return data === null ? 0 : data;
      }
      
      // Handle actual errors (404, network issues, etc)
      console.error('Failed to fetch global counter', res.status, await res.text());
      return 0;
    } catch (error) {
      console.error('Network error fetching global counter', error);
      return 0;
    }
  }


}

