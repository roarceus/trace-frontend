import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CircularProgress,
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, Download as DownloadIcon } from '@mui/icons-material';
import axiosInstance from '../../api/axiosConfig';

interface PdfViewerProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  traceId: string;
  fileName: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ open, onClose, courseId, traceId, fileName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      loadPdf();
    }
    return () => {
      // Clean up blob URL when component unmounts or dialog closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [open, courseId, traceId]);

  const loadPdf = async () => {
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    try {
      // Important: Use the correct endpoint path without duplicate '/api'
      const endpoint = `/v1/course/${courseId}/trace/${traceId}/pdf`;
      
      console.log("Fetching PDF from endpoint:", endpoint);
      
      // Use axios to get PDF with authentication headers
      const response = await axiosInstance.get(endpoint, {
        responseType: 'blob',
      });

      // Create a blob URL from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      setPdfUrl(blobUrl);
    } catch (err: any) {
      console.error('Error loading PDF:', err);
      let errorMessage = 'Failed to load PDF. Please try again later.';
      
      // Check if we have a more specific error message
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'PDF not found. The file may have been deleted or moved.';
        } else if (err.response.status === 403 || err.response.status === 401) {
          errorMessage = 'Authentication error. Please log in again.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = fileName || 'trace-survey.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: '90vh' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          {fileName}
        </Typography>
        <Box>
          {pdfUrl && (
            <IconButton color="primary" onClick={handleDownload} sx={{ mr: 1 }}>
              <DownloadIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" gutterBottom>{error}</Typography>
            <Button variant="contained" onClick={loadPdf}>Try Again</Button>
          </Box>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title={fileName}
          />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography>No PDF to display</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;