import { User, LoginCredentials } from '../types/user.types';

export const setAuthToken = (credentials: LoginCredentials): void => {
  const token = btoa(`${credentials.username}:${credentials.password}`);
  localStorage.setItem('authToken', token);
  localStorage.setItem('credentials', JSON.stringify(credentials));
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const getCredentials = (): LoginCredentials | null => {
  const credentialsStr = localStorage.getItem('credentials');
  return credentialsStr ? JSON.parse(credentialsStr) : null;
};

export const setUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('credentials');
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getUser();
};