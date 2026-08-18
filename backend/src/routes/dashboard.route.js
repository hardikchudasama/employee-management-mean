const express = require('express');

const authenticate = require('../middleware/auth.middleware');

const {
  getDashboardStats
} = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/', authenticate, getDashboardStats);

module.exports = router;