import axiosInstance from './axiosConfig';
import { Course, CourseRequest } from '../types/course.types';

export const createCourse = async (courseData: CourseRequest): Promise<Course> => {
  const response = await axiosInstance.post<Course>('/v1/course', courseData);
  return response.data;
};

export const getCourses = async (): Promise<Course[]> => {
  const response = await axiosInstance.get<Course[]>('/v1/courses');
  return response.data;
};

export const getCourseById = async (id: string): Promise<Course> => {
  const response = await axiosInstance.get<Course>(`/v1/course/${id}`);
  return response.data;
};

export const updateCourse = async (id: string, courseData: CourseRequest): Promise<void> => {
  await axiosInstance.put(`/v1/course/${id}`, courseData);
};

export const patchCourse = async (
  id: string,
  courseData: Partial<CourseRequest>
): Promise<void> => {
  await axiosInstance.patch(`/v1/course/${id}`, courseData);
};

export const deleteCourse = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/v1/course/${id}`);
};