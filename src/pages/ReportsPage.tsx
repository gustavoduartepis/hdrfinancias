import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar,
  Download
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

type ReportPeriod = 'current_month' | 'last_month' | 'custom' | 'last_3_months' | 'last_6_months';
type ChartType = 'bar' | 'pie' | 'line';

export const ReportsPage: React.FC = () => {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('current_month');
  const [selectedChart, setSelectedChart] = useState<ChartType>('bar');
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
    }, {} as Record<string, number>);
    
    const expensesByCategory = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
            Análises e gráficos financeiros
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-hdr-yellow text-hdr-black px-4 py-2 rounded-lg hover:bg-yellow-400 hover:shadow-md transition-all duration-200 flex items-center space-x-2 font-medium">
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-hdr-yellow" />
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as ReportPeriod)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
              >
                <option value="current_month">Este mês</option>
                <option value="last_month">Mês passado</option>
                <option value="last_3_months">Últimos 3 meses</option>
                <option value="last_6_months">Últimos 6 meses</option>
                <option value="custom">Data específica</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-hdr-yellow" />
              <label className="text-sm font-medium text-gray-700">Tipo de Gráfico:</label>
              <select
                value={selectedChart}
                onChange={(e) => setSelectedChart(e.target.value as ChartType)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
              >
                <option value="bar">Barras</option>
                <option value="line">Linha</option>
                <option value="pie">Pizza</option>
              </select>
            </div>
          </div>
          
          {/* Custom Date Range */}
          {selectedPeriod === 'custom' && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Data inicial:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Data final:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-hdr-yellow focus:border-hdr-yellow"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Receitas</p>
              <p className="text-2xl font-bold text-hdr-yellow mt-2">
                {formatCurrency(reportData.totalIncome)}
              </p>
            </div>
            <div className="p-3 rounded-full bg-hdr-yellow bg-opacity-10">
              <TrendingUp className="w-6 h-6 text-hdr-yellow" />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Despesas</p>
              <p className="text-2xl font-bold text-gray-600 mt-2">
                {formatCurrency(reportData.totalExpenses)}
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
                reportData.netProfit >= 0 ? 'text-hdr-yellow' : 'text-red-600'
              }`}>
                {formatCurrency(reportData.netProfit)}
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              reportData.netProfit >= 0 ? 'bg-hdr-yellow bg-opacity-10' : 'bg-red-100'
            }`}>
              <DollarSign className={`w-6 h-6 ${
                reportData.netProfit >= 0 ? 'text-hdr-yellow' : 'text-red-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Margem de Lucro</p>
              <p className={`text-2xl font-bold mt-2 ${
                reportData.profitMargin >= 0 ? 'text-hdr-black' : 'text-red-600'
              }`}>
                {reportData.profitMargin.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              <PieChart className="w-6 h-6 text-hdr-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-hdr-black">
                Lançamentos do Período
              </h3>
              <span className="text-lg font-bold text-hdr-yellow hdr-asterisk">*</span>
            </div>
            <span className="text-sm text-gray-500">
              {reportData.transactionCount} lançamento(s)
            </span>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <BarChart3 className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">Nenhum lançamento encontrado para o período selecionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Cliente
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                    Pessoa
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
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
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue Breakdown */}
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-lg font-semibold text-hdr-black">
              Receitas por Categoria
            </h3>
            <span className="text-lg font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <div className="space-y-3">
            {Object.entries(reportData.incomeByCategory).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma receita no período</p>
            ) : (
              Object.entries(reportData.incomeByCategory).map(([category, amount]) => {
                const percentage = reportData.totalIncome > 0 ? (amount / reportData.totalIncome) * 100 : 0;
                return (
                  <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-hdr-yellow rounded"></div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Expenses Breakdown */}
        <div className="bg-hdr-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-lg font-semibold text-hdr-black">
              Despesas por Categoria
            </h3>
            <span className="text-lg font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          <div className="space-y-3">
            {Object.entries(reportData.expensesByCategory).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma despesa no período</p>
            ) : (
              Object.entries(reportData.expensesByCategory).map(([category, amount]) => {
                const percentage = reportData.totalExpenses > 0 ? (amount / reportData.totalExpenses) * 100 : 0;
                return (
                  <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-500 rounded"></div>
                      <span className="font-medium text-gray-900">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>


    </div>
  );
};