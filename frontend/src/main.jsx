import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/global.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#16A34A', secondary: '#fff' },
        },
        error: {
          iconTheme: { primary: '#DC2626', secondary: '#fff' },
        },
      }}
    />
    <App />
  </React.StrictMode>
)
