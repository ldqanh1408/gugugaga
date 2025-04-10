import "./NoteEditor.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownToggle, Dropdown, DropdownMenu } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setIsEditing,
  updateExistingNote,
  setCurrentNote,
  fetchNotes,
  saveNewNote,
} from "../../redux/notesSlice";
function NoteEditor({
  note = {}, // Giá trị mặc định
  onSave,
  isFromViewer = false,
}) {
  const { isEditing, currentIndex, notes, currentNote } = useSelector(
    (state) => state.notes
  );
  const [header, setHeader] = useState(currentNote.header || "");
  const [date, setDate] = useState(currentNote.date || "");
  const [text, setText] = useState(currentNote.text || "");
  const [mood, setMood] = useState(currentNote.mood || "");
  const dispatch = useDispatch();
  console.error(currentNote)
  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Tránh lỗi khi date là null hoặc undefined
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
  }
  
  useEffect(() => {
    dispatch(setCurrentNote({ _id: currentNote?._id, header, date, text, mood }));
  }, [header, date, text, mood]);
  
  const handleSubmit = () => {
    if (!header.trim() || !date.trim() || !text.trim()) {
      alert("Please fill in all the required fields!!!");
      return;
    }
    const updatedNote = { _id: currentNote?._id, header, date, text, mood };
    dispatch(setCurrentNote(updatedNote));
    if (isEditing) {
      dispatch(updateExistingNote(updatedNote))
      dispatch(setIsEditing(false));
    } else {
      dispatch(saveNewNote(updatedNote))
      dispatch(fetchNotes());
    }
  };
  const autoResizeTextArea = (event) => {
    event.target.style.height = "auto"; // Reset height trước
    event.target.style.height = event.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
  };

  if (!currentNote) return <div>Loading...</div>; // Hoặc xử lý lỗi khác

  return (
    <div
      key={currentNote?._id}
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
          type=""
          value={formatDateForInput(date)}
        />
      </div>
      <Dropdown className="d-none d-lg-block">
        <DropdownToggle as="div" className="p-0 border-0 bg-transparent">
          <div className={`mood mood-${mood}`}>{mood}</div>
        </DropdownToggle>
        <DropdownMenu className="mt-2">
          <Dropdown.Item onClick={() => setMood("neutral")}>
            Neutral
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("happy")}>Happy</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("angry")}>Angry</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("sad")}>Sad</Dropdown.Item>
          <Dropdown.Item onClick={() => setMood("excited")}>
            Excited
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
