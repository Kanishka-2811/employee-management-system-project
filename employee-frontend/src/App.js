import React, { useState, useEffect } from 'react';
import { fetchEmployees, createEmployee, deleteEmployee, updateEmployee } from './services/api';

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', department: 'IT', position: '', salary: 50000, email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [editId, setEditId] = useState(null);

  // 1. Database se Employees Fetch Karein
  const loadEmployees = async () => {
    try {
      const res = await fetchEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error('Error loading employees:', err);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // 2. Form Input Change Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Add / Update Employee
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) return alert('Please fill all fields');

    try {
      // Automatic Unique Email Generate (agar user input na ho)
      const payload = {
        ...formData,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}${Math.floor(Math.random()*1000)}@company.com`,
      };

      if (editId) {
        await updateEmployee(editId, payload);
        setEditId(null);
      } else {
        await createEmployee(payload);
      }

      setFormData({ name: '', department: 'IT', position: '', salary: 50000, email: '' });
      loadEmployees(); // Refresh list
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Error saving data to MongoDB!');
    }
  };

  // 4. Delete Employee
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        await deleteEmployee(id);
        loadEmployees();
      } catch (err) {
        console.error('Error deleting employee:', err);
      }
    }
  };

  // 5. Edit Button Handler
  const handleEdit = (emp) => {
    setEditId(emp._id);
    setFormData({
      name: emp.name,
      department: emp.department,
      position: emp.position,
      salary: emp.salary || 50000,
      email: emp.email || '',
    });
  };

  // Filter Search Logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Employee Management System</h2>

      {/* Form Section */}
      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editId ? 'Edit Employee' : 'Add New Employee'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            name="name"
            placeholder="Employee Name"
            value={formData.name}
            onChange={handleChange}
            style={{ flex: '1', padding: '8px' }}
            required
          />
          <select name="department" value={formData.department} onChange={handleChange} style={{ padding: '8px' }}>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            type="text"
            name="position"
            placeholder="Role / Designation"
            value={formData.position}
            onChange={handleChange}
            style={{ flex: '1', padding: '8px' }}
            required
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: editId ? '#e67e22' : '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editId ? 'Update' : 'Add'}
          </button>
        </form>
      </div>

      {/* Search & Filter Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1', padding: '8px' }}
        />
        <select value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} style={{ padding: '8px' }}>
          <option value="All">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
        </select>
      </div>

      {/* Employee Table */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>
                  <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px', padding: '4px 8px' }}>Edit</button>
                  <button onClick={() => handleDelete(emp._id)} style={{ color: 'red', padding: '4px 8px' }}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>No Employees Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;