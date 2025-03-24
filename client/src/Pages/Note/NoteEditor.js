import "./NoteEditor.css";
import React, { useState } from "react";

function NoteEditor({note = {}, onSave,isFromViewer = false, currentIndex, setCurrentIndex}) {
  const [header, setHeader] = useState(note.header || "");
  const [date, setDate] = useState(note.date || "");
  const [text, setText] = useState(note.text || "");
  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Tránh lỗi khi date là null hoặc undefined
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
  }
  const handleSubmit = () => {
    if (!header.trim() || !date.trim() || !text.trim()){
      alert("Please fill in all the required fields!!!");
      return;
    }
    const updatedNote = {_id:note._id, header, date, text, mood: 'neutral'};
    onSave(updatedNote);
  };
  
  const autoResizeTextArea = (event) => {
    event.target.style.height = "auto"; // Reset height trước
    event.target.style.height = event.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
  };

  return (
    <div key={note._id} className={`note-editor-container ${isFromViewer ? "viewer-mode" : ""}`}> 
      <div className={`note-diary ${isFromViewer ? "viewer-diary" : ""}`}>Diary</div>
      <input className="note-title" value={header} onChange={(e) => setHeader(e.target.value)} placeholder="Enter title" />
      <hr class="note-line"></hr>
      
      <div className="date-container">
        <input className="note-date" type="date" value={formatDateForInput(date)} onChange={(e) => setDate(e.target.value)} />
      </div>
      
      <textarea className="note-content" 
        value={text} 
        onChange={(e) => {
          setText(e.target.value); 
          autoResizeTextArea(e);
        }} 
        placeholder="Enter content">
      </textarea>
      
      <div className="button-container">
        <button className="save-btn" onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default NoteEditor;
