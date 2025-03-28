import React, { useEffect, useState, useRef } from "react";
import "./ChatBox.css";
import axios from "axios";
import SaveButton from "../../assets/imgs/SaveButton.svg";
import { getMessages, addMessage, getNotes } from "../../services";

function ChatBox({ notes }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatReference = useRef(null);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (error) {
        console.error({ message: error.message });
      }
    }

    async function fetchBotMessage() {
      return {}; // Dữ liệu rỗng để tránh lỗi
    }
  

    // async function fetchBotMessage() {
    //   var promptNote = "JOURNAL REVIEW\n";
    //   promptNote += "Below are the user's journal entries. Summarize the entries, providing any insights or reflections on the user's emotions or thoughts.\n\n";
      
    //   promptNote += notes.map((note) => {
    //     // Chuyển đổi ngày từ định dạng ISO sang định dạng dễ đọc
    //     const date = new Date(note.date);
    //     const day = date.getDate(); // Ngày
    //     const month = date.toLocaleString('default', { month: 'long' }); // Tháng (Tên tháng)
    //     const year = date.getFullYear(); // Năm
    
    //     return `Ngày: ${day}, Tháng: ${month}, Năm: ${year} | Mood: ${note.mood} | Title: "${note.header}" | Entry: ${note.text}`;
    //   }).join("\n\n");
    
    //   promptNote += "\n\nPlease summarize the overall mood, emotional trends, and any notable observations based on the entries above.\n";
    //   console.log(promptNote);
    //   const response = await axios.post(
    //     "http://127.0.0.1:8080/completion",
    //     {
    //       stream: false,
    //       n_predict: 150,  // Increased response length for more detailed summaries
    //       temperature: 0.7,
    //       stop: ["</s>", "llama:", "User:"],
    //       repeat_last_n: 256,
    //       repeat_penalty: 1.18,
    //       top_k: 40,
    //       top_p: 0.5,
    //       tfs_z: 1,
    //       typical_p: 1,
    //       presence_penalty: 0,
    //       frequency_penalty: 0,
    //       mirostat: 0,
    //       mirostat_tau: 5,
    //       mirostat_eta: 0.1,
    //       prompt: promptNote,
    //     },
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    
    //   const botText = response.data?.content || "No response";
    
    //   const botMessage = { text: botText, role: "ai" };
    //   await addMessage({ message: botMessage });
    //   setMessages((prevMessages) => {
    //     const updatedMessages = [...prevMessages, botMessage];
    //     return updatedMessages;
    //   });
    // }
    fetchMessages();
    fetchBotMessage();
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "") return;


    const userMessage = { text: input, role: "user" };
    const newMessage = await addMessage({ message: userMessage });
    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      return updatedMessages;
    });
    setInput(""); //xoa inp sau khi gui'

    try {
      const history = messages
        .map((m) => `${m.role === "user" ? "User" : "llama"}: ${m.text}`)
        .join("\n");
      const prompt = history + `\nUser: ${input}\nllama:`;
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
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const botText = response.data?.content || "No response";

      const botMessage = { text: botText, role: "ai" };
      await addMessage({ message: botMessage });
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, botMessage];
        return updatedMessages;
      });
    } catch (error) {
      console.error("Gửi message không thành công");
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
