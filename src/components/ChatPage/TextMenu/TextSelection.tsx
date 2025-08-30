// // TextSelection.tsx

// // Copyright 2025 The Lynx Authors. All rights reserved.
// // Licensed under the Apache License Version 2.0 that can be found in the
// // LICENSE file in the root directory of this source tree.

// import { root, useState } from "@lynx-js/react";
// import "./TextMenu.css";
// import ContextMenu from "./ContextMenu.jsx"; // Import the ContextMenu component

// // TextSelection component for text selection and context menu handling
// const TextSelection = () => {
//   // State for selected text element ID
//   const [selectedId, setSelectedId] = useState("");
//   // State for context menu visibility
//   const [showContextMenu, setShowContextMenu] = useState(false);
//   // State for context menu left offset
//   const [contextMenuLeftOffset, setContextMenuLeftOffset] = useState(0);
//   // State for context menu top offset
//   const [contextMenuTopOffset, setContextMenuTopOffset] = useState(0);

//   // Handle query errors
//   const handleQueryError = (res: any) => {
//     console.log(res.code, res.data);
//   };

//   // Handle text selection change
//   const handleSelectionChange = (e: any) => {
//     if (e.detail.start === -1) {
//       setSelectedId("");
//       hiddenContextMenu();
//       return;
//     }
//     const newSelectedId = "#" + e.target.id;
//     setSelectedId(newSelectedId);
//     (lynx as any).createSelectorQuery()
//       .select(newSelectedId)
//       .invoke({
//         method: "getTextBoundingRect",
//         params: { start: e.detail.start, end: e.detail.end },
//         success: (res: any) => {
//           showContextMenuAtPosition(
//             res.boundingRect.left + res.boundingRect.width / 2 - 50,
//             res.boundingRect.top + res.boundingRect.height + 20,
//           );
//         },
//         fail: handleQueryError,
//       })
//       .exec();
//   };


// const handleCopy = () => {
//   copyText();
//   clearSelection();
// };

// const handleReply = () => {
//   // Your reply logic here
//   clearSelection();
// };


//   // Copy selected text to clipboard
//   const copyText = () => {
//     if (selectedId === "") return;
//     (lynx as any).createSelectorQuery()
//       .select(selectedId)
//       .invoke({
//         method: "getSelectedText",
//         params: {},
//         success: (res: any) => {
//           console.log("getSelectedText:", JSON.stringify(res));
//           // Use clipboard module to set text
//           console.log(`"${res.selectedText}" has been copied.`);
//         },
//         fail: handleQueryError,
//       })
//       .exec();
//   };

//   // Clear text selection
//   const clearSelection = () => {
//     if (selectedId === "") return;
//     (lynx as any).createSelectorQuery()
//       .select(selectedId)
//       .invoke({
//         method: "setTextSelection",
//         params: {
//           startX: -1,
//           startY: -1,
//           endX: -1,
//           endY: -1,
//           showStartHandle: false,
//           showEndHandle: false,
//         },
//         success(res: any) {
//           console.log("clearTextSelection", res);
//         },
//         fail: handleQueryError,
//       })
//       .exec();
//     setSelectedId("");
//   };

//   // Hide context menu
//   const hiddenContextMenu = () => {
//     if (!showContextMenu) return;
//     setShowContextMenu(false);
//   };

//   // Show context menu at given position
//   const showContextMenuAtPosition = (left: number, top: number) => {
//     setShowContextMenu(true);
//     setContextMenuLeftOffset(left);
//     setContextMenuTopOffset(top);
//   };

//   return (
//     <page>
//       <view className="Background" />
//       <view className="App">
//         {/* Render the ContextMenu component */}
//         <ContextMenu
//           show={showContextMenu}
//           left={contextMenuLeftOffset}
//           top={contextMenuTopOffset}
//           onCopy={handleCopy}
//           onReply={handleReply}
//           onSearch={() => { /* Add search logic here */ }}
//         />
//         <view id="container" style={{ width: "90vw" }} className="Container">
//           <text
//             id="1"
//             className="NormalText"
//             text-selection={true}
//             custom-context-menu={true}
//             flatten={false}
//             bindselectionchange={handleSelectionChange}
//           >
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ornare maximus vehicula. Duis nisi velit,
//             dictum id mauris vitae, lobortis pretium quam. Quisque sed nisi pulvinar, consequat justo id, feugiat leo.
//             Cras eu elementum dui.
//           </text>
//         </view>
//       </view>
//     </page>
//   );
// };

// export default TextSelection;
// root.render(<TextSelection />);

// if (import.meta.webpackHot) {
//   import.meta.webpackHot.accept();
// }