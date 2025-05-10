import "./NoteEditor.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  DropdownToggle,
  Dropdown,
  DropdownMenu,
  Modal,
  Form,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import ImageButton from "../../assets/imgs/ImageButton.svg";
import RecordButton from "../../assets/imgs/RecordButton.svg";
import VideoButton from "../../assets/imgs/VideoButton.svg";
import { useDispatch, useSelector } from "react-redux";
import { getPayLoad } from "../../services/authService";
import { addMessage } from "../../services";
import axios from "axios";
import {
  setCurrentIndex,
  setIsEditing,
  updateExistingNote,
  setCurrentNote,
  fetchNotes,
  saveNewNote,
  addMediaToCurrentNote,
} from "../../redux/notesSlice";
import { uploadAudio, uploadImage } from "../../services/userService"; // Import the uploadAudio and uploadImage functions
import { trackUserEmotion } from "../../services/emotion.service";

function NoteEditor({ isFromViewer = false }) {
  const { isEditing, currentIndex, notes, currentNote } = useSelector(
    (state) => state.notes
  );

  const {entity} = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([]);
  const [header, setHeader] = useState(currentNote.header || "");
  const [date, setDate] = useState(currentNote.date || "");
  const [text, setText] = useState(currentNote.text || "");
  const [mood, setMood] = useState(currentNote.mood || "");
  const [showNameModal, setShowNameModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [customFileName, setCustomFileName] = useState("");
  const dispatch = useDispatch();
  console.error(currentNote);

  function formatDateForInput(dateString) {
    if (!dateString) return ""; // Tránh lỗi khi date là null hoặc undefined
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Lấy YYYY-MM-DD
  }

  useEffect(() => {
    dispatch(
      setCurrentNote({
        _id: currentNote?._id,
        header,
        date,
        text,
        mood,
        media: currentNote.media,
      })
    );
  }, [header, date, text, mood]);

  const handleSubmit = async () => {
    if (!header.trim() || !date.trim() || !text.trim() || !mood.trim()) {
      alert("Please fill in all the required fields!!!");
      return;
    }

    const updatedNote = {
      _id: currentNote?._id || undefined, // Đảm bảo `_id` không bị undefined
      header: header.trim(),
      date: date.trim(),
      text: text.trim(),
      mood: mood.trim(),
      media: currentNote.media || [], // Use media directly from Redux store
    };

    console.log("Payload being sent to backend:", updatedNote); // Log payload để kiểm tra

    dispatch(setCurrentNote(updatedNote));

    try {
      if (isEditing) {
        await dispatch(updateExistingNote(updatedNote));
        dispatch(setIsEditing(false));
      } else {
       await dispatch(saveNewNote(updatedNote)); // Gửi payload để lưu note mới

        const journalId = entity?.journalId || "default-chat";
        const chatId = entity?.chatId || "default-chat";
        // Không gọi trackUserEmotion ở đây nữa
        // Gửi message tới AI model
        const requestData = {
          chatId: chatId,
          message: currentNote.text || "",
          media: currentNote.media?.map((m) => ({
            type: m.type,
            url: m.url,
            name: m.name,
          })),
        };
        // Make API request to backend
        const response = await axios.post(
          "http://localhost:4000/api/chats/ai",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("AI response received:", response.data);
        // Check if response contains expected properties
        if (response.data && response.data.success) {
          const botText = response.data.response || "No response";
        }
        if (
          response.data.sentiment !== undefined &&
          response.data.sentiment_label
        ) {
          try {
            console.log("Tracking AI emotion:", {
              sentiment: response.data.sentiment,
              label: response.data.sentiment_label,
            });

            await trackUserEmotion(
              currentNote.text,
              "note",
              journalId,
              response.data.sentiment_label,
              response.data.sentiment
           
            );
            
          } catch (emotionError) {
            console.error("Error tracking AI emotion:", emotionError);
          }
        }

        dispatch(fetchNotes()); // Fetch danh sách notes mới nhất
      }
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
    }
  };

  const handleFileSelect = (e) => {
    console.log(e);
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCustomFileName(file.name);
      setShowNameModal(true);
    }
  };
  const handleUploadWithName = async () => {
    if (!selectedFile || !customFileName) return;

    try {
      if (selectedFile.type.startsWith("audio")) {
        const response = await uploadAudio(selectedFile);
        if (response.success) {
          const mediaItem = {
            type: "audio",
            url: response.audioUrl,
            name: customFileName,
          };
          dispatch(addMediaToCurrentNote(mediaItem));
          alert("Audio uploaded successfully!");
        } else {
          alert(`Failed to upload audio: ${response.message}`);
          console.error("Audio upload failed:", response.message);
        }
      } else if (selectedFile.type.startsWith("image")) {
        const response = await uploadImage(selectedFile);
        if (response.success) {
          const mediaItem = {
            type: "image",
            url: response.imageUrl,
            name: customFileName,
          };
          dispatch(addMediaToCurrentNote(mediaItem));
          alert("Image uploaded successfully!");
        } else {
          alert(`Failed to upload image: ${response.message}`);
          console.error("Image upload failed:", response.message);
        }
      }

      setShowNameModal(false);
      setSelectedFile(null);
      setCustomFileName("");
    } catch (error) {
      console.error("Error processing file:", error);
      alert(`Error uploading file: ${error.message}`);
    }
  };
  const autoResizeTextArea = (event) => {
    event.target.style.height = "auto"; // Reset height trước
    event.target.style.height = event.target.scrollHeight + "px"; // Gán chiều cao theo nội dung
  };

  const handleDeleteMedia = (index) => {
    const updatedMedia = currentNote.media.filter((_, idx) => idx !== index);
    dispatch(setCurrentNote({ ...currentNote, media: updatedMedia }));
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
        <input className="note-date" type="" value={formatDateForInput(date)} />
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
      <div
        className="media-toolbar"
        style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
      >
        <label className="btn p-0">
          <img src={ImageButton} alt="Add Image" width="24" />
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
        </label>
        <label className="btn p-0">
          <img src={RecordButton} alt="Add Audio" width="24" />
          <input
            type="file"
            accept="audio/*"
            hidden
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* File Name Modal */}
      <Modal
        show={showNameModal}
        onHide={() => setShowNameModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Name your file</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>File name</Form.Label>
            <Form.Control
              type="text"
              value={customFileName}
              onChange={(e) => setCustomFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => setShowNameModal(false)}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUploadWithName}>
            Upload
          </button>
        </Modal.Footer>
      </Modal>

      {/* Media Preview */}
      <div className="media-preview">
        {currentNote.media?.map((m, idx) => {
          if (!m || !m.type) return null;
          return (
            <div key={idx} className="media-item">
              <button
                className="delete-media-btn"
                onClick={() => handleDeleteMedia(idx)}
                title="Remove"
              >
                ×
              </button>
              {m.type === "image" && (
                <div className="media-content">
                  <img src={m.url} alt={m.name} />
                  <span className="media-filename" title={m.name}>
                    {m.name}
                  </span>
                </div>
              )}
              {m.type === "audio" && (
                <div className="audio-container">
                  <span className="audio-filename" title={m.name}>
                    {m.name}
                  </span>
                  <audio src={m.url} controls className="audio-player" />
                </div>
              )}
            </div>
          );
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
