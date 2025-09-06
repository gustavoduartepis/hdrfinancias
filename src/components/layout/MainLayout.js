import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardPage } from '../../pages/DashboardPage';
import TransactionsPage from '../../pages/TransactionsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { ClientsPage } from '../../pages/ClientsPage';
export const MainLayout = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return _jsx(DashboardPage, {});
            case 'transactions':
                return _jsx(TransactionsPage, {});
            case 'reports':
                return _jsx(ReportsPage, {});
            case 'clients':
                return _jsx(ClientsPage, {});
            default:
                return _jsx(DashboardPage, {});
        }
    };
    return (_jsxs("div", { className: "flex h-screen bg-gray-50", children: [_jsx(Sidebar, { activeSection: activeSection, onSectionChange: setActiveSection }), _jsx("div", { className: "flex-1 overflow-auto ml-0 lg:ml-0", children: _jsx("main", { className: "p-4 lg:p-6 pt-16 lg:pt-6 min-h-full", children: _jsx("div", { className: "max-w-full overflow-x-auto", children: renderContent() }) }) })] }));
};
