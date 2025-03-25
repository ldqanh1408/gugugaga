import React, { useState, useEffect } from "react";
import NoteViewer from "./NoteViewer";
import NoteEditor from "./NoteEditor";
import ResizeHandle from "./ResizeHandle";
import ChatBox from "./ChatBox";
import {saveNote, getNotes, updateNote} from "../../services/journalService.js"
function Note() {
  const [notes, setNotes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await getNotes();
      setNotes(data);
    }
    fetchNotes();
  }, []);

  
  const handleSave = async (newNote) => {
    try {
      const savedNote = await saveNote({note:newNote});
      
      setNotes((prev) =>{
        const updatedNote = [...prev,savedNote];
        return updatedNote;
      })
      setCurrentIndex(notes.length);
    }
    catch(error){
      console.error(error.message);
    }
  };
  
  const handleUpdate = async (updatedNote) => {
    try {
      console.log(updatedNote)
      const savedNote = await updateNote({note:updatedNote}); // API trả về note đã cập nhật
      // Cập nhật note trong state  
      console.log(savedNote)
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === savedNote._id ? savedNote : note // Thay thế note cũ bằng note mới
        )
      );
  
      setIsEditing(false); // Thoát chế độ edit sau khi update thành công
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleEdit = () => setIsEditing(true);
  
  const handlePrev = () =>{
    setCurrentIndex((prev) => prev - 1);
  } 
  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  return (
    <div>
      {currentIndex === null ? (
        <NoteEditor onSave={handleSave} />
      ) : (
        <ResizeHandle >
              <NoteViewer
                note={notes[currentIndex]}
                isEditing={isEditing} 
                setIsEditing={setIsEditing}
                onPrev={handlePrev}
                onNext={handleNext}
                currentIndex={currentIndex}
                hasPrev = {currentIndex > 0}
                hasNext = {currentIndex < notes.length - 1}
                onSave={handleUpdate}
                setCurrentIndex = {setCurrentIndex}
              />
          <ChatBox notes={notes}/>
        </ResizeHandle>
      )}
    </div>
  );
}

export default Note;
