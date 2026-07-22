const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const employeeRoutes = require('./routes/employeeRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/employees', employeeRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully! ✅'))
  .catch((err) => console.log('Database Connection Error ❌:', err));

// Test Route
app.get('/', (req, res) => {
  res.send('Employee Management API is Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🚀`);
});