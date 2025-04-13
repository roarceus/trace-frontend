import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { InstructorRequest } from '../../types/instructor.types';

interface InstructorFormProps {
  initialData?: InstructorRequest;
  onSubmit: (data: InstructorRequest) => Promise<void>;
  isEdit?: boolean;
}

const InstructorForm: React.FC<InstructorFormProps> = ({
  initialData = { name: '' },
  onSubmit,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<InstructorRequest>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      setError('Instructor name is required');
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
      setSuccess(isEdit ? 'Instructor updated successfully' : 'Instructor created successfully');
      if (!isEdit) {
        setFormData({ name: '' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {isEdit ? 'Edit Instructor' : 'Add New Instructor'}
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
        <TextField
          fullWidth
          label="Instructor Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />
        
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? isEdit
                ? 'Updating...'
                : 'Creating...'
              : isEdit
              ? 'Update Instructor'
              : 'Create Instructor'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default InstructorForm;