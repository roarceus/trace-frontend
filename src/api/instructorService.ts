import axiosInstance from './axiosConfig';
import { Instructor, InstructorRequest } from '../types/instructor.types';

export const createInstructor = async (instructorData: InstructorRequest): Promise<Instructor> => {
  const response = await axiosInstance.post<Instructor>('/v1/instructor', instructorData);
  return response.data;
};

export const getInstructors = async (): Promise<Instructor[]> => {
  const response = await axiosInstance.get<Instructor[]>('/v1/instructors');
  return response.data;
};

export const getInstructorById = async (id: string): Promise<Instructor> => {
  const response = await axiosInstance.get<Instructor>(`/v1/instructor/${id}`);
  return response.data;
};

export const updateInstructor = async (
  id: string,
  instructorData: InstructorRequest
): Promise<void> => {
  await axiosInstance.put(`/v1/instructor/${id}`, instructorData);
};

export const patchInstructor = async (
  id: string,
  instructorData: Partial<InstructorRequest>
): Promise<void> => {
  await axiosInstance.patch(`/v1/instructor/${id}`, instructorData);
};

export const deleteInstructor = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/v1/instructor/${id}`);
  } catch (error: any) {
    // Check for specific error status
    if (error.response) {
      if (error.response.status === 503) {
        throw new Error("Cannot delete this instructor because courses are associated with them. Please delete the courses first.");
      }
    }
    // Re-throw other errors
    throw error;
  }
};