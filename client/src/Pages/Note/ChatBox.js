import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ChatBox.css";
import axios from "axios";
import SaveButton from "../../assets/imgs/SaveButton.svg";
import ImageButton from "../../assets/imgs/ImageButton.svg";
import RecordButton from "../../assets/imgs/RecordButton.svg";
import { getMessages, addMessage } from "../../services";
import { getPayLoad } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "../../redux/notesSlice";
import { Modal, Form } from "react-bootstrap";
import { uploadAudio, uploadImage } from "../../services/userService";

function ChatBox() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat";
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [customFileName, setCustomFileName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const chatReference = useRef(null);
  
  const {notes} = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!notes) {
      dispatch(fetchNotes());
    }
  }, [dispatch]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error({ message: error.message });
      }
    }
    fetchMessages();
  }, []);

  useEffect(() => {
    if (chatReference.current) {
      chatReference.current.scrollTop = chatReference.current.scrollHeight;
    }
  }, [messages]);

  const handleFileSelect = (e) => {
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
      let mediaItem = null;
      
      if (selectedFile.type.startsWith("audio")) {
        const response = await uploadAudio(selectedFile);
        if (response.success) {
          mediaItem = { 
            type: "audio", 
            url: response.audioUrl, 
            name: customFileName 
          };
        } else {
          console.error("Audio upload failed:", response.message);
        }
      } else if (selectedFile.type.startsWith("image")) {
        const response = await uploadImage(selectedFile);
        if (response.success) {
          mediaItem = { 
            type: "image", 
            url: response.imageUrl, 
            name: customFileName 
          };
        } else {
          console.error("Image upload failed:", response.message);
        }
      }

      if (mediaItem) {
        setSelectedMedia([...selectedMedia, mediaItem]);
      }
    } catch (error) {
      console.error("Error processing file:", error);
    }

    setShowNameModal(false);
    setSelectedFile(null);
    setCustomFileName("");
  };

  const handleDeleteMedia = (index) => {
    setSelectedMedia(selectedMedia.filter((_, idx) => idx !== index));
  };

  const handleInput = (e) => {
    const textarea = e.target;
    setInput(e.target.value);
    
    // Reset height and limit it
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, 40);
    textarea.style.height = `${newHeight}px`;
  };

  const sendMessage = async () => {
    if (input.trim() === "" && selectedMedia.length === 0) return;

    const userMessage = { 
      text: input || "Sent media", 
      role: "user",
      media: selectedMedia
    };
    
    await addMessage({ message: userMessage });
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setSelectedMedia([]); // Clear selected media after sending

    try {
      const { chatId } = await getPayLoad();
      const response = await axios.post(
        "http://localhost:4000/api/chats/ai",
        {
          chatId: chatId,
          message: userInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botText = response.data?.response || "No response";
      const botMessage = { text: botText, role: "ai", media: [] };

      await addMessage({ message: botMessage });
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gửi message không thành công:", error.message);
    }
  };

  return (
    <div className="chat-box-container d-flex justify-content-center align-items-center">
      <div className={`chat-box ${isChatPage ? "formattedBox" : ""}`}>
        <div className="chat-toolbar top">
          <div className="chat-toolbar-text">Gugugaga</div>
        </div>

        <div className="chat-content" ref={chatReference}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-text">{msg.text}</div>
              {msg.media && msg.media.map((m, idx) => (
                <div key={idx} className="message-media">
                  {m.type === "image" && (
                    <div className="media-content">
                      <img src={m.url} alt={m.name} />
                      <span className="media-filename">{m.name}</span>
                    </div>
                  )}
                  {m.type === "audio" && (
                    <div className="audio-container">
                      <span className="audio-filename">{m.name}</span>
                      <audio src={m.url} controls className="audio-player" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="chat-toolbar bottom">
          <div className="input-container">
            {selectedMedia.length > 0 && (
              <div className="selected-media-preview">
                {selectedMedia.map((m, idx) => (
                  <div key={idx} className="media-item">
                    <button 
                      className="delete-media-btn"
                      onClick={() => handleDeleteMedia(idx)}
                      title="Remove"
                    >×</button>
                    {m.type === "image" && (
                      <div className="media-content">
                        <img src={m.url} alt={m.name} />
                        <span className="media-filename">{m.name}</span>
                      </div>
                    )}
                    {m.type === "audio" && (
                      <div className="audio-container">
                        <span className="audio-filename">{m.name}</span>
                        <audio src={m.url} controls className="audio-player" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="input-row">
              <div className="media-buttons">
                <label title="Add Image">
                  <img src={ImageButton} alt="Add" />
                  <input type="file" accept="image/*" hidden onChange={handleFileSelect} />
                </label>
                <label title="Add Audio">
                  <img src={RecordButton} alt="Add" />
                  <input type="file" accept="audio/*" hidden onChange={handleFileSelect} />
                </label>
              </div>

              <textarea 
                className="chat-input"
                placeholder="Enter message..."
                value={input}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button 
                className="send-btn" 
                onClick={sendMessage}
                title="Send message"
              >
                <img src={SaveButton} alt="Send" className="send-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* File Name Modal */}
      <Modal show={showNameModal} onHide={() => setShowNameModal(false)} centered>
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
          <button className="btn btn-secondary" onClick={() => setShowNameModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUploadWithName}>
            Upload
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChatBox;