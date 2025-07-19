import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SocketProvider } from "./lib/SocketContext"
import { useState } from 'react'
import HomePage from './views/HomePage/HomePage'
import Teacher from "./views/TeacherPage/TeacherPage"
import StudentPage from "./views/StudentPage/StudentPage"

import './App.css'

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/teacherpage" element={<Teacher />} />
            <Route path="/studentpage" element={<StudentPage />} />
          </Routes>
          {/* <Toaster position="top-right" /> */}
        </div>
      </Router>
    </SocketProvider>
  )
}

export default App
