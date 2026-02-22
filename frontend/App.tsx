import type { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import TermsPage from './pages/TermsPage';

const App: FC = () => {
  return (
    <div className="min-h-screen bg-charcoal-bg">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat/:projectId" element={<ChatPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Routes>
    </div>
  );
};

export default App;
