import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import type { Transaction } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';





const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

// Add Transaction Modal Component
interface AddTransactionModalProps {
  onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
  const { addTransaction, state } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'income' as 'income' | 'expense',
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
      type: 'income' as 'income' | 'expense',
      description: '',
      amount: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      client: '',
      personName: ''
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-hdr-white rounded-lg w-full max-w-lg shadow-xl max-h-[95vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg sm:text-xl font-semibold text-hdr-black">Novo Lançamento</h3>
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

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'income')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                    formData.type === 'income'
                      ? 'border-hdr-yellow bg-hdr-yellow bg-opacity-10 text-hdr-black'
                      : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'
                  }`}
                >
                  <TrendingUp className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Receita</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'expense')}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all touch-manipulation ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400 active:bg-gray-50'
                  }`}
                >
                  <TrendingDown className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">Despesa</span>
                </button>
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Ex: Pagamento Cliente ABC"
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm"
                required
              />
            </div>

            {/* Valor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-base sm:text-sm">
                  R$
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories[formData.type].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Data */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow text-base sm:text-sm"
                required
              />
            </div>

            {/* Cliente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente (opcional)
              </label>
              <select
                value={formData.client}
                onChange={(e) => handleInputChange('client', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
              >
                <option value="">Selecione um cliente</option>
                {state.clients
                  .filter(client => client.status === 'active')
                  .map((client) => (
                    <option key={client.id} value={client.name}>
                      {client.name} {client.company ? `- ${client.company}` : ''}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* Nome da Pessoa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Pessoa (opcional)
              </label>
              <input
                type="text"
                value={formData.personName}
                onChange={(e) => handleInputChange('personName', e.target.value)}
                placeholder="Ex: João Silva"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:flex-1 bg-gray-100 text-gray-700 px-4 py-3 sm:py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:flex-1 bg-hdr-yellow text-hdr-black px-4 py-3 sm:py-2 rounded-lg hover:bg-yellow-400 active:bg-yellow-500 transition-colors font-medium touch-manipulation"
              >
                Salvar Lançamento
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TransactionsPage: React.FC = () => {
  const { state, deleteTransaction } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
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

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteTransaction(id);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    // Implementar edição de transação no futuro
    console.log('Editar transação:', transaction);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-hdr-black hdr-logo">Lançamentos</h1>
            <span className="text-3xl font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <p className="text-gray-600 mt-1">
            Gerencie suas receitas e despesas
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-hdr-yellow text-hdr-black px-4 py-2 rounded-lg hover:bg-yellow-400 hover:shadow-md transition-all duration-200 flex items-center space-x-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
              <p className="text-2xl font-bold text-hdr-yellow mt-2">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-hdr-yellow bg-opacity-10">
              <TrendingUp className="w-6 h-6 text-hdr-yellow" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <TrendingDown className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo</p>
              <p className={`text-2xl font-bold mt-2 ${
                balance >= 0 ? 'text-hdr-black' : 'text-red-600'
              }`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-hdr-black bg-opacity-10">
              <DollarSign className="w-6 h-6 text-hdr-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição, categoria ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
            >
              <option value="all">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
            Lançamentos ({filteredTransactions.length})
          </h3>
        </div>
        
        {/* Mobile Card View */}
        <div className="block md:hidden">
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-hdr-black truncate">{transaction.description}</h4>
                    <p className="text-sm text-gray-500 mt-1">{transaction.category}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`font-semibold text-sm ${
                      transaction.type === 'income' ? 'text-hdr-yellow' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                  <span>{formatDate(transaction.date)}</span>
                  {transaction.client && (
                    <>
                      <span>•</span>
                      <span className="truncate">{transaction.client}</span>
                    </>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === 'income'
                      ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>

                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditTransaction(transaction)}
                    className="p-1.5 text-hdr-yellow hover:bg-hdr-yellow hover:bg-opacity-10 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
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
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Data
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Cliente
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Pessoa
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                  Criado por
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{transaction.description}</div>

                      <div className="md:hidden mt-1 text-sm text-gray-500">
                        {transaction.category}
                      </div>
                      <div className="lg:hidden mt-1 text-sm text-gray-500">
                        {transaction.client || '-'}
                      </div>
                      <div className="sm:hidden mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'income'
                            ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </div>
                      <div className="lg:hidden mt-1 text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                    {transaction.category}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                    {transaction.client || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {transaction.personName || '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                    {transaction.createdBy ? transaction.createdBy.name : '-'}
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'income'
                        ? 'bg-hdr-yellow bg-opacity-20 text-hdr-black'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={transaction.type === 'income' ? 'text-hdr-yellow font-semibold' : 'text-gray-600 font-semibold'}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-hdr-yellow hover:text-yellow-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => handleDeleteTransaction(transaction.id)}
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

      {/* Add Transaction Modal */}
      {showAddForm && <AddTransactionModal onClose={() => setShowAddForm(false)} />}
    </div>
  );
};

export default TransactionsPage;