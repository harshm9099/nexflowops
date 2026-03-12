import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import HeroTerminal from './components/HeroTerminal.jsx'

const heroRoot = document.getElementById('root-hero');
if (heroRoot) {
  createRoot(heroRoot).render(
    <StrictMode>
      <div className="w-full h-full flex justify-center items-center">
        <HeroTerminal />
      </div>
    </StrictMode>,
  )
}

const aboutRoot = document.getElementById('root-about');
if (aboutRoot) {
  createRoot(aboutRoot).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
