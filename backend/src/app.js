const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;