import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { AuthPage } from './pages/AuthPage';
import { MainLayout } from './components/layout/MainLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
const AppContent = () => {
    const { user } = useAuth();
    if (!user) {
        return _jsx(AuthPage, {});
    }
    return (_jsx(ProtectedRoute, { children: _jsx(MainLayout, {}) }));
};
function App() {
    return (_jsx(AuthProvider, { children: _jsx(AppProvider, { children: _jsx(Router, { children: _jsx("div", { className: "min-h-screen bg-gray-50", children: _jsx(Routes, { children: _jsx(Route, { path: "/*", element: _jsx(AppContent, {}) }) }) }) }) }) }));
}
export default App;
