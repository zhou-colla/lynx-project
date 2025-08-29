import { useState } from '@lynx-js/react'
import editIcon from '../../assets/edit-icon.png'
import deleteIcon from '../../assets/delete-icon.png'
import ChevronRightIcon from '../../assets/right-arrow.png'
import ChevronDownIcon from '../../assets/down-arrow.png'
import addIcon from '../../assets/add-icon.png'

import './MemoryDisplay.css'

import type { Memory } from '../../data/types.ts';
import data from '../../data/memories.json' with { type: "json"};

const memoryData: Memory[] = data.memories;

export function Memory() {
  const [memories, setMemories] = useState<Memory[]>(memoryData)
  const [openId, setOpenId] = useState<string>(memoryData[0]?.memoryID || 'default')

  const [showAdd, setShowAdd] = useState(false)
  const [newMemoryName, setNewMemoryName] = useState('')
  const [newMemoryContent, setNewMemoryContent] = useState('')

  const [showEdit, setShowEdit] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editMemoryName, setEditMemoryName] = useState('')
  const [editMemoryContent, setEditMemoryContent] = useState('')

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? '' : id)
  }

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.memoryID !== id))
    if (openId === id) setOpenId('')
  }

  // Logic for adding memories
  const handleAdd = () => {
    setShowAdd(true)
  }

  const handleAddConfirm = () => {
    if (!newMemoryName.trim()) return

    // Find the highest existing integer ID and increment by 1
    const maxId = memories.reduce((max, m) => {
      const idNum = parseInt(m.memoryID, 10);
      return isNaN(idNum) ? max : Math.max(max, idNum);
    }, 0);
    const newId = (maxId + 1).toString();

    const newMemory: Memory = {
      memoryID: newId,
      memoryName: newMemoryName,
      content: newMemoryContent,
    }
    const updatedMemories = [...memories, newMemory]
    setMemories(updatedMemories)
    setShowAdd(false)
    setNewMemoryName('')
    setNewMemoryContent('')
  }


  // Logic for editing memories
  const handleEdit = (id: string) => {
    const memory = memories.find(m => m.memoryID === id)
    if (memory) {
      setEditId(id)
      setEditMemoryName(memory.memoryName)
      setEditMemoryContent(memory.content)
      setShowEdit(true)
    }
  }

  const handleEditConfirm = () => {
    if (!editId || !editMemoryName.trim()) return
    setMemories(memories.map(m =>
      m.memoryID === editId
        ? { ...m, memoryName: editMemoryName, content: editMemoryContent }
        : m
    ))
    setShowEdit(false)
    setEditId(null)
    setEditMemoryName('')
    setEditMemoryContent('')
  }

  const handleEditCancel = () => {
    setShowEdit(false)
    setEditId(null)
    setEditMemoryName('')
    setEditMemoryContent('')
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

      {/* Adding Modal */}
      {showAdd && (
        <view className="AddMemoryModal">
          <view>
            <text>Memory name</text>
            <input
              value={newMemoryName}
              bindinput={e => setNewMemoryName(e.detail.value)}
            />
          </view>
          <view>
            <text>Memory content</text>
            <input
              value={newMemoryContent}
              bindinput={e => setNewMemoryContent(e.detail.value)}
            />
          </view>
          <view className="ButtonRow">
            <view bindtap={handleAddConfirm}>
              <text>Add</text>
            </view>
            <view bindtap={() => setShowAdd(false)}>
              <text>Cancel</text>
            </view>
          </view>
        </view>
      )}

      {/* Editing Modal */}
      {showEdit && (
        <view className="AddMemoryModal">
          <view>
            <text>Edit memory name</text>
            <text>{editMemoryName}</text>
            <input
              value={editMemoryName}
              bindinput={e => setEditMemoryName(e.detail.value)}
            />
          </view>
          <view>
            <text>Edit memory content</text>
            <text>{editMemoryContent}</text>
            <input
              value={editMemoryContent}
              bindinput={e => setEditMemoryContent(e.detail.value)}
            />
          </view>
          <view className="ButtonRow">
            <view bindtap={handleEditConfirm}>
              <text>Confirm</text>
            </view>
            <view bindtap={handleEditCancel}>
              <text>Cancel</text>
            </view>
          </view>
        </view>
      )}
    </view>
  )
}