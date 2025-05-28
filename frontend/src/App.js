import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { PremiumProvider } from './contexts/PremiumContext';

// Simple placeholder component for now
const Home = () => <div>AI Learning Platform Home</div>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PremiumProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </PremiumProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
