const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
      maxlength: [50, 'First name cannot exceed 50 characters'],
      match: [/^[a-zA-Z\s]+$/, 'First name can contain only letters and spaces']
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
      maxlength: [50, 'Last name cannot exceed 50 characters'],
      match: [/^[a-zA-Z\s]+$/, 'Last name can contain only letters and spaces']
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please enter a valid email address'
      ]
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[0-9]{10}$/,
        'Phone number must contain exactly 10 digits'
      ]
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['IT', 'HR', 'Finance', 'Sales', 'Marketing'],
        message: 'Invalid department'
      }
    },

    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
      minlength: [2, 'Designation must be at least 2 characters'],
      maxlength: [100, 'Designation cannot exceed 100 characters']
    },

    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [1, 'Salary must be greater than 0']
    },

    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required']
    },

    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Active', 'Inactive'],
        message: 'Status must be Active or Inactive'
      },
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;