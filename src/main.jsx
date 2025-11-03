import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports.js'
import { initTheme } from './utils/theme'

// Configure AWS Amplify with generated outputs
Amplify.configure(awsExports)

// Initialize theme before rendering the app so it applies to all pages
initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
