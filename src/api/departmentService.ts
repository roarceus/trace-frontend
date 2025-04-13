import axiosInstance from './axiosConfig';
import { Department } from '../types/department.types';

export const getDepartments = async (): Promise<Department[]> => {
  const response = await axiosInstance.get<Department[]>('/v1/departments');
  return response.data;
};

export const getDepartmentById = async (id: number): Promise<Department> => {
  // This is a placeholder since there doesn't seem to be a specific endpoint for this
  // Implement this when the API supports it
  const departments = await getDepartments();
  const department = departments.find(d => d.department_id === id);
  
  if (!department) {
    throw new Error(`Department with ID ${id} not found`);
  }
  
  return department;
};