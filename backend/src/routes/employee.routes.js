const express = require('express');

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus
} = require('../controllers/employee.controller');

const router = express.Router();

router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.patch('/:id/status', updateEmployeeStatus);
router.delete('/:id', deleteEmployee);

module.exports = router;