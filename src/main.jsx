import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import './index.css'
import App from './App.jsx'
// import AppRecoilProvider from './store/RecoilProvider.jsx'

createRoot(document.getElementById('root')).render(
  // <AppRecoilProvider>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </AppRecoilProvider>
)
