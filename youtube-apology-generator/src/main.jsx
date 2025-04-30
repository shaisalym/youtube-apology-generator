import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import RecordStudio from './RecordStudio.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/record" element={<RecordStudio />} />
      </Routes>
    </Router>
  </StrictMode>
)
