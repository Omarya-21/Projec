const express = require('express');
const { Pool } = require('pg');  // Changed from mysql2
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database table ready');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
};

initDB();

app.get('/', (req, res) => {
  res.json({ message: 'PC Parts API with PostgreSQL' });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Need username and password' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // PostgreSQL query with $1, $2 parameters
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id',
      [username, hashedPassword]
    );
    
    const userId = result.rows[0].id;
    const token = jwt.sign(
      { userId, username }, 
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, token, user: { id: userId, username } });
  } catch (error) {
    // PostgreSQL unique violation error code
    if (error.code === '23505') {
      res.status(400).json({ error: 'Username exists' });
    } else {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Need username and password' });
    
    // PostgreSQL query
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    const users = result.rows;
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/check-auth', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ isLoggedIn: false });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    res.json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Using PostgreSQL`);
});