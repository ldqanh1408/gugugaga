import "./NoteEditor.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { DropdownToggle, Dropdown, DropdownMenu } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ImageButton from "../../assets/imgs/ImageButton.svg";
import RecordButton from "../../assets/imgs/RecordButton.svg";
import VideoButton from "../../assets/imgs/VideoButton.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setIsEditing,
  updateExistingNote,
  setCurrentNote,
  fetchNotes,
  saveNewNote,
  addMediaToCurrentNote,
} from "../../redux/notesSlice";
function NoteEditor({
  isFromViewer = false,
}) {
  const { isEditing, currentIndex, notes, currentNote } = useSelector(
    (state) => state.notes
  );
  const [header, setHeader] = useState(currentNote.header || "");
  const [date, setDate] = useState(currentNote.date || "");
  const [text, setText] = useState(currentNote.text || "");
  const [mood, setMood] = useState(currentNote.mood || "");
  const [media, setMedia] = useState(currentNote.media || []);
  const dispatch = useDispatch();
  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Tránh lỗi khi date là null hoặc undefined
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
  }
  
  useEffect(() => {
    dispatch(setCurrentNote({ _id: currentNote?._id, header, date, text, mood, media }));
  }, [header, date, text, mood, media]);
  const handleAddImage = () => {
    console.log("Add image clicked");
  };
  
  const handleAddVideo = () => {
    console.log("Add video clicked");
  };
  
  const handleAddAudio = () => {
    console.log("Add audio clicked");
  };
  
  const handleSubmit = () => {
    if (!header.trim() || !date.trim() || !text.trim()) {
      alert("Please fill in all the required fields!!!");
      return;
    }
    const updatedNote = { _id: currentNote?._id, header, date, text, mood, media };
    dispatch(setCurrentNote(updatedNote));
    if (isEditing) {
      dispatch(updateExistingNote(updatedNote))
      dispatch(setIsEditing(false));
    } else {
      dispatch(saveNewNote(updatedNote))
      dispatch(fetchNotes());
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      type: file.type.split("/")[0], // image / video / audio
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setMedia([...media, ...newMedia]);
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
      <div className="media-toolbar" style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <label className="btn p-0">
          <img src={ImageButton} alt="Add Image" width="24" />
          <input type="file" accept="image/*" hidden onChange={handleMediaChange} />
        </label>
        <label className="btn p-0">
          <img src={VideoButton} alt="Add Video" width="24" />
          <input type="file" accept="video/*" hidden onChange={handleMediaChange} />
        </label>
        <label className="btn p-0">
          <img src={RecordButton} alt="Add Audio" width="24" />
          <input type="file" accept="audio/*" hidden onChange={handleMediaChange} />
        </label>
      </div>
      {/* Preview Media */}
      <div className="media-preview mt-2">
        {media.map((m, idx) => {
          if (m.type === "image") return <img key={idx} src={m.url} alt={m.name} width="100" />;
          if (m.type === "video") return <video key={idx} src={m.url} width="100" controls />;
          if (m.type === "audio") return <audio key={idx} src={m.url} controls />;
          return null;
        })}
      </div>


      <div className="button-container">
        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
}

export default NoteEditor;
