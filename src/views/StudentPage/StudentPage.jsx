import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentGetStarted from "../../components/StudentGetStarted/StudentGetStarted";
import StudentLoader from "../../components/StudentLoader/StudentLoader";
import StudentQuestion from "../../components/StudentQuestion/StudentQuestion";
import StudentChatBox from "../../components/StudentChatBox/StudentChatBox";
import { useSocket } from "../../lib/SocketContext";
import "./StudentPage.css";

const StudentPage = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [showLoader, setShowLoader] = useState(false);
    const [studentName, setStudentName] = useState("");
    const [currentQuestionData, setCurrentQuestionData] = useState(null);
    const [answerStats, setAnswerStats] = useState(null);
    const [toast, setToast] = useState("");
    const [lastQuestion, setLastQuestion] = useState(null);
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);

    useEffect(() => {
        if (!socket) return;
        const handleNewQuestion = (data) => {
            if (data && data.question) {
                setCurrentQuestionData({
                    question: data.question,
                    timer: data.timer ? Math.floor(data.timer / 1000) : 30
                });
                setLastQuestion(data.question);
                setAnswerStats(null);
            }
        };
        socket.on("new-question", handleNewQuestion);

        const handleAnswerSubmitted = (data) => {
            if (data && data.success) {
                setToast("Answer submitted successfully!");
                // Merge stats into lastQuestion for options, etc.
                const mergedStats = {
                    ...lastQuestion,
                    ...data.stats
                };
                setAnswerStats(mergedStats);
                setTimeout(() => setToast(""), 2000);
            }
        };
        socket.on("answer-submitted", handleAnswerSubmitted);

        const handleKicked = () => {
            setToast("You have been kicked off by the teacher");
            setTimeout(() => {
                setToast("");
                navigate("/");
            }, 2000);
        };
        socket.on("kicked-from-room", handleKicked);

        return () => {
            socket.off("new-question", handleNewQuestion);
            socket.off("answer-submitted", handleAnswerSubmitted);
            socket.off("kicked-from-room", handleKicked);
        };
    }, [socket, lastQuestion, navigate]);

    const handleContinue = (name) => {
        setStudentName(name);
        setShowLoader(true);
    };

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
    );

    return (
        <div className="student-page-container">
            {toast && <div style={{ position: 'fixed', top: 24, right: 24, background: '#7c3aed', color: '#fff', padding: '12px 24px', borderRadius: 8, zIndex: 9999 }}>{toast}</div>}
            {currentQuestionData ? (
                <StudentQuestion
                    questionData={currentQuestionData.question}
                    initialTime={currentQuestionData.timer}
                    answerStats={answerStats}
                />
            ) : (
                <>
                    {!showLoader && <StudentGetStarted onContinue={handleContinue} />}
                    {showLoader && <StudentLoader studentName={studentName} />}
                </>
            )}
            {/* Chat Toggle Button (floating) */}
            <button className="chat-toggle" onClick={() => setIsChatBoxOpen(open => !open)} title="Open Chat">
                <ChatIcon />
            </button>
            {isChatBoxOpen && <StudentChatBox onClose={() => setIsChatBoxOpen(false)} />}
        </div>
    );
};

export default StudentPage;
