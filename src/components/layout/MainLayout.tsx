import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardPage } from '../../pages/DashboardPage';
import TransactionsPage from '../../pages/TransactionsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { ClientsPage } from '../../pages/ClientsPage';
import { StorageDebug } from '../debug/StorageDebug';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showDebug, setShowDebug] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'clients':
        return <ClientsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setShowDebug(true)}
          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          title="Debug do Storage"
        >
          🔧
        </button>
      </div>
      
      <div className="flex-1 overflow-auto ml-0 lg:ml-0">
        <main className="p-4 lg:p-6 pt-16 lg:pt-6 min-h-full">
          <div className="max-w-full overflow-x-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <StorageDebug 
        isOpen={showDebug} 
        onClose={() => setShowDebug(false)} 
      />
    </div>
  );
};