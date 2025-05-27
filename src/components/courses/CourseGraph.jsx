'use client'
import React, { useState } from 'react'
import {
  Card,
  Box,
  Typography,
  MenuItem,
  TextField,
  Divider
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const dummyData = {
  2023: [
    { month: 'Jan', total: 20, active: 15, completed: 5 },
    { month: 'Feb', total: 30, active: 20, completed: 10 },
    { month: 'Mar', total: 40, active: 25, completed: 15 },
    { month: 'Apr', total: 35, active: 20, completed: 15 },
    { month: 'May', total: 50, active: 30, completed: 20 },
    { month: 'Jun', total: 60, active: 35, completed: 25 }
  ],
  2024: [
    { month: 'Jan', total: 25, active: 18, completed: 7 },
    { month: 'Feb', total: 40, active: 28, completed: 12 },
    { month: 'Mar', total: 55, active: 30, completed: 25 },
    { month: 'Apr', total: 45, active: 26, completed: 19 },
    { month: 'May', total: 70, active: 40, completed: 30 },
    { month: 'Jun', total: 90, active: 50, completed: 40 }
  ]
}

const CourseGraph = () => {
  const [year, setYear] = useState('2024')
  const data = dummyData[year]

  const totalEnrollments = data.reduce((sum, d) => sum + d.total, 0)
  const totalActive = data.reduce((sum, d) => sum + d.active, 0)
  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0)

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant='h6' mb={3}>
        Course Enrollments Over Time
      </Typography>

      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Chart */}
        <Box flex={1} height={300}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='total' stroke='#1976d2' name='Total Enrollments' />
              <Line type='monotone' dataKey='active' stroke='#2e7d32' name='Active' />
              <Line type='monotone' dataKey='completed' stroke='#d32f2f' name='Completed' />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Filters and Summary */}
        <Box minWidth={250}>
          <TextField
            select
            fullWidth
            label='Select Year'
            value={year}
            onChange={e => setYear(e.target.value)}
            size='small'
            sx={{ mb: 3 }}
          >
            {Object.keys(dummyData).map(y => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </TextField>

          <Divider sx={{ mb: 2 }} />

          <Typography variant='subtitle1'>Summary</Typography>
          <Typography variant='body2' sx={{ mt: 1 }}>
            Total Enrollments: <strong>{totalEnrollments}</strong>
          </Typography>
          <Typography variant='body2'>
            Active: <strong>{totalActive}</strong>
          </Typography>
          <Typography variant='body2'>
            Completed: <strong>{totalCompleted}</strong>
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default CourseGraph
