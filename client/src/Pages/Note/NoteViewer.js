import React, {useState} from "react";
import "./NoteViewer.css";
import EditButton from "../../assets/imgs/EditButton.svg";

function NoteViewer() {
  const [note, setNote] = useState("Nothing!!!");

  return (
    <div className="note-viewer-container d-flex justify-content-center align-items-center">
      <div className="note-viewer">
        <div className="toolbar top">

          <button className="btn edit-btn">
            <img src={EditButton} alt="Edit" className="edit-icon"/>
          </button>

          <div className="triangle-wrapper">
            <button className="btn">▲</button>
          </div>


        </div>

        <div className="note-data text-center">
          <p>Nothing</p>
        </div>

        <div className="toolbar bottom">
          <button className="btn">▼</button>
        </div>  
      </div>
    </div>
  );
}

export default NoteViewer;
