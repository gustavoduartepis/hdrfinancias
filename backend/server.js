const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { db } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'hdr-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

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
  try {
    // Verificar se já existem usuários
    const existingUsers = await db.getUserByEmail('admin@audiovisual.com');
    if (existingUsers) {
      console.log('Usuários padrão já existem');
      return;
    }

    // Criar usuários padrão
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    await db.createUser({
      email: 'admin@audiovisual.com',
      password_hash: adminPassword,
      name: 'Administrador',
      role: 'admin'
    });

    await db.createUser({
      email: 'user@audiovisual.com',
      password_hash: userPassword,
      name: 'Usuário Comum',
      role: 'user'
    });

    console.log('✅ Usuários padrão criados no Supabase');
  } catch (error) {
    console.error('❌ Erro ao criar usuários padrão:', error);
  }
};

// Rotas de autenticação
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }
    
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password_hash, ...userWithoutPassword } = user;
    
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
    
    // Verificar se usuário já existe
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Usuário já existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await db.createUser({
      email,
      password_hash: hashedPassword,
      name,
      role
    });
    
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    const { password_hash, ...userWithoutPassword } = newUser;
    
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
    const transactions = await db.getTransactionsByUserId(req.user.id);
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const transactionData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const newTransaction = await db.createTransaction(transactionData);
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
    
    const updatedTransaction = await db.updateTransaction(id, updateData);
    
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db.deleteTransaction(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de clientes
app.get('/api/clients', authenticateToken, async (req, res) => {
  try {
    const clients = await db.getClientsByUserId(req.user.id);
    res.json(clients);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/clients', authenticateToken, async (req, res) => {
  try {
    const clientData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const newClient = await db.createClient(clientData);
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
    
    const updatedClient = await db.updateClient(id, updateData);
    
    if (!updatedClient) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(updatedClient);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db.deleteClient(id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
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
    
    const result = await db.syncData(req.user.id, clientTransactions || [], clientClients || []);
    
    res.json(result);
  } catch (error) {
    console.error('Erro na sincronização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'HDR API Backend - Supabase',
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'Supabase PostgreSQL',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register',
      data: '/api/transactions, /api/clients',
      sync: '/api/sync',
      status: '/api/status, /api/health'
    }
  });
});

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'Supabase PostgreSQL'
  });
});

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    database: 'Supabase PostgreSQL'
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
      console.log(`🗄️ Banco: Supabase PostgreSQL`);
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