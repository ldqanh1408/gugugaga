import "./NoteEditor.css";
import React, { useState } from "react";

function NoteEditor({ note = {}, onSave, isFromViewer = false }) {
  const [title, setTitle] = useState(note.title || "");
  const [date, setDate] = useState(note.date || "");
  const [content, setContent] = useState(note.content || "");

  const handleSubmit = () => {
    if (!title.trim() || !date.trim() || !content.trim()){
      alert("Please fill in all the required fields!!!");
      return;
    }

    const updatedNote = { title, date, content };

    localStorage.setItem('savedNote', JSON.stringify(updatedNote));

    onSave(updatedNote);
  };

  const autoResizeTextArea = (event) => {
    event.target.style.height = "auto"; // Reset height trước
    event.target.style.height = event.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
  };

  return (
    <div className={`note-editor-container ${isFromViewer ? "viewer-mode" : ""}`}>
      <div className={`note-diary ${isFromViewer ? "viewer-diary" : ""}`}>Diary</div>
      <input className="note-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
      <hr class="note-line"></hr>
      
      <div className="date-container">
        <input className="note-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      
      <textarea className="note-content" 
        value={content} 
        onChange={(e) => {
          setContent(e.target.value); 
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
