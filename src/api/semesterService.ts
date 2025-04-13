import axiosInstance from './axiosConfig';
import { SemesterTerm } from '../types/semester.types';

export const getSemesters = async (): Promise<SemesterTerm[]> => {
  const response = await axiosInstance.get<SemesterTerm[]>('/v1/semesters');
  return response.data;
};