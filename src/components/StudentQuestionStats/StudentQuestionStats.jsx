import "../QuestionStats/QuestionStats.css";

const StudentQuestionStats = ({ stats, timer }) => {
    if (!stats || !stats.options) return null;
    const optionCounts = stats.optionCounts || {};
    const totalResponses = stats.totalResponses || Object.values(optionCounts).reduce((a, b) => a + b, 0);

    // Timer display (if timer is provided)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            background: '#f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="question-starts-container">
                <div className="question-header-row">
                    <h2 className="question-starts-header" style={{ marginBottom: 0 }}>Question</h2>
                    {typeof timer === 'number' && timer > 0 && (
                        <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 16, background: '#f3f4f6', borderRadius: 8, padding: '4px 12px', marginLeft: 12 }}>{formatTime(timer)}</span>
                    )}
                </div>
                <div className="question-display">{stats.question}</div>
                <div className="total-responses">
                    {`Total Responses: ${totalResponses} students`}
                </div>
                <div className="main-content full-width">
                    <div className="options-section">
                        {stats.options.map((option, idx) => {
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentQuestionStats; 