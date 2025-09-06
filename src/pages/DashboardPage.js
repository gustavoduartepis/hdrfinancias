import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, PiggyBank, Target, Download, Upload } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
const MetricCard = ({ title, value, change, changeType = 'neutral', icon }) => {
    const getChangeColor = () => {
        switch (changeType) {
            case 'positive': return 'text-green-600';
            case 'negative': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };
    const getChangeIcon = () => {
        switch (changeType) {
            case 'positive': return _jsx(TrendingUp, { className: "w-4 h-4" });
            case 'negative': return _jsx(TrendingDown, { className: "w-4 h-4" });
            default: return null;
        }
    };
    return (_jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: title }), _jsx("p", { className: "text-2xl font-bold text-hdr-black mt-2", children: value }), change && (_jsxs("div", { className: `flex items-center mt-2 ${getChangeColor()}`, children: [getChangeIcon(), _jsx("span", { className: "text-sm font-medium ml-1", children: change })] }))] }), _jsx("div", { className: "p-3 rounded-full bg-hdr-yellow", children: _jsx("div", { className: "text-hdr-black", children: icon }) })] }) }));
};
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
export const DashboardPage = () => {
    const { getTotalIncome, getTotalExpenses, getBalance, getActiveClientsCount, state, exportToExcel, importFromExcel } = useApp();
    const fileInputRef = useRef(null);
    const handleExport = () => {
        exportToExcel('backup-sistema-financeiro');
    };
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await importFromExcel(file);
                // Reset input para permitir selecionar o mesmo arquivo novamente
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
            catch (error) {
                console.error('Erro ao importar arquivo:', error);
            }
        }
    };
    const totalIncome = getTotalIncome();
    const totalExpenses = getTotalExpenses();
    const balance = getBalance();
    const activeClients = getActiveClientsCount();
    const totalProjects = state.clients.length; // Usando número de clientes como proxy para projetos
    const currentMonth = new Date().toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
    // Dados calculados dinamicamente a partir das transações
    const getMonthlyData = () => {
        const monthlyStats = {};
        state.transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
            if (!monthlyStats[monthKey]) {
                monthlyStats[monthKey] = { receita: 0, despesa: 0 };
            }
            if (transaction.type === 'income') {
                monthlyStats[monthKey].receita += transaction.amount;
            }
            else {
                monthlyStats[monthKey].despesa += transaction.amount;
            }
        });
        return Object.entries(monthlyStats).map(([month, data]) => ({
            month,
            receita: data.receita,
            despesa: data.despesa
        }));
    };
    const getCategoryData = () => {
        const categoryStats = {};
        const totalIncome = getTotalIncome();
        state.transactions
            .filter(t => t.type === 'income')
            .forEach(transaction => {
            categoryStats[transaction.category] = (categoryStats[transaction.category] || 0) + transaction.amount;
        });
        const colors = ['#FFD11A', '#000000', '#6b7280', '#9ca3af', '#d1d5db'];
        return Object.entries(categoryStats).map(([name, amount], index) => ({
            name,
            value: totalIncome > 0 ? Math.round((amount / totalIncome) * 100) : 0,
            color: colors[index % colors.length]
        }));
    };
    const monthlyData = getMonthlyData();
    const categoryData = getCategoryData();
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h1", { className: "text-3xl font-bold text-hdr-black hdr-logo", children: "Dashboard" }), _jsx("span", { className: "text-2xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Vis\u00E3o geral financeira - ", currentMonth] })] }), _jsxs("div", { className: "flex items-center space-x-2 text-sm text-gray-500", children: [_jsx(Calendar, { className: "w-4 h-4 text-hdr-yellow" }), _jsx("span", { children: "Atualizado em tempo real" })] })] }), _jsx("div", { className: "bg-white rounded-lg shadow-sm border border-gray-200 p-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-hdr-black mb-1", children: "Backup de Dados" }), _jsx("p", { className: "text-sm text-gray-600", children: "Exporte ou importe seus dados para seguran\u00E7a" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3", children: [_jsxs("button", { onClick: handleExport, className: "flex items-center justify-center space-x-2 px-4 py-2 bg-hdr-yellow text-hdr-black rounded-lg hover:bg-yellow-500 transition-colors font-medium w-full sm:w-auto", children: [_jsx(Download, { className: "w-4 h-4" }), _jsx("span", { children: "Exportar Dados" })] }), _jsxs("button", { onClick: handleImportClick, className: "flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-hdr-black rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300 w-full sm:w-auto", children: [_jsx(Upload, { className: "w-4 h-4" }), _jsx("span", { children: "Importar Dados" })] }), _jsx("input", { ref: fileInputRef, type: "file", accept: ".xlsx,.xls", onChange: handleFileChange, className: "hidden" })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6", children: [_jsx(MetricCard, { title: "Receita Total do M\u00EAs", value: formatCurrency(totalIncome), change: "+12.5% vs m\u00EAs anterior", changeType: "positive", icon: _jsx(DollarSign, { className: "w-6 h-6" }), color: "bg-hdr-yellow" }), _jsx(MetricCard, { title: "Clientes Ativos", value: activeClients.toString(), change: "Clientes em andamento", changeType: "neutral", icon: _jsx(Calendar, { className: "w-6 h-6" }), color: "bg-hdr-yellow" }), _jsx(MetricCard, { title: "Total de Projetos", value: totalProjects.toString(), change: "Projetos cadastrados", changeType: "neutral", icon: _jsx(Target, { className: "w-6 h-6" }), color: "bg-hdr-yellow" }), _jsx(MetricCard, { title: "Custos Totais", value: formatCurrency(totalExpenses), change: "-5.3% vs m\u00EAs anterior", changeType: "positive", icon: _jsx(TrendingDown, { className: "w-6 h-6" }), color: "bg-hdr-yellow" }), _jsx(MetricCard, { title: "Lucro L\u00EDquido", value: formatCurrency(balance), change: "+18.7% vs m\u00EAs anterior", changeType: "positive", icon: _jsx(PiggyBank, { className: "w-6 h-6" }), color: "bg-hdr-yellow" }), _jsx(MetricCard, { title: "Transa\u00E7\u00F5es do M\u00EAs", value: state.transactions.filter(t => {
                            const transactionDate = new Date(t.date);
                            const currentDate = new Date();
                            return transactionDate.getMonth() === currentDate.getMonth() &&
                                transactionDate.getFullYear() === currentDate.getFullYear();
                        }).length.toString(), change: "Movimenta\u00E7\u00F5es registradas", changeType: "neutral", icon: _jsx(TrendingUp, { className: "w-6 h-6" }), color: "bg-hdr-yellow" })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6", children: [_jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("h3", { className: "text-base lg:text-lg font-semibold text-hdr-black", children: "Receitas vs Despesas" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow", children: "*" })] }), _jsx("div", { className: "h-56 sm:h-64 lg:h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: monthlyData, margin: { top: 5, right: 5, left: 5, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3" }), _jsx(XAxis, { dataKey: "month", fontSize: 12, tick: { fontSize: 12 } }), _jsx(YAxis, { fontSize: 12, tick: { fontSize: 12 }, tickFormatter: (value) => `${(value / 1000).toFixed(0)}k` }), _jsx(Tooltip, { formatter: (value) => [`R$ ${value.toLocaleString()}`, ''], contentStyle: { fontSize: '12px' } }), _jsx(Bar, { dataKey: "receita", fill: "#FFD11A", name: "Receita" }), _jsx(Bar, { dataKey: "despesa", fill: "#6b7280", name: "Despesa" })] }) }) })] }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("h3", { className: "text-base lg:text-lg font-semibold text-hdr-black", children: "Distribui\u00E7\u00E3o por Categoria" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow", children: "*" })] }), _jsx("div", { className: "h-56 sm:h-64 lg:h-72", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: categoryData, cx: "50%", cy: "50%", innerRadius: 40, outerRadius: 80, paddingAngle: 5, dataKey: "value", children: categoryData.map((entry, index) => (_jsx(Cell, { fill: entry.color }, `cell-${index}`))) }), _jsx(Tooltip, { formatter: (value) => [`${value}%`, ''], contentStyle: { fontSize: '12px' } })] }) }) }), _jsx("div", { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2", children: categoryData.map((item, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-3 h-3 rounded-full mr-2 flex-shrink-0", style: { backgroundColor: item.color } }), _jsxs("span", { className: "text-xs sm:text-sm truncate", children: [item.name, ": ", item.value, "%"] })] }, index))) })] })] }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center space-x-2 mb-4", children: [_jsx("h3", { className: "text-base lg:text-lg font-semibold text-hdr-black", children: "Transa\u00E7\u00F5es Recentes" }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow", children: "*" })] }), _jsxs("div", { className: "space-y-3", children: [state.transactions.slice(0, 5).map((transaction) => (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 space-y-2 sm:space-y-0", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium text-hdr-black truncate", children: transaction.description }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-2", children: [_jsx("span", { className: "truncate", children: transaction.category }), _jsx("span", { className: "hidden sm:inline", children: "\u2022" }), _jsx("span", { className: "whitespace-nowrap", children: new Date(transaction.date).toLocaleDateString('pt-BR') })] })] }), _jsx("div", { className: "flex justify-end sm:justify-start", children: _jsxs("span", { className: `font-semibold text-sm sm:text-base whitespace-nowrap ${transaction.type === 'income' ? 'text-hdr-yellow' : 'text-red-500'}`, children: [transaction.type === 'income' ? '+' : '-', "R$ ", transaction.amount.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2
                                                })] }) })] }, transaction.id))), state.transactions.length === 0 && (_jsx("p", { className: "text-gray-500 text-center py-4", children: "Nenhuma transa\u00E7\u00E3o cadastrada ainda." }))] })] })] }));
};
