// src/components/Note.js
import React, { useEffect } from "react";
import NoteViewer from "./NoteViewer";
import NoteEditor from "./NoteEditor";
import ResizeHandle from "./ResizeHandle";
import ChatBox from "./ChatBox";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  fetchNotes,
  saveNewNote,
  updateExistingNote,
  setCurrentIndex,
  setIsEditing,
  setCurrentNote,
} from "../../redux/notesSlice";

function Note() {
  const dispatch = useDispatch();
  const { notes, currentIndex, isEditing, currentNote } = useSelector((state) => state.notes);
  useEffect(() => {
    if (currentIndex !== null && notes.length > 0) {
      dispatch(setCurrentNote(notes[currentIndex]));  // Cập nhật currentNote khi currentIndex thay đổi
    }
    if(!notes){
      dispatch(fetchNotes());
    }
  }, [currentIndex, notes, dispatch]);
  const handleSave = (newNote) => {
    dispatch(saveNewNote(newNote));
  };

  const handleUpdate = (updatedNote) => {
    dispatch(updateExistingNote(updatedNote));
  };

  const handleEdit = () => {
    dispatch(setIsEditing(true));
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      dispatch(setCurrentIndex(currentIndex - 1));
    }
  };
  const handleNext = () => {
    if (currentIndex < notes.length - 1) {
      dispatch(setCurrentIndex(currentIndex + 1));
    }
  };
  if (!currentNote) return <div>Loading...</div>;  // Hoặc xử lý lỗi khác

  return (
    <div>
      {currentIndex === null ? (
        // Render NoteEditor nếu chưa có ghi chú nào được chọn
        <NoteEditor onSave={handleSave} />
      ) : (
        // <ResizeHandle>
          <NoteViewer
           
            onPrev={handlePrev}
            onNext={handleNext}
          
            hasPrev={currentIndex > 0}
            hasNext={currentIndex < notes.length - 1}
           
          />
          /* <ChatBox notes={notes} />
        </ResizeHandle> */
      )}
    </div>
  );
}

export default Note;
