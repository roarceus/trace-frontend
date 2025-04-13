import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Breadcrumbs,
  Link,
  Alert,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from '@mui/material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Course } from '../types/course.types';
import { Trace } from '../types/trace.types';
import { Instructor } from '../types/instructor.types';
import { Department } from '../types/department.types';
import { getCourseById } from '../api/courseService';
import { getTracesByCourseId, deleteTrace } from '../api/traceService';
import { getInstructorById } from '../api/instructorService';
import { getDepartmentById } from '../api/departmentService';
import TraceList from '../components/trace/TraceList';
import TraceForm from '../components/trace/TraceForm';

const CourseDetailsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Trace | null>(null);

  useEffect(() => {
    if (!courseId) {
      navigate('/courses');
      return;
    }
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const courseData = await getCourseById(courseId);
        setCourse(courseData);
        
        // Fetch instructor data
        try {
          const instructorData = await getInstructorById(courseData.instructor_id);
          setInstructor(instructorData);
        } catch (err) {
          console.error('Error fetching instructor:', err);
        }
        
        // Fetch department data
        try {
          const departmentData = await getDepartmentById(courseData.department_id);
          setDepartment(departmentData);
        } catch (err) {
          console.error('Error fetching department:', err);
        }
        
        const tracesData = await getTracesByCourseId(courseId);
        setTraces(tracesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load course data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, navigate]);

  const handleTraceDelete = async () => {
    if (!confirmDelete || !courseId) return;
    
    try {
      await deleteTrace(courseId, confirmDelete.trace_id);
      setTraces((prev) =>
        prev.filter((trace) => trace.trace_id !== confirmDelete.trace_id)
      );
      setConfirmDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete trace';
      setError(errorMessage);
    }
  };

  const handleTraceAdded = (newTrace: Trace) => {
    setTraces((prev) => [...prev, newTrace]);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Course not found.</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/courses')}
          sx={{ mt: 2 }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link component={RouterLink} to="/dashboard" underline="hover" color="inherit">
          Dashboard
        </Link>
        <Link component={RouterLink} to="/courses" underline="hover" color="inherit">
          Courses
        </Link>
        <Typography color="text.primary">{course.name}</Typography>
      </Breadcrumbs>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {course.name} ({course.code})
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {course.description || 'No description available'}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label={`${course.credit_hours} Credits`} color="primary" variant="outlined" />
              {instructor && (
                <Chip label={`Instructor: ${instructor.name}`} variant="outlined" />
              )}
              {department && (
                <Chip label={`Department: ${department.name}`} variant="outlined" />
              )}
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Created:</strong> {new Date(course.date_added).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong> {new Date(course.date_last_updated).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/courses')}
          >
            Back to Courses
          </Button>
        </Box>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Trace Surveys
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Upload Trace
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <TraceList
        traces={traces}
        onDelete={setConfirmDelete}
      />

      {/* Add Trace Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Trace Survey</DialogTitle>
        <DialogContent>
          {course && (
            <TraceForm
              courseId={course.course_id}
              onTraceAdded={handleTraceAdded}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the trace "{confirmDelete?.file_name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleTraceDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CourseDetailsPage;