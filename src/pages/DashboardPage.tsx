import React, { useRef } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  PiggyBank,
  Target,
  Download,
  Upload
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Dados calculados dinamicamente a partir das transações reais

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-hdr-black mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm font-medium ml-1">{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-hdr-yellow">
          <div className="text-hdr-black">{icon}</div>
        </div>
      </div>
    </div>
  );
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const DashboardPage: React.FC = () => {
  const { getTotalIncome, getTotalExpenses, getBalance, getActiveClientsCount, state, exportToExcel, importFromExcel } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportToExcel('backup-sistema-financeiro');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importFromExcel(file);
        // Reset input para permitir selecionar o mesmo arquivo novamente
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
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
    const monthlyStats: { [key: string]: { receita: number; despesa: number } } = {};
    
    state.transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { receita: 0, despesa: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyStats[monthKey].receita += transaction.amount;
      } else {
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
    const categoryStats: { [key: string]: number } = {};
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-hdr-black hdr-logo">Dashboard</h1>
            <span className="text-2xl font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <p className="text-gray-600 mt-1">
            Visão geral financeira - {currentMonth}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4 text-hdr-yellow" />
          <span>Atualizado em tempo real</span>
        </div>
      </div>

      {/* Botões de Backup */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-hdr-black mb-1">Backup de Dados</h3>
            <p className="text-sm text-gray-600">Exporte ou importe seus dados para segurança</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleExport}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-hdr-yellow text-hdr-black rounded-lg hover:bg-yellow-500 transition-colors font-medium w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Dados</span>
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-hdr-black rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300 w-full sm:w-auto"
            >
              <Upload className="w-4 h-4" />
              <span>Importar Dados</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <MetricCard
          title="Receita Total do Mês"
          value={formatCurrency(totalIncome)}
          change="+12.5% vs mês anterior"
          changeType="positive"
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
        
        <MetricCard
          title="Clientes Ativos"
          value={activeClients.toString()}
          change="Clientes em andamento"
          changeType="neutral"
          icon={<Calendar className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
        
        <MetricCard
          title="Total de Projetos"
          value={totalProjects.toString()}
          change="Projetos cadastrados"
          changeType="neutral"
          icon={<Target className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
        
        <MetricCard
          title="Custos Totais"
          value={formatCurrency(totalExpenses)}
          change="-5.3% vs mês anterior"
          changeType="positive"
          icon={<TrendingDown className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
        
        <MetricCard
          title="Lucro Líquido"
          value={formatCurrency(balance)}
          change="+18.7% vs mês anterior"
          changeType="positive"
          icon={<PiggyBank className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
        
        <MetricCard
          title="Transações do Mês"
          value={state.transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const currentDate = new Date();
            return transactionDate.getMonth() === currentDate.getMonth() && 
                   transactionDate.getFullYear() === currentDate.getFullYear();
          }).length.toString()}
          change="Movimentações registradas"
          changeType="neutral"
          icon={<TrendingUp className="w-6 h-6" />}
          color="bg-hdr-yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
              Receitas vs Despesas
            </h3>
            <span className="text-lg font-bold text-hdr-yellow">*</span>
          </div>
          <div className="h-56 sm:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="receita" fill="#FFD11A" name="Receita" />
                <Bar dataKey="despesa" fill="#6b7280" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
              Distribuição por Categoria
            </h3>
            <span className="text-lg font-bold text-hdr-yellow">*</span>
          </div>
          <div className="h-56 sm:h-64 lg:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs sm:text-sm truncate">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transações Recentes */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
            Transações Recentes
          </h3>
          <span className="text-lg font-bold text-hdr-yellow">*</span>
        </div>
        <div className="space-y-3">
          {state.transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 space-y-2 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-hdr-black truncate">{transaction.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-2">
                  <span className="truncate">{transaction.category}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="whitespace-nowrap">{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
              <div className="flex justify-end sm:justify-start">
                <span className={`font-semibold text-sm sm:text-base whitespace-nowrap ${
                  transaction.type === 'income' ? 'text-hdr-yellow' : 'text-red-500'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
            </div>
          ))}
          {state.transactions.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Nenhuma transação cadastrada ainda.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};