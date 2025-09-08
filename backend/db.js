const { Pool } = require('pg');

// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:12345678Silguto.@db.agfxharrsjvrvhrxxgfc.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados Supabase');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o banco:', err);
});

// Funções auxiliares para queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada:', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Funções específicas para o sistema HDR
const db = {
  // Usuários
  async createUser(userData) {
    const { email, password_hash, name, role = 'user' } = userData;
    const result = await query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, password_hash, name, role]
    );
    return result.rows[0];
  },

  async getUserByEmail(email) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async getUserById(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Clientes
  async getClientsByUserId(userId) {
    const result = await query(
      'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async createClient(clientData) {
    const { user_id, name, email, phone, company, address, total_revenue, last_project, status, contract_type } = clientData;
    const result = await query(
      'INSERT INTO clients (user_id, name, email, phone, company, address, total_revenue, last_project, status, contract_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [user_id, name, email, phone, company, address, total_revenue, last_project, status, contract_type]
    );
    return result.rows[0];
  },

  async updateClient(id, clientData) {
    const { name, email, phone, company, address, total_revenue, last_project, status, contract_type } = clientData;
    const result = await query(
      'UPDATE clients SET name = $1, email = $2, phone = $3, company = $4, address = $5, total_revenue = $6, last_project = $7, status = $8, contract_type = $9, updated_at = NOW() WHERE id = $10 RETURNING *',
      [name, email, phone, company, address, total_revenue, last_project, status, contract_type, id]
    );
    return result.rows[0];
  },

  async deleteClient(id) {
    const result = await query('DELETE FROM clients WHERE id = $1', [id]);
    return result.rowCount > 0;
  },

  // Transações
  async getTransactionsByUserId(userId) {
    const result = await query(
      'SELECT t.*, c.name as client_name FROM transactions t LEFT JOIN clients c ON t.client_id = c.id WHERE t.user_id = $1 ORDER BY t.date DESC, t.created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async createTransaction(transactionData) {
    const { user_id, date, description, type, category, amount, client_id, person } = transactionData;
    const result = await query(
      'INSERT INTO transactions (user_id, date, description, type, category, amount, client_id, person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_id, date, description, type, category, amount, client_id, person]
    );
    return result.rows[0];
  },

  async updateTransaction(id, transactionData) {
    const { date, description, type, category, amount, client_id, person } = transactionData;
    const result = await query(
      'UPDATE transactions SET date = $1, description = $2, type = $3, category = $4, amount = $5, client_id = $6, person = $7, updated_at = NOW() WHERE id = $8 RETURNING *',
      [date, description, type, category, amount, client_id, person, id]
    );
    return result.rows[0];
  },

  async deleteTransaction(id) {
    const result = await query('DELETE FROM transactions WHERE id = $1', [id]);
    return result.rowCount > 0;
  },

  // Sincronização
  async syncData(userId, localTransactions, localClients) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Sincronizar transações
      for (const transaction of localTransactions) {
        const { id, date, description, type, category, amount, client_id, person } = transaction;
        await client.query(
          'INSERT INTO transactions (id, user_id, date, description, type, category, amount, client_id, person) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO UPDATE SET date = $3, description = $4, type = $5, category = $6, amount = $7, client_id = $8, person = $9, updated_at = NOW()',
          [id, userId, date, description, type, category, amount, client_id, person]
        );
      }
      
      // Sincronizar clientes
      for (const clientData of localClients) {
        const { id, name, email, phone, company, address, total_revenue, last_project, status, contract_type } = clientData;
        await client.query(
          'INSERT INTO clients (id, user_id, name, email, phone, company, address, total_revenue, last_project, status, contract_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO UPDATE SET name = $3, email = $4, phone = $5, company = $6, address = $7, total_revenue = $8, last_project = $9, status = $10, contract_type = $11, updated_at = NOW()',
          [id, userId, name, email, phone, company, address, total_revenue, last_project, status, contract_type]
        );
      }
      
      await client.query('COMMIT');
      
      // Retornar dados atualizados
      const transactions = await this.getTransactionsByUserId(userId);
      const clients = await this.getClientsByUserId(userId);
      
      return { transactions, clients };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

module.exports = { pool, query, db };
