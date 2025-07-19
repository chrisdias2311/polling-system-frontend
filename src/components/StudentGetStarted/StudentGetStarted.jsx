"use client"

import { useState } from "react"
import { useSocket } from "../../lib/SocketContext"
import shouldCreateCustomRoomId from "../../utils/flags"
import "./StudentGetStarted.css"

const StudentGetStarted = ({ onContinue }) => {
    const [studentName, setStudentName] = useState("")
    const socket = useSocket();

    const handleContinue = () => {
        if (!studentName.trim()) return;
        let roomId = "000000";
        if (shouldCreateCustomRoomId()) {
            roomId = window.prompt("Enter Room ID:", "");
            if (!roomId || !roomId.trim()) return;
            roomId = roomId.trim();
        }
        // Emit join-as-student event
        if (socket) {
            socket.emit("join-as-student", { roomId, studentName: studentName.trim() });
        }
        if (onContinue) onContinue(studentName.trim());
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && studentName.trim()) {
            handleContinue()
        }
    }

    return (
        <div className="student-get-started-container">
            <div className="student-content">
                {/* Interactive Poll Badge */}
                <span className="badge">Interactive Poll</span>

                {/* Main Heading Section */}
                <div className="heading-section">
                    <h1 className="main-heading">Let's Get Started</h1>
                    <p className="subtitle">
                        If you're a student, you'll be able to <span className="subtitle-highlight">submit your answers</span>,
                        participate in live polls, and see how your responses compare with your classmates
                    </p>
                </div>

                {/* Form Section */}
                <div className="form-section">
                    <label htmlFor="student-name" className="form-label">
                        Enter your Name
                    </label>
                    <input
                        id="student-name"
                        type="text"
                        className="name-input"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your full name"
                        maxLength={50}
                    />
                    <button className="continue-button" onClick={handleContinue} disabled={!studentName.trim()}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default StudentGetStarted
