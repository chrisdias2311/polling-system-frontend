"use client"

import { useState, useEffect, useRef } from "react"
import "./QuestionStats.css"
import ChatBox from "../ChatBox/ChatBox"
import { useSocket } from "../../lib/SocketContext"

const QuestionStats = ({ initialQuestionData, onAskNewQuestion }) => {
    const socket = useSocket();
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
    const [questionData, setQuestionData] = useState(initialQuestionData ? initialQuestionData.question : null);
    const [timer, setTimer] = useState(initialQuestionData && initialQuestionData.timer ? Math.floor(initialQuestionData.timer / 1000) : null);
    const [optionCounts, setOptionCounts] = useState(initialQuestionData && initialQuestionData.question && initialQuestionData.question.optionCount ? initialQuestionData.question.optionCount : {});
    const [countdown, setCountdown] = useState(initialQuestionData && initialQuestionData.timer ? Math.floor(initialQuestionData.timer / 1000) : null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!socket) return;
        const handleQuestionAsked = (data) => {
            if (data.success && data.question) {
                setQuestionData(data.question);
                const seconds = data.timer ? Math.floor(data.timer / 1000) : null;
                setTimer(seconds);
                setCountdown(seconds);
                setOptionCounts(data.question.optionCount || {});
            }
        };
        socket.on("question-asked", handleQuestionAsked);

        // Listen for answer-stats-update
        const handleAnswerStatsUpdate = (data) => {
            if (!data || !data.stats) return;
            const stats = data.stats;
            setOptionCounts(stats.optionCounts || {});
            setQuestionData(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    question: stats.question || prev.question,
                    responses: stats.responses || prev.responses,
                    options: prev.options,
                    totalResponses: stats.totalResponses !== undefined
                        ? stats.totalResponses
                        : (stats.responses ? stats.responses.length : prev.totalResponses),
                };
            });
        };
        socket.on("answer-stats-update", handleAnswerStatsUpdate);

        return () => {
            socket.off("question-asked", handleQuestionAsked);
            socket.off("answer-stats-update", handleAnswerStatsUpdate);
        };
    }, [socket]);

    // Countdown timer effect
    useEffect(() => {
        if (countdown === null || countdown <= 0) {
            clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev > 1) return prev - 1;
                clearInterval(intervalRef.current);
                return 0;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [countdown]);

    // Optionally, update optionCounts if you want to simulate real-time updates

    // Chat Icon SVG
    const ChatIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.89 20 9.84 19.79 8.87 19.41L3 21L4.59 15.13C4.21 14.16 4 13.11 4 12C4 7.582 8.03 4 12 4C16.97 4 21 7.582 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    // Close Icon SVG
    const CloseIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    return (
        <div className="question-starts-container">
            <div className="question-header-row">
                <h2 className="question-starts-header" style={{ marginBottom: 0 }}>Question</h2>
                {countdown !== null && (
                    <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 16, background: '#f3f4f6', borderRadius: 8, padding: '4px 12px' }}>{countdown} sec</span>
                )}
            </div>
            <div className="question-display">
                {questionData ? questionData.question : "Waiting for question..."}
            </div>
            <div className="total-responses">
                {questionData ? `Total Responses: ${questionData.totalResponses || 0} students` : ""}
            </div>
            <div className="main-content full-width">
                <div className="options-section">
                    {questionData && questionData.options.map((option) => {
                        const totalResponses = Object.values(optionCounts).reduce((a, b) => a + b, 0);
                        const percent = totalResponses > 0 ? Math.round((optionCounts[option.id] / totalResponses) * 100) : 0;
                        return (
                            <div key={option.id} className="option-bar">
                                <div className={`option-progress`} style={{ width: `${percent}%`, background: '#7c3aed', color: '#fff' }}>
                                    <div className="option-text">
                                        <span className="option-letter">{option.id}</span>
                                        <span>{option.text}</span>
                                    </div>
                                </div>
                                <span className="percentage-label">{optionCounts[option.id] || 0}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <button className="ask-new-question-btn" onClick={() => { if (countdown === 0 && onAskNewQuestion) onAskNewQuestion(); }} disabled={countdown > 0}>
                + Ask a new question
            </button>
            {/* Chat Toggle Button (icon only, toggles chatbox) */}
            <button className="chat-toggle" onClick={() => setIsChatBoxOpen(open => !open)}>
                <ChatIcon />
            </button>
            {isChatBoxOpen && <ChatBox onClose={() => setIsChatBoxOpen(false)} />}
        </div>
    )
}

export default QuestionStats
