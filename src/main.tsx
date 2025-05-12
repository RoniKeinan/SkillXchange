import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SkillProvider } from './contexts/SkillsContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
    <UserProvider>
    <CategoryProvider>
    <SkillProvider>
      <App />
    </SkillProvider>
    </CategoryProvider>
    </UserProvider>
    </Router>
  </React.StrictMode>
);