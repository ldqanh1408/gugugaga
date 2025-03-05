import React, { useState } from "react";
import NoteViewer from "./NoteViewer";
import NoteEditor from "./NoteEditor";
import ResizeHandle from "./ResizeHandle";
import ChatBox from "./ChatBox";

function Note() {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newNote) => {
    setNotes([...notes, newNote]);
    setCurrentIndex(notes.length);
  };

  const handleEdit = () => setIsEditing(true);
  const handleUpdate = (updatedNote) => {
    const updatedNotes = [...notes];
    updatedNotes[currentIndex] = updatedNote;
    setNotes(updatedNotes);
    setIsEditing(false);
  };

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex((prev) => Math.min(notes.length - 1, prev + 1));

  return (
    <div>
      {currentIndex === null ? (
        <NoteEditor onSave={handleSave} />
      ) : (
        <ResizeHandle>
          <div>
            {isEditing ? (
              <NoteEditor note={notes[currentIndex]} onSave={handleUpdate} />
            ) : (
              <NoteViewer
                note={notes[currentIndex]}
                onEdit={handleEdit}
                onPrev={handlePrev}
                onNext={handleNext}
                hasPrev={currentIndex > 0}
                hasNext={currentIndex < notes.length - 1}
              />
            )}
          </div>
          <ChatBox />
        </ResizeHandle>
      )}
    </div>
  );
}

export default Note;
