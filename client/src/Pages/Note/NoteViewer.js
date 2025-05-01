import React, {useEffect, useState} from "react";
import "./NoteViewer.css";
import EditButton from "../../assets/imgs/EditButton.svg";
import CreateNewButton from "../../assets/imgs/CreateNewButton.svg";
import NoteEditor from "./NoteEditor";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentIndex, setIsEditing } from "../../redux/notesSlice";
import ImageButton from "../../assets/imgs/ImageButton.svg";
import RecordButton from "../../assets/imgs/RecordButton.svg";
import VideoButton from "../../assets/imgs/VideoButton.svg";

function NoteViewer({ hasPrev, hasNext, onPrev, onNext }) {
  function formatDate(dateString) {
    const date = new Date(dateString); // Chuyển chuỗi ISO sang đối tượng Date
    return date.toLocaleDateString("vi-VN"); // Định dạng ngày theo chuẩn Việt Nam (dd/mm/yyyy)
  }
  const dispatch = useDispatch();
  const {notes, currentIndex, isEditing, currentNote} = useSelector((state) => state.notes);
  const [note, setNote] = useState(notes[currentIndex] || currentNote);

  useEffect(() => {
    setNote(notes[currentIndex] || currentNote); // Update note when currentIndex or currentNote changes
  }, [notes, currentIndex, currentNote]);

  if (!note) return <div>Loading...</div>;  // Hoặc xử lý lỗi khác

  return (
    
    <div className="note-viewer-container d-flex justify-content-center align-items-center">
      {isEditing ? (
        <NoteEditor 
          note={currentNote}
          isFromViewer={true}
          
        />
      ) : (
        <div className="note-viewer">
          <div className="toolbar top">
            <button className="btn edit-btn" onClick={() => dispatch(setIsEditing(true))}>
              <img src={EditButton} alt="Edit" className="edit-icon"/>
            </button>
            
            {/* create: mới icon chưa logic */}
            <button className="btn create-btn" onClick={() => dispatch(setCurrentIndex(null))}>
              <img src={CreateNewButton} alt="Create" className="create-icon"/>
            </button>
            
            <div className="triangle-wrapper">
              {hasPrev ? <button className="btn" onClick={onPrev}>▲</button> : <button className="btn">▲</button>}  
            </div>
          </div>

          <div className="note-viewer-data">
            <h1 className="note-viewer-title">{currentNote?.header || "Nothing"}</h1>
            <hr class="note-viewer-line"></hr>
            <p className="note-viewer-date">{formatDate(currentNote?.date) || ""}</p>
            <p className="note-viewer-content">{currentNote?.text || ""}</p>
            {/* Media Preview */}
            <div className="media-preview">
              {currentNote.media?.map((m, idx) => (
                <div key={idx} className="media-item">
                  {m.type === "image" && (
                    <div className="media-content">
                      <img src={m.url} alt={m.name} />
                      <span className="media-filename" title={m.name}>{m.name}</span>
                    </div>
                  )}
                  {m.type === "audio" && (
                    <div className="audio-container">
                      <span className="audio-filename" title={m.name}>{m.name}</span>
                      <audio src={m.url} controls className="audio-player" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="toolbar bottom">
            {hasNext ? <button className="btn" onClick={onNext}>▼</button> : <button className="btn" >▼</button>}
          </div>  
        </div>
      )}
    </div>
  );
}

export default NoteViewer;
