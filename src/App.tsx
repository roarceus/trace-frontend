import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Provider
import { AuthProvider } from './contexts/AuthContext';

// Common Components
import AppBar from './components/common/AppBar';
import Drawer from './components/common/Drawer';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import InstructorPage from './pages/InstructorPage';
import CoursePage from './pages/CoursePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import TracePage from './pages/TracePage';

const drawerWidth = 240;

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AuthProvider>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <CssBaseline />
          
          <Routes>
            <Route 
              path="/login" 
              element={<LoginPage />} 
            />
            <Route 
              path="/signup" 
              element={<SignupPage />} 
            />
            <Route
              path="/*"
              element={
                <>
                  <AppBar onMenuClick={handleDrawerToggle} drawerWidth={drawerWidth} />
                  <Drawer
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    drawerWidth={drawerWidth}
                  />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      width: { sm: `calc(100% - ${drawerWidth}px)` },
                      ml: { sm: `${drawerWidth}px` },
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Toolbar />
                    <Box sx={{ flexGrow: 1 }}>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/dashboard" />}
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <DashboardPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/instructors"
                          element={
                            <ProtectedRoute>
                              <InstructorPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/courses"
                          element={
                            <ProtectedRoute>
                              <CoursePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/courses/:courseId"
                          element={
                            <ProtectedRoute>
                              <CourseDetailsPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/traces"
                          element={
                            <ProtectedRoute>
                              <TracePage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="*"
                          element={<Navigate to="/dashboard" />}
                        />
                      </Routes>
                    </Box>
                    <Footer />
                  </Box>
                </>
              }
            />
          </Routes>
        </Box>
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
};

export default App;