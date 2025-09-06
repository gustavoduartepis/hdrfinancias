import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User {
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

// Get users from localStorage or use default users
const getStoredUsers = (): (User & { password: string })[] => {
  const stored = localStorage.getItem('audiovisual_users');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultUsers;
    }
  }
  return defaultUsers;
};

// Save users to localStorage
const saveUsers = (users: (User & { password: string })[]) => {
  localStorage.setItem('audiovisual_users', JSON.stringify(users));
};

// Initialize users from storage

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize default users if not exists
    const stored = localStorage.getItem('audiovisual_users');
    if (!stored) {
      saveUsers(defaultUsers);
    }
    
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('audiovisual_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      localStorage.setItem('audiovisual_user', JSON.stringify(userWithoutPassword));
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
    
    // Add new user to the list and save to localStorage
    const updatedUsers = [...currentUsers, { ...newUser, password }];
    saveUsers(updatedUsers);
    
    setUser(newUser);
    localStorage.setItem('audiovisual_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('audiovisual_user');
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