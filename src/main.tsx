
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { initializeDatabase } from '@/utils/storageUtils'

// Initialize database connection
initializeDatabase()
  .then(() => console.info("Database initialization successful"))
  .catch((error) => console.error("Database initialization failed:", error));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster />
  </React.StrictMode>,
)
