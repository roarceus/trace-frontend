export interface CourseRequest {
    code: string;
    name: string;
    description: string;
    instructor_id: string;
    department_id: number;
    credit_hours: number;
  }
  
  export interface Course {
    course_id: string;
    date_added: string;
    date_last_updated: string;
    user_id: string;
    code: string;
    name: string;
    description: string;
    instructor_id: string;
    department_id: number;
    credit_hours: number;
  }