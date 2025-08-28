import { useState } from '@lynx-js/react'
import editIcon from '../../assets/edit.png'
import deleteIcon from '../../assets/delete.png'
import ChevronRightIcon from '../../assets/chevronright.png'
import ChevronDownIcon from '../../assets/chevrondown.png'

import './MemoryDisplay.css'

interface MemoryData {
  id: string
  title: string
  content: string
}

const initialMemories: MemoryData[] = [
  {
    id: 'default',
    title: 'Default Memory',
    content: `This is the default memory. You can edit or delete it.`,
  },
  { id: 'a', title: 'Memory A', content: '' },
  { id: 'b', title: 'Memory B', content: '' },
]

export function Memory() {
  const [memories, setMemories] = useState<MemoryData[]>(initialMemories)
  const [openId, setOpenId] = useState<string>('default')

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? '' : id)
  }

  const handleDelete = (id: string) => {
    setMemories(memories.filter(m => m.id !== id))
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
      { id: newId, title: `Memory ${String.fromCharCode(65 + memories.length)}`, content: '' },
    ])
  }

  return (
    <view className="MemoryPage">
      {memories.map(memory => (
        <view key={memory.id} className="MemoryItem">
          <view className="MemoryHeader">
            <text
              className="MemoryDropdown"
              bindtap={() => handleToggle(memory.id)}
            >
              {openId === memory.id ? <image src={ChevronDownIcon} className='ChevronIcon' /> 
                                    : <image src={ChevronRightIcon} className='ChevronIcon' />} 
              {memory.title}
            </text>
            <view className="MemoryIcons">
              <image
                src={editIcon}
                className="MemoryIcon"
                bindtap={() => handleEdit(memory.id)}
              />
              <image
                src={deleteIcon}
                className="MemoryIcon"
                bindtap={() => handleDelete(memory.id)}
              />
            </view>
          </view>
          {openId === memory.id && (
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