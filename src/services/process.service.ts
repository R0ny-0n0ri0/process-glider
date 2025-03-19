
import apiRequest from './api.service';
import { 
  Process, 
  CreateProcessDto, 
  UpdateProcessDto 
} from '../types/api.types';

const BASE_URL = '/processes';

export const ProcessService = {
  // Get all processes
  getAll: () => {
    return apiRequest<Process[]>(BASE_URL);
  },
  
  // Get process by id
  getById: (id: number) => {
    return apiRequest<Process>(`${BASE_URL}/${id}`);
  },
  
  // Get processes by department id
  getByDepartmentId: (departmentId: number) => {
    return apiRequest<Process[]>(`${BASE_URL}/department/${departmentId}`);
  },
  
  // Create new process
  create: (data: CreateProcessDto) => {
    return apiRequest<Process>(BASE_URL, 'POST', data);
  },
  
  // Update existing process
  update: (id: number, data: UpdateProcessDto) => {
    return apiRequest<Process>(`${BASE_URL}/${id}`, 'PUT', data);
  },
  
  // Delete process
  delete: (id: number) => {
    return apiRequest<void>(`${BASE_URL}/${id}`, 'DELETE');
  }
};
