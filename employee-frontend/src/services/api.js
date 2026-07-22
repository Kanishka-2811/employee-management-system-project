import axios from 'axios';

// Backend Server URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api/employees',
});

// APIs Call Functions
export const fetchEmployees = () => API.get('/');
export const createEmployee = (newEmp) => API.post('/', newEmp);
export const updateEmployee = (id, updatedEmp) => API.put(`/${id}`, updatedEmp);
export const deleteEmployee = (id) => API.delete(`/${id}`);