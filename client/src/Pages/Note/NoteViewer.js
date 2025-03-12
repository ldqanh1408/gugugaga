import React, {useState} from "react";
import "./NoteViewer.css";
import EditButton from "../../assets/imgs/EditButton.svg";
import NoteEditor from "./NoteEditor";

function NoteViewer() {
  const [note, setNote] = useState(
    JSON.parse(localStorage.getItem('savedNote')) ||
    { title: "Nothing!!!", date: "", content: ""}
  );

  const [isEditing, setIsEditing] = useState(false);
  const handleSave = (updatedNote) => {
    setNote(updatedNote);
    setIsEditing(false);
  }

  return (
    <div className="note-viewer-container d-flex justify-content-center align-items-center">
      {isEditing ? (
        <NoteEditor 
          note={note} 
          onSave={handleSave}
          isFromViewer={true}
        />
      ) : (
        <div className="note-viewer">
          <div className="toolbar top">
            <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
              <img src={EditButton} alt="Edit" className="edit-icon"/>
            </button>

            <div className="triangle-wrapper">
              <button className="btn">▲</button>
            </div>
          </div>

          <div className="note-viewer-data">
            <h1 className="note-viewer-title">{note.title || "Nothing"}</h1>
            <hr class="note-viewer-line"></hr>
            <p className="note-viewer-date">{note.date || ""}</p>
            <p className="note-viewer-content">{note.content || ""}</p>
          </div>

          <div className="toolbar bottom">
            <button className="btn">▼</button>
          </div>  
        </div>
      )}
    </div>
  );
}

export default NoteViewer;
