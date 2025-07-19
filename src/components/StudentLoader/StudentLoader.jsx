"use client"

import { useState, useEffect } from "react"
import "./StudentLoader.css"

const StudentLoader = ({ studentName = "Student" }) => {
    const [connectionStatus, setConnectionStatus] = useState("connecting")
    const [isChatOpen, setIsChatOpen] = useState(false)

    // Simulate connection status changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setConnectionStatus("connected")
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen)
        // Add chat functionality here
        console.log("Chat toggled")
    }

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

    return (
        <div className="student-loader-container">
            <div className="loader-content">
                {/* Interactive Poll Badge */}
                <span className="badge">Interactive Poll</span>

                {/* Spinner */}
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>

                {/* Loading Text */}
                <p className="loading-text">Wait for the teacher to ask questions..</p>

                {/* Connection Status */}
                <div className="status-indicator">
                    <div className="status-dot"></div>
                    <span>{connectionStatus === "connecting" ? "Connecting to session..." : `Connected as ${studentName}`}</span>
                </div>

                {/* Additional Info */}
                <div className="waiting-info">
                    <h3 className="info-title">Ready to participate!</h3>
                    <p className="info-text">
                        You're now connected to the live polling session. Questions will appear here when your teacher starts asking
                        them. Make sure to stay on this page to receive real-time updates.
                    </p>
                </div>
            </div>

            {/* Chat Toggle Button */}
            <button className="chat-toggle" onClick={toggleChat} title="Open Chat">
                <ChatIcon />
            </button>
        </div>
    )
}

export default StudentLoader
