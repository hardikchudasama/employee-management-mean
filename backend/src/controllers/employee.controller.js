const Employee = require('../models/employee.model');

const createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });

  } catch (error) {

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: getValidationErrors(error)
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create employee'
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      department,
      status,
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter
    const filter = {};

    // Search
    if (search.trim()) {
      filter.$or = [
        { firstName: { $regex: search.trim(), $options: 'i' } },
        { lastName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { designation: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Sorting
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const sort = {
      [sortBy]: sortDirection,
    };

    // Get employees and total count
    const [employees, totalRecords] = await Promise.all([
      Employee.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber),

      Employee.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNumber);

    res.status(200).json({
      success: true,
      data: employees,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalRecords,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employees',
      error: error.message,
    });
  }
};


const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch employee',
      error: error.message,
    });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update employee',
      error: error.message,
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete employee',
      error: error.message,
    });
  }
};

const updateEmployeeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee status'
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Employee ${status.toLowerCase()} successfully`,
      data: employee
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update employee status',
      error: error.message
    });
  }
};

const getValidationErrors = (error) => {
  const errors = {};

  if (error.name === 'ValidationError') {
    Object.keys(error.errors).forEach((field) => {
      errors[field] = error.errors[field].message;
    });
  }

  return errors;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee,
};