'use client'

import { API_URL } from '@/configs/url'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Box, IconButton, Typography, CircularProgress, Paper, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import DeleteIcon from '@mui/icons-material/Delete'
import PageLoader from '@/components/loaders/PageLoader'

const Page = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchGoals = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/goals`)
      console.log("API Response:", response.data)

      if (response.data && Array.isArray(response.data)) {
        // Add id field for DataGrid key
        const goalsWithId = response.data.map(goal => ({
          ...goal,
          id: goal._id,
        }))
        setGoals(goalsWithId)
      } else {
        toast.error('Unexpected response format from server')
        setGoals([])
      }
    } catch (error) {
      console.error('Failed to fetch goals:', error)
      toast.error('Failed to load goals')
      setGoals([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleDelete = async goalId => {
    try {
      await axios.delete(`${API_URL}/api/goals/${goalId}`)
      toast.success('Goal deleted successfully')
      fetchGoals()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete goal')
    }
  }

  const columns = [
    {
      field: 'userId',
      headerName: 'User Name',
      flex: 1,
      valueGetter: params => {
          console.log("params",params)
        // Safely get user name from nested userId object
        return params?.name ?? 'N/A'
      },
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    // { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'frequency', headerName: 'Frequency', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 1.5,
      valueFormatter: params => {
        if (!params) return 'N/A'
        const date = new Date(params)
        return isNaN(date) ? 'Invalid date' : date.toLocaleString()
      },
    },
    {
      field: 'updatedAt',
      headerName: 'Last Update',
      flex: 1.5,
      valueFormatter: params => {
        console.log("params",params)
        if (!params) return 'N/A'
        const date = new Date(params)
        return isNaN(date) ? 'Invalid date' : date.toLocaleString()
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: params => (
        <Tooltip title="Delete"
            slotProps={{
              popper: {
                className: 'capitalize',
                sx: {
                  '& .MuiTooltip-tooltip': {
                    backgroundColor: 'var(--mui-palette-background-paper)',
                    color: 'var(--mui-palette-text-primary)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }
                }
              }
            }}
          >
        <IconButton onClick={() => handleDelete(params.row._id)} color='error'>
          <DeleteIcon />
        </IconButton>
        </Tooltip>

      ),
    },
  ]

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Typography variant='h5' gutterBottom>
        Accountability Goals
      </Typography>

      {loading ? (
        <Box className="flex items-center justify-center min-h-screen w-full">
          <PageLoader />
        </Box>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Box sx={{ minWidth: '900px' }}>


          <DataGrid
            rows={goals}
            columns={columns}
            getRowId={row => row._id}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />

          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Page
