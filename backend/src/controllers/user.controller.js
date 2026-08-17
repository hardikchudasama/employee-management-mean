const User = require('../models/user.model');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      role,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

    const skip = (pageNumber - 1) * limitNumber;

    // Build filter
    const filter = {};

    // Search by name or email
    if (search.trim()) {
      filter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: 'i'
          }
        },
        {
          email: {
            $regex: search.trim(),
            $options: 'i'
          }
        }
      ];
    }

    // Role filter
    if (role) {
      filter.role = role;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Validate sorting
    const allowedSortFields = [
      'name',
      'email',
      'role',
      'status',
      'createdAt'
    ];

    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'createdAt';

    const validSortOrder = sortOrder === 'asc' ? 1 : -1;

    // Fetch users and total count in parallel
    const [users, totalRecords] = await Promise.all([
      User.find(filter)
        .select('-password -refreshTokenHash')
        .sort({
          [validSortBy]: validSortOrder
        })
        .skip(skip)
        .limit(limitNumber),

      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(
      totalRecords / limitNumber
    );

    return res.status(200).json({
      success: true,

      data: users,

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalRecords,
        totalPages
      }
    });

  } catch (error) {

    console.error('Get users error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -refreshTokenHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Active or Inactive'
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (
      user._id.toString() === req.user.userId &&
      status === 'Inactive'
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    user.status = status;

    // If user is deactivated, invalidate refresh token
    if (status === 'Inactive') {
      user.refreshTokenHash = null;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${status === 'Active' ? 'activated' : 'deactivated'} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be admin or user'
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // No change required
    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: `User already has the ${role} role`
      });
    }

    // Prevent admin from changing their own role
    if (
      user._id.toString() === req.user.userId
    ) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    // Prevent removing the last admin
    if (
      user.role === 'admin' &&
      role === 'user'
    ) {
      const adminCount = await User.countDocuments({
        role: 'admin',
        status: 'Active'
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot remove the last active admin'
        });
      }
    }

    user.role = role;

    // If changing to admin, make sure account is active
    // only if you want this behavior.
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User role changed to ${role} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Update user role error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole
};