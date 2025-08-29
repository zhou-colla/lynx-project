// NavBar.tsx
import { useState } from '@lynx-js/react';
import './NavBar.css';
import addIconCircle from '../../assets/add-icon-circle.png'
import menuIcon from '../../assets/menu-icon.png'

export function NavBar() {
  // This state is internal to NavBar and only controls the overlay's visibility
  const [showMemoryOptions, setShowMemoryOptions] = useState(false);

  const handleClick = () => {
    alert(`Check`)
  }

  return (
    <view className="nav-bar">
      <view bindtap={handleClick}>
        <image src={menuIcon} className="left-icon" />
      </view>
      <view bindtap={handleClick}>
        <image src={addIconCircle} className="right-icon"/>
      </view>
    </view>
  );
}

    //   {/* The MemoryBar is rendered as a child but its CSS makes it appear as an overlay */}
    //   {showMemoryOptions && (
    //     <MemoryBar
    //       onSelectMemory={(memory) => {
    //         onMemoryChange(memory);
    //         setShowMemoryOptions(false);
    //       }}
    //       onClose={() => setShowMemoryOptions(false)}
    //     />
    //   )}