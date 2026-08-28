require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./modules/auth/auth.routes');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Chat API is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;