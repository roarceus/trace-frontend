import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  CircularProgress,
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  Description as DescriptionIcon 
} from '@mui/icons-material';
import { Course } from '../../types/course.types';
import { Instructor } from '../../types/instructor.types';
import { Department } from '../../types/department.types';
import { getInstructors } from '../../api/instructorService';
import { getDepartments } from '../../api/departmentService';
import { useNavigate } from 'react-router-dom';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

interface InstructorMap {
  [key: string]: string;
}

interface DepartmentMap {
  [key: number]: string;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const [instructorMap, setInstructorMap] = useState<InstructorMap>({});
  const [departmentMap, setDepartmentMap] = useState<DepartmentMap>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Fetch instructors and departments
        const [instructorsData, departmentsData] = await Promise.all([
          getInstructors(),
          getDepartments(),
        ]);
        
        // Create maps for quick lookups
        const instMap: InstructorMap = {};
        instructorsData.forEach((instructor: Instructor) => {
          instMap[instructor.instructor_id] = instructor.name;
        });
        
        const deptMap: DepartmentMap = {};
        departmentsData.forEach((department: Department) => {
          deptMap[department.department_id] = department.name;
        });
        
        setInstructorMap(instMap);
        setDepartmentMap(deptMap);
      } catch (error) {
        console.error('Error fetching reference data:', error);
      } finally {
        setDataLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (dataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {courses.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body1">No courses found.</Typography>
        </Box>
      ) : (
        <Stack spacing={3} direction="row" flexWrap="wrap">
          {courses.map((course) => (
            <Box key={course.course_id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 1 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {course.name}
                    </Typography>
                    <Chip label={course.code} color="primary" size="small" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {course.description || 'No description available'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                    <Chip
                      label={`${course.credit_hours} Credits`}
                      size="small"
                      variant="outlined"
                    />
                    {instructorMap[course.instructor_id] && (
                      <Chip
                        label={`Instructor: ${instructorMap[course.instructor_id]}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {departmentMap[course.department_id] && (
                      <Chip
                        label={`Dept: ${departmentMap[course.department_id]}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="caption" display="block" color="text.secondary">
                    Created: {new Date(course.date_added).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    Last Updated: {new Date(course.date_last_updated).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<DescriptionIcon />}
                    onClick={() => navigate(`/courses/${course.course_id}`)}
                  >
                    Traces
                  </Button>
                  
                  <Box sx={{ marginLeft: 'auto' }}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(course)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(course)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CourseList;