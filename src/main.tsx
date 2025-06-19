import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SkillProvider } from './contexts/SkillsContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RequestProvider } from './contexts/RequestContext';
import { ChatProvider } from './contexts/ChatContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
<Router>
  <UserProvider>
    <CategoryProvider>
      <SkillProvider>
        <ChatProvider>
          <RequestProvider>
            <App />
          </RequestProvider>
        </ChatProvider>
      </SkillProvider>
    </CategoryProvider>
  </UserProvider>
</Router>
);