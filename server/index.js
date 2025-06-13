const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const peptideRoutes = require('./routes/peptideRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const userRoutes = require('./routes/userRoutes');
const voteRoutes = require('./routes/voteRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const seedRoutes = require('./routes/seedRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/peptides', peptideRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/seed', seedRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'PeptiTrace API is running' });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peptitrace', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 