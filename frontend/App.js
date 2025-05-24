import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OtpLoginPage from './pages/OtpLoginPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import CourseExplorerPage from './pages/CourseExplorerPage';
import ContentDetailPage from './pages/ContentDetailPage';
import AiTutorPage from './pages/AiTutorPage';
import QuizArenaPage from './pages/QuizArenaPage';
import QuizDetailPage from './pages/QuizDetailPage';
import ProgressReportPage from './pages/ProgressReportPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const { darkMode } = useTheme();
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path="otp-login" element={<AuthLayout><OtpLoginPage /></AuthLayout>} />
        </Route>
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="courses" element={<CourseExplorerPage />} />
          <Route path="content/:contentId" element={<ContentDetailPage />} />
          <Route path="ai-tutor" element={<AiTutorPage />} />
          <Route path="ai-tutor/:sessionId" element={<AiTutorPage />} />
          <Route path="quizzes" element={<QuizArenaPage />} />
          <Route path="quiz/:quizId" element={<QuizDetailPage />} />
          <Route path="progress" element={<ProgressReportPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
