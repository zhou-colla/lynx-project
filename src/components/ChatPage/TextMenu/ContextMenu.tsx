// ContextMenu.tsx

import "./TextMenu.css";

interface ContextMenuProps {
  show: boolean;
  left: number;
  top: number;
  onCopy: () => void;
  onReply: () => void;
  onSearch: () => void;
}

const ContextMenu = ({ show, left, top, onCopy, onReply, onSearch }: ContextMenuProps) => {
  return (
    <view
      style={{
        left: left + "px",
        top: top + "px",
        visibility: show ? "visible" : "hidden",
      }}
      className="ContextMenu"
    >
      <text className="ContextMenuText" bindtap={onCopy}>
        Copy
      </text>
      <text className="ContextMenuText" bindtap={onSearch}>
        Search
      </text>
      <text className="ContextMenuText" bindtap={onReply}>
        Reply
      </text>
    </view>
  );
};

export default ContextMenu;