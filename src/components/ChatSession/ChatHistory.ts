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

  addUserMessage(message: string) {
    this.history.push({ role: 'user', parts: [{ text: message }] });
  }

  addModelMessage(message: string) {
    this.history.push({ role: 'model', parts: [{ text: message }] });
  }

  getHistory(): ChatEntry[] {
    return this.history;
  }

  getLastMessage(): ChatEntry | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }

  clearHistory() {
    this.history = [];
  }
}
