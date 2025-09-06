import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AuthPage } from '../../pages/AuthPage';
export const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    if (!isAuthenticated) {
        return _jsx(AuthPage, {});
    }
    if (requireAdmin && !isAdmin) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 mb-4", children: "Acesso Negado" }), _jsx("p", { className: "text-gray-600", children: "Voc\u00EA n\u00E3o tem permiss\u00E3o para acessar esta p\u00E1gina." }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Esta funcionalidade requer privil\u00E9gios de administrador." })] }) }));
    }
    return _jsx(_Fragment, { children: children });
};
