import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
export const RegisterForm = ({ onToggleMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setIsLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setIsLoading(false);
            return;
        }
        try {
            const success = await register(formData.email, formData.password, formData.name, formData.role);
            if (!success) {
                setError('Este email já está em uso');
            }
        }
        catch (err) {
            setError('Erro ao criar conta. Tente novamente.');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "w-full max-w-md mx-auto", children: _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-xl p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-hdr-yellow rounded-full flex items-center justify-center mb-4", children: _jsx(UserPlus, { className: "w-8 h-8 text-hdr-black" }) }), _jsx("h2", { className: "text-2xl font-bold text-hdr-black", children: "Criar conta" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Cadastre-se para come\u00E7ar" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome completo" }), _jsx("input", { id: "name", name: "name", type: "text", value: formData.name, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", placeholder: "Seu nome completo", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500", placeholder: "seu@email.com", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "role", className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de usu\u00E1rio" }), _jsxs("select", { id: "role", name: "role", value: formData.role, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500", children: [_jsx("option", { value: "user", children: "Usu\u00E1rio comum" }), _jsx("option", { value: "admin", children: "Administrador" })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700 mb-2", children: "Senha" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", name: "password", type: showPassword ? 'text' : 'password', value: formData.password, onChange: handleChange, className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", placeholder: "M\u00EDnimo 6 caracteres", required: true }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword(!showPassword), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400" })) })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700 mb-2", children: "Confirmar senha" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "confirmPassword", name: "confirmPassword", type: showConfirmPassword ? 'text' : 'password', value: formData.confirmPassword, onChange: handleChange, className: "w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500", placeholder: "Confirme sua senha", required: true }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowConfirmPassword(!showConfirmPassword), children: showConfirmPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400" })) })] })] }), error && (_jsx("div", { className: "bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm", children: error })), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-hdr-black bg-hdr-yellow hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hdr-yellow disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all duration-200", children: isLoading ? 'Criando conta...' : 'Criar conta' })] }), _jsx("div", { className: "mt-6 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["J\u00E1 tem uma conta?", ' ', _jsx("button", { onClick: onToggleMode, className: "font-medium text-hdr-yellow hover:text-yellow-400", children: "Fa\u00E7a login" })] }) })] }) }));
};
