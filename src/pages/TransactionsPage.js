import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, DollarSign, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
};
const AddTransactionModal = ({ onClose }) => {
    const { addTransaction, state } = useApp();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: 'income',
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        client: '',
        personName: ''
    });
    const categories = {
        income: ['Receita Fixa', 'Receita Extra', 'Serviços', 'Consultoria', 'Vendas'],
        expense: ['Despesas Fixas', 'Equipamentos', 'Marketing', 'Infraestrutura', 'Pessoal', 'Salário', 'Outros']
    };
    // Reset form when modal opens
    useEffect(() => {
        setFormData({
            type: 'income',
            description: '',
            amount: '',
            category: '',
            date: new Date().toISOString().split('T')[0],
            client: '',
            personName: ''
        });
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.description || !formData.amount || !formData.category) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        const transaction = {
            type: formData.type,
            description: formData.description,
            amount: parseFloat(formData.amount),
            category: formData.category,
            date: formData.date,
            client: formData.client || undefined,
            personName: formData.personName || undefined,
            createdBy: user ? {
                id: user.id,
                name: user.name,
                email: user.email
            } : undefined,
            createdAt: new Date().toISOString()
        };
        addTransaction(transaction);
        onClose();
    };
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-hdr-white rounded-lg w-full max-w-lg shadow-xl max-h-[95vh] overflow-y-auto", children: _jsxs("div", { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h3", { className: "text-lg sm:text-xl font-semibold text-hdr-black", children: "Novo Lan\u00E7amento" }), _jsx("span", { className: "text-lg sm:text-xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "Fechar modal", children: "\u2715" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo *" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { type: "button", onClick: () => handleInputChange('type', 'income'), className: `p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${formData.type === 'income'
                                                    ? 'border-hdr-yellow bg-hdr-yellow bg-opacity-10 text-hdr-black'
                                                    : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'}`, children: [_jsx(TrendingUp, { className: "w-5 h-5 mx-auto mb-1" }), _jsx("span", { className: "text-sm font-medium", children: "Receita" })] }), _jsxs("button", { type: "button", onClick: () => handleInputChange('type', 'expense'), className: `p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${formData.type === 'expense'
                                                    ? 'border-red-500 bg-red-50 text-red-700'
                                                    : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'}`, children: [_jsx(TrendingDown, { className: "w-5 h-5 mx-auto mb-1" }), _jsx("span", { className: "text-sm font-medium", children: "Despesa" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Descri\u00E7\u00E3o *" }), _jsx("input", { type: "text", value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "Ex: Pagamento Cliente ABC", className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Valor *" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-sm", children: "R$" }), _jsx("input", { type: "number", step: "0.01", min: "0", value: formData.amount, onChange: (e) => handleInputChange('amount', e.target.value), placeholder: "0,00", className: "w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Categoria *" }), _jsxs("select", { value: formData.category, onChange: (e) => handleInputChange('category', e.target.value), className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm", required: true, children: [_jsx("option", { value: "", children: "Selecione uma categoria" }), categories[formData.type].map((category) => (_jsx("option", { value: category, children: category }, category)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Data *" }), _jsx("input", { type: "date", value: formData.date, onChange: (e) => handleInputChange('date', e.target.value), className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Cliente (opcional)" }), _jsxs("select", { value: formData.client, onChange: (e) => handleInputChange('client', e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", children: [_jsx("option", { value: "", children: "Selecione um cliente" }), state.clients
                                                .filter(client => client.status === 'active')
                                                .map((client) => (_jsxs("option", { value: client.name, children: [client.name, " ", client.company ? `- ${client.company}` : ''] }, client.id)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome da Pessoa (opcional)" }), _jsx("input", { type: "text", value: formData.personName, onChange: (e) => handleInputChange('personName', e.target.value), placeholder: "Ex: Jo\u00E3o Silva", className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow" })] }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6", children: [_jsx("button", { type: "button", onClick: onClose, className: "w-full sm:flex-1 bg-gray-100 text-gray-700 px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation font-medium", children: "Cancelar" }), _jsx("button", { type: "submit", className: "w-full sm:flex-1 bg-hdr-yellow text-hdr-black px-4 py-3 sm:py-2 rounded-lg hover:bg-yellow-400 active:bg-yellow-500 transition-colors font-medium touch-manipulation", children: "Salvar Lan\u00E7amento" })] })] })] }) }) }));
};
const TransactionsPage = () => {
    const { state, deleteTransaction } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const transactions = state.transactions;
    const filteredTransactions = state.transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (transaction.client && transaction.client.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterType === 'all' || transaction.type === filterType;
        return matchesSearch && matchesFilter;
    });
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    const handleDeleteTransaction = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            deleteTransaction(id);
        }
    };
    const handleEditTransaction = (transaction) => {
        // Implementar edição de transação no futuro
        console.log('Editar transação:', transaction);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h1", { className: "text-3xl font-bold text-hdr-black hdr-logo", children: "Lan\u00E7amentos" }), _jsx("span", { className: "text-3xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerencie suas receitas e despesas" })] }), _jsxs("button", { onClick: () => setShowAddForm(true), className: "bg-hdr-yellow text-hdr-black px-4 py-2 rounded-lg hover:bg-yellow-400 hover:shadow-md transition-all duration-200 flex items-center space-x-2 font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Novo Lan\u00E7amento" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6", children: [_jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total de Receitas" }), _jsx("p", { className: "text-2xl font-bold text-hdr-yellow mt-2", children: formatCurrency(totalIncome) })] }), _jsx("div", { className: "p-3 rounded-full bg-hdr-yellow bg-opacity-10", children: _jsx(TrendingUp, { className: "w-6 h-6 text-hdr-yellow" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total de Despesas" }), _jsx("p", { className: "text-2xl font-bold text-gray-600 mt-2", children: formatCurrency(totalExpenses) })] }), _jsx("div", { className: "p-3 rounded-full bg-gray-100", children: _jsx(TrendingDown, { className: "w-6 h-6 text-gray-600" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Saldo" }), _jsx("p", { className: `text-2xl font-bold mt-2 ${balance >= 0 ? 'text-hdr-black' : 'text-red-600'}`, children: formatCurrency(balance) })] }), _jsx("div", { className: "p-3 rounded-full bg-hdr-black bg-opacity-10", children: _jsx(DollarSign, { className: "w-6 h-6 text-hdr-black" }) })] }) })] }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Buscar por descri\u00E7\u00E3o, categoria ou cliente...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow" })] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "w-5 h-5 text-gray-400" }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow", children: [_jsx("option", { value: "all", children: "Todos" }), _jsx("option", { value: "income", children: "Receitas" }), _jsx("option", { value: "expense", children: "Despesas" })] })] })] }) }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-4 lg:px-6 py-4 border-b border-gray-200", children: _jsxs("h3", { className: "text-base lg:text-lg font-semibold text-hdr-black", children: ["Lan\u00E7amentos (", filteredTransactions.length, ")"] }) }), _jsx("div", { className: "block md:hidden", children: _jsx("div", { className: "divide-y divide-gray-200", children: filteredTransactions.map((transaction) => (_jsxs("div", { className: "p-4 hover:bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-medium text-hdr-black truncate", children: transaction.description }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: transaction.category })] }), _jsx("div", { className: "ml-4 text-right", children: _jsxs("span", { className: `font-semibold text-sm ${transaction.type === 'income' ? 'text-hdr-yellow' : 'text-red-500'}`, children: [transaction.type === 'income' ? '+' : '-', formatCurrency(transaction.amount)] }) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3", children: [_jsx("span", { children: formatDate(transaction.date) }), transaction.client && (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u2022" }), _jsx("span", { className: "truncate", children: transaction.client })] })), _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                    ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                                                    : 'bg-gray-100 text-gray-800'}`, children: transaction.type === 'income' ? 'Receita' : 'Despesa' })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { onClick: () => handleEditTransaction(transaction), className: "p-1.5 text-hdr-yellow hover:bg-hdr-yellow hover:bg-opacity-10 rounded transition-colors", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteTransaction(transaction.id), className: "p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, transaction.id))) }) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Data" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Descri\u00E7\u00E3o" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Categoria" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Cliente" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell", children: "Pessoa" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell", children: "Criado por" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Tipo" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Valor" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredTransactions.map((transaction) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell", children: formatDate(transaction.date) }), _jsx("td", { className: "px-4 lg:px-6 py-4 text-sm text-gray-900", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: transaction.description }), _jsx("div", { className: "md:hidden mt-1 text-sm text-gray-500", children: transaction.category }), _jsx("div", { className: "lg:hidden mt-1 text-sm text-gray-500", children: transaction.client || '-' }), _jsx("div", { className: "sm:hidden mt-1", children: _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                                    ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                                                                    : 'bg-gray-100 text-gray-800'}`, children: transaction.type === 'income' ? 'Receita' : 'Despesa' }) }), _jsx("div", { className: "lg:hidden mt-1 text-sm text-gray-500", children: formatDate(transaction.date) })] }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell", children: transaction.category }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell", children: transaction.client || '-' }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell", children: transaction.personName || '-' }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell", children: transaction.createdBy ? transaction.createdBy.name : '-' }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell", children: _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                        ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                                                        : 'bg-gray-100 text-gray-800'}`, children: transaction.type === 'income' ? 'Receita' : 'Despesa' }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium", children: _jsxs("span", { className: transaction.type === 'income' ? 'text-hdr-yellow font-semibold' : 'text-gray-600 font-semibold', children: [transaction.type === 'income' ? '+' : '-', formatCurrency(transaction.amount)] }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-hdr-yellow hover:text-yellow-600 transition-colors", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-red-600 hover:text-red-800 transition-colors", onClick: () => handleDeleteTransaction(transaction.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, transaction.id))) })] }) })] }), showAddForm && _jsx(AddTransactionModal, { onClose: () => setShowAddForm(false) })] }));
};
export default TransactionsPage;
