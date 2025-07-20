"use client"

import { useState, useEffect } from "react"
import { useSocket } from "../../lib/SocketContext"
import "./StudentQuestion.css"

const StudentQuestion = ({ questionData, initialTime = 15, onSubmit = () => { }, onTimeUp = () => { }, answerStats }) => {
    const [selectedOption, setSelectedOption] = useState("")
    const [timeLeft, setTimeLeft] = useState(initialTime)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState(null)
    const [statsTimer, setStatsTimer] = useState(timeLeft)
    const socket = useSocket();

    // Timer countdown
    useEffect(() => {
        setTimeLeft(initialTime)
        setStatsTimer(initialTime)
        // Reset selection states for new question
        setSelectedOption("")
        setIsSubmitted(false)
        setSubmissionStatus(null)
    }, [initialTime, questionData])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (timeLeft === 0 && !isSubmitted && !(answerStats && answerStats.options)) {
            handleTimeUp()
        }
    }, [timeLeft, isSubmitted, answerStats])

    // Timer for stats/results view
    useEffect(() => {
        if (answerStats && answerStats.options) {
            setStatsTimer(timeLeft)
            let interval;
            if (typeof initialTime === 'number' && initialTime > 0) {
                interval = setInterval(() => {
                    setStatsTimer(prev => {
                        if (prev < initialTime) return prev + 1;
                        clearInterval(interval);
                        return initialTime;
                    });
                }, 1000);
            }
            return () => clearInterval(interval);
        }
    }, [answerStats, timeLeft, initialTime])

    const handleTimeUp = () => {
        setIsSubmitted(true)
        setSubmissionStatus("error")
        onTimeUp()
    }

    const handleOptionSelect = (optionId) => {
        if (!isSubmitted) {
            setSelectedOption(optionId)
        }
    }

    const handleSubmit = () => {
        if (selectedOption && !isSubmitted) {
            setIsSubmitted(true)
            setSubmissionStatus("success")
            onSubmit(selectedOption)
            if (socket && questionData && questionData.id) {
                socket.emit("submit-answer", {
                    questionId: questionData.id,
                    selectedOption: selectedOption
                });
            }
        }
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const toggleChat = () => {
        console.log("Chat toggled")
    }

    // Timer Icon SVG
    const TimerIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="timer-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <polyline
                points="12,6 12,12 16,14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    // Chat Icon SVG
    const ChatIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.89 20 9.84 19.79 8.87 19.41L3 21L4.59 15.13C4.21 14.16 4 13.11 4 12C4 7.582 8.03 4 12 4C16.97 4 21 7.582 21 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )

    if (!questionData) return null;

    // If answerStats is present, only show the stats/results UI and keep the timer rolling
    if (answerStats && answerStats.options) {
        const optionCounts = answerStats.optionCounts || {};
        const totalResponses = answerStats.totalResponses || Object.values(optionCounts).reduce((a, b) => a + b, 0);
        return (
            <div className="student-question-container">
                <div className="question-content">
                    <div className="question-header">
                        <h2 className="question-number">Question</h2>
                        <div className="timer">
                            <TimerIcon />
                            <span>{formatTime(statsTimer)}</span>
                        </div>
                    </div>
                    <div className="question-display">{answerStats.question}</div>
                    <div className="options-section" style={{ marginTop: 32 }}>
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>Results:</div>
                        {answerStats.options.map((option, idx) => {
                            const percent = totalResponses > 0 ? Math.round((optionCounts[option.id] / totalResponses) * 100) : 0;
                            return (
                                <div key={option.id} className="option-bar">
                                    <div className={`option-progress`} style={{ width: `${percent}%`, background: '#7c3aed', color: '#fff' }}>
                                        <div className="option-text">
                                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                                            <span>{option.text}</span>
                                        </div>
                                    </div>
                                    <span className="percentage-label">{optionCounts[option.id] || 0}</span>
                                </div>
                            );
                        })}
                        <div className="total-responses" style={{ marginTop: 8 }}>
                            {`Total Responses: ${answerStats.totalResponses || Object.values(answerStats.optionCounts || {}).reduce((a, b) => a + b, 0)} students`}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Normal question/options UI
    return (
        <div className="student-question-container">
            <div className="question-content">
                {/* Question Header */}
                <div className="question-header">
                    <h2 className="question-number">Question</h2>
                    <div className="timer">
                        <TimerIcon />
                        <span>{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Question Display */}
                <div className="question-display">{questionData.question}</div>

                {/* Options Container */}
                <div className="options-container">
                    {questionData.options.map((option, idx) => (
                        <div
                            key={option.id}
                            className={`option-item ${selectedOption === option.id ? "selected" : ""}`}
                            onClick={() => handleOptionSelect(option.id)}
                        >
                            <div className={`option-circle ${selectedOption === option.id ? "selected" : "unselected"}`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="option-text">{option.text}</span>
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <button className="submit-button" onClick={handleSubmit} disabled={!selectedOption || isSubmitted}>
                    {isSubmitted ? "Submitted" : "Submit"}
                </button>

                {/* Submission Feedback */}
                {submissionStatus && (
                    <div className={`submission-feedback ${submissionStatus}`}>
                        {submissionStatus === "success"
                            ? "Answer submitted successfully!"
                            : "Time's up! Your answer has been recorded."}
                    </div>
                )}
            </div>

            {/* Chat Toggle Button */}
            <button className="chat-toggle" onClick={toggleChat} title="Open Chat">
                <ChatIcon />
            </button>
        </div>
    )
}

export default StudentQuestion
