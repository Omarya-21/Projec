const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true
}));
app.use(express.json());

// Railway provides DATABASE_URL automatically
const DATABASE_URL = process.env.DATABASE_URL;

let pool;

// Create database connection
async function createConnection() {
  try {
    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }
    
    // Parse the connection string
    const url = new URL(DATABASE_URL);
    
    pool = mysql.createPool({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 10000, // 10 seconds timeout
    });
    
    console.log('✅ Database pool created');
    return pool;
  } catch (error) {
    console.error('❌ Failed to create database pool:', error.message);
    throw error;
  }
}

// Initialize database
async function initDB() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    connection.release();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'PC Parts Shop API',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: DATABASE_URL ? 'connected' : 'not configured'
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
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    connection.release();
    
    const token = jwt.sign(
      { userId: result.insertId, username },
      process.env.JWT_SECRET || 'railway-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: { id: result.insertId, username }
    });
    
  } catch (error) {
    console.error('Register error:', error.message);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
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
    
    const connection = await pool.getConnection();
    const [users] = await connection.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    connection.release();
    
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
      process.env.JWT_SECRET || 'railway-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username }
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Start server
async function startServer() {
  try {
    // Create database connection
    await createConnection();
    
    // Initialize database
    await initDB();
    
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database URL: ${DATABASE_URL ? 'Configured' : 'Not set'}`);
      console.log(`🌐 Health check: https://your-app.railway.app/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();