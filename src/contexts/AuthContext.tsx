import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StorageService } from '../utils/storage';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string, role?: 'admin' | 'user') => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for demonstration
const defaultUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@audiovisual.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@audiovisual.com',
    password: 'user123',
    name: 'Usuário Comum',
    role: 'user'
  }
];

// Get users from storage or use default users
const getStoredUsers = (): (User & { password: string })[] => {
  const stored = StorageService.getItem<(User & { password: string })[]>('audiovisual_users');
  if (stored && Array.isArray(stored)) {
    console.log('Usuários carregados do storage:', stored.length);
    return stored;
  }
  console.log('Usando usuários padrão');
  return defaultUsers;
};

// Save users to storage
const saveUsers = (users: (User & { password: string })[]) => {
  const success = StorageService.setItem('audiovisual_users', users);
  console.log('Salvando usuários:', success ? 'sucesso' : 'falhou', users.length);
  return success;
};

// Initialize users from storage

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Log storage info for debugging
    const storageInfo = StorageService.getStorageInfo();
    console.log('Storage disponível:', storageInfo);
    
    // Initialize default users if not exists
    const stored = StorageService.getItem<(User & { password: string })[]>('audiovisual_users');
    if (!stored || !Array.isArray(stored)) {
      console.log('Inicializando usuários padrão');
      saveUsers(defaultUsers);
    }
    
    // Check if user is logged in on app start
    const savedUser = StorageService.getItem<User>('audiovisual_user');
    if (savedUser) {
      console.log('Usuário logado encontrado:', savedUser.email);
      setUser(savedUser);
    } else {
      console.log('Nenhum usuário logado encontrado');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get fresh users from storage
    const currentUsers = getStoredUsers();
    const foundUser = currentUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      const success = StorageService.setItem('audiovisual_user', userWithoutPassword);
      console.log('Login realizado:', userWithoutPassword.email, 'Salvo:', success);
      return true;
    }
    
    return false;
  };

  const register = async (email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get fresh users from storage
    const currentUsers = getStoredUsers();
    
    // Check if user already exists
    const existingUser = currentUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role
    };
    
    // Add new user to the list and save to storage
    const updatedUsers = [...currentUsers, { ...newUser, password }];
    const usersSaved = saveUsers(updatedUsers);
    
    setUser(newUser);
    const userSaved = StorageService.setItem('audiovisual_user', newUser);
    console.log('Registro realizado:', newUser.email, 'Usuários salvos:', usersSaved, 'Usuário salvo:', userSaved);
    return usersSaved && userSaved;
  };

  const logout = () => {
    console.log('Logout realizado');
    setUser(null);
    StorageService.removeItem('audiovisual_user');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};