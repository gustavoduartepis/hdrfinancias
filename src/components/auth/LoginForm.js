import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';
export const LoginForm = ({ onToggleMode }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const success = await login(email, password);
            if (!success) {
                setError('Email ou senha inválidos');
            }
        }
        catch (err) {
            setError('Erro ao fazer login. Tente novamente.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setForgotPasswordMessage('');
        try {
            // Simular envio de email de recuperação
            await new Promise(resolve => setTimeout(resolve, 1000));
            setForgotPasswordMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
            setForgotPasswordEmail('');
        }
        catch (err) {
            setForgotPasswordMessage('Erro ao enviar email. Tente novamente.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const resetForgotPassword = () => {
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
        setForgotPasswordMessage('');
    };
    return (_jsxs("div", { className: "w-full max-w-md mx-auto", children: [_jsxs("div", { className: "bg-hdr-white rounded-lg shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-hdr-yellow rounded-full flex items-center justify-center mb-4", children: _jsx(LogIn, { className: "w-8 h-8 text-hdr-black" }) }), _jsx("h2", { className: "text-2xl font-bold text-hdr-black", children: "Bem-vindo de volta" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Fa\u00E7a login em sua conta" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", placeholder: "seu@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", placeholder: "Sua senha", required: true }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400" })) })] }), _jsx("div", { className: "text-right mt-2", children: _jsx("button", { type: "button", onClick: () => setShowForgotPassword(true), className: "text-sm text-hdr-yellow hover:text-yellow-400 font-medium", children: "Esqueci a senha" }) })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm", children: error })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-hdr-black bg-hdr-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hdr-yellow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-200", children: isLoading ? 'Entrando...' : 'Entrar' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["N\u00E3o tem uma conta?", ' ', _jsx("button", { onClick: onToggleMode, className: "font-medium text-hdr-yellow hover:text-yellow-400", children: "Cadastre-se" })] }) }), _jsxs("div", { className: "mt-8 p-4 bg-gray-50 rounded-md", children: [_jsx("p", { className: "text-xs text-gray-600 mb-2", children: "Contas de demonstra\u00E7\u00E3o:" }), _jsxs("div", { className: "text-xs text-gray-500 space-y-1", children: [_jsx("div", { children: "Admin: admin@audiovisual.com / admin123" }), _jsx("div", { children: "Usu\u00E1rio: user@audiovisual.com / user123" })] })] })] }), showForgotPassword && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md mx-4", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("h3", { className: "text-xl font-bold text-hdr-black mb-2", children: "Recuperar Senha" }), _jsx("p", { className: "text-gray-600 text-sm", children: "Digite seu email para receber as instru\u00E7\u00F5es de recupera\u00E7\u00E3o" })] }), _jsxs("form", { onSubmit: handleForgotPassword, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "forgot-email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { id: "forgot-email", type: "email", value: forgotPasswordEmail, onChange: (e) => setForgotPasswordEmail(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", placeholder: "seu@email.com", required: true })] }), forgotPasswordMessage && (_jsx("div", { className: `px-4 py-3 rounded-md text-sm ${forgotPasswordMessage.includes('enviado')
                                        ? 'bg-green-50 border border-green-200 text-green-600'
                                        : 'bg-red-50 border border-red-200 text-red-600'}`, children: forgotPasswordMessage })), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", onClick: resetForgotPassword, className: "flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hdr-yellow", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: isLoading, className: "flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-hdr-black bg-hdr-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hdr-yellow disabled:opacity-50 disabled:cursor-not-allowed", children: isLoading ? 'Enviando...' : 'Enviar' })] })] })] }) }))] }));
};
