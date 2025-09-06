const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hdr-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Diretório para armazenar dados
const DATA_DIR = path.join(__dirname, 'data');
fs.ensureDirSync(DATA_DIR);

// Arquivos de dados
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');

// Funções auxiliares para manipular arquivos
const readJsonFile = async (filePath, defaultValue = []) => {
  try {
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Erro ao ler arquivo ${filePath}:`, error);
    return defaultValue;
  }
};

const writeJsonFile = async (filePath, data) => {
  try {
    await fs.writeJson(filePath, data, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Erro ao escrever arquivo ${filePath}:`, error);
    return false;
  }
};

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Inicializar usuários padrão
const initializeDefaultUsers = async () => {
  const users = await readJsonFile(USERS_FILE, []);
  
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        email: 'admin@audiovisual.com',
        password: await bcrypt.hash('admin123', 10),
        name: 'Administrador',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'user@audiovisual.com',
        password: await bcrypt.hash('user123', 10),
        name: 'Usuário Comum',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ];
    
    await writeJsonFile(USERS_FILE, defaultUsers);
    console.log('Usuários padrão criados');
  }
};

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const users = await readJsonFile(USERS_FILE, []);
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' });
    }
    
    const users = await readJsonFile(USERS_FILE, []);
    
    // Verificar se usuário já existe
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário já existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de transações
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await readJsonFile(TRANSACTIONS_FILE, []);
    const userTransactions = transactions.filter(t => t.userId === req.user.id);
    res.json(userTransactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactionData = req.body;
    const transactions = await readJsonFile(TRANSACTIONS_FILE, []);
    
    const newTransaction = {
      ...transactionData,
      id: Date.now().toString(),
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    await writeJsonFile(TRANSACTIONS_FILE, transactions);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const transactions = await readJsonFile(TRANSACTIONS_FILE, []);
    
    const transactionIndex = transactions.findIndex(t => t.id === id && t.userId === req.user.id);
    
    if (transactionIndex === -1) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(TRANSACTIONS_FILE, transactions);
    
    res.json(transactions[transactionIndex]);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const transactions = await readJsonFile(TRANSACTIONS_FILE, []);
    
    const filteredTransactions = transactions.filter(t => !(t.id === id && t.userId === req.user.id));
    
    if (filteredTransactions.length === transactions.length) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    await writeJsonFile(TRANSACTIONS_FILE, filteredTransactions);
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de clientes
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const clients = await readJsonFile(CLIENTS_FILE, []);
    const userClients = clients.filter(c => c.userId === req.user.id);
    res.json(userClients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    const clientData = req.body;
    const clients = await readJsonFile(CLIENTS_FILE, []);
    
    const newClient = {
      ...clientData,
      id: Date.now().toString(),
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    clients.push(newClient);
    await writeJsonFile(CLIENTS_FILE, clients);
    
    res.status(201).json(newClient);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const clients = await readJsonFile(CLIENTS_FILE, []);
    
    const clientIndex = clients.findIndex(c => c.id === id && c.userId === req.user.id);
    
    if (clientIndex === -1) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    clients[clientIndex] = {
      ...clients[clientIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(CLIENTS_FILE, clients);
    
    res.json(clients[clientIndex]);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const clients = await readJsonFile(CLIENTS_FILE, []);
    
    const filteredClients = clients.filter(c => !(c.id === id && c.userId === req.user.id));
    
    if (filteredClients.length === clients.length) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await writeJsonFile(CLIENTS_FILE, filteredClients);
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de sincronização completa
app.post('/api/sync', authenticateToken, async (req, res) => {
  try {
    const { transactions: clientTransactions, clients: clientClients } = req.body;
    
    // Carregar dados do servidor
    const serverTransactions = await readJsonFile(TRANSACTIONS_FILE, []);
    const serverClients = await readJsonFile(CLIENTS_FILE, []);
    
    // Filtrar dados do usuário
    const userServerTransactions = serverTransactions.filter(t => t.userId === req.user.id);
    const userServerClients = serverClients.filter(c => c.userId === req.user.id);
    
    // Sincronizar transações (merge simples - servidor tem prioridade)
    const mergedTransactions = [...userServerTransactions];
    
    if (clientTransactions && Array.isArray(clientTransactions)) {
      clientTransactions.forEach(clientTransaction => {
        const exists = mergedTransactions.find(t => t.id === clientTransaction.id);
        if (!exists) {
          mergedTransactions.push({
            ...clientTransaction,
            userId: req.user.id,
            createdAt: clientTransaction.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    }
    
    // Sincronizar clientes
    const mergedClients = [...userServerClients];
    
    if (clientClients && Array.isArray(clientClients)) {
      clientClients.forEach(clientClient => {
        const exists = mergedClients.find(c => c.id === clientClient.id);
        if (!exists) {
          mergedClients.push({
            ...clientClient,
            userId: req.user.id,
            createdAt: clientClient.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    }
    
    // Atualizar dados no servidor
    const otherTransactions = serverTransactions.filter(t => t.userId !== req.user.id);
    const otherClients = serverClients.filter(c => c.userId !== req.user.id);
    
    await writeJsonFile(TRANSACTIONS_FILE, [...otherTransactions, ...mergedTransactions]);
    await writeJsonFile(CLIENTS_FILE, [...otherClients, ...mergedClients]);
    
    res.json({
      transactions: mergedTransactions,
      clients: mergedClients
    });
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    await initializeDefaultUsers();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 API disponível em http://localhost:${PORT}/api`);
      console.log(`✅ Status: http://localhost:${PORT}/api/status`);
    });
  } catch (error) {
    console.error('Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM, encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT, encerrando servidor...');
  process.exit(0);
});