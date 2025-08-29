// MemoryBar.tsx
import { useState, useEffect } from '@lynx-js/react'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import './MemoryBar.css';
import ChevronRightIcon from '../../assets/right-arrow.png'
import ChevronDownIcon from '../../assets/down-arrow.png'

import type { Memory } from '../../data/types.ts';
import data from '../../data/memories.json' with { type: "json"};

const memoryData: Memory[] = data.memories; // get the list of memory

export function MemoryBar(props: { memoryID: string, setMemoryID: Dispatch<SetStateAction<string>> }) {
  const [memoryId, setMemoryID] = useState(props.memoryID)
  const [currentMemoryName, setCurrentMemoryName] = useState("")
  const [expand, setExpand] = useState(false)

  const handleToggleExpand = () => {
    setExpand(!expand)
  }

  useEffect(() => {
    const foundMemory = memoryData.find(
      (mem) => mem.memoryID === props.memoryID
    );
    if (foundMemory) {
      setCurrentMemoryName(foundMemory.memoryName);
    } else {
      setCurrentMemoryName("No Memory Selected");
    }
  }, [props.memoryID]); // get the memoryName with the corresponding memoryID
  

  return (
    <view className='memory-bar'>
      <image 
        src={expand ? ChevronDownIcon : ChevronRightIcon} 
        className='ChevronIcon' 
        bindtap={handleToggleExpand} 
      />
      <text>{currentMemoryName}</text>
    </view>
  );
}