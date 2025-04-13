import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
  CircularProgress,
} from '@mui/material';
import { CourseRequest } from '../../types/course.types';
import { Instructor } from '../../types/instructor.types';
import { Department } from '../../types/department.types';
import { getInstructors } from '../../api/instructorService';
import { getDepartments } from '../../api/departmentService';

interface CourseFormProps {
  initialData?: Partial<CourseRequest>;
  onSubmit: (data: CourseRequest) => Promise<void>;
  isEdit?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({
  initialData = {},
  onSubmit,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<CourseRequest>({
    code: initialData.code || '',
    name: initialData.name || '',
    description: initialData.description || '',
    instructor_id: initialData.instructor_id || '',
    department_id: initialData.department_id || 0,
    credit_hours: initialData.credit_hours || 3,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [instructorsData, departmentsData] = await Promise.all([
          getInstructors(),
          getDepartments(),
        ]);
        
        setInstructors(instructorsData);
        setDepartments(departmentsData);
        
        // Set default department if not already set and departments exist
        if (!formData.department_id && departmentsData.length > 0) {
          setFormData(prev => ({
            ...prev,
            department_id: departmentsData[0].department_id,
          }));
        }
      } catch (err) {
        console.error('Failed to load form data:', err);
        setError('Failed to load departments or instructors. Please try again.');
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'department_id' ? Number(value) : value,
    }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const validate = (): boolean => {
    if (!formData.code.trim()) {
      setError('Course code is required');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Course name is required');
      return false;
    }
    if (!formData.instructor_id) {
      setError('Please select an instructor');
      return false;
    }
    if (!formData.department_id) {
      setError('Please select a department');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    setSuccess(null);
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      await onSubmit(formData);
      setSuccess(isEdit ? 'Course updated successfully' : 'Course created successfully');
      if (!isEdit) {
        // Reset form after successful creation
        setFormData({
          code: '',
          name: '',
          description: '',
          instructor_id: '',
          department_id: departments.length > 0 ? departments[0].department_id : 0,
          credit_hours: 3,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Course' : 'Add New Course'}
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              disabled={loading}
            />
            
            <TextField
              fullWidth
              label="Course Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Stack>
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            disabled={loading}
          />
          
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl fullWidth required>
              <InputLabel id="instructor-label">Instructor</InputLabel>
              <Select
                labelId="instructor-label"
                id="instructor"
                name="instructor_id"
                value={formData.instructor_id}
                label="Instructor"
                onChange={handleSelectChange}
                disabled={loading || instructors.length === 0}
              >
                {instructors.length === 0 ? (
                  <MenuItem disabled value="">
                    No instructors available
                  </MenuItem>
                ) : (
                  instructors.map((instructor) => (
                    <MenuItem key={instructor.instructor_id} value={instructor.instructor_id}>
                      {instructor.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            <FormControl fullWidth required>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                name="department_id"
                value={formData.department_id.toString()}
                label="Department"
                onChange={handleSelectChange}
                disabled={loading || departments.length === 0}
              >
                {departments.length === 0 ? (
                  <MenuItem disabled value="">
                    No departments available
                  </MenuItem>
                ) : (
                  departments.map((department) => (
                    <MenuItem key={department.department_id} value={department.department_id.toString()}>
                      {department.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Credit Hours"
              name="credit_hours"
              type="number"
              value={formData.credit_hours}
              onChange={handleNumberChange}
              required
              disabled={loading}
              inputProps={{ min: 1, max: 6 }}
            />
          </Stack>
        </Stack>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || instructors.length === 0 || departments.length === 0}
          >
            {loading
              ? isEdit
                ? 'Updating...'
                : 'Creating...'
              : isEdit
              ? 'Update Course'
              : 'Create Course'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseForm;