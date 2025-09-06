import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Users, 
  LogOut,
  User,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral'
  },
  {
    id: 'transactions',
    label: 'Lançamentos',
    icon: Receipt,
    description: 'Receitas e despesas'
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: BarChart3,
    description: 'Análises e gráficos'
  },
  {
    id: 'clients',
    label: 'Clientes',
    icon: Users,
    description: 'Gestão de clientes'
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-lg bg-hdr-white shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5 text-hdr-black" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 sm:w-72 lg:w-64 bg-gray-900 border-r border-gray-700
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full
      `}>
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-hdr-white hdr-logo">HDR</h1>
            <span className="text-2xl font-bold text-hdr-yellow hdr-asterisk">*</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-1">Sistema Financeiro</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-hdr-yellow rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-hdr-black" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-hdr-white">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
              isAdmin ? 'bg-hdr-yellow text-hdr-black' : 'bg-gray-700 text-hdr-white'
            }`}>
              {isAdmin ? 'Administrador' : 'Usuário'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 lg:p-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 lg:py-2.5 text-left rounded-lg transition-all duration-200 touch-manipulation ${
                    isActive
                      ? 'bg-hdr-yellow text-hdr-black shadow-sm'
                      : 'text-hdr-white hover:bg-gray-800 hover:text-hdr-yellow active:bg-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-base lg:text-sm">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 lg:p-6 border-t border-gray-800 mt-auto">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 lg:py-2.5 text-hdr-white hover:bg-gray-800 hover:text-hdr-yellow active:bg-gray-600 rounded-lg transition-all duration-200 touch-manipulation"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="font-medium text-base lg:text-sm">Sair</span>
        </button>
      </div>
      </div>
    </>
  );
};