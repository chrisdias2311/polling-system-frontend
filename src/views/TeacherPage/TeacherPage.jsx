import Header from "../../components/Header/Header"
import Question from "../../components/Question/Question"
import QuestionStats from "../../components/QuestionStats/QuestionStats"
import ChatBox from "../../components/ChatBox/ChatBox"
import "./TeacherPage.css"
import { useEffect, useState } from "react"
import { useSocket } from "../../lib/SocketContext"

const Teacher = () => {
    const socket = useSocket();
    const [showHeader, setShowHeader] = useState(true);
    const [showStats, setShowStats] = useState(false);
    const [latestQuestionData, setLatestQuestionData] = useState(null);
    const [hasStarted, setHasStarted] = useState(false);
    const [isChatBoxOpen, setIsChatBoxOpen] = useState(false);
    const [participants, setParticipants] = useState([]);
    useEffect(() => {
        if (!socket) return;
        socket.emit("join-as-teacher");
        const handleQuestionAsked = (data) => {
            setShowStats(true);
            setHasStarted(true);
            if (data && data.question) {
                setLatestQuestionData(data);
            }
        };
        socket.on("question-asked", handleQuestionAsked);

        const handleStudentJoined = (data) => {
            if (data && data.id && data.studentName) {
                setParticipants(prev => {
                    // Avoid duplicates
                    if (prev.some(p => p.id === data.id)) return prev;
                    return [...prev, { id: data.id, name: data.studentName }];
                });
            }
        };
        socket.on("student-joined", handleStudentJoined);

        const handleStudentKicked = (data) => {
            console.log("REMOVEEEEEEE")
            if (data && data.studentId) {
                setParticipants(prev => prev.filter(p => p.id !== data.studentId));
            }
        };
        socket.on("student-kicked-success", handleStudentKicked);

        return () => {
            socket.off("question-asked", handleQuestionAsked);
            socket.off("student-joined", handleStudentJoined);
            socket.off("student-kicked-success", handleStudentKicked);
        };
    }, [socket]);

    const handleAskNewQuestion = () => {
        setShowStats(false);
        setShowHeader(false);
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
        <div className="teacher-page">
            <div className="teacher-container">
                <div className="teacher-content">
                  {!hasStarted && !showStats && <Header />}
                  {!showStats && <Question onQuestionAsked={() => setShowHeader(false)} />}
                  {showStats && <QuestionStats initialQuestionData={latestQuestionData} onAskNewQuestion={handleAskNewQuestion} />}
                </div>
            </div>
            {/* Chat Toggle Button (floating) */}
            <button className="chat-toggle" onClick={() => setIsChatBoxOpen(open => !open)} title="Open Chat">
                <ChatIcon />
            </button>
            {isChatBoxOpen && <ChatBox onClose={() => setIsChatBoxOpen(false)} participants={participants} />}
        </div>
    )
}

export default Teacher
