import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../lib/SocketContext";
import "./ChatBox.css";

const ChatBox = ({ onClose, participants }) => {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (data) => {
      console.log(data)
      if (data && data.message) {
        setMessages(prev => [...prev, data]);
      }
    };
    socket.on("new-message", handleNewMessage);
    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleKick = (studentId) => {
    if (socket) {
      socket.emit("kick-student", { studentId });
    }
  };

  const handleSend = () => {
    if (socket && message.trim()) {
      socket.emit("send-message", { message: message.trim() });
      setMessage("");
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      handleSend();
    }
  };

  return (
    <div className="chatbox-overlay">
      <div className="chatbox-container">
        <div className="chatbox-header">
          <span style={{ cursor: "pointer" }} onClick={() => setActiveTab("chat")}
            className={activeTab === "chat" ? "active-tab" : ""}>Chat</span>
          <span style={{ marginLeft: 16, cursor: "pointer" }} onClick={() => setActiveTab("participants")}
            className={activeTab === "participants" ? "active-tab" : ""}>Participants</span>
          <button className="chatbox-close" onClick={onClose}>&times;</button>
        </div>
        {activeTab === "chat" && (
          <>
            <div className="chatbox-messages">
              {messages.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>No messages yet.</div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="chatbox-message">
                    <span className="chatbox-user">{msg.senderName}:</span> <span>{msg.message}</span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chatbox-input-row">
              <input
                className="chatbox-input"
                placeholder="Type a message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
              <button className="chatbox-send" onClick={handleSend} disabled={!message.trim()}>Send</button>
            </div>
          </>
        )}
        {activeTab === "participants" && (
          <div className="chatbox-participants-list">
            {participants && participants.length > 0 ? (
              participants.map(participant => (
                <div key={participant.id} className="chatbox-participant-item">
                  <span>{participant.name}</span>
                  <button className="kick-btn" onClick={() => handleKick(participant.id)}>Kick Out</button>
                </div>
              ))
            ) : (
              <div style={{ color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>No participants yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox; 