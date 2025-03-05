import React from "react";

function NoteViewer({ note, onEdit, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div>
      <h2>{note.title}</h2>
      <p>{note.date}</p>
      <p>{note.content}</p>

      {/* Nút chỉnh sửa */}
      <button onClick={onEdit}>✏️ Chỉnh sửa</button>

      {/* Nút điều hướng */}
      <button onClick={onPrev} disabled={!hasPrev}>⬅️ Trước</button>
      <button onClick={onNext} disabled={!hasNext}>➡️ Sau</button>
    </div>
  );
}

export default NoteViewer;
