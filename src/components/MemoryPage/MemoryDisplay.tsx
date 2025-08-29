import { useState } from '@lynx-js/react'

import editIcon from '../../assets/edit-icon.png'
import deleteIcon from '../../assets/delete-icon.png'
import ChevronRightIcon from '../../assets/right-arrow.png'
import ChevronDownIcon from '../../assets/down-arrow.png'
import addIcon from '../../assets/add-icon.png'

import './MemoryDisplay.css'

import type { Memory } from '../../data/types.ts';
import data from '../../data/memories.json' with { type: "json"};
import { MemoryModal } from './MemoryModal.js'

const memoryData: Memory[] = data.memories;

export function Memory() {
  const [memories, setMemories] = useState<Memory[]>(memoryData)
  const [openId, setOpenId] = useState<string>(memoryData[0]?.memoryID || 'default')

  const [showAdd, setShowAdd] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  
  const handleToggle = (id: string) => {
    setOpenId(openId === id ? '' : id)
  }

  // Add memory logic using modal
  const handleAdd = () => {
    setShowAdd(true)
  }

  const handleAddConfirm = (name: string, content: string) => {
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
  }

  // Edit memory logic using modal
  const handleEdit = (id: string) => {
    setEditId(id)
    setShowEdit(true)
  }

  const handleEditConfirm = (name: string, content: string) => {
    if (!editId || !name.trim()) return
    setMemories(memories.map(m =>
      m.memoryID === editId
        ? { ...m, memoryName: name, content: content }
        : m
    ))
    setShowEdit(false)
    setEditId(null)
  }

  const handleEditCancel = () => {
    setShowEdit(false)
    setEditId(null)
  }

  // Delete memory
  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.memoryID !== id))
    if (openId === id) setOpenId('')
  }


  return (
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
  )
}