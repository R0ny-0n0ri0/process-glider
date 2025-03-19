
import apiRequest from './api.service';
import { 
  Department, 
  CreateDepartmentDto, 
  UpdateDepartmentDto 
} from '../types/api.types';

const BASE_URL = '/departments';

export const DepartmentService = {
  // Get all departments
  getAll: () => {
    return apiRequest<Department[]>(BASE_URL);
  },
  
  // Get department by id
  getById: (id: number) => {
    return apiRequest<Department>(`${BASE_URL}/${id}`);
  },
  
  // Create new department
  create: (data: CreateDepartmentDto) => {
    return apiRequest<Department>(BASE_URL, 'POST', data);
  },
  
  // Update existing department
  update: (id: number, data: UpdateDepartmentDto) => {
    return apiRequest<Department>(`${BASE_URL}/${id}`, 'PUT', data);
  },
  
  // Delete department
  delete: (id: number) => {
    return apiRequest<void>(`${BASE_URL}/${id}`, 'DELETE');
  }
};
