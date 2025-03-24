import React, { useState, useRef } from "react";
import "./ResizeHandle.css";

function ResizeHandle({onSave, children }) {
  const [width, setWidth] = useState(50); // Mặc định chia đôi 50-50
  const isResizing = useRef(false); // Trạng thái đang kéo hay không
  console.warn(children[1])
  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isResizing.current) return; // Nếu không kéo thì bỏ qua
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setWidth(Math.max(20, Math.min(80, newWidth))); // Giới hạn min 20%, max 80%
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  return (
    <div className="resize-container">
      <div className="left-pane" style={{ width: `${width}%` }}>{children[0]}</div>
      <div className="resize-handle" onMouseDown={handleMouseDown}></div>
      <div className="right-pane" style={{ width: `${100 - width}%` }}>{children[1]}</div>
    </div>
  );
}

export default ResizeHandle;
