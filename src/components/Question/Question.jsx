"use client"

import { useState } from "react"
import { useSocket } from "../../lib/SocketContext";
import "./question.css"

const Question = ({ onQuestionAsked }) => {
  const socket = useSocket();
  const [questionText, setQuestionText] = useState("")
  const [options, setOptions] = useState([
    { id: 1, text: "", isCorrect: false },
    { id: 2, text: "", isCorrect: false },
  ])
  const [timer, setTimer] = useState(60)
  const [error, setError] = useState("")

  const addOption = () => {
    const newOption = {
      id: options.length + 1,
      text: "",
      isCorrect: false,
    }
    setOptions([...options, newOption])
  }

  const updateOption = (id, field, value) => {
    setOptions(options.map((option) =>
      option.id === id ? { ...option, [field]: value } : option
    ))
  }

  const setCorrectOption = (id) => {
    setOptions(options.map((option) =>
      ({ ...option, isCorrect: option.id === id })
    ))
  }

  const handleAskQuestion = () => {
    // Validation
    if (!questionText.trim()) {
      setError("Question cannot be empty.")
      return
    }
    if (options.length < 2) {
      setError("At least 2 options are required.")
      return
    }
    if (options.some(opt => !opt.text.trim())) {
      setError("All options must have text.")
      return
    }
    const correctCount = options.filter(opt => opt.isCorrect).length
    if (correctCount !== 1) {
      setError("Exactly one option must be marked as correct.")
      return
    }
    if (!timer || isNaN(timer) || timer < 10) {
      setError("Timer must be at least 10 seconds.")
      return
    }
    setError("")
    // Prepare data
    const data = {
      question: questionText,
      timer: Number(timer) * 1000,
      options: options.map(opt => ({
        id: String(opt.id),
        text: opt.text,
        isCorrect: opt.isCorrect
      }))
    }
    socket && socket.emit("ask-question", data)
    if (onQuestionAsked) onQuestionAsked();
    // Optionally, clear fields or show success
  }

  return (
    <div className="question-container">
      <div className="question-header">
        <h2 className="question-title">Enter your question</h2>
        <div style={{ minWidth: 120 }}>
          <select
            className="timer-dropdown"
            value={timer}
            onChange={e => setTimer(Number(e.target.value))}
            style={{ width: 120, padding: "6px 10px", borderRadius: 6, border: "1.5px solid #d1d5db", fontSize: 15 }}
          >
            <option value={30}>30 seconds</option>
            <option value={60}>60 seconds</option>
            <option value={90}>90 seconds</option>
            <option value={120}>120 seconds</option>
          </select>
        </div>
      </div>

      <div className="question-input-container">
        <textarea
          className="question-textarea"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          maxLength={100}
        />
        <span className="character-count">{questionText.length}/100</span>
      </div>

      <div className="content-grid">
        <div className="edit-options">
          <h3 className="section-title">Edit Options</h3>
          {options.map((option) => (
            <div key={option.id} className="option-item-question">
              <span className="option-number">{option.id}</span>
              <input
                type="text"
                className="option-input"
                value={option.text}
                onChange={(e) => updateOption(option.id, "text", e.target.value)}
                placeholder={`Option ${option.id}`}
              />
            </div>
          ))}
          <button className="add-option-btn" onClick={addOption}>
            + Add More option
          </button>
        </div>

        <div className="correct-answers">
          <h3 className="section-title">Is it Correct?</h3>
          {options.map((option) => (
            <div key={option.id} className="answer-option">
              <div className="radio-group">
                <div className="radio-item">
                  <input
                    type="radio"
                    id={`correct-${option.id}`}
                    name="correct-option"
                    value={option.id}
                    className="radio-input"
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(option.id)}
                  />
                  <label htmlFor={`correct-${option.id}`} className="radio-label">
                    Yes
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <div style={{ color: "#dc2626", marginBottom: 12, fontWeight: 500 }}>{error}</div>}

      <button className="ask-question-btn" onClick={handleAskQuestion}>
        Ask Question
      </button>
    </div>
  )
}

export default Question
