const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);