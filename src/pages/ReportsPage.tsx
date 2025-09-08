import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Filter,
  CalendarDays,
  Users,
  Target
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR');
};

export const ReportsPage: React.FC = () => {
  const { state, getTotalIncome, getTotalExpenses, getBalance } = useApp();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar transações por período
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    switch (dateRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return state.transactions;
    }
    
    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const categoryMatch = selectedCategory === 'all' || transaction.category === selectedCategory;
      return transactionDate >= startDate && categoryMatch;
    });
  }, [state.transactions, dateRange, selectedCategory]);

  // Dados calculados dinamicamente
  const getMonthlyData = () => {
    const monthlyStats: { [key: string]: { receita: number; despesa: number; lucro: number; transacoes: number } } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = { receita: 0, despesa: 0, lucro: 0, transacoes: 0 };
      }
      
      monthlyStats[monthKey].transacoes += 1;
      
      if (transaction.type === 'income') {
        monthlyStats[monthKey].receita += transaction.amount;
      } else {
        monthlyStats[monthKey].despesa += transaction.amount;
      }
    });
    
    return Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      receita: data.receita,
      despesa: data.despesa,
      lucro: data.receita - data.despesa,
      transacoes: data.transacoes
    }));
  };

  const getCategoryData = () => {
    const categoryStats: { [key: string]: { receita: number; despesa: number; count: number } } = {};
    
    filteredTransactions.forEach(transaction => {
      if (!categoryStats[transaction.category]) {
        categoryStats[transaction.category] = { receita: 0, despesa: 0, count: 0 };
      }
      
      categoryStats[transaction.category].count += 1;
      
      if (transaction.type === 'income') {
        categoryStats[transaction.category].receita += transaction.amount;
      } else {
        categoryStats[transaction.category].despesa += transaction.amount;
      }
    });
    
    const colors = ['#FFD11A', '#000000', '#6b7280', '#9ca3af', '#d1d5db', '#f3f4f6', '#e5e7eb'];
    
    return Object.entries(categoryStats)
      .map(([name, data], index) => ({
        name,
        receita: data.receita,
        despesa: data.despesa,
        total: data.receita + data.despesa,
        count: data.count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.total - a.total);
  };

  const getClientRevenueData = () => {
    const clientStats: { [key: string]: { receita: number; count: number } } = {};
    
    filteredTransactions
      .filter(t => t.type === 'income' && t.client)
      .forEach(transaction => {
        if (!clientStats[transaction.client!]) {
          clientStats[transaction.client!] = { receita: 0, count: 0 };
        }
        clientStats[transaction.client!].receita += transaction.amount;
        clientStats[transaction.client!].count += 1;
      });
    
    const colors = ['#FFD11A', '#000000', '#6b7280', '#9ca3af', '#d1d5db'];
    
    return Object.entries(clientStats)
      .map(([name, data], index) => ({
        name,
        value: data.receita,
        count: data.count,
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 clientes
  };

  const getDailyData = () => {
    const dailyStats: { [key: string]: { receita: number; despesa: number; lucro: number } } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const dayKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      if (!dailyStats[dayKey]) {
        dailyStats[dayKey] = { receita: 0, despesa: 0, lucro: 0 };
      }
      
      if (transaction.type === 'income') {
        dailyStats[dayKey].receita += transaction.amount;
      } else {
        dailyStats[dayKey].despesa += transaction.amount;
      }
    });
    
    return Object.entries(dailyStats)
      .map(([day, data]) => ({
        day,
        receita: data.receita,
        despesa: data.despesa,
        lucro: data.receita - data.despesa
      }))
      .sort((a, b) => new Date(a.day.split('/').reverse().join('-')).getTime() - new Date(b.day.split('/').reverse().join('-')).getTime());
  };

  const monthlyData = getMonthlyData();
  const categoryData = getCategoryData();
  const clientRevenueData = getClientRevenueData();
  const dailyData = getDailyData();

  // Estatísticas do período selecionado
  const periodStats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalTransactions = filteredTransactions.length;
    const uniqueClients = new Set(filteredTransactions
      .filter(t => t.client)
      .map(t => t.client)).size;
    
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      totalTransactions,
      uniqueClients
    };
  }, [filteredTransactions]);

  const categories = ['all', ...Array.from(new Set(state.transactions.map(t => t.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-bold text-hdr-black hdr-logo">Relatórios</h1>
            <span className="text-3xl font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <p className="text-gray-600 mt-1">
            Análise detalhada do desempenho financeiro
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4 text-hdr-yellow" />
          <span>Atualizado em tempo real</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
              <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
              <option value="all">Todo o período</option>
              </select>
            </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
              <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
            >
              <option value="all">Todas as categorias</option>
              {categories.slice(1).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
              </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita do Período</p>
              <p className="text-2xl font-bold text-hdr-yellow mt-2">
                {formatCurrency(periodStats.totalIncome)}
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
              <p className="text-sm font-medium text-gray-600">Despesas do Período</p>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {formatCurrency(periodStats.totalExpenses)}
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
              <p className="text-sm font-medium text-gray-600">Lucro Líquido</p>
              <p className={`text-2xl font-bold mt-2 ${
                periodStats.balance >= 0 ? 'text-hdr-black' : 'text-red-600'
              }`}>
                {formatCurrency(periodStats.balance)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-hdr-black bg-opacity-10">
              <DollarSign className="w-6 h-6 text-hdr-black" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transações</p>
              <p className="text-2xl font-bold text-hdr-black mt-2">
                {periodStats.totalTransactions}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <CalendarDays className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Monthly Revenue vs Expenses */}
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
              Receitas vs Despesas por Mês
              </h3>
            <span className="text-lg font-bold text-hdr-yellow">*</span>
            </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                  formatter={(value, name) => [
                    `R$ ${value.toLocaleString()}`, 
                    name === 'receita' ? 'Receita' : name === 'despesa' ? 'Despesa' : 'Lucro'
                  ]}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar dataKey="receita" fill="#FFD11A" name="receita" />
                <Bar dataKey="despesa" fill="#6b7280" name="despesa" />
                <Line type="monotone" dataKey="lucro" stroke="#000000" strokeWidth={2} name="lucro" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Category Distribution */}
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
              Distribuição por Categoria
            </h3>
            <span className="text-lg font-bold text-hdr-yellow">*</span>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData.slice(0, 6)} // Top 6 categorias
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="total"
                >
                  {categoryData.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
                    </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categoryData.slice(0, 6).map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs sm:text-sm truncate">
                  {item.name}: {formatCurrency(item.total)} ({item.count} trans.)
                </span>
                      </div>
            ))}
                      </div>
                    </div>
                  </div>

      {/* Client Revenue Chart */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
            Top 10 Clientes por Receita
          </h3>
          <span className="text-lg font-bold text-hdr-yellow">*</span>
        </div>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={clientRevenueData} layout="horizontal" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number"
                fontSize={12}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category"
                dataKey="name"
                fontSize={12}
                tick={{ fontSize: 12 }}
                width={100}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  `R$ ${value.toLocaleString()}`, 
                  `Receita (${props.payload.count} transações)`
                ]}
                contentStyle={{ fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#FFD11A" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

      {/* Daily Trend */}
      {dailyData.length > 0 && (
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-base lg:text-lg font-semibold text-hdr-black">
              Tendência Diária
            </h3>
            <span className="text-lg font-bold text-hdr-yellow">*</span>
          </div>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="day" 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    `R$ ${value.toLocaleString()}`, 
                    name === 'receita' ? 'Receita' : name === 'despesa' ? 'Despesa' : 'Lucro'
                  ]}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="receita" 
                  stackId="1"
                  stroke="#FFD11A" 
                  fill="#FFD11A" 
                  fillOpacity={0.6}
                  name="receita"
                />
                <Area 
                  type="monotone" 
                  dataKey="despesa" 
                  stackId="2"
                  stroke="#6b7280" 
                  fill="#6b7280" 
                  fillOpacity={0.6}
                  name="despesa"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};