const express = require('express');

const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole
} = require('../controllers/user.controller');

const router = express.Router();

// Get all users - Admin only
router.get(
  '/',
  authenticate,
  authorize('admin'),
  getAllUsers
);

router.get(
  '/:id',
  authenticate,
  authorize('admin'),
  getUserById
);

router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  updateUserStatus
);

router.patch(
  '/:id/role',
  authenticate,
  authorize('admin'),
  updateUserRole
);

module.exports = router;