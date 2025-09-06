import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useMemo } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown, DollarSign, Calendar, Download } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
export const ReportsPage = () => {
    const { state } = useApp();
    const [selectedPeriod, setSelectedPeriod] = useState('current_month');
    const [selectedChart, setSelectedChart] = useState('bar');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    // Filter transactions based on selected period
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return state.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            switch (selectedPeriod) {
                case 'current_month':
                    return transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear;
                case 'last_month':
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return transactionDate.getMonth() === lastMonth &&
                        transactionDate.getFullYear() === lastMonthYear;
                case 'last_3_months':
                    const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
                    return transactionDate >= threeMonthsAgo;
                case 'last_6_months':
                    const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
                    return transactionDate >= sixMonthsAgo;
                case 'custom':
                    if (customStartDate && customEndDate) {
                        const startDate = new Date(customStartDate);
                        const endDate = new Date(customEndDate);
                        return transactionDate >= startDate && transactionDate <= endDate;
                    }
                    return true;
                default:
                    return true;
            }
        });
    }, [state.transactions, selectedPeriod, customStartDate, customEndDate]);
    // Calculate real data from filtered transactions
    const reportData = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income');
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
        const netProfit = totalIncome - totalExpenses;
        const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
        // Group by category
        const incomeByCategory = income.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
        const expensesByCategory = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
        return {
            totalIncome,
            totalExpenses,
            netProfit,
            profitMargin,
            incomeByCategory,
            expensesByCategory,
            transactionCount: filteredTransactions.length
        };
    }, [filteredTransactions]);
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h1", { className: "text-3xl font-bold text-hdr-black hdr-logo", children: "Relat\u00F3rios" }), _jsx("span", { className: "text-3xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("p", { className: "text-gray-600 mt-1", children: "An\u00E1lises e gr\u00E1ficos financeiros" })] }), _jsx("div", { className: "flex items-center space-x-3", children: _jsxs("button", { className: "bg-hdr-yellow text-hdr-black px-4 py-2 rounded-lg hover:bg-yellow-400 hover:shadow-md transition-all duration-200 flex items-center space-x-2 font-medium", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Exportar PDF" })] }) })] }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6", children: _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-hdr-yellow" }), _jsx("label", { className: "text-sm font-medium text-gray-700", children: "Per\u00EDodo:" }), _jsxs("select", { value: selectedPeriod, onChange: (e) => setSelectedPeriod(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", children: [_jsx("option", { value: "current_month", children: "Este m\u00EAs" }), _jsx("option", { value: "last_month", children: "M\u00EAs passado" }), _jsx("option", { value: "last_3_months", children: "\u00DAltimos 3 meses" }), _jsx("option", { value: "last_6_months", children: "\u00DAltimos 6 meses" }), _jsx("option", { value: "custom", children: "Data espec\u00EDfica" })] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(BarChart3, { className: "w-5 h-5 text-hdr-yellow" }), _jsx("label", { className: "text-sm font-medium text-gray-700", children: "Tipo de Gr\u00E1fico:" }), _jsxs("select", { value: selectedChart, onChange: (e) => setSelectedChart(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", children: [_jsx("option", { value: "bar", children: "Barras" }), _jsx("option", { value: "line", children: "Linha" }), _jsx("option", { value: "pie", children: "Pizza" })] })] })] }), selectedPeriod === 'custom' && (_jsxs("div", { className: "flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Data inicial:" }), _jsx("input", { type: "date", value: customStartDate, onChange: (e) => setCustomStartDate(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: "Data final:" }), _jsx("input", { type: "date", value: customEndDate, onChange: (e) => setCustomEndDate(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow" })] })] }))] }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: [_jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total de Receitas" }), _jsx("p", { className: "text-2xl font-bold text-hdr-yellow mt-2", children: formatCurrency(reportData.totalIncome) })] }), _jsx("div", { className: "p-3 rounded-full bg-hdr-yellow bg-opacity-10", children: _jsx(TrendingUp, { className: "w-6 h-6 text-hdr-yellow" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total de Despesas" }), _jsx("p", { className: "text-2xl font-bold text-gray-600 mt-2", children: formatCurrency(reportData.totalExpenses) })] }), _jsx("div", { className: "p-3 rounded-full bg-gray-100", children: _jsx(TrendingDown, { className: "w-6 h-6 text-gray-600" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Lucro L\u00EDquido" }), _jsx("p", { className: `text-2xl font-bold mt-2 ${reportData.netProfit >= 0 ? 'text-hdr-yellow' : 'text-red-600'}`, children: formatCurrency(reportData.netProfit) })] }), _jsx("div", { className: `p-3 rounded-full ${reportData.netProfit >= 0 ? 'bg-hdr-yellow bg-opacity-10' : 'bg-red-100'}`, children: _jsx(DollarSign, { className: `w-6 h-6 ${reportData.netProfit >= 0 ? 'text-hdr-yellow' : 'text-red-600'}` }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Margem de Lucro" }), _jsxs("p", { className: `text-2xl font-bold mt-2 ${reportData.profitMargin >= 0 ? 'text-hdr-black' : 'text-red-600'}`, children: [reportData.profitMargin.toFixed(1), "%"] })] }), _jsx("div", { className: "p-3 rounded-full bg-gray-100", children: _jsx(PieChart, { className: "w-6 h-6 text-hdr-black" }) })] }) })] }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-4 lg:px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h3", { className: "text-lg font-semibold text-hdr-black", children: "Lan\u00E7amentos do Per\u00EDodo" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsxs("span", { className: "text-sm text-gray-500", children: [reportData.transactionCount, " lan\u00E7amento(s)"] })] }) }), filteredTransactions.length === 0 ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "text-gray-400 mb-2", children: _jsx(BarChart3, { className: "w-12 h-12 mx-auto" }) }), _jsx("p", { className: "text-gray-500", children: "Nenhum lan\u00E7amento encontrado para o per\u00EDodo selecionado" })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Data" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Descri\u00E7\u00E3o" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell", children: "Categoria" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Cliente" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell", children: "Pessoa" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Tipo" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Valor" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredTransactions.map((transaction) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: new Date(transaction.date).toLocaleDateString('pt-BR') }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm font-medium text-gray-900", children: transaction.description }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell", children: transaction.category }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell", children: transaction.client || '-' }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell", children: transaction.personName || '-' }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                        ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                                                        : 'bg-gray-100 text-gray-800'}`, children: transaction.type === 'income' ? 'Receita' : 'Despesa' }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("span", { className: transaction.type === 'income' ? 'text-hdr-yellow font-semibold' : 'text-gray-600 font-semibold', children: [transaction.type === 'income' ? '+' : '-', formatCurrency(transaction.amount)] }) })] }, transaction.id))) })] }) }))] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6", children: [_jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-hdr-black", children: "Receitas por Categoria" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("div", { className: "space-y-3", children: Object.entries(reportData.incomeByCategory).length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Nenhuma receita no per\u00EDodo" })) : (Object.entries(reportData.incomeByCategory).map(([category, amount]) => {
                                    const percentage = reportData.totalIncome > 0 ? (amount / reportData.totalIncome) * 100 : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-4 h-4 bg-hdr-yellow rounded" }), _jsx("span", { className: "font-medium text-gray-900", children: category })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "font-semibold text-gray-900", children: formatCurrency(amount) }), _jsxs("div", { className: "text-sm text-gray-500", children: [percentage.toFixed(1), "%"] })] })] }, category));
                                })) })] }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-hdr-black", children: "Despesas por Categoria" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("div", { className: "space-y-3", children: Object.entries(reportData.expensesByCategory).length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Nenhuma despesa no per\u00EDodo" })) : (Object.entries(reportData.expensesByCategory).map(([category, amount]) => {
                                    const percentage = reportData.totalExpenses > 0 ? (amount / reportData.totalExpenses) * 100 : 0;
                                    return (_jsxs("div", { className: "flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-4 h-4 bg-gray-500 rounded" }), _jsx("span", { className: "font-medium text-gray-900", children: category })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "font-semibold text-gray-900", children: formatCurrency(amount) }), _jsxs("div", { className: "text-sm text-gray-500", children: [percentage.toFixed(1), "%"] })] })] }, category));
                                })) })] })] })] }));
};
