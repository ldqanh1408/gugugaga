import React, {useEffect, useState, useRef} from "react";
import "./ChatBox.css";
import SaveButton from "../../assets/imgs/SaveButton.svg";

function ChatBox() {
  const [messages, setMessages] = useState([
    {text: "Hi! I'm your assistant :3 Let's chatting", sender: "bot"}
  ]);
  const [input, setInput] = useState("");
  const chatReference = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return; //???
    
    setMessages([...messages, {text: input, sender: "user"}]); //them tn user
    setInput(""); //xoa inp sau khi gui

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: "Bot: " + input, sender: "bot"}]);
    }, 300);
  };

  //cuộn xuống mỗi khi gửi tn
  useEffect(() => {
    if (chatReference.current) {
      chatReference.current.scrollTop = chatReference.current.scrollHeight;
    }
  }, [messages]
  );


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
            <img src={SaveButton} alt="Send" className="send-icon"/>
          </button>
        
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
