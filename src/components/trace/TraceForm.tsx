import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Stack,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { TraceRequest } from '../../types/trace.types';
import { Instructor } from '../../types/instructor.types';
import { SemesterTerm } from '../../types/semester.types';
import { getInstructors } from '../../api/instructorService';
import { getSemesters } from '../../api/semesterService';
import { createTrace } from '../../api/traceService';

interface TraceFormProps {
  courseId: string;
  onTraceAdded: (trace: any) => void; // Use proper Trace type
}

const TraceForm: React.FC<TraceFormProps> = ({ courseId, onTraceAdded }) => {
  const [formData, setFormData] = useState<TraceRequest>({
    instructor_id: '',
    semester_term: '',
    section: '',
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [semesters, setSemesters] = useState<SemesterTerm[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [instructorsData, semestersData] = await Promise.all([
          getInstructors(),
          getSemesters(),
        ]);
        
        setInstructors(instructorsData);
        setSemesters(semestersData);
      } catch (err) {
        console.error('Failed to load form data:', err);
        setError('Failed to load instructors or semesters. Please try again.');
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Validate file type
      if (!selectedFile.type.includes('pdf')) {
        setError('Only PDF files are allowed');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const validate = (): boolean => {
    if (!formData.instructor_id) {
      setError('Please select an instructor');
      return false;
    }
    if (!formData.semester_term) {
      setError('Please select a semester term');
      return false;
    }
    if (!formData.section.trim()) {
      setError('Section is required');
      return false;
    }
    if (!file) {
      setError('Please upload a PDF file');
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
      const traceData: TraceRequest = {
        ...formData,
        file: file || undefined
      };
      
      const newTrace = await createTrace(courseId, traceData);
      setSuccess('Trace uploaded successfully');
      
      // Reset form
      setFormData({
        instructor_id: '',
        semester_term: '',
        section: '',
      });
      setFile(null);
      
      // Notify parent component
      onTraceAdded(newTrace);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while uploading the trace';
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
        Upload Trace Survey
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
              <InputLabel id="semester-term-label">Semester Term</InputLabel>
              <Select
                labelId="semester-term-label"
                id="semester-term"
                name="semester_term"
                value={formData.semester_term}
                label="Semester Term"
                onChange={handleSelectChange}
                disabled={loading || semesters.length === 0}
              >
                {semesters.length === 0 ? (
                  <MenuItem disabled value="">
                    No semesters available
                  </MenuItem>
                ) : (
                  semesters.map((semester) => (
                    <MenuItem key={semester.semester_term} value={semester.semester_term}>
                      {semester.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Stack>
          
          <TextField
            fullWidth
            label="Section"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="e.g., 01"
          />
          
          <Box
            sx={{
              border: '1px dashed',
              borderColor: 'grey.400',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
            }}
          >
            <input
              accept=".pdf"
              id="upload-trace-file"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={loading}
            />
            <label htmlFor="upload-trace-file">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                disabled={loading}
              >
                Upload PDF
              </Button>
            </label>
            {file && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Selected file: {file.name}
                </Typography>
              </Box>
            )}
            {!file && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Select a PDF file to upload
              </Typography>
            )}
          </Box>
        </Stack>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || instructors.length === 0 || semesters.length === 0}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {loading ? 'Uploading...' : 'Upload Trace'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TraceForm;