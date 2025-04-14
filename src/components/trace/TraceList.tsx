import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  CircularProgress,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  PictureAsPdf as PdfIcon,
  Visibility as VisibilityIcon 
} from '@mui/icons-material';
import { Trace } from '../../types/trace.types';
import { Instructor } from '../../types/instructor.types';
import { getInstructors } from '../../api/instructorService';
import PdfViewer from './PdfViewer';

interface TraceListProps {
  traces: Trace[];
  onDelete: (trace: Trace) => void;
}

interface InstructorMap {
  [key: string]: string;
}

const TraceList: React.FC<TraceListProps> = ({ traces, onDelete }) => {
  const [instructorMap, setInstructorMap] = useState<InstructorMap>({});
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{
    open: boolean;
    courseId: string;
    traceId: string;
    fileName: string;
  }>({
    open: false,
    courseId: '',
    traceId: '',
    fileName: '',
  });

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const instructors = await getInstructors();
        const map: InstructorMap = {};
        instructors.forEach((instructor: Instructor) => {
          map[instructor.instructor_id] = instructor.name;
        });
        setInstructorMap(map);
      } catch (error) {
        console.error('Error fetching instructors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const handleViewPdf = (courseId: string, traceId: string, fileName: string) => {
    setSelectedPdf({
      open: true,
      courseId,
      traceId,
      fileName,
    });
  };

  const handleClosePdf = () => {
    setSelectedPdf(prev => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {traces.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">No trace surveys found for this course.</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Upload a trace survey to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="traces table">
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Instructor</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Section</TableCell>
                  <TableCell>Uploaded</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {traces.map((trace) => (
                  <TableRow key={trace.trace_id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PdfIcon color="error" sx={{ mr: 1 }} />
                        {trace.file_name}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {instructorMap[trace.instructor_id] ? (
                        instructorMap[trace.instructor_id]
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unknown Instructor
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={trace.semester_term} size="small" />
                    </TableCell>
                    <TableCell>{trace.section}</TableCell>
                    <TableCell>
                      {new Date(trace.date_created).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View PDF">
                        <IconButton
                          aria-label="view"
                          color="primary"
                          onClick={() => handleViewPdf(trace.course_id, trace.trace_id, trace.file_name)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => onDelete(trace)}
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
        )}
      </Paper>

      {/* PDF Viewer Dialog */}
      <PdfViewer
        open={selectedPdf.open}
        onClose={handleClosePdf}
        courseId={selectedPdf.courseId}
        traceId={selectedPdf.traceId}
        fileName={selectedPdf.fileName}
      />
    </>
  );
};

export default TraceList;