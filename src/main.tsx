
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChatProvider } from '@/context/chat/ChatProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import { Toaster } from 'sonner'

// Create a root element
const rootElement = document.getElementById('root') as HTMLElement

// Render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Router>
      <ChatProvider>
        <App />
        <Toaster position="top-right" richColors />
      </ChatProvider>
    </Router>
  </React.StrictMode>
)
