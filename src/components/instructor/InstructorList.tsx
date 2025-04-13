import React from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Chip,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, School as SchoolIcon } from '@mui/icons-material';
import { Instructor } from '../../types/instructor.types';

interface InstructorListProps {
  instructors: Instructor[];
  onEdit: (instructor: Instructor) => void;
  onDelete: (instructor: Instructor) => void;
  loading?: boolean;
  error?: string | null;
}

const InstructorList: React.FC<InstructorListProps> = ({
  instructors,
  onEdit,
  onDelete,
  loading = false,
  error = null,
}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Compute displayed rows based on pagination
  const displayedInstructors = instructors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading instructors...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ width: '100%', mb: 2, p: 3 }}>
        <Box sx={{ color: 'error.main', py: 2 }}>
          <Typography variant="body1" color="error">
            Error loading instructors: {error}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Instructors
        <Chip 
          label={`Total: ${instructors.length}`} 
          color="primary" 
          size="small" 
          sx={{ ml: 2 }}
        />
      </Typography>
      
      {instructors.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body1">No instructors found.</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Add an instructor to get started.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="instructors table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedInstructors.map((instructor) => (
                  <TableRow key={instructor.instructor_id} hover>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {instructor.name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(instructor.date_created).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          aria-label="edit"
                          color="primary"
                          onClick={() => onEdit(instructor)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => onDelete(instructor)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={instructors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default InstructorList;