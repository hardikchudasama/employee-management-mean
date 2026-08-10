const express = require('express');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus
} = require('../controllers/employee.controller');

const router = express.Router();

router.get('/', authenticate, getAllEmployees);
router.get('/:id', authenticate, getEmployeeById);
router.post('/', authenticate, authorize('admin'), createEmployee);
router.put('/:id', authenticate, authorize('admin'), updateEmployee);
router.patch('/:id/status', authenticate, authorize('admin'), updateEmployeeStatus);
router.delete('/:id', authenticate, authorize('admin'), deleteEmployee);

module.exports = router;