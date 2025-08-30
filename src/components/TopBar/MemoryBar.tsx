import { useState, useEffect } from '@lynx-js/react'
import type { Dispatch, SetStateAction } from '@lynx-js/react';
import './MemoryBar.css';
import ChevronRightIcon from '../../assets/white-right-arrow.png'
import ChevronDownIcon from '../../assets/white-down-arrow.png'
import type { Memory } from '../../data/types.ts';
import { FIREBASE_DB } from '../../Env.js'
import { defaultMemory } from '../MemoryPage/MemoryDisplay.js';



export function MemoryBar(props: { memoryID: string, setMemoryID: Dispatch<SetStateAction<string>> }) {
  const [currentMemoryName, setCurrentMemoryName] = useState("")
  const [expand, setExpand] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])


  const loadFromFirebase = async () => {
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
  }


  const handleToggleExpand = () => {
    setExpand(!expand)
  }


  useEffect(() => {
    loadFromFirebase();
  }, []);

  useEffect(() => {
    const foundMemory = memories.find(
      (mem) => mem.memoryID === props.memoryID
    );

    if (foundMemory) {
      setCurrentMemoryName(foundMemory.memoryName);
    } else {
      setCurrentMemoryName("No Memory Selected");
    }
  }, [props.memoryID, memories]); // rerun when either changes

  return (
    <view className='memory-bar-wrapper'>
      <view className='memory-bar' bindtap={handleToggleExpand}>
        <image
          src={expand ? ChevronDownIcon : ChevronRightIcon}
          className='chevron-icon'
        />
        <text className='memory-bar-text'>{currentMemoryName}</text>
      </view>

      {expand && (
        <list
          scroll-orientation="vertical"
          className='memory-list'
        >
          {memories.map((memory, index) => {
            const isCurrentMemory = (memory.memoryID == props.memoryID);

            return (
              <list-item
                key={memory.memoryID}
                item-key={memory.memoryID}
                className={`memory-list-item ${isCurrentMemory ? 'current-memory' : ''}`}
                bindtap={() => {
                  props.setMemoryID(memory.memoryID);
                  setExpand(false);
                }}
              >
                <text className='memory-list-text'>
                  {memory.memoryName}
                </text>
              </list-item>
            );
          })}
        </list>
      )}
    </view>
  );
}