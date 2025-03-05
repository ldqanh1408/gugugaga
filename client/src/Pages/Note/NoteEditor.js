import "./NoteEditor.css";
import React, { useState } from "react";

function NoteEditor({ note = {}, onSave }) {
  const [title, setTitle] = useState(note.title || "");
  const [date, setDate] = useState(note.date || "");
  const [content, setContent] = useState(note.content || "");

  const handleSubmit = () => {
    onSave({ title, date, content });
  };

  return (
    <div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung" />
      <button onClick={handleSubmit}>💾 Lưu</button>
    </div>
  );
}

export default NoteEditor;
