import { useState, useEffect } from "react";
import { useSocket } from "../../lib/SocketContext";
import QuestionHistoryStats from "../QuestionHistoryStats/QuestionHistoryStats";
import "./PollHistory.css";

const PollHistory = ({ isOpen, onClose }) => {
    const [roomStats, setRoomStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();

    useEffect(() => {
        if (isOpen && socket) {
            setLoading(true);
            socket.emit("get-room-stats");
            
            const handleRoomStats = (data) => {
                setRoomStats(data);
                setLoading(false);
            };
            
            socket.on("room-stats", handleRoomStats);
            
            return () => {
                socket.off("room-stats", handleRoomStats);
            };
        }
    }, [isOpen, socket]);

    if (!isOpen) return null;

    return (
        <div className="poll-history-overlay" onClick={onClose}>
            <div className="poll-history-modal" onClick={(e) => e.stopPropagation()}>
                <div className="poll-history-header">
                    <h2>Poll History</h2>
                    <button className="close-button" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                
                <div className="poll-history-content">
                    {loading ? (
                        <div className="loading">Loading poll history...</div>
                    ) : roomStats ? (
                        <div className="history-stats">
                            {roomStats.questions && roomStats.questions.length > 0 ? (
                                roomStats.questions.map((question, index) => (
                                    <QuestionHistoryStats 
                                        key={question.id}
                                        questionData={question} 
                                        index={index} 
                                    />
                                ))
                            ) : (
                                <div className="no-questions">No questions have been asked yet.</div>
                            )}
                        </div>
                    ) : (
                        <div className="error">Failed to load poll history.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PollHistory; 