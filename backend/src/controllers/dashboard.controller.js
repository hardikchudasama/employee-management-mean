const Employee = require('../models/employee.model');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      departments,
      departmentStats,
      recentEmployees,
      statusStats
    ] = await Promise.all([
      // Total employees
      Employee.countDocuments(),

      // Active employees
      Employee.countDocuments({ status: 'Active' }),

      // Inactive employees
      Employee.countDocuments({ status: 'Inactive' }),

      // Departments
      Employee.distinct('department'),

      // Employees by department
      Employee.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            department: '$_id',
            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ]),

      // Recently added employees
      Employee.find()
        .sort({ createdAt: -1 })
        .limit(5),

      // Employees by status
      Employee.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            status: '$_id',
            count: 1
          }
        },
        {
          $sort: {
            count: -1
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        departmentCount: departments.length,
        departmentStats,
        recentEmployees,
        statusStats
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};