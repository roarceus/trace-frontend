export interface TraceRequest {
    instructor_id: string;
    semester_term: string;
    section: string;
    file?: File;
  }
  
  export interface Trace {
    trace_id: string;
    user_id: string;
    file_name: string;
    date_created: string;
    bucket_path: string;
    course_id: string;
    instructor_id: string;
    semester_term: string;
    section: string;
  }