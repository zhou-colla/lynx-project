import { FIREBASE_DB } from '../../Env.js'

export interface Chat {
  id: number
  title: string
}

export class Folder {
  public id: number
  public name: string
  public chats: Chat[]

  constructor(id: number, name: string, chats: Chat[] = []) {
    this.id = id
    this.name = name
    this.chats = chats
  }

  // Use PUT for creating/replacing the entire folder object
  async saveToFirebase() {
    await fetch(`${FIREBASE_DB}/folders/${this.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: this.id,
        name: this.name,
        chats: this.chats,
      }),
    })
  }

  // Use PATCH for updating parts of an existing folder
  async updateChatsInFirebase() {
    await fetch(`${FIREBASE_DB}/folders/${this.id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chats: this.chats }),
    })
  }

  async deleteFromFirebase() {
    await fetch(`${FIREBASE_DB}/folders/${this.id}.json`, {
      method: 'DELETE',
    })
  }

  static async loadFromFirebase(id: number): Promise<Folder | null> {
    const res = await fetch(`${FIREBASE_DB}/folders/${id}.json`)
    if (res.ok) {
      const data = await res.json()
      if (data) {
        return new Folder(data.id, data.name, data.chats || [])
      }
    } else {
      console.log('No data found for folder:', id)
    }
    return null
  }

  static async getAllFromFirebase(): Promise<Folder[]> {
    const res = await fetch(`${FIREBASE_DB}/folders.json`)
    if (res.ok) {
      const data = await res.json()
      if (data) {
        return Object.values(data).map(
          (folder: any) => new Folder(folder.id, folder.name, folder.chats || [])
        )
      }
    }
    return []
  }
}