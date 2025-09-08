import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/notifications/NotificationContainer';
import { AuthPage } from './pages/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <AuthPage />;
  }

  return (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/*" element={<AppContent />} />
              </Routes>
              <NotificationContainer />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App
