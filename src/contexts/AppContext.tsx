import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ExcelService } from '../services/excelService';
import { StorageService } from '../utils/storage';
import type { ExportData } from '../services/excelService';
import { ApiService } from '../services/apiService';
import { useNotifications } from './NotificationContext';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  client?: string;
  personName?: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  contractProposal?: string;
  address: string;
  totalRevenue: number;
  lastProject: string;
  status: 'active' | 'inactive' | 'prospect';
  contractType: 'fixed' | 'project' | 'both';
}

export interface AppState {
  transactions: Transaction[];
  clients: Client[];
  loading: boolean;
  error: string | null;
}

// Actions
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_CLIENTS'; payload: Client[] };

// Initial state
const initialState: AppState = {
  transactions: [],
  clients: [],
  loading: false,
  error: null
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      };
    
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload]
      };
    
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(c => 
          c.id === action.payload.id ? action.payload : c
        )
      };
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(c => c.id !== action.payload)
      };
    
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getBalance: () => number;
  getActiveClientsCount: () => number;
  getClientTotalRevenue: (clientName: string) => number;
  updateClientRevenues: () => void;
  // Excel functions
  exportToExcel: (filename?: string) => void;
  importFromExcel: (file: File) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper functions for localStorage
const getStorageKey = (userId: string, dataType: 'transactions' | 'clients') => {
  return `audiovisual_${dataType}_${userId}`;
};

const saveToStorage = async (userId: string, dataType: 'transactions' | 'clients', data: any) => {
  try {
    const key = getStorageKey(userId, dataType);
    
    // Tentar sincronizar com API primeiro
    const isOnline = await ApiService.isOnline();
    if (isOnline) {
      console.log(`🌐 API online, sincronizando ${dataType}...`);
      // TODO: Implementar sincronização específica por tipo
       // const syncResponse = await ApiService.syncData({ [dataType]: data });
       // if (syncResponse.data && !syncResponse.error) {
       //   console.log(`✅ ${dataType} sincronizados com API`);
       // } else {
       //   console.log(`⚠️ Erro na sincronização de ${dataType}, salvando localmente`);
       // }
    }
    
    // Sempre salvar localmente como backup
    const success = StorageService.setItem(key, data);
    console.log(`Salvando ${dataType} para usuário ${userId}:`, success ? 'sucesso' : 'falhou', data.length);
    return success;
  } catch (error) {
    console.error('Erro ao salvar dados no storage:', error);
    return false;
  }
};

const loadTransactionsFromStorage = async (userId: string, addNotification: (notification: any) => void): Promise<Transaction[]> => {
  try {
    // Tentar carregar da API primeiro
    const isOnline = await ApiService.isOnline();
    if (isOnline) {
      console.log('🌐 API online, carregando transactions da API...');
      
      const response = await ApiService.getTransactions();
      
      if (response.data && !response.error) {
        console.log('✅ Transactions carregados da API:', response.data.length);
        // Salvar localmente como backup
        const key = getStorageKey(userId, 'transactions');
        StorageService.setItem(key, response.data);
        
        addNotification({
          type: 'success',
          title: 'Sincronização Concluída',
          message: `${response.data.length} transações carregadas da nuvem`,
          duration: 3000
        });
        
        return response.data;
      }
    }
    
    // Fallback para dados locais
    console.log('📂 Carregando transactions locais...');
    const key = getStorageKey(userId, 'transactions');
    const data = StorageService.getItem(key, []);
    console.log(`Carregando transactions para usuário ${userId}:`, Array.isArray(data) ? data.length : 0, 'itens');
    
    if (Array.isArray(data) && data.length > 0) {
      addNotification({
        type: 'warning',
        title: 'Modo Offline',
        message: 'Carregando dados locais. Sincronização automática quando voltar online.',
        duration: 4000
      });
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao carregar transactions do storage:', error);
    addNotification({
      type: 'error',
      title: 'Erro ao Carregar Dados',
      message: 'Não foi possível carregar as transações. Verifique sua conexão.',
      duration: 5000
    });
    return [];
  }
};

const loadClientsFromStorage = async (userId: string, addNotification: (notification: any) => void): Promise<Client[]> => {
  try {
    // Tentar carregar da API primeiro
    const isOnline = await ApiService.isOnline();
    if (isOnline) {
      console.log('🌐 API online, carregando clients da API...');
      
      const response = await ApiService.getClients();
      
      if (response.data && !response.error) {
        console.log('✅ Clients carregados da API:', response.data.length);
        // Mapear dados da API para o formato do AppContext
        const mappedClients: Client[] = response.data.map(apiClient => ({
          id: apiClient.id,
          name: apiClient.name,
          email: apiClient.email,
          phone: apiClient.phone,
          company: apiClient.company || '',
          contractProposal: '',
          address: '',
          totalRevenue: apiClient.totalRevenue || 0,
          lastProject: '',
          status: apiClient.status,
          contractType: 'project' as const
        }));
        // Salvar localmente como backup
        const key = getStorageKey(userId, 'clients');
        StorageService.setItem(key, mappedClients);
        
        addNotification({
          type: 'success',
          title: 'Sincronização Concluída',
          message: `${mappedClients.length} clientes carregados da nuvem`,
          duration: 3000
        });
        
        return mappedClients;
      }
    }
    
    // Fallback para dados locais
    console.log('📂 Carregando clients locais...');
    const key = getStorageKey(userId, 'clients');
    const data = StorageService.getItem(key, []);
    console.log(`Carregando clients para usuário ${userId}:`, Array.isArray(data) ? data.length : 0, 'itens');
    
    if (Array.isArray(data) && data.length > 0) {
      addNotification({
        type: 'warning',
        title: 'Modo Offline',
        message: 'Carregando dados locais. Sincronização automática quando voltar online.',
        duration: 4000
      });
    }
    
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Erro ao carregar clients do storage:', error);
    addNotification({
      type: 'error',
      title: 'Erro ao Carregar Dados',
      message: 'Não foi possível carregar os clientes. Verifique sua conexão.',
      duration: 5000
    });
    return [];
  }
};

// Migration function for existing data
const migrateExistingData = (userId: string) => {
  try {
    // Check for old data format
    const oldTransactions = StorageService.getItem('audiovisual_transactions');
    const oldClients = StorageService.getItem('audiovisual_clients');
    
    if (oldTransactions && !StorageService.getItem(getStorageKey(userId, 'transactions'))) {
      console.log('Migrando transações antigas para o usuário:', userId);
      StorageService.setItem(getStorageKey(userId, 'transactions'), oldTransactions);
      StorageService.removeItem('audiovisual_transactions');
    }
    
    if (oldClients && !StorageService.getItem(getStorageKey(userId, 'clients'))) {
      console.log('Migrando clientes antigos para o usuário:', userId);
      StorageService.setItem(getStorageKey(userId, 'clients'), oldClients);
      StorageService.removeItem('audiovisual_clients');
    }
  } catch (error) {
    console.error('Erro ao migrar dados existentes:', error);
  }
};

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  // Load user data when user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        console.log('Carregando dados para usuário:', user.email, user.id);
        
        // Migrate existing data if needed
        migrateExistingData(user.id);
        
        const userTransactions = await loadTransactionsFromStorage(user.id, addNotification);
        const userClients = await loadClientsFromStorage(user.id, addNotification);
        
        dispatch({ type: 'SET_TRANSACTIONS', payload: userTransactions });
        dispatch({ type: 'SET_CLIENTS', payload: userClients });
      } else {
        console.log('Usuário deslogado, limpando dados');
        // Clear data when user logs out
        dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
        dispatch({ type: 'SET_CLIENTS', payload: [] });
      }
    };
    
    loadUserData();
  }, [user]);

  // Save data to localStorage whenever transactions or clients change
  useEffect(() => {
    if (user && state.transactions.length >= 0) {
      saveToStorage(user.id, 'transactions', state.transactions);
    }
  }, [user, state.transactions]);

  useEffect(() => {
    if (user && state.clients.length >= 0) {
      saveToStorage(user.id, 'clients', state.clients);
    }
  }, [user, state.clients]);

  // Update client revenues when transactions change
  useEffect(() => {
    if (state.transactions.length > 0 && state.clients.length > 0) {
      const updatedClients = state.clients.map(client => ({
        ...client,
        totalRevenue: state.transactions
          .filter(t => t.type === 'income' && t.client === client.name)
          .reduce((sum, t) => sum + t.amount, 0)
      }));
      
      // Only update if there are actual changes
      const hasChanges = updatedClients.some((client, index) => 
        client.totalRevenue !== state.clients[index].totalRevenue
      );
      
      if (hasChanges) {
        dispatch({ type: 'SET_CLIENTS', payload: updatedClients });
      }
    }
  }, [state.transactions]);

  // Helper functions
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    };
    
    // Adicionar localmente primeiro
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    
    addNotification({
      type: 'success',
      title: 'Transação Adicionada',
      message: `${transaction.type === 'income' ? 'Receita' : 'Despesa'} de R$ ${transaction.amount.toLocaleString('pt-BR')} adicionada com sucesso`,
      duration: 3000
    });
    
    // Tentar sincronizar com API
    try {
      const isOnline = await ApiService.isOnline();
      if (isOnline) {
        const response = await ApiService.createTransaction(newTransaction);
        if (response.data && !response.error) {
          console.log('✅ Transação sincronizada com API');
          addNotification({
            type: 'info',
            title: 'Sincronizado',
            message: 'Transação sincronizada com a nuvem',
            duration: 2000
          });
        }
      } else {
        addNotification({
          type: 'warning',
          title: 'Modo Offline',
          message: 'Transação salva localmente. Será sincronizada quando voltar online.',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('⚠️ Erro ao sincronizar transação:', error);
      addNotification({
        type: 'error',
        title: 'Erro de Sincronização',
        message: 'Transação salva localmente, mas não foi possível sincronizar com a nuvem',
        duration: 5000
      });
    }
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addClient = async (client: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString()
    };
    
    // Adicionar localmente primeiro
    dispatch({ type: 'ADD_CLIENT', payload: newClient });
    
    addNotification({
      type: 'success',
      title: 'Cliente Adicionado',
      message: `Cliente "${client.name}" adicionado com sucesso`,
      duration: 3000
    });
    
    // Tentar sincronizar com API
    try {
      const isOnline = await ApiService.isOnline();
      if (isOnline) {
        const response = await ApiService.createClient(newClient);
        if (response.data && !response.error) {
          console.log('✅ Cliente sincronizado com API');
          addNotification({
            type: 'info',
            title: 'Sincronizado',
            message: 'Cliente sincronizado com a nuvem',
            duration: 2000
          });
        }
      } else {
        addNotification({
          type: 'warning',
          title: 'Modo Offline',
          message: 'Cliente salvo localmente. Será sincronizado quando voltar online.',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('⚠️ Erro ao sincronizar cliente:', error);
      addNotification({
        type: 'error',
        title: 'Erro de Sincronização',
        message: 'Cliente salvo localmente, mas não foi possível sincronizar com a nuvem',
        duration: 5000
      });
    }
  };

  const updateClient = (client: Client) => {
    dispatch({ type: 'UPDATE_CLIENT', payload: client });
  };

  const deleteClient = (id: string) => {
    dispatch({ type: 'DELETE_CLIENT', payload: id });
  };

  const getTotalIncome = () => {
    return state.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getActiveClientsCount = () => {
    return state.clients.filter(c => c.status === 'active').length;
  };

  const getClientTotalRevenue = (clientName: string) => {
    return state.transactions
      .filter(t => t.type === 'income' && t.client === clientName)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const updateClientRevenues = () => {
    const updatedClients = state.clients.map(client => ({
      ...client,
      totalRevenue: getClientTotalRevenue(client.name)
    }));
    dispatch({ type: 'SET_CLIENTS', payload: updatedClients });
  };

  const exportToExcel = (filename?: string) => {
    try {
      const exportData: ExportData = {
        transactions: state.transactions,
        clients: state.clients,
        summary: {
          totalRevenue: getTotalIncome(),
          totalExpenses: getTotalExpenses(),
          balance: getBalance(),
          totalClients: state.clients.length,
          totalTransactions: state.transactions.length
        }
      };
      
      ExcelService.exportToExcel(exportData, filename);
      alert('Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Tente novamente.');
    }
  };

  const importFromExcel = async (file: File) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const importedData = await ExcelService.importFromExcel(file);
      
      if (importedData.transactions) {
        // Mesclar transações importadas com as existentes
        const existingIds = new Set(state.transactions.map(t => t.id));
        const newTransactions = importedData.transactions.filter(t => !existingIds.has(t.id));
        
        if (newTransactions.length > 0) {
          dispatch({ type: 'SET_TRANSACTIONS', payload: [...state.transactions, ...newTransactions] });
        }
      }
      
      if (importedData.clients) {
        // Mesclar clientes importados com os existentes
        const existingClientIds = new Set(state.clients.map(c => c.id));
        const newClients = importedData.clients.filter(c => !existingClientIds.has(c.id));
        
        if (newClients.length > 0) {
          dispatch({ type: 'SET_CLIENTS', payload: [...state.clients, ...newClients] });
        }
      }
      
      alert('Dados importados com sucesso!');
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      alert('Erro ao importar dados. Verifique o arquivo e tente novamente.');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value: AppContextType = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addClient,
    updateClient,
    deleteClient,
    getTotalIncome,
    getTotalExpenses,
    getBalance,
    getActiveClientsCount,
    getClientTotalRevenue,
    updateClientRevenues,
    exportToExcel,
    importFromExcel
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}