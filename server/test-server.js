const express = require('express');
const cors = require('cors');

const app = express();

// Simple CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested from:', req.headers.origin);
  res.json({ message: 'Server is running', timestamp: new Date().toISOString() });
});

// Test auth endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('Login requested from:', req.headers.origin);
  res.json({ success: true, message: 'Test login successful' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('CORS enabled for: http://localhost:5173, http://localhost:5174, http://localhost:3000');
});