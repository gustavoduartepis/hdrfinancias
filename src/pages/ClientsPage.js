import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Plus, Search, Filter, Users, Mail, Phone, MapPin, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
// Dados de clientes agora vêm apenas do contexto global
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};
const getStatusColor = (status) => {
    switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-red-100 text-red-800';
        case 'prospect': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
const getStatusLabel = (status) => {
    switch (status) {
        case 'active': return 'Ativo';
        case 'inactive': return 'Inativo';
        case 'prospect': return 'Prospect';
        default: return status;
    }
};
const getContractTypeLabel = (type) => {
    switch (type) {
        case 'fixed': return 'Fixo';
        case 'project': return 'Projeto';
        case 'both': return 'Ambos';
        default: return type;
    }
};
export const ClientsPage = () => {
    const { state, deleteClient, updateClient } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    // Usar apenas os dados reais do contexto
    const clients = state.clients;
    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === 'all' || client.status === filterStatus;
        return matchesSearch && matchesFilter;
    });
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalRevenue = clients.reduce((sum, c) => sum + c.totalRevenue, 0);
    const prospects = clients.filter(c => c.status === 'prospect').length;
    const handleDeleteClient = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
            deleteClient(id);
        }
    };
    const handleViewClient = (client) => {
        setSelectedClient(client);
        setShowViewModal(true);
    };
    const handleEditClient = (client) => {
        setSelectedClient(client);
        setShowEditModal(true);
    };
    const closeModals = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setSelectedClient(null);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h1", { className: "text-3xl font-bold text-hdr-black hdr-logo", children: "Clientes" }), _jsx("span", { className: "text-3xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("p", { className: "text-gray-600 mt-1", children: "Gerencie seus clientes e projetos" })] }), _jsxs("button", { onClick: () => setShowAddForm(true), className: "bg-hdr-black text-hdr-white px-4 py-2 rounded-lg hover:bg-hdr-yellow hover:text-hdr-black transition-colors flex items-center space-x-2", children: [_jsx(Plus, { className: "w-4 h-4" }), _jsx("span", { children: "Novo Cliente" })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: [_jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total de Clientes" }), _jsx("p", { className: "text-2xl font-bold text-hdr-black mt-2", children: totalClients })] }), _jsx("div", { className: "p-3 rounded-full bg-gray-100", children: _jsx(Users, { className: "w-6 h-6 text-hdr-black" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Clientes Ativos" }), _jsx("p", { className: "text-2xl font-bold text-hdr-yellow mt-2", children: activeClients })] }), _jsx("div", { className: "p-3 rounded-full bg-yellow-100", children: _jsx(Users, { className: "w-6 h-6 text-hdr-yellow" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Receita Total" }), _jsx("p", { className: "text-2xl font-bold text-hdr-black mt-2", children: formatCurrency(totalRevenue) })] }), _jsx("div", { className: "p-3 rounded-full bg-gray-100", children: _jsx(DollarSign, { className: "w-6 h-6 text-hdr-black" }) })] }) }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Prospects" }), _jsx("p", { className: "text-2xl font-bold text-hdr-yellow mt-2", children: prospects })] }), _jsx("div", { className: "p-3 rounded-full bg-yellow-100", children: _jsx(Users, { className: "w-6 h-6 text-hdr-yellow" }) })] }) })] }), _jsx("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6", children: _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx("div", { className: "flex-1 min-w-0", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-hdr-yellow" }), _jsx("input", { type: "text", placeholder: "Buscar por nome, email ou empresa...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent" })] }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { className: "w-5 h-5 text-hdr-yellow" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", children: [_jsx("option", { value: "all", children: "Todos os Status" }), _jsx("option", { value: "active", children: "Ativos" }), _jsx("option", { value: "inactive", children: "Inativos" }), _jsx("option", { value: "prospect", children: "Prospects" })] })] })] }) }), _jsxs("div", { className: "bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden", children: [_jsx("div", { className: "px-4 lg:px-6 py-4 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("h3", { className: "text-lg font-semibold text-hdr-black", children: ["Clientes (", filteredClients.length, ")"] }), _jsx("span", { className: "text-lg font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }) }), _jsx("div", { className: "block md:hidden", children: _jsx("div", { className: "divide-y divide-gray-200", children: filteredClients.map((client) => (_jsxs("div", { className: "p-4 hover:bg-gray-50", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "font-medium text-hdr-black truncate", children: client.name }), client.company && (_jsx("p", { className: "text-sm text-gray-500", children: client.company })), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: client.email }), client.phone && (_jsx("p", { className: "text-sm text-gray-500", children: client.phone }))] }), _jsx("div", { className: "ml-4", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`, children: getStatusLabel(client.status) }) })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3", children: [_jsx("span", { className: "truncate", children: client.address }), _jsx("span", { children: "\u2022" }), _jsx("span", { className: "truncate", children: getContractTypeLabel(client.contractType) }), _jsx("span", { children: "\u2022" }), _jsx("span", { className: "font-medium text-hdr-yellow", children: formatCurrency(client.totalRevenue) })] }), _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsx("button", { onClick: () => handleViewClient(client), className: "p-1.5 text-hdr-yellow hover:bg-hdr-yellow hover:bg-opacity-10 rounded transition-colors", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleEditClient(client), className: "p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { onClick: () => handleDeleteClient(client.id), className: "p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] }, client.id))) }) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Cliente" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Contato" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Localiza\u00E7\u00E3o" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Tipo de Contrato" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell", children: "Receita Total" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "A\u00E7\u00F5es" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredClients.map((client) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 lg:px-6 py-4 text-sm text-gray-900", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: client.name }), client.company && (_jsx("div", { className: "text-gray-500", children: client.company })), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: ["\u00DAltimo: ", client.lastProject] }), client.contractProposal && (_jsxs("div", { className: "text-xs text-blue-600 mt-1 truncate", children: ["Proposta: ", client.contractProposal.substring(0, 50), "..."] }))] }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 text-sm text-gray-900", children: _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Mail, { className: "w-4 h-4 text-gray-400 mr-2" }), _jsx("span", { className: "truncate max-w-xs", children: client.email })] }), _jsxs("div", { className: "flex items-center", children: [_jsx(Phone, { className: "w-4 h-4 text-gray-400 mr-2" }), _jsx("span", { children: client.phone })] })] }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell", children: _jsxs("div", { className: "flex items-center", children: [_jsx(MapPin, { className: "w-4 h-4 text-gray-400 mr-2" }), _jsx("span", { children: client.address })] }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell", children: _jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800", children: getContractTypeLabel(client.contractType) }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-hdr-yellow hidden lg:table-cell", children: formatCurrency(client.totalRevenue) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`, children: getStatusLabel(client.status) }) }), _jsx("td", { className: "px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("button", { className: "text-hdr-yellow hover:text-hdr-black", onClick: () => handleViewClient(client), title: "Visualizar cliente", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-hdr-yellow hover:text-hdr-black", onClick: () => handleEditClient(client), title: "Editar cliente", children: _jsx(Edit, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-red-600 hover:text-red-800", onClick: () => handleDeleteClient(client.id), children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, client.id))) })] }) })] }), showAddForm && (_jsx(AddClientModal, { onClose: () => setShowAddForm(false) })), showViewModal && selectedClient && (_jsx(ViewClientModal, { client: selectedClient, onClose: closeModals })), showEditModal && selectedClient && (_jsx(EditClientModal, { client: selectedClient, onClose: closeModals, onSave: updateClient }))] }));
};
const AddClientModal = ({ onClose }) => {
    const { addClient } = useApp();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        contractProposal: '',
        address: '',
        status: 'prospect',
        contractType: 'project'
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        const newClient = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || undefined,
            address: formData.address,
            totalRevenue: 0,
            lastProject: 'Novo cliente',
            status: formData.status,
            contractType: formData.contractType
        };
        addClient(newClient);
        onClose();
    };
    const formatPhoneNumber = (value) => {
        // Remove todos os caracteres não numéricos
        const numbers = value.replace(/\D/g, '');
        // Limita a 11 dígitos (formato brasileiro)
        const limitedNumbers = numbers.slice(0, 11);
        // Aplica a formatação baseada na quantidade de dígitos
        if (limitedNumbers.length <= 2) {
            return limitedNumbers;
        }
        else if (limitedNumbers.length <= 6) {
            return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2)}`;
        }
        else if (limitedNumbers.length <= 10) {
            return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
        }
        else {
            return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            setFormData(prev => ({
                ...prev,
                [name]: formatPhoneNumber(value)
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsx("div", { className: "bg-hdr-white rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto", children: _jsxs("div", { className: "p-4 sm:p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-4 sm:mb-6", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("h3", { className: "text-lg sm:text-xl font-semibold text-hdr-black", children: "Novo Cliente" }), _jsx("span", { className: "text-lg sm:text-xl font-bold text-hdr-yellow hdr-asterisk", children: "*" })] }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "Fechar modal", children: "\u2715" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome do Cliente *" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "Digite o nome completo do cliente" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome da Empresa" }), _jsx("input", { type: "text", name: "company", value: formData.company, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "Digite o nome da empresa" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "email@exemplo.com (opcional)" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Telefone *" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "Digite o telefone (formata\u00E7\u00E3o autom\u00E1tica)" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Formato brasileiro: 99 99999-9999" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Endere\u00E7o/Localiza\u00E7\u00E3o" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "Cidade, Estado" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Proposta de Contrato" }), _jsx("textarea", { name: "contractProposal", value: formData.contractProposal, onChange: handleChange, rows: 4, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", placeholder: "Descreva os detalhes da proposta de contrato, valores, escopo do trabalho, prazos, etc." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", children: [_jsx("option", { value: "prospect", children: "Prospect" }), _jsx("option", { value: "active", children: "Ativo" }), _jsx("option", { value: "inactive", children: "Inativo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Contrato" }), _jsxs("select", { name: "contractType", value: formData.contractType, onChange: handleChange, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent", children: [_jsx("option", { value: "project", children: "Projeto" }), _jsx("option", { value: "fixed", children: "Fixo" }), _jsx("option", { value: "both", children: "Ambos" })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6", children: [_jsx("button", { type: "button", onClick: onClose, className: "w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation font-medium", children: "Cancelar" }), _jsx("button", { type: "submit", className: "w-full sm:w-auto px-4 py-3 sm:py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black active:bg-yellow-500 transition-colors touch-manipulation font-medium", children: "Salvar Cliente" })] })] })] }) }) }));
};
const ViewClientModal = ({ client, onClose }) => {
    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Ativo';
            case 'inactive': return 'Inativo';
            case 'prospect': return 'Prospect';
            default: return status;
        }
    };
    const getContractTypeLabel = (type) => {
        switch (type) {
            case 'fixed': return 'Fixo';
            case 'project': return 'Projeto';
            case 'both': return 'Ambos';
            default: return type;
        }
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-hdr-black", children: "Detalhes do Cliente" }), _jsx("button", { onClick: onClose, className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Nome" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Empresa" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.company || 'Não informado' })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Email" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.email || 'Não informado' })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Telefone" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.phone })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Endere\u00E7o" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.address })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "\u00DAltimo Projeto" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: client.lastProject })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Receita Total" }), _jsxs("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: ["R$ ", client.totalRevenue.toLocaleString('pt-BR')] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Status" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: getStatusLabel(client.status) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tipo de Contrato" }), _jsx("p", { className: "text-gray-900 bg-gray-50 p-2 rounded", children: getContractTypeLabel(client.contractType) })] })] })] }), _jsx("div", { className: "flex justify-end mt-6", children: _jsx("button", { onClick: onClose, className: "px-4 py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black transition-colors", children: "Fechar" }) })] }) }));
};
const EditClientModal = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company || '',
        address: client.address,
        lastProject: client.lastProject,
        status: client.status,
        contractType: client.contractType
    });
    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length <= 2) {
            return numbers;
        }
        else if (numbers.length <= 7) {
            return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
        }
        else if (numbers.length <= 11) {
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
        else {
            return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setFormData(prev => ({ ...prev, [name]: formattedPhone }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedClient = {
            ...client,
            ...formData,
            company: formData.company || undefined
        };
        onSave(updatedClient);
        onClose();
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 sm:mb-6", children: [_jsx("h2", { className: "text-lg sm:text-2xl font-bold text-hdr-black", children: "Editar Cliente" }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", "aria-label": "Fechar modal", children: "\u2715" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 sm:space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Nome *" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, required: true, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Empresa" }), _jsx("input", { type: "text", name: "company", value: formData.company, onChange: handleChange, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Email" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm", placeholder: "email@exemplo.com (opcional)" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Telefone *" }), _jsx("input", { type: "tel", name: "phone", value: formData.phone, onChange: handleChange, required: true, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm", placeholder: "99 99999-9999" }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Formato: 99 99999-9999" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Endere\u00E7o *" }), _jsx("input", { type: "text", name: "address", value: formData.address, onChange: handleChange, required: true, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u00DAltimo Projeto" }), _jsx("input", { type: "text", name: "lastProject", value: formData.lastProject, onChange: handleChange, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Status" }), _jsxs("select", { name: "status", value: formData.status, onChange: handleChange, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm", children: [_jsx("option", { value: "prospect", children: "Prospect" }), _jsx("option", { value: "active", children: "Ativo" }), _jsx("option", { value: "inactive", children: "Inativo" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Tipo de Contrato" }), _jsxs("select", { name: "contractType", value: formData.contractType, onChange: handleChange, className: "w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm", children: [_jsx("option", { value: "project", children: "Projeto" }), _jsx("option", { value: "fixed", children: "Fixo" }), _jsx("option", { value: "both", children: "Ambos" })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6", children: [_jsx("button", { type: "button", onClick: onClose, className: "w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation font-medium", children: "Cancelar" }), _jsx("button", { type: "submit", className: "w-full sm:w-auto px-4 py-3 sm:py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black active:bg-yellow-500 transition-colors touch-manipulation font-medium", children: "Salvar Altera\u00E7\u00F5es" })] })] })] }) }));
};
export default ClientsPage;
