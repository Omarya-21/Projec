const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - works with both XAMPP and Railway
let pool;

if (process.env.DATABASE_URL) {
  // Parse Railway connection string
  const url = new URL(process.env.DATABASE_URL);
  pool = mysql.createPool({
    host: url.hostname,
    port: url.port || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.replace('/', ''),
    waitForConnections: true,
    connectionLimit: 10
  });
  console.log('📊 Using Railway MySQL');
} else {
  // Use XAMPP local MySQL
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pcparts_login',
    waitForConnections: true,
    connectionLimit: 10
  });
  console.log('📊 Using XAMPP MySQL');
}

// Initialize database
const initDB = async () => {
  try {
    const conn = await pool.getConnection();
    
    // For XAMPP: create database if not exists
    if (!process.env.DATABASE_URL) {
      await conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'pcparts_login'}`);
      await conn.query(`USE ${process.env.DB_NAME || 'pcparts_login'}`);
    }
    
    // Create users table
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
    console.log('💡 Tip: Make sure MySQL is running (XAMPP or Railway)');
  }
};

initDB();

// Test endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PC Parts Shop API',
    database: process.env.DATABASE_URL ? 'Railway' : 'XAMPP',
    status: 'running'
  });
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const conn = await pool.getConnection();
    
    const [result] = await conn.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    conn.release();
    
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, username }
    });
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    
    const conn = await pool.getConnection();
    const [users] = await conn.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    conn.release();
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check authentication
app.get('/api/check-auth', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ isLoggedIn: false });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    
    res.json({ 
      isLoggedIn: true, 
      user: decoded 
    });
    
  } catch (error) {
    res.json({ isLoggedIn: false });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Using default'}`);
});