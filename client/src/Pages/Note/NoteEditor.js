import "./NoteEditor.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Row,
  Col,
  DropdownToggle,
  Dropdown,
  DropdownMenu,
  Button,
} from "react-bootstrap";
import avatar from "../../assets/imgs/avatar.svg";
import smile from "../../assets/imgs/smile.svg";
function NoteEditor({
  note = {},
  onSave,
  isFromViewer = false,
  currentIndex,
  setCurrentIndex,
}) {
  const [header, setHeader] = useState(note.header || "");
  const [date, setDate] = useState(note.date || "");
  const [text, setText] = useState(note.text || "");
  const [mood, setMood] = useState(note.mood || "neutral");
  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Tránh lỗi khi date là null hoặc undefined
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
  }
  const handleSubmit = () => {
    if (!header.trim() || !date.trim() || !text.trim()) {
      alert("Please fill in all the required fields!!!");
      return;
    }
    const updatedNote = { _id: note._id, header, date, text, mood };
    onSave(updatedNote);
  };

  const autoResizeTextArea = (event) => {
    event.target.style.height = "auto"; // Reset height trước
    event.target.style.height = event.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
  };

  return (
    <div
      key={note._id}
      className={`note-editor-container ${isFromViewer ? "viewer-mode" : ""}`}
    >
      <div className={`note-diary ${isFromViewer ? "viewer-diary" : ""}`}>
        Diary
      </div>
      <input
        className="note-title"
        value={header}
        onChange={(e) => setHeader(e.target.value)}
        placeholder="Enter title"
      />

      <hr className="note-line"></hr>

      <div className="date-container">
        <input
          className="note-date"
          type="date"
          value={formatDateForInput(date)}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <Dropdown className="d-none d-lg-block">
        <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
          <div className={`mood mood-${mood}`}>{mood}</div>
        </DropdownToggle>
        <DropdownMenu className="mt-2">
          <Dropdown.Item onClick={() => setMood("neutral")}>
            neutral
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("happy")}>happy</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("angry")}>angry</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("sad")}>sad</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("excited")}>
            excited
          </Dropdown.Item>
        </DropdownMenu>
      </Dropdown>

      <textarea
        className="note-content"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          autoResizeTextArea(e);
        }}
        placeholder="Enter content"
      ></textarea>

      <div className="button-container">
        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
