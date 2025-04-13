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
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Instructor, InstructorRequest } from '../types/instructor.types';
import { createInstructor, getInstructors, updateInstructor, deleteInstructor } from '../api/instructorService';
import InstructorForm from '../components/instructor/InstructorForm';
import InstructorList from '../components/instructor/InstructorList';

const InstructorPage: React.FC = () => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Instructor | null>(null);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'error' | 'success' | 'info'}>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Fetch instructors on component mount
  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInstructors();
      setInstructors(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load instructors';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async (data: InstructorRequest) => {
    try {
      const newInstructor = await createInstructor(data);
      setInstructors((prev) => [...prev, newInstructor]);
      setShowAddForm(false);
      setSnackbar({
        open: true,
        message: 'Instructor created successfully',
        severity: 'success'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create instructor';
      throw new Error(errorMessage);
    }
  };

  const handleEditInstructor = async (data: InstructorRequest) => {
    if (!editingInstructor) return;
    
    try {
      await updateInstructor(editingInstructor.instructor_id, data);
      const updatedInstructor = {
        ...editingInstructor,
        name: data.name,
      };
      
      setInstructors((prev) =>
        prev.map((instructor) =>
          instructor.instructor_id === editingInstructor.instructor_id
            ? updatedInstructor
            : instructor
        )
      );
      
      setEditingInstructor(null);
      setSnackbar({
        open: true,
        message: 'Instructor updated successfully',
        severity: 'success'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update instructor';
      throw new Error(errorMessage);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteInstructor(confirmDelete.instructor_id);
      setInstructors((prev) =>
        prev.filter((instructor) => instructor.instructor_id !== confirmDelete.instructor_id)
      );
      setConfirmDelete(null);
      setSnackbar({
        open: true,
        message: 'Instructor deleted successfully',
        severity: 'success'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete instructor';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
      setConfirmDelete(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Instructors
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setShowAddForm(true)}
        >
          Add Instructor
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <InstructorList
        instructors={instructors}
        onEdit={setEditingInstructor}
        onDelete={setConfirmDelete}
        loading={loading}
        error={error}
      />

      {/* Add Form Dialog */}
      <Dialog
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Instructor</DialogTitle>
        <DialogContent>
          <InstructorForm onSubmit={handleAddInstructor} />
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog
        open={!!editingInstructor}
        onClose={() => setEditingInstructor(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Instructor</DialogTitle>
        <DialogContent>
          {editingInstructor && (
            <InstructorForm
              initialData={{ name: editingInstructor.name }}
              onSubmit={handleEditInstructor}
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
            Are you sure you want to delete instructor "{confirmDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default InstructorPage;