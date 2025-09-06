import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const toggleMode = () => {
        setIsLogin(!isLogin);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-hdr-gray-light to-hdr-gray-lighter flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "max-w-md w-full space-y-8", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "flex items-center justify-center space-x-3 mb-4", children: [_jsx("h1", { className: "text-5xl font-bold text-hdr-black hdr-logo", children: "HDR" }), _jsx("span", { className: "text-5xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("p", { className: "text-lg text-gray-600", children: "Sistema Financeiro" })] }), isLogin ? (_jsx(LoginForm, { onToggleMode: toggleMode })) : (_jsx(RegisterForm, { onToggleMode: toggleMode }))] }) }));
};
