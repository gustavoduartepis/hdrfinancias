import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Users,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  DollarSign
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  totalRevenue: number;
  lastProject: string;
  status: 'active' | 'inactive' | 'prospect';
  contractType: 'fixed' | 'project' | 'both';
}

// Dados de clientes agora vêm apenas do contexto global

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-red-100 text-red-800';
    case 'prospect': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Ativo';
    case 'inactive': return 'Inativo';
    case 'prospect': return 'Prospect';
    default: return status;
  }
};

const getContractTypeLabel = (type: string) => {
  switch (type) {
    case 'fixed': return 'Fixo';
    case 'project': return 'Projeto';
    case 'both': return 'Ambos';
    default: return type;
  }
};

export const ClientsPage: React.FC = () => {
  const { state, deleteClient, updateClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'prospect'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      deleteClient(id);
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedClient(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-hdr-black hdr-logo">Clientes</h1>
            <span className="text-3xl font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <p className="text-gray-600 mt-1">
            Gerencie seus clientes e projetos
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-hdr-black text-hdr-white px-4 py-2 rounded-lg hover:bg-hdr-yellow hover:text-hdr-black transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-hdr-black mt-2">
                {totalClients}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <Users className="w-6 h-6 text-hdr-black" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-hdr-yellow mt-2">
                {activeClients}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="w-6 h-6 text-hdr-yellow" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-hdr-black mt-2">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <DollarSign className="w-6 h-6 text-hdr-black" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prospects</p>
              <p className="text-2xl font-bold text-hdr-yellow mt-2">
                {prospects}
              </p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Users className="w-6 h-6 text-hdr-yellow" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-hdr-yellow" />
              <input
                type="text"
                placeholder="Buscar por nome, email ou empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-hdr-yellow" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive' | 'prospect')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
              <option value="prospect">Prospects</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-hdr-black">
              Clientes ({filteredClients.length})
            </h3>
            <span className="text-lg font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <div key={client.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-hdr-black truncate">{client.name}</h4>
                    {client.company && (
                      <p className="text-sm text-gray-500">{client.company}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">{client.email}</p>
                    {client.phone && (
                      <p className="text-sm text-gray-500">{client.phone}</p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getStatusColor(client.status)
                    }`}>
                      {getStatusLabel(client.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                  <span className="truncate">{client.address}</span>
                  <span>•</span>
                  <span className="truncate">{getContractTypeLabel(client.contractType)}</span>
                  <span>•</span>
                  <span className="font-medium text-hdr-yellow">{formatCurrency(client.totalRevenue)}</span>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewClient(client)}
                    className="p-1.5 text-hdr-yellow hover:bg-hdr-yellow hover:bg-opacity-10 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditClient(client)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Localização
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Tipo de Contrato
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Receita Total
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{client.name}</div>
                      {client.company && (
                        <div className="text-gray-500">{client.company}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Último: {client.lastProject}
                      </div>
                      {client.contractProposal && (
                        <div className="text-xs text-blue-600 mt-1 truncate">
                          Proposta: {client.contractProposal.substring(0, 50)}...
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="truncate max-w-xs">{client.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{client.address}</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getContractTypeLabel(client.contractType)}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-hdr-yellow hidden lg:table-cell">
                    {formatCurrency(client.totalRevenue)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(client.status)
                    }`}>
                      {getStatusLabel(client.status)}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-hdr-yellow hover:text-hdr-black"
                        onClick={() => handleViewClient(client)}
                        title="Visualizar cliente"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-hdr-yellow hover:text-hdr-black"
                        onClick={() => handleEditClient(client)}
                        title="Editar cliente"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteClient(client.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddForm && (
        <AddClientModal
          onClose={() => setShowAddForm(false)}
        />
      )}

      {/* View Client Modal */}
      {showViewModal && selectedClient && (
        <ViewClientModal
          client={selectedClient}
          onClose={closeModals}
        />
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onClose={closeModals}
          onSave={updateClient}
        />
      )}
    </div>
  );
};

// Add Client Modal Component
interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const { addClient } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    contractProposal: '',
    address: '',
    status: 'prospect' as 'active' | 'inactive' | 'prospect',
    contractType: 'project' as 'fixed' | 'project' | 'both'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newClient: Client = {
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

  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (formato brasileiro)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Aplica a formatação baseada na quantidade de dígitos
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `${limitedNumbers.slice(0, 2)} ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      setFormData(prev => ({
        ...prev,
        [name]: formatPhoneNumber(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-hdr-white rounded-lg w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-semibold text-hdr-black">Novo Cliente</h3>
              <span className="text-lg sm:text-xl font-bold text-hdr-yellow hdr-asterisk">*</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome do Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                placeholder="Digite o nome completo do cliente"
              />
            </div>

            {/* Nome da Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                placeholder="Digite o nome da empresa"
              />
            </div>

            {/* Informações de Contato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                  placeholder="email@exemplo.com (opcional)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                  placeholder="Digite o telefone (formatação automática)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato brasileiro: 99 99999-9999
                </p>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço/Localização
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                placeholder="Cidade, Estado"
              />
            </div>

            {/* Proposta de Contrato */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposta de Contrato
              </label>
              <textarea
                name="contractProposal"
                value={formData.contractProposal}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                placeholder="Descreva os detalhes da proposta de contrato, valores, escopo do trabalho, prazos, etc."
              />
            </div>

            {/* Status e Tipo de Contrato */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                >
                  <option value="prospect">Prospect</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contrato
                </label>
                <select
                  name="contractType"
                  value={formData.contractType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent"
                >
                  <option value="project">Projeto</option>
                  <option value="fixed">Fixo</option>
                  <option value="both">Ambos</option>
                </select>
              </div>
            </div>

            {/* Botões */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black active:bg-yellow-500 transition-colors touch-manipulation font-medium"
            >
              Salvar Cliente
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// View Client Modal Component
interface ViewClientModalProps {
  client: Client;
  onClose: () => void;
}

const ViewClientModal: React.FC<ViewClientModalProps> = ({ client, onClose }) => {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'prospect': return 'Prospect';
      default: return status;
    }
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed': return 'Fixo';
      case 'project': return 'Projeto';
      case 'both': return 'Ambos';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-hdr-black">Detalhes do Cliente</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.company || 'Não informado'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.email || 'Não informado'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.phone}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
            <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.address}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Último Projeto</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{client.lastProject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receita Total</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">R$ {client.totalRevenue.toLocaleString('pt-BR')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{getStatusLabel(client.status)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Contrato</label>
              <p className="text-gray-900 bg-gray-50 p-2 rounded">{getContractTypeLabel(client.contractType)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Client Modal Component
interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onSave: (clientData: Client) => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onClose, onSave }) => {
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

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else {
      return `${numbers.slice(0, 2)} ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedClient: Client = {
      ...client,
      ...formData,
      company: formData.company || undefined
    };
    onSave(updatedClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-hdr-black">Editar Cliente</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Fechar modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
                placeholder="email@exemplo.com (opcional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
                placeholder="99 99999-9999"
              />
              <p className="text-xs text-gray-500 mt-1">Formato: 99 99999-9999</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Endereço *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Último Projeto
            </label>
            <input
              type="text"
              name="lastProject"
              value={formData.lastProject}
              onChange={handleChange}
              className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
              >
                <option value="prospect">Prospect</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Contrato
              </label>
              <select
                name="contractType"
                value={formData.contractType}
                onChange={handleChange}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-transparent text-base sm:text-sm"
              >
                <option value="project">Projeto</option>
                <option value="fixed">Fixo</option>
                <option value="both">Ambos</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-colors touch-manipulation font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-hdr-black text-hdr-white rounded-lg hover:bg-hdr-yellow hover:text-hdr-black active:bg-yellow-500 transition-colors touch-manipulation font-medium"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientsPage;