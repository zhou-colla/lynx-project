// ChatHistory.ts
export interface ChatPart {
  text: string;
}

export interface ChatEntry {
  role: 'user' | 'model';
  parts: ChatPart[];
}

export default class ChatHistory {
  private history: ChatEntry[] = [];
  private memory: Record<string, string> = {"1": "mood: happy"};

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
  const memoryEntries: ChatEntry[] = Object.entries(this.memory).map(
    ([key, value]) => ({
      role: 'user',
      parts: [{ text: `${key}: ${value}` }],
    })
  );

  return [...memoryEntries, ...this.history];
}


}
