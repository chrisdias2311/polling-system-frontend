import React from "react";
import "./QuestionHistoryStats.css";

const QuestionHistoryStats = ({ questionData, index }) => {
    if (!questionData || !questionData.stats) return null;

    const stats = questionData.stats;
    const totalResponses = stats.totalResponses || 0;
    const totalStudents = stats.totalStudents || 0;
    const responseRate = totalStudents > 0 ? Math.round((totalResponses / totalStudents) * 100) : 0;

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="question-history-stats">
            <div className="history-question-header">
                <div className="history-question-info">
                    <h3 className="history-question-number">Question {index + 1}</h3>
                    <span className="history-question-time">{formatTime(questionData.askedAt)}</span>
                </div>
            </div>

            <div className="history-question-text">
                {questionData.question}
            </div>

            <div className="history-options-container">
                {questionData.options.map((option, idx) => {
                    const optionCount = stats.optionCounts[option.id] || 0;
                    const percentage = totalResponses > 0 ? Math.round((optionCount / totalResponses) * 100) : 0;
                    
                    return (
                        <div key={option.id} className="history-option-bar">
                            <div className="history-option-progress">
                                <div 
                                    className="history-option-fill" 
                                    style={{ width: `${percentage}%` }}
                                >
                                    <div className="history-option-content">
                                        <span className="history-option-letter">{String.fromCharCode(65 + idx)}</span>
                                        <span className="history-option-text">{option.text}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="history-option-stats">
                                <span className="history-option-count">{optionCount}</span>
                                <span className="history-option-percentage">({percentage}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="history-summary-stats">
                <div className="history-stat-item">
                    <span className="history-stat-label">Total Responses:</span>
                    <span className="history-stat-value">{totalResponses}/{totalStudents}</span>
                </div>
                <div className="history-stat-item">
                    <span className="history-stat-label">Response Rate:</span>
                    <span className="history-stat-value">{responseRate}%</span>
                </div>
            </div>
        </div>
    );
};

export default QuestionHistoryStats; 