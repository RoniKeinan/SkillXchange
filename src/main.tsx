import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SkillProvider } from './contexts/SkillsContext';
import { CategoryProvider } from './contexts/CategoryContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CategoryProvider>
    <SkillProvider>
      <App />
    </SkillProvider>
    </CategoryProvider>
  </React.StrictMode>
);