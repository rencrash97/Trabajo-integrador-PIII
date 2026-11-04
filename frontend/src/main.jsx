import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'
import { JsonAuthProvider } from './general/JsonAuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <JsonAuthProvider>
      <App />
      <ToastContainer />
    </JsonAuthProvider>
  </StrictMode>,
)
