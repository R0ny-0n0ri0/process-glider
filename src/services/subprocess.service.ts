
import apiRequest from './api.service';
import { 
  SubProcess, 
  CreateSubProcessDto, 
  UpdateSubProcessDto 
} from '../types/api.types';

const BASE_URL = '/subprocesses';

export const SubProcessService = {
  // Get all subprocesses
  getAll: () => {
    return apiRequest<SubProcess[]>(BASE_URL);
  },
  
  // Get subprocess by id
  getById: (id: number) => {
    return apiRequest<SubProcess>(`${BASE_URL}/${id}`);
  },
  
  // Get subprocesses by process id
  getByProcessId: (processId: number) => {
    return apiRequest<SubProcess[]>(`${BASE_URL}/process/${processId}`);
  },
  
  // Create new subprocess
  create: (data: CreateSubProcessDto) => {
    return apiRequest<SubProcess>(BASE_URL, 'POST', data);
  },
  
  // Update existing subprocess
  update: (id: number, data: UpdateSubProcessDto) => {
    return apiRequest<SubProcess>(`${BASE_URL}/${id}`, 'PUT', data);
  },
  
  // Delete subprocess
  delete: (id: number) => {
    return apiRequest<void>(`${BASE_URL}/${id}`, 'DELETE');
  }
};
