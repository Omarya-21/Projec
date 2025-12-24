const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'pcparts_login',
  waitForConnections: true,
  connectionLimit: 10
});

const initDB = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query(`CREATE DATABASE IF NOT EXISTS pcparts_login`);
    await conn.query(`USE pcparts_login`);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    conn.release();
    console.log('✅ Database ready');
  } catch (error) {
    console.error('❌ Database error:', error.message);
  }
};

initDB();

app.get('/', (req, res) => {
  res.json({ message: 'PC Parts API' });
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Need username and password' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    const [result] = await conn.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    conn.release();
    
    const token = jwt.sign({ userId: result.insertId, username }, 'secret-key', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: result.insertId, username } });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Need username and password' });
    
    const conn = await pool.getConnection();
    const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
    conn.release();
    
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user.id, username: user.username }, 'secret-key', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/check-auth', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.json({ isLoggedIn: false });
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secret-key');
    res.json({ isLoggedIn: true, user: decoded });
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   POST /api/register - Register`);
  console.log(`   POST /api/login - Login`);
  console.log(`   GET  /api/check-auth - Check login`);
});