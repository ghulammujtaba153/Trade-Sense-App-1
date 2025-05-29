import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import CourseSection from './CourseSection';
import GoalsSection from './GoalSection';

const UserDetailSection = ({ enrollments }) => {
  return (
    <Stack spacing={4}>
      <Typography variant="h5" fontWeight="600">
        Courses
      </Typography>

      <CourseSection enrollments={enrollments} />

      <GoalsSection />
    </Stack>
  );
};

export default UserDetailSection;
