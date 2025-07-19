"use client"

import { useState, useEffect } from "react"
import "./HomePage.css"
import { useSocket } from "../../lib/SocketContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const LivePollingSystem = () => {
    const [selectedRole, setSelectedRole] = useState("student")
    const navigate = useNavigate();

    const handleContinue = () => {
        if (selectedRole === "teacher") {
            navigate("/teacherpage");
        } else {
            navigate("/studentpage");
        }
        console.log(`Selected role: ${selectedRole}`)
        // Add your continue logic here
    }

    return (
        <div className="container">
            <div className="content">
                {/* Interactive Poll Badge */}
                <div>
                    <span className="badge">Interactive Poll</span>
                </div>

                {/* Main Heading */}
                <div className="heading-section">
                    <h1 className="main-heading">Welcome to the Live Polling System</h1>
                    <p className="subtitle">
                        Please select the role that best describes you to begin using the live polling system
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="cards-container">
                    {/* Student Card */}
                    <div
                        className={`card ${selectedRole === "student" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("student")}
                    >
                        <div className="card-content">
                            <h3 className="card-title">I'm a Student</h3>
                            <p className="card-description">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry
                            </p>
                        </div>
                    </div>

                    {/* Teacher Card */}
                    <div
                        className={`card ${selectedRole === "teacher" ? "selected" : ""}`}
                        onClick={() => setSelectedRole("teacher")}
                    >
                        <div className="card-content">
                            <h3 className="card-title">I'm a Teacher</h3>
                            <p className="card-description">Submit answers and view live poll results in real-time</p>
                        </div>
                    </div>
                </div>

                {/* Continue Button */}
                <div className="button-container">
                    <button className="continue-button" onClick={handleContinue} disabled={!selectedRole}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LivePollingSystem
