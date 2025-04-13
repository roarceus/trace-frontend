import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Course, CourseRequest } from '../types/course.types';
import { createCourse, getCourses, updateCourse, deleteCourse } from '../api/courseService';
import CourseForm from '../components/course/CourseForm';
import CourseList from '../components/course/CourseList';

const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null);

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (data: CourseRequest) => {
    try {
      const newCourse = await createCourse(data);
      setCourses((prev) => [...prev, newCourse]);
      setShowAddForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create course';
      throw new Error(errorMessage);
    }
  };

  const handleEditCourse = async (data: CourseRequest) => {
    if (!editingCourse) return;
    
    try {
      await updateCourse(editingCourse.course_id, data);
      setCourses((prev) =>
        prev.map((course) =>
          course.course_id === editingCourse.course_id
            ? { ...course, ...data, date_last_updated: new Date().toISOString() }
            : course
        )
      );
      
      setEditingCourse(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update course';
      throw new Error(errorMessage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteCourse(confirmDelete.course_id);
      setCourses((prev) =>
        prev.filter((course) => course.course_id !== confirmDelete.course_id)
      );
      setConfirmDelete(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete course';
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Courses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Add Course
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <CourseList
          courses={courses}
          onEdit={setEditingCourse}
          onDelete={setConfirmDelete}
        />
      )}

      {/* Add Form Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <CourseForm onSubmit={handleAddCourse} />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog
        open={!!editingCourse}
        onClose={() => setEditingCourse(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          {editingCourse && (
            <CourseForm
              initialData={{
                code: editingCourse.code,
                name: editingCourse.name,
                description: editingCourse.description,
                instructor_id: editingCourse.instructor_id,
                department_id: editingCourse.department_id,
                credit_hours: editingCourse.credit_hours,
              }}
              onSubmit={handleEditCourse}
              isEdit
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
            Are you sure you want to delete the course "{confirmDelete?.name}" ({confirmDelete?.code})? 
            This action cannot be undone and will delete all associated trace data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CoursePage;