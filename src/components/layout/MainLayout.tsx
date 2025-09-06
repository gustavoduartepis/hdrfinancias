import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DashboardPage } from '../../pages/DashboardPage';
import TransactionsPage from '../../pages/TransactionsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { ClientsPage } from '../../pages/ClientsPage';

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

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
      
      <div className="flex-1 overflow-auto ml-0 lg:ml-0">
        <main className="p-4 lg:p-6 pt-16 lg:pt-6 min-h-full">
          <div className="max-w-full overflow-x-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};