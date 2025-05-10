import React, { useState, useEffect } from 'react';
import { trackUserEmotion } from '../../services/emotion.service';
import { sendMessage, fetchMessages } from '../../services/chat.service';

const Chat = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages(selectedChat?._id);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (selectedChat) {
      loadMessages();
    }
  }, [selectedChat]);

  const handleSendMessage = async (message) => {
    try {
      if (!message.trim() || !selectedChat?._id) return;

      // First analyze emotion from message
      const { emotion, emotionScore } = await trackUserEmotion(message, 'chat', selectedChat._id);

      // Send message with emotion data
      const sentMessage = await sendMessage({
        content: message,
        chatId: selectedChat._id,
        emotion,
        emotionScore
      });

      // Update UI
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error toast or notification
    }
  };

  const handleAIResponse = async (response) => {
    try {
      if (!selectedChat?._id) return;

      // Track AI response emotion
      await trackUserEmotion(
        response.response,
        'chat',
        selectedChat._id,
        response.emotion,
        response.emotionScore
      );

      // Update messages state with the AI response
      setMessages(prev => [...prev, {
        content: response.response,
        emotion: response.emotion,
        emotionScore: response.emotionScore,
        isAI: true
      }]);
    } catch (error) {
      console.error('Error processing AI response:', error);
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      handleSendMessage(newMessage);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className="message">
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;