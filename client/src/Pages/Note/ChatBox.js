import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./ChatBox.css";
import axios from "axios";
import SaveButton from "../../assets/imgs/SaveButton.svg";
import { getMessages, addMessage, getNotes } from "../../services";
import { getPayLoad } from "../../services/authService"; // Lấy chatId từ payload
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes } from "../../redux/notesSlice";

function ChatBox() {
  const location = useLocation();
  const isChatPage = location.pathname === "/chat"; // Kiểm tra nếu đang ở trang Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatReference = useRef(null);

  const {notes} = useSelector((state) => state.notes);
  const dispatch = useDispatch();
  useEffect(() => {
    if(!notes) {
      dispatch(fetchNotes());
    }
  }, [dispatch])


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
  
  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Thêm tin nhắn của người dùng vào chat
    const userMessage = { text: input, role: "user" };
    await addMessage({ message: userMessage });
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput(""); // Xóa input sau khi gửi

    try {
      // Lấy chatId từ payload
      const { chatId } = await getPayLoad();

      // Gọi API của chroma_service để nhận phản hồi từ GPT
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
      const botMessage = { text: botText, role: "ai" };

      // Thêm tin nhắn của bot vào chat
      await addMessage({ message: botMessage });
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Gửi message không thành công:", error.message);
    }
  };

  // Cuộn xuống mỗi khi có tin nhắn mới
  useEffect(() => {
    if (chatReference.current) {
      chatReference.current.scrollTop = chatReference.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-box-container d-flex justify-content-center align-items-center">
      <div className={`chat-box ${isChatPage ? "formattedBox" : ""}`}>
        <div className="chat-toolbar top">
          <div className="chat-toolbar-text">Gugugaga</div>
        </div>

        <div className="chat-content" ref={chatReference}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
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