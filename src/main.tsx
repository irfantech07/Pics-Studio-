import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("PICS STUDiO: Application initializing...");
console.log("API Key loaded:", !!import.meta.env.VITE_GEMINI_API_KEY);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
