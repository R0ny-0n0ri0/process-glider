
// Department types
export interface Department {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

// Process types
export interface Process {
  id: number;
  name: string;
  description?: string;
  departmentId: number;
  department?: Department;
  subProcesses?: SubProcess[];
  tools?: string[];
  responsibles?: string[];
  documentation?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProcessDto {
  name: string;
  description?: string;
  departmentId: number;
  tools?: string[];
  responsibles?: string[];
  documentation?: string[];
}

export interface UpdateProcessDto {
  name?: string;
  description?: string;
  departmentId?: number;
  tools?: string[];
  responsibles?: string[];
  documentation?: string[];
}

// SubProcess types
export interface SubProcess {
  id: number;
  name: string;
  description?: string;
  processId: number;
  process?: Process;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSubProcessDto {
  name: string;
  description?: string;
  processId: number;
  order?: number;
}

export interface UpdateSubProcessDto {
  name?: string;
  description?: string;
  processId?: number;
  order?: number;
}
