import React, { useState, useEffect } from "react";
import NoteViewer from "./NoteViewer";
import NoteEditor from "./NoteEditor";
import ResizeHandle from "./ResizeHandle";
import ChatBox from "./ChatBox";

function Note() {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  const saveToLocalStorage = (newNotes) => {
    localStorage.setItem("notes", JSON.stringify(newNotes));
  };

  const handleSave = (newNote) => {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    const noteWithChat = {
      ...newNote,
      chatHistory
    };

    const updatedNotes = [...notes, noteWithChat];
    setNotes(updatedNotes);
    saveToLocalStorage(updatedNotes);
    setCurrentIndex(updatedNotes.length - 1);

    const calendarEntry = {
      date: newNote.date,
      title: newNote.title,
      mood: newNote.mood || "neutral",
      time: new Date().toLocaleTimeString() //tgian ghi nhat ki
    };

    const calendarHistory = JSON.parse(localStorage.getItem("calendarHistory")) || [];
    calendarHistory.push(calendarEntry);
    localStorage.setItem("calendarHistory", JSON.stringify(calendarHistory));
  };

  const handleEdit = () => setIsEditing(true);
  const handleUpdate = (updatedNote) => {
    const updatedNotes = [...notes];
    updatedNotes[currentIndex] = updatedNote;
    setNotes(updatedNotes);
    setIsEditing(false);
    saveToLocalStorage(updatedNotes)
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
