import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import History from './pages/History';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import InterviewSession from './pages/InterviewSession';
import SessionHistory from './pages/SessionHistory';
import SessionDetail from './pages/SessionDetail';
import useAuth from './hooks/useAuth';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} user={user} />
        
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 lg:p-8 min-h-full"
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/interview/:sessionId" element={<InterviewSession />} />
              <Route path="/sessions" element={<SessionHistory />} />
              <Route path="/session/:sessionId" element={<SessionDetail />} />
            </Routes>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
