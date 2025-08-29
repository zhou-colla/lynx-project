import { useState, useEffect } from '@lynx-js/react'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import './MemoryBar.css';
import ChevronRightIcon from '../../assets/white-right-arrow.png'
import ChevronDownIcon from '../../assets/white-down-arrow.png'
import type { Memory } from '../../data/types.ts';
import data from '../../data/memories.json' with { type: "json"};

const memoryData: Memory[] = data.memories;

export function MemoryBar(props: { memoryID: string, setMemoryID: Dispatch<SetStateAction<string>> }) {
  const [currentMemoryName, setCurrentMemoryName] = useState("")
  const [expand, setExpand] = useState(false) // Start collapsed by default

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
  }, [props.memoryID]);

  return (
    <view className='memory-bar-wrapper'>
      <view className='memory-bar' bindtap={handleToggleExpand}>
        <image 
          src={expand ? ChevronDownIcon : ChevronRightIcon} 
          className='chevron-icon' 
        />
        <text style={{ color: 'white' }}>{currentMemoryName}</text>
      </view>
      
      {expand && (
        <view className='memory-list-container'>
          <view className='memory-list'>
            {memoryData.map((memory) => (
              <view 
                key={memory.memoryID}
                className='memory-list-item'
                bindtap={() => {
                  props.setMemoryID(memory.memoryID);
                  setExpand(false);
                }}
              >
                <text className='memory-list-text'>{memory.memoryName}</text>
              </view>
            ))}
          </view>
        </view>
      )}
    </view>
  );
}