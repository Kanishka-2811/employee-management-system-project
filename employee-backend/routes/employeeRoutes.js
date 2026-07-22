const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// 1. CREATE: Naya Employee add karne ke liye
router.post('/', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. READ: Saare Employees get karne ke liye
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. READ SINGLE: Kisi specific employee ki details lene ke liye
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. UPDATE: Employee update karne ke liye
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. DELETE: Employee delete karne ke liye
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;