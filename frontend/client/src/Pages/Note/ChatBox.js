import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatBox.css";
import SaveButton from "../../assets/imgs/SaveButton.svg";

function ChatBox() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your assistant :3 Let's chat!", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const chatReference = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", { prompt: input });
      const botMessage = { text: response.data.content, sender: "bot" };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: Could not connect to AI", sender: "bot" }]);
    }
  };

  useEffect(() => {
    if (chatReference.current) {
      chatReference.current.scrollTop = chatReference.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box-container d-flex justify-content-center align-items-center">
      <div className="chat-box">
        <div className="chat-toolbar top">
          <div className="chat-toolbar-text">Gugugaga</div>
        </div>

        <div className="chat-content" ref={chatReference}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-toolbar bottom">
          <textarea
            className="chat-input"
            placeholder="Enter message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          ></textarea>

          <button className="send-btn" onClick={sendMessage}>
            <img src={SaveButton} alt="Send" className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
