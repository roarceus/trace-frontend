import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import { Course } from '../types/course.types';
import { Trace } from '../types/trace.types';
import { getCourses, getCourseById } from '../api/courseService';
import { getTraces, getTracesByCourseId, deleteTrace } from '../api/traceService';
import TraceList from '../components/trace/TraceList';
import TraceForm from '../components/trace/TraceForm';
import { Add as AddIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trace-tabpanel-${index}`}
      aria-labelledby={`trace-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const TracePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [courseTraces, setCourseTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Trace | null>(null);
  const [tabValue, setTabValue] = useState(0);

  // Fetch courses and all traces on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesData, tracesData] = await Promise.all([
          getCourses(),
          getTraces()
        ]);
        
        setCourses(coursesData);
        setTraces(tracesData);
        
        if (coursesData.length > 0) {
          setSelectedCourseId(coursesData[0].course_id);
        }
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch course-specific traces when selected course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const [courseData, tracesData] = await Promise.all([
          getCourseById(selectedCourseId),
          getTracesByCourseId(selectedCourseId)
        ]);
        
        setSelectedCourse(courseData);
        setCourseTraces(tracesData);
      } catch (err) {
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [selectedCourseId]);

  const handleCourseChange = (event: SelectChangeEvent) => {
    setSelectedCourseId(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTraceAdded = (newTrace: Trace) => {
    // Update both lists
    setCourseTraces(prev => [...prev, newTrace]);
    setTraces(prev => [...prev, newTrace]);
    setShowUploadForm(false);
  };

  const handleTraceDelete = async () => {
    if (!confirmDelete || !selectedCourseId) return;
    
    try {
      await deleteTrace(
        tabValue === 0 ? selectedCourseId : confirmDelete.course_id, 
        confirmDelete.trace_id
      );
      
      // Remove from appropriate list
      if (tabValue === 0) {
        setCourseTraces(prev =>
          prev.filter(trace => trace.trace_id !== confirmDelete.trace_id)
        );
      }
      
      // Always remove from all traces list
      setTraces(prev =>
        prev.filter(trace => trace.trace_id !== confirmDelete.trace_id)
      );
      
      setConfirmDelete(null);
    } catch (err) {
      setError('Failed to delete trace');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Trace Surveys
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Course Traces" />
          <Tab label="All Traces" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 3, px: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="course-select-label">Select Course</InputLabel>
              <Select
                labelId="course-select-label"
                id="course-select"
                value={selectedCourseId}
                label="Select Course"
                onChange={handleCourseChange}
                disabled={loading || courses.length === 0}
              >
                {courses.length === 0 ? (
                  <MenuItem disabled>No courses available</MenuItem>
                ) : (
                  courses.map((course) => (
                    <MenuItem key={course.course_id} value={course.course_id}>
                      {course.name} ({course.code})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {selectedCourseId && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => setShowUploadForm(true)}
                  disabled={!selectedCourseId}
                >
                  Upload Trace
                </Button>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : !selectedCourseId ? (
              <Alert severity="info">
                Please select a course to view its trace surveys.
              </Alert>
            ) : (
              <TraceList
                traces={courseTraces}
                onDelete={setConfirmDelete}
              />
            )}
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" gutterBottom>
              All Uploaded Traces
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TraceList
                traces={traces}
                onDelete={setConfirmDelete}
              />
            )}
          </Box>
        </TabPanel>
      </Paper>

      {/* Upload Form Dialog */}
      <Dialog
        open={showUploadForm}
        onClose={() => setShowUploadForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Upload Trace Survey</DialogTitle>
        <DialogContent>
          {selectedCourseId && (
            <TraceForm
              courseId={selectedCourseId}
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

export default TracePage;