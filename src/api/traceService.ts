import axiosInstance from './axiosConfig';
import { Trace, TraceRequest } from '../types/trace.types';

export const createTrace = async (courseId: string, traceData: TraceRequest): Promise<Trace> => {
  const formData = new FormData();
  
  // Append trace data to form
  formData.append('instructor_id', traceData.instructor_id);
  formData.append('semester_term', traceData.semester_term);
  formData.append('section', traceData.section);
  
  // Append file if available
  if (traceData.file) {
    formData.append('file', traceData.file);
  }
  
  const response = await axiosInstance.post<Trace>(
    `/v1/course/${courseId}/trace`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
};

export const getTraces = async (): Promise<Trace[]> => {
  const response = await axiosInstance.get<Trace[]>('/v1/traces');
  return response.data;
};

export const getTracesByCourseId = async (courseId: string): Promise<Trace[]> => {
  const response = await axiosInstance.get<Trace[]>(`/v1/course/${courseId}/trace`);
  return response.data;
};

export const getTraceById = async (courseId: string, traceId: string): Promise<Trace> => {
  const response = await axiosInstance.get<Trace>(`/v1/course/${courseId}/trace/${traceId}`);
  return response.data;
};

export const deleteTrace = async (courseId: string, traceId: string): Promise<void> => {
  await axiosInstance.delete(`/v1/course/${courseId}/trace/${traceId}`);
};