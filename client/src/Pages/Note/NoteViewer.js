import React, {useState} from "react";
import "./NoteViewer.css";
import EditButton from "../../assets/imgs/EditButton.svg";
import NoteEditor from "./NoteEditor";
import { useDispatch, useSelector } from "react-redux";
import { setIsEditing } from "../../redux/notesSlice";

function NoteViewer({ hasPrev, hasNext, onPrev, onNext }) {
  function formatDate(dateString) {
    const date = new Date(dateString); // Chuyển chuỗi ISO sang đối tượng Date
    return date.toLocaleDateString("vi-VN"); // Định dạng ngày theo chuẩn Việt Nam (dd/mm/yyyy)
  }
  const dispatch = useDispatch();
  const {notes, currentIndex, isEditing, currentNote} = useSelector((state) => state.notes);
  const [note, setNote] = useState(notes[currentIndex] || currentNote);
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

            <div className="triangle-wrapper">
              {hasPrev ? <button className="btn" onClick={onPrev}>▲</button> : <button className="btn">▲</button>}  
            </div>
          </div>

          <div className="note-viewer-data">
            <h1 className="note-viewer-title">{currentNote?.header || "Nothing"}</h1>
            <hr class="note-viewer-line"></hr>
            <p className="note-viewer-date">{formatDate(currentNote?.date) || ""}</p>
            <p className="note-viewer-content">{currentNote?.text || ""}</p>
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
