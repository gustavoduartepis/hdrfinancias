import * as XLSX from 'xlsx';
import type { Transaction, Client } from '../contexts/AppContext';

export interface ExportData {
  transactions: Transaction[];
  clients: Client[];
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    balance: number;
    totalClients: number;
    totalTransactions: number;
  };
}

export class ExcelService {
  /**
   * Exporta todos os dados do sistema para um arquivo Excel
   */
  static exportToExcel(data: ExportData, filename: string = 'backup-sistema-financeiro'): void {
    try {
      // Criar um novo workbook
      const workbook = XLSX.utils.book_new();

      // Aba 1: Resumo Geral
      const summaryData = [
        ['Resumo do Sistema Financeiro', ''],
        ['Data da Exportação', new Date().toLocaleString('pt-BR')],
        ['', ''],
        ['Receita Total', `R$ ${data.summary.totalRevenue.toFixed(2).replace('.', ',')}`],
        ['Despesas Totais', `R$ ${data.summary.totalExpenses.toFixed(2).replace('.', ',')}`],
        ['Saldo', `R$ ${data.summary.balance.toFixed(2).replace('.', ',')}`],
        ['Total de Clientes', data.summary.totalClients.toString()],
        ['Total de Transações', data.summary.totalTransactions.toString()]
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

      // Aba 2: Transações
      if (data.transactions.length > 0) {
        const transactionsData = [
          ['ID', 'Data', 'Descrição', 'Tipo', 'Categoria', 'Valor', 'Cliente', 'Pessoa']
        ];
        
        data.transactions.forEach(transaction => {
          transactionsData.push([
            transaction.id,
            new Date(transaction.date).toLocaleDateString('pt-BR'),
            transaction.description,
            transaction.type === 'income' ? 'Receita' : 'Despesa',
            transaction.category,
            `R$ ${transaction.amount.toFixed(2).replace('.', ',')}`,
            transaction.client || '',
            transaction.personName || ''
          ]);
        });
        
        const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
        XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transações');
      }

      // Aba 3: Clientes
      if (data.clients.length > 0) {
        const clientsData = [
          ['ID', 'Nome', 'Email', 'Telefone', 'Endereço', 'Receita Total', 'Status']
        ];
        
        data.clients.forEach(client => {
          clientsData.push([
            client.id,
            client.name,
            client.email || '',
            client.phone || '',
            client.address || '',
            `R$ ${(client.totalRevenue || 0).toFixed(2).replace('.', ',')}`,
            client.status || 'Ativo'
          ]);
        });
        
        const clientsSheet = XLSX.utils.aoa_to_sheet(clientsData);
        XLSX.utils.book_append_sheet(workbook, clientsSheet, 'Clientes');
      }

      // Aba 4: Receitas por Categoria
      const revenueByCategory = this.getRevenueByCategory(data.transactions);
      if (Object.keys(revenueByCategory).length > 0) {
        const revenueCategoryData = [
          ['Categoria', 'Valor Total', 'Quantidade de Transações']
        ];
        
        Object.entries(revenueByCategory).forEach(([category, info]) => {
          revenueCategoryData.push([
            category,
            `R$ ${info.total.toFixed(2).replace('.', ',')}`,
            info.count.toString()
          ]);
        });
        
        const revenueCategorySheet = XLSX.utils.aoa_to_sheet(revenueCategoryData);
        XLSX.utils.book_append_sheet(workbook, revenueCategorySheet, 'Receitas por Categoria');
      }

      // Aba 5: Despesas por Categoria
      const expensesByCategory = this.getExpensesByCategory(data.transactions);
      if (Object.keys(expensesByCategory).length > 0) {
        const expensesCategoryData = [
          ['Categoria', 'Valor Total', 'Quantidade de Transações']
        ];
        
        Object.entries(expensesByCategory).forEach(([category, info]) => {
          expensesCategoryData.push([
            category,
            `R$ ${info.total.toFixed(2).replace('.', ',')}`,
            info.count.toString()
          ]);
        });
        
        const expensesCategorySheet = XLSX.utils.aoa_to_sheet(expensesCategoryData);
        XLSX.utils.book_append_sheet(workbook, expensesCategorySheet, 'Despesas por Categoria');
      }

      // Aba 6: Receita por Cliente
      const revenueByClient = this.getRevenueByClient(data.transactions, data.clients);
      if (revenueByClient.length > 0) {
        const clientRevenueData = [
          ['Cliente', 'Receita Total', 'Número de Transações', 'Ticket Médio', 'Última Transação', 'Status']
        ];
        
        revenueByClient.forEach(clientInfo => {
          clientRevenueData.push([
            clientInfo.clientName,
            `R$ ${clientInfo.totalRevenue.toFixed(2).replace('.', ',')}`,
            clientInfo.transactionCount.toString(),
            `R$ ${clientInfo.averageTicket.toFixed(2).replace('.', ',')}`,
            clientInfo.lastTransaction ? new Date(clientInfo.lastTransaction).toLocaleDateString('pt-BR') : 'N/A',
            clientInfo.status || 'Ativo'
          ]);
        });
        
        const clientRevenueSheet = XLSX.utils.aoa_to_sheet(clientRevenueData);
        XLSX.utils.book_append_sheet(workbook, clientRevenueSheet, 'Receita por Cliente');
      }

      // Aba 7: Extras e Informações Adicionais
      const extrasData = [
        ['Informações Extras do Sistema', ''],
        ['', ''],
        ['Clientes com Maior Receita', ''],
        ['Cliente', 'Receita Total']
      ];
      
      // Top 5 clientes por receita
      const topClients = revenueByClient
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5);
      
      topClients.forEach(client => {
        extrasData.push([
          client.clientName,
          `R$ ${client.totalRevenue.toFixed(2).replace('.', ',')}`
        ]);
      });
      
      extrasData.push(['', '']);
      extrasData.push(['Estatísticas Gerais', '']);
      extrasData.push(['Receita Média por Cliente', `R$ ${(data.summary.totalRevenue / Math.max(data.clients.length, 1)).toFixed(2).replace('.', ',')}`]);
      extrasData.push(['Transação Média', `R$ ${(data.summary.totalRevenue / Math.max(data.summary.totalTransactions, 1)).toFixed(2).replace('.', ',')}`]);
      extrasData.push(['Clientes Ativos', data.clients.filter(c => c.status === 'active').length.toString()]);
      extrasData.push(['Clientes Inativos', data.clients.filter(c => c.status === 'inactive').length.toString()]);
      extrasData.push(['Clientes Prospects', data.clients.filter(c => c.status === 'prospect').length.toString()]);
      
      const extrasSheet = XLSX.utils.aoa_to_sheet(extrasData);
      XLSX.utils.book_append_sheet(workbook, extrasSheet, 'Extras e Estatísticas');

      // Gerar e baixar o arquivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const finalFilename = `${filename}-${timestamp}.xlsx`;
      XLSX.writeFile(workbook, finalFilename);
      
      console.log(`Arquivo exportado com sucesso: ${finalFilename}`);
    } catch (error) {
      console.error('Erro ao exportar dados para Excel:', error);
      throw new Error('Falha na exportação dos dados');
    }
  }

  /**
   * Importa dados de um arquivo Excel
   */
  static async importFromExcel(file: File): Promise<Partial<ExportData>> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            const importedData: Partial<ExportData> = {};
            
            // Importar transações
            if (workbook.SheetNames.includes('Transações')) {
              const transactionsSheet = workbook.Sheets['Transações'];
              const transactionsJson = XLSX.utils.sheet_to_json(transactionsSheet, { header: 1 }) as any[][];
              
              if (transactionsJson.length > 1) {
                importedData.transactions = transactionsJson.slice(1).map((row, index) => ({
                  id: row[0] || `imported-${Date.now()}-${index}`,
                  date: this.parseDate(row[1]) || new Date().toISOString(),
                  description: row[2] || '',
                  type: (row[3] === 'Receita' ? 'income' : 'expense') as 'income' | 'expense',
                  category: row[4] || '',
                  amount: this.parseAmount(row[5]) || 0,
                  client: row[6] || undefined,
                  personName: row[7] || undefined
                }));
              }
            }
            
            // Importar clientes
            if (workbook.SheetNames.includes('Clientes')) {
              const clientsSheet = workbook.Sheets['Clientes'];
              const clientsJson = XLSX.utils.sheet_to_json(clientsSheet, { header: 1 }) as any[][];
              
              if (clientsJson.length > 1) {
                importedData.clients = clientsJson.slice(1).map((row, index) => ({
                  id: row[0] || `imported-client-${Date.now()}-${index}`,
                  name: row[1] || '',
                  email: row[2] || undefined,
                  phone: row[3] || undefined,
                  address: row[4] || undefined,
                  totalRevenue: this.parseAmount(row[5]) || 0,
                  status: row[6] || 'active',
                  lastProject: row[7] || 'Projeto Importado',
                  contractType: row[8] || 'Mensal'
                }));
              }
            }
            
            resolve(importedData);
          } catch (error) {
            reject(new Error('Erro ao processar arquivo Excel'));
          }
        };
        
        reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error('Erro ao importar dados do Excel'));
      }
    });
  }

  /**
   * Agrupa receitas por categoria
   */
  private static getRevenueByCategory(transactions: Transaction[]): Record<string, { total: number; count: number }> {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Sem Categoria';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += transaction.amount;
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);
  }

  /**
   * Agrupa despesas por categoria
   */
  private static getExpensesByCategory(transactions: Transaction[]): Record<string, { total: number; count: number }> {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        const category = transaction.category || 'Sem Categoria';
        if (!acc[category]) {
          acc[category] = { total: 0, count: 0 };
        }
        acc[category].total += transaction.amount;
        acc[category].count += 1;
        return acc;
      }, {} as Record<string, { total: number; count: number }>);
  }

  /**
   * Converte string de data para ISO
   */
  private static parseDate(dateStr: string): string | null {
    if (!dateStr) return null;
    
    try {
      // Tenta diferentes formatos de data
      const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
      ];
      
      for (const format of formats) {
        const match = dateStr.match(format);
        if (match) {
          if (format === formats[0]) {
            // DD/MM/YYYY
            const [, day, month, year] = match;
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toISOString();
          } else {
            // YYYY-MM-DD
            return new Date(dateStr).toISOString();
          }
        }
      }
      
      // Fallback: tentar parsing direto
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? null : date.toISOString();
    } catch {
      return null;
    }
  }

  /**
   * Agrupa receita por cliente com estatísticas detalhadas
   */
  private static getRevenueByClient(transactions: Transaction[], clients: Client[]): Array<{
    clientName: string;
    totalRevenue: number;
    transactionCount: number;
    averageTicket: number;
    lastTransaction: string | null;
    status: string;
  }> {
    const clientStats: { [key: string]: {
      totalRevenue: number;
      transactionCount: number;
      lastTransaction: string | null;
      status: string;
    } } = {};
    
    // Processar transações de receita
    transactions
      .filter(t => t.type === 'income' && t.client)
      .forEach(transaction => {
        const clientName = transaction.client!;
        if (!clientStats[clientName]) {
          const client = clients.find(c => c.name === clientName);
          clientStats[clientName] = {
            totalRevenue: 0,
            transactionCount: 0,
            lastTransaction: null,
            status: client?.status || 'Ativo'
          };
        }
        
        clientStats[clientName].totalRevenue += transaction.amount;
        clientStats[clientName].transactionCount += 1;
        
        // Atualizar última transação
        if (!clientStats[clientName].lastTransaction || 
            new Date(transaction.date) > new Date(clientStats[clientName].lastTransaction!)) {
          clientStats[clientName].lastTransaction = transaction.date;
        }
      });
    
    // Incluir clientes sem transações
    clients.forEach(client => {
      if (!clientStats[client.name]) {
        clientStats[client.name] = {
          totalRevenue: 0,
          transactionCount: 0,
          lastTransaction: null,
          status: client.status || 'Ativo'
        };
      }
    });
    
    return Object.entries(clientStats).map(([clientName, stats]) => ({
      clientName,
      totalRevenue: stats.totalRevenue,
      transactionCount: stats.transactionCount,
      averageTicket: stats.transactionCount > 0 ? stats.totalRevenue / stats.transactionCount : 0,
      lastTransaction: stats.lastTransaction,
      status: stats.status
    }));
  }

  /**
   * Converte string de valor monetário para número
   */
  private static parseAmount(amountStr: string): number | null {
    if (!amountStr) return null;
    
    try {
      // Remove símbolos de moeda e espaços
      const cleanStr = amountStr.toString()
        .replace(/R\$\s?/g, '')
        .replace(/\s/g, '')
        .replace(/\./g, '') // Remove pontos de milhares
        .replace(',', '.'); // Converte vírgula decimal para ponto
      
      const amount = parseFloat(cleanStr);
      return isNaN(amount) ? null : amount;
    } catch {
      return null;
    }
  }
}

export default ExcelService;