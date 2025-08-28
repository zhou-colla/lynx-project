import { useState } from '@lynx-js/react'
import editIcon from '../../assets/edit-icon.png'
import deleteIcon from '../../assets/delete-icon.png'
import ChevronRightIcon from '../../assets/right-arrow.png'
import ChevronDownIcon from '../../assets/down-arrow.png'

import './MemoryDisplay.css'

import type { Memory } from '../../data/types.ts';
import data from '../../data/memories.json' with { type: "json"};

const memoryData: Memory[] = data.memories;

export function Memory() {
  const [memories, setMemories] = useState<Memory[]>(memoryData)
  const [openId, setOpenId] = useState<string>(memoryData[0]?.memoryID || 'default')

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? '' : id)
  }

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.memoryID !== id))
    if (openId === id) setOpenId('')
  }

  const handleEdit = (id: string) => {
    // Implement your edit logic here (e.g. open modal)
    alert(`Edit memory: ${id}`)
  }

  const handleAdd = () => {
    const newId = `mem${Date.now()}`
    setMemories([
      ...memories,
      {
        memoryID: newId,
        memoryName: `Memory ${String.fromCharCode(65 + memories.length)}`,
        content: '',
      },
    ])
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
        <text className="AddMemoryPlus">+</text>
      </view>
    </view>
  )
}