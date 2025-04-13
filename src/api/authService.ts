import axiosInstance from './axiosConfig';
import { UserRequest, User, LoginCredentials } from '../types/user.types';
import { setAuthToken, setUser, clearAuth } from '../utils/authUtils';

export const signUp = async (userData: UserRequest): Promise<User> => {
  try {
    const response = await axiosInstance.post<User>('/v1/user', userData);
    return response.data;
  } catch (error: any) {
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 409) {
        throw new Error('User already exists. Please use a different email.');
      }
      throw new Error(error.response.data?.error || 'An error occurred during signup');
    }
    throw error;
  }
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    // Store auth token for Basic Auth
    setAuthToken(credentials);
    
    // Make an authenticated request to verify credentials
    // We'll use a generic endpoint that should be accessible with valid credentials
    const response = await axiosInstance.get('/v1/instructors');
    
    // If we get here, authentication was successful
    // Now create a user object with the available information
    const user: User = {
      user_id: 'authenticated-user',
      first_name: credentials.username.split('@')[0] || 'User',
      last_name: '',
      username: credentials.username,
      account_created: new Date().toISOString(),
      account_updated: new Date().toISOString()
    };
    
    setUser(user);
    return user;
  } catch (error: any) {
    // Clear token on authentication failure
    clearAuth();
    
    // Handle specific error cases
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid email or password. Please try again.');
      }
      throw new Error(error.response.data?.error || 'Authentication failed');
    }
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  return null;
};