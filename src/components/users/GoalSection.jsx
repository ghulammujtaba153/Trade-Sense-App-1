import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box
} from '@mui/material';
import { API_URL } from '@/configs/url';
import { useParams } from 'next/navigation';

const GoalsSection = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/goals/${id}`);
      setData(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        User Goals
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Frequency</TableCell>
              <TableCell>Target Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Reminders</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No goals found.
                </TableCell>
              </TableRow>
            ) : (
              data.map(goal => (
                <TableRow key={goal._id}>
                  <TableCell>{goal.title}</TableCell>
                  <TableCell>{goal.description}</TableCell>
                  <TableCell>{goal.frequency}</TableCell>
                  <TableCell>{new Date(goal.targetDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={goal.status}
                      color={
                        goal.status === 'completed'
                          ? 'success'
                          : goal.status === 'active'
                          ? 'primary'
                          : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{goal.reminders?.enabled ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GoalsSection;
