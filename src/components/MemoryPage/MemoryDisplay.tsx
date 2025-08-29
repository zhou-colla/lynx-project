import { useState, useEffect } from '@lynx-js/react'

import editIcon from '../../assets/edit-icon.png'
import deleteIcon from '../../assets/delete-icon.png'
import ChevronRightIcon from '../../assets/right-arrow.png'
import ChevronDownIcon from '../../assets/down-arrow.png'
import addIcon from '../../assets/add-icon.png'

import './MemoryDisplay.css'

import type { Memory } from '../../data/types.ts';
import { MemoryModal } from './MemoryModal.js'
import { NavBar } from '../TopBar/NavBar.js'

import { FIREBASE_DB } from '../../Env.js'

const defaultMemory = {
  memoryID: '0',
  memoryName: 'Default Memory',
  content: 'This is the default memory content.',
};

export function Memory() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [openId, setOpenId] = useState<string | undefined>()

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const [loading, setLoading] = useState(true);

  // load memories from firebase on component mount
  const loadFromFirebase = async () => {
    setLoading(true);

    let loadedMemories: Memory[] = [];
    let index = 1;
    let emptyCount = 0;

    while (true) {
      const res = await fetch(`${FIREBASE_DB}/memories/${index}.json`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });

      if (!res.ok) break; // Stop if not found or error

      const memory = await res.json();
      if (!memory || Object.keys(memory).length === 0) {
        emptyCount++;
        if (emptyCount > 3) break; // Stop after 3 empty responses
        index++;
        continue
      }

      loadedMemories.push(memory);
      index++;
    }

    if (loadedMemories.length > 0) {
      setMemories(loadedMemories);
    } else {
      setMemories([defaultMemory]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadFromFirebase();
  }, []);

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? '' : id)
  }

  // Add memory logic using modal
  const handleAdd = () => {
    setShowAdd(true)
  }

  const handleAddConfirm = async(name: string, content: string) => {
    if (!name.trim()) return

    // Find the highest existing integer ID and increment by 1
    const maxId = memories.reduce((max, m) => {
      const idNum = parseInt(m.memoryID, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    const newId = (maxId + 1).toString();

    const newMemory: Memory = {
      memoryID: newId,
      memoryName: name,
      content: content,
    }
    setMemories([...memories, newMemory])
    setShowAdd(false)

    // save to db each time a new memory is created
    await fetch(`${FIREBASE_DB}/memories/${newMemory.memoryID}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMemory),
    });
  }

  // Edit memory logic using modal
  const handleEdit = (id: string) => {
    setEditId(id)
    setShowEdit(true)
  }

  const handleEditConfirm = async (name: string, content: string) => {
  if (!editId || !name.trim()) return

    const updatedMemory: Memory = {
      memoryID: editId,
      memoryName: name,
      content: content,
    };

    setMemories(memories.map(m =>
      m.memoryID === editId
        ? updatedMemory
        : m
    ));
    setShowEdit(false);
    setEditId(null);

    // save to db each time a memory is edited
    await fetch(`${FIREBASE_DB}/memories/${editId}.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMemory),
    });
}

  const handleEditCancel = () => {
    setShowEdit(false)
    setEditId(null)
  }

  // Delete memory
  const handleDelete = async (id: string) => {
    setMemories(memories.filter(m => m.memoryID !== id))
    if (openId === id) setOpenId('')

    // delete from db each time a memory is deleted
    await fetch(`${FIREBASE_DB}/memories/${id}.json`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  }

  return (
    <view>
      <NavBar />
      <view className="MemoryPage">
        {memories.map(memory => (
          <view key={memory.memoryID} className="MemoryItem">
            <view className="MemoryHeader">
              <text
                className="MemoryDropdown"
                bindtap={() => handleToggle(memory.memoryID)}
              >
                {openId === memory.memoryID 
                  ? <image src={ChevronDownIcon} className='ChevronIcon' /> 
                  : <image src={ChevronRightIcon} className='ChevronIcon' />} 
                {memory.memoryName}
              </text>
              <view className="MemoryIcons">
                <image
                  src={editIcon}
                  className="MemoryIcon"
                  bindtap={() => handleEdit(memory.memoryID)}
                />
                <image
                  src={deleteIcon}
                  className="MemoryIcon"
                  bindtap={() => handleDelete(memory.memoryID)}
                />
              </view>
            </view>
            {openId === memory.memoryID && (
              <view className="MemoryContent">
                <text>{memory.content || 'No content.'}</text>
              </view>
            )}
          </view>
        ))}

        {/* Add Memory Button */}
        <view className="AddMemoryButton" bindtap={handleAdd}>
          <image 
            src={addIcon}
            className='AddMemoryPlus'
          />
        </view>

        {/* Add Modal */}
        {showAdd && (
          <MemoryModal
            title="Add Memory"
            onConfirm={handleAddConfirm}
            onCancel={() => setShowAdd(false)}
          />
        )}

        {/* Edit Modal */}
        {showEdit && (
          <MemoryModal
            title="Edit Memory"
            initialName={memories.find(m => m.memoryID === editId)?.memoryName}
            initialContent={memories.find(m => m.memoryID === editId)?.content}
            onConfirm={handleEditConfirm}
            onCancel={handleEditCancel}
          />
        )}
      </view>
    </view>
  )
}