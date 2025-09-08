// Serviço para comunicação com a API backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD 
  ? 'https://hdr-backend-gustavoduartepis-projects.vercel.app/api'
  : 'http://localhost:3001/api');

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
  };
  token: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  clientId?: string;
  person?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'inactive' | 'prospect';
  totalRevenue?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('api_token', token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('api_token');
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem('api_token');
  }

  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const token = this.getToken();

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        (headers as any).Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || 'Erro na requisição',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('Erro na requisição:', error);
      return {
        error: 'Erro de conexão com o servidor',
        status: 0,
      };
    }
  }

  // Métodos de autenticação
  static async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(
    email: string,
    password: string,
    name: string,
    role: string = 'user'
  ): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  }

  // Métodos de transações
  static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.makeRequest<Transaction[]>('/transactions');
  }

  static async createTransaction(transaction: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Transaction>> {
    return this.makeRequest<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  static async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    return this.makeRequest<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Métodos de clientes
  static async getClients(): Promise<ApiResponse<Client[]>> {
    return this.makeRequest<Client[]>('/clients');
  }

  static async createClient(client: Omit<Client, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Client>> {
    return this.makeRequest<Client>('/clients', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  static async updateClient(id: string, client: Partial<Client>): Promise<ApiResponse<Client>> {
    return this.makeRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  static async deleteClient(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Método de sincronização
  static async syncData(localData: { transactions: Transaction[]; clients: Client[] }): Promise<ApiResponse<{ transactions: Transaction[]; clients: Client[] }>> {
    return this.makeRequest<{ transactions: Transaction[]; clients: Client[] }>('/sync', {
      method: 'POST',
      body: JSON.stringify(localData),
    });
  }

  // Verificar status da API
  static async getStatus(): Promise<ApiResponse<{ status: string; timestamp: string; version: string }>> {
    return this.makeRequest<{ status: string; timestamp: string; version: string }>('/status');
  }

  // Verificar se a API está online
  static async isOnline(): Promise<boolean> {
    try {
      const response = await this.getStatus();
      return response.status === 200 && response.data?.status === 'online';
    } catch {
      return false;
    }
  }
}

export { ApiService, type Transaction, type Client, type LoginResponse, type ApiResponse };