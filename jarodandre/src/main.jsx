import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import { initScrollReveal } from './utilidades/scrollReveal'
import ConexionBackend from './componentes/estructura/ConexionBackend'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConexionBackend><App /></ConexionBackend>
  </StrictMode>,
)

initScrollReveal()
