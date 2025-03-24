import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import axios from "axios";
import SaveButton from "../../assets/imgs/SaveButton.svg";

function ChatBox() {
  const [messages, setMessages] = useState(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatHistory")) || [
      { text: "Hi! I'm your assistant :3 Let's chat", sender: "bot" },
    ];
    return storedMessages;
  });

  const [input, setInput] = useState("");
  const chatReference = useRef(null);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage];
      localStorage.setItem(
        "chatHistory",
        JSON.stringify([...messages, userMessage])
      );
      return updatedMessages;
    }); //them tn user
    setInput(""); //xoa inp sau khi gui

    try {
      const history = messages
        .map((m) => `${m.sender === "user" ? "User" : "llama"}: ${m.text}`)
        .join("\n");

      const response = await axios.post(
        "http://127.0.0.1:8080/completion",
        {
          stream: false,
          n_predict: 30,
          temperature: 0.7,
          stop: ["</s>", "llama:", "User:"],
          repeat_last_n: 256,
          repeat_penalty: 1.18,
          top_k: 40,
          top_p: 0.5,
          tfs_z: 1,
          typical_p: 1,
          presence_penalty: 0,
          frequency_penalty: 0,
          mirostat: 0,
          mirostat_tau: 5,
          mirostat_eta: 0.1,
          prompt: history + `\nUser: ${input}\nllama:`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botText = response.data?.content || "No response";

      const botMessage = { text: botText, sender: "bot" };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botMessage];
        localStorage.setItem(
          "chatHistory",
          JSON.stringify([...messages, userMessage, botMessage])
        );
        return updatedMessages;
      });
    } catch (error) {
      const errorMessage = {
        text: "Error: Could not connect to AI",
        sender: "bot",
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, errorMessage];
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    }
  };

  //cuộn xuống mỗi khi gửi tn
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
