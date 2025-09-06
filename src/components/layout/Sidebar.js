import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { LayoutDashboard, Receipt, BarChart3, Users, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const menuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        description: 'Visão geral'
    },
    {
        id: 'transactions',
        label: 'Lançamentos',
        icon: Receipt,
        description: 'Receitas e despesas'
    },
    {
        id: 'reports',
        label: 'Relatórios',
        icon: BarChart3,
        description: 'Análises e gráficos'
    },
    {
        id: 'clients',
        label: 'Clientes',
        icon: Users,
        description: 'Gestão de clientes'
    }
];
export const Sidebar = ({ activeSection, onSectionChange }) => {
    const { user, logout, isAdmin } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setIsMobileMenuOpen(true), className: "lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-hdr-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors", "aria-label": "Abrir menu", children: _jsx(Menu, { className: "w-5 h-5 text-hdr-black" }) }), isMobileMenuOpen && (_jsx("div", { className: "lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300", onClick: () => setIsMobileMenuOpen(false) })), _jsxs("div", { className: `
        fixed lg:static inset-y-0 left-0 z-50
        w-64 sm:w-72 lg:w-64 bg-gray-900 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full
      `, children: [_jsxs("div", { className: "p-4 lg:p-6 border-b border-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h1", { className: "text-2xl font-bold text-hdr-white hdr-logo", children: "HDR" }), _jsx("span", { className: "text-2xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("button", { onClick: () => setIsMobileMenuOpen(false), className: "lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors", "aria-label": "Fechar menu", children: _jsx(X, { className: "w-5 h-5 text-gray-400" }) })] }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Sistema Financeiro" })] }), _jsx("div", { className: "p-4 border-b border-gray-800", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-hdr-yellow rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-5 h-5 text-hdr-black" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium truncate text-hdr-white", children: user?.name }), _jsx("p", { className: "text-xs text-gray-400 truncate", children: user?.email }), _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${isAdmin ? 'bg-hdr-yellow text-hdr-black' : 'bg-gray-700 text-hdr-white'}`, children: isAdmin ? 'Administrador' : 'Usuário' })] })] }) }), _jsx("nav", { className: "flex-1 p-4 lg:p-6 overflow-y-auto", children: _jsx("ul", { className: "space-y-1", children: menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.id;
                                return (_jsx("li", { children: _jsxs("button", { onClick: () => {
                                            onSectionChange(item.id);
                                            setIsMobileMenuOpen(false);
                                        }, className: `w-full flex items-center px-4 py-3 lg:py-2.5 text-left rounded-lg transition-all duration-200 touch-manipulation ${isActive
                                            ? 'bg-hdr-yellow text-hdr-black shadow-sm'
                                            : 'text-hdr-white hover:bg-gray-800 hover:text-hdr-yellow active:bg-gray-600'}`, children: [_jsx(Icon, { className: "w-5 h-5 mr-3 flex-shrink-0" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-base lg:text-sm", children: item.label }), _jsx("div", { className: "text-xs opacity-75", children: item.description })] })] }) }, item.id));
                            }) }) }), _jsx("div", { className: "p-4 lg:p-6 border-t border-gray-800 mt-auto", children: _jsxs("button", { onClick: logout, className: "w-full flex items-center px-4 py-3 lg:py-2.5 text-hdr-white hover:bg-gray-800 hover:text-hdr-yellow active:bg-gray-600 rounded-lg transition-all duration-200 touch-manipulation", children: [_jsx(LogOut, { className: "w-5 h-5 mr-3 flex-shrink-0" }), _jsx("span", { className: "font-medium text-base lg:text-sm", children: "Sair" })] }) })] })] }));
};
