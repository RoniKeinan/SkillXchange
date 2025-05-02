import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SkillProvider } from './contexts/SkillsContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SkillProvider>
      <App />
    </SkillProvider>
  </React.StrictMode>
);