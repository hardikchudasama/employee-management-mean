const express = require('express');
const cors = require('cors');

const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeeRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;