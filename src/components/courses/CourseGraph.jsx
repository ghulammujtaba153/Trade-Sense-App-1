'use client'
import React, { useEffect, useState } from 'react'
import {
  Card,
  Box,
  Typography,
  MenuItem,
  TextField,
  Divider
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { toast } from 'react-toastify'
import axios from 'axios'
import { API_URL } from '@/configs/url'

const CourseGraph = () => {
  const [year, setYear] = useState('2025')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [yearsAvailable, setYearsAvailable] = useState([])

  const fetch = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/enrollments/growth`)

      const groupedByYear = res.data.reduce((acc, enrollment) => {
        const date = new Date(enrollment.enrolledAt)
        const month = date.toLocaleString('default', { month: 'short' })
        const year = date.getFullYear()

        if (!acc[year]) acc[year] = {}
        if (!acc[year][month]) acc[year][month] = { total: 0, active: 0, completed: 0, dropped: 0, month }

        acc[year][month].total++
        acc[year][month][enrollment.status]++

        return acc
      }, {})

      const allYears = Object.keys(groupedByYear)
      setYearsAvailable(allYears)

      const formatted = Object.fromEntries(
        allYears.map(y => [
          y,
          Object.values(groupedByYear[y]).sort((a, b) => new Date(`${a.month} 1, 2000`) - new Date(`${b.month} 1, 2000`))
        ])
      )

      setChartData(formatted)
    } catch (error) {
      toast.error(error.message || 'Failed to fetch graph data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const currentData = chartData[year] || []
  const totalEnrollments = currentData.reduce((sum, d) => sum + d.total, 0)
  const totalActive = currentData.reduce((sum, d) => sum + d.active, 0)
  const totalCompleted = currentData.reduce((sum, d) => sum + d.completed, 0)
  const totalDropped = currentData.reduce((sum, d) => sum + d.dropped, 0)

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant='h6' mb={3}>
        Course Enrollments Over Time
      </Typography>

      <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        {/* Chart */}
        <Box flex={1} height={300}>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='month' />
              <YAxis />
              <Tooltip />
              <Line type='monotone' dataKey='total' stroke='#1976d2' name='Total Enrollments' />
              <Line type='monotone' dataKey='active' stroke='#2e7d32' name='Active' />
              <Line type='monotone' dataKey='completed' stroke='#d32f2f' name='Completed' />
              <Line type='monotone' dataKey='dropped' stroke='#ff9800' name='Dropped' />
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
            {yearsAvailable.map(y => (
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
          <Typography variant='body2'>
            Dropped: <strong>{totalDropped}</strong>
          </Typography>
        </Box>
      </Box>
    </Card>
  )
}

export default CourseGraph