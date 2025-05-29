'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from 'recharts'
import {
  Card, CardHeader, CardContent, Typography, Box, Divider
} from '@mui/material'
import { API_URL } from '@/configs/url'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GoalsCreatedGraph = () => {
  const [goalStats, setGoalStats] = useState({
    created: new Array(12).fill(0),
    completed: new Array(12).fill(0),
    pending: new Array(12).fill(0),
  })

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/goals/analysis/win`)
        console.log('fetching user goals', res.data)

        const created = new Array(12).fill(0)
        const completed = new Array(12).fill(0)
        const pending = new Array(12).fill(0)

        // Count by createdAt month for all goals
        res.data.completedGoals.forEach(goal => {
          const month = new Date(goal.createdAt).getMonth()
          created[month]++
          completed[month]++
        })

        res.data.activeGoals.forEach(goal => {
          const month = new Date(goal.createdAt).getMonth()
          created[month]++
          pending[month]++
        })

        setGoalStats({ created, completed, pending })
      } catch (err) {
        console.error(err)
      }
    }

    fetchGoals()
  }, [])

  // Prepare chart data for Recharts
  const chartData = months.map((month, i) => ({
    name: month,
    Created: goalStats.created[i],
    Completed: goalStats.completed[i],
    Pending: goalStats.pending[i],
  }))

  // Calculate totals for the right side card
  const totalCreated = goalStats.created.reduce((a, b) => a + b, 0)
  const totalCompleted = goalStats.completed.reduce((a, b) => a + b, 0)
  const totalPending = goalStats.pending.reduce((a, b) => a + b, 0)

  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', width: '100%' }}>

      <Card sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <Card sx={{ flex: 2, minWidth: 200 }}>
          <CardHeader title="Goals Analysis Per Month" subheader="Based on createdAt date" />
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Created" fill="#1976d2" />
              <Bar dataKey="Completed" fill="#388e3c" />
              <Bar dataKey="Pending" fill="#fbc02d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 200 }}>
        <CardHeader title="Summary" />
        <CardContent>
          <Typography variant="h6" color="primary">Total Created</Typography>
          <Typography variant="h4" gutterBottom>{totalCreated}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" color="success.main">Total Completed</Typography>
          <Typography variant="h4" gutterBottom>{totalCompleted}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="h6" color="warning.main">Total Pending</Typography>
          <Typography variant="h4">{totalPending}</Typography>
        </CardContent>
      </Card>
      </Card>

     
      
    </Box>
  )
}

export default GoalsCreatedGraph
