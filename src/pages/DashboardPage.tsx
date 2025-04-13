import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { School as SchoolIcon, Person as PersonIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={3}>
        {/* Welcome Message */}
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography component="h1" variant="h4" color="primary" gutterBottom>
            Welcome, {user?.first_name}!
          </Typography>
          <Typography variant="body1">
            This dashboard allows you to manage your trace survey data. You can create and manage instructors, courses, and upload trace surveys.
          </Typography>
        </Paper>
        
        {/* Quick Actions */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Instructors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add and manage instructor information for your courses.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth
                  onClick={() => navigate('/instructors')}
                >
                  Manage Instructors
                </Button>
              </CardActions>
            </Card>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Courses
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and manage your course listings and details.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth
                  onClick={() => navigate('/courses')}
                >
                  Manage Courses
                </Button>
              </CardActions>
            </Card>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 60, mb: 2, color: 'primary.main' }} />
                <Typography variant="h5" component="div" gutterBottom>
                  Trace Surveys
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload and manage trace survey PDFs for your courses.
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  fullWidth
                  onClick={() => navigate('/traces')}
                >
                  Manage Traces
                </Button>
              </CardActions>
            </Card>
          </Box>
        </Stack>
      </Stack>
    </Container>
  );
};

export default DashboardPage;