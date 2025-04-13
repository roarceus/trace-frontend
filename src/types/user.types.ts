export interface UserRequest {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }
  
  export interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
    account_created: string;
    account_updated: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  