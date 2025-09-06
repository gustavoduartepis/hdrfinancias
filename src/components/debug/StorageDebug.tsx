import React, { useState, useEffect } from 'react';
import { StorageService } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface StorageDebugProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StorageDebug: React.FC<StorageDebugProps> = ({ isOpen, onClose }) => {
  const [storageInfo, setStorageInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');
  const { user } = useAuth();
  const { state } = useApp();

  useEffect(() => {
    if (isOpen) {
      updateStorageInfo();
    }
  }, [isOpen]);

  const updateStorageInfo = () => {
    const info = StorageService.getStorageInfo();
    setStorageInfo(info);
  };

  const testStorage = () => {
    const testKey = 'test_storage_' + Date.now();
    const testData = { test: true, timestamp: Date.now() };
    
    const saved = StorageService.setItem(testKey, testData);
    const loaded = StorageService.getItem(testKey);
    const removed = StorageService.removeItem(testKey);
    
    setTestResult(`
      Teste de Storage:
      - Salvar: ${saved ? 'OK' : 'FALHOU'}
      - Carregar: ${JSON.stringify(loaded) === JSON.stringify(testData) ? 'OK' : 'FALHOU'}
      - Remover: ${removed ? 'OK' : 'FALHOU'}
    `);
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      StorageService.clear();
      setTestResult('Todos os dados foram removidos.');
      updateStorageInfo();
    }
  };

  const exportData = () => {
    const allData = {
      user: user,
      transactions: state.transactions,
      clients: state.clients,
      storageInfo: storageInfo,
      timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `debug-data-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Debug do Storage</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Informações do Storage */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Informações do Storage</h3>
            {storageInfo && (
              <div className="text-sm">
                <p><strong>Tipo:</strong> {storageInfo.type}</p>
                <p><strong>Disponível:</strong> {storageInfo.available ? 'Sim' : 'Não'}</p>
                {storageInfo.size && (
                  <p><strong>Tamanho usado:</strong> {(storageInfo.size / 1024).toFixed(2)} KB</p>
                )}
              </div>
            )}
          </div>
          
          {/* Informações do Usuário */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Usuário Atual</h3>
            {user ? (
              <div className="text-sm">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Nome:</strong> {user.name}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum usuário logado</p>
            )}
          </div>
          
          {/* Dados do App */}
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-semibold mb-2">Dados do App</h3>
            <div className="text-sm">
              <p><strong>Transações:</strong> {state.transactions.length}</p>
              <p><strong>Clientes:</strong> {state.clients.length}</p>
              <p><strong>Loading:</strong> {state.loading ? 'Sim' : 'Não'}</p>
              {state.error && (
                <p><strong>Erro:</strong> <span className="text-red-600">{state.error}</span></p>
              )}
            </div>
          </div>
          
          {/* Resultado do Teste */}
          {testResult && (
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Resultado do Teste</h3>
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            </div>
          )}
          
          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={testStorage}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Testar Storage
            </button>
            
            <button
              onClick={updateStorageInfo}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Atualizar Info
            </button>
            
            <button
              onClick={exportData}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Exportar Dados
            </button>
            
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Limpar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};