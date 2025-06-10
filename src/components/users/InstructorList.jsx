'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardHeader, Typography, Box, TextField, InputAdornment, Switch, IconButton, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { toast } from 'react-toastify'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import InstructorDrawer from './InstructorDrawer'
import { API_URL } from '@/configs/url'
import AssignInstructor from './AssignInstructor'
import PageLoader from '../loaders/PageLoader'

const InstructorList = () => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Drawer state for add/edit
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // AssignInstructor modal state
  const [assignOpen, setAssignOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/auth/editors`)
      setUsers(res.data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await axios.patch(`${API_URL}/api/auth/users/${id}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const updateStatus = async (userId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/auth/users/${userId}/status`, { status: newStatus })
      toast.success(`User status updated to ${newStatus}`)
      fetchUsers()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  // Filter users based on search text
  const filteredUsers = users.filter(user => {
    const searchLower = searchText.toLowerCase()
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    )
  })

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.8,
      renderCell: params => (
        <Switch
          checked={params.row.status === 'active'}
          onChange={() => updateStatus(params.row._id, params.row.status === 'active' ? 'suspended' : 'active')}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: params => (
        <Box>
          <IconButton
            color='primary'
            onClick={() => {
              setEditingUser(params.row)
              setDrawerOpen(true)
            }}
            title='Edit User'
          >
            <EditIcon />
          </IconButton>

          <IconButton onClick={() => handleDelete(params.row._id)} color='error' title='Delete User'>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleAddNew = () => {
    setEditingUser(null)
    setDrawerOpen(true)
  }

  const onSaveUser = () => {
    fetchUsers()
    setDrawerOpen(false)
  }

  // Handler for AssignInstructor popup open/close
  const handleOpenAssign = () => {
    setAssignOpen(true)
  }

  const handleCloseAssign = () => {
    setAssignOpen(false)
  }

  // When instructor assigned, refresh users or handle accordingly
  const handleAssignComplete = data => {
    toast.success('Instructor assigned successfully')
    fetchUsers()
  }


  if(loading) return <PageLoader />

  return (
    <Card sx={{ pb: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} mb={3} px={3}>
        <CardHeader title='Instructors List' />
        <Box>
          <Button variant='contained' color='primary' onClick={handleAddNew} sx={{ mr: 2 }}>
            Add Instructor
          </Button>
          <Button variant='outlined' color='primary' onClick={handleOpenAssign}>
            Assign Instructor
          </Button>
        </Box>
      </Box>

      <Box px={3}>
        <Typography variant='body2' sx={{ mb: 2 }}>
          A table of instructors displaying their information and status.
        </Typography>

        <Box display='flex' gap={2} mb={3} flexWrap='wrap' alignItems='center'>
          <TextField
            label='Search'
            variant='outlined'
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
            size='small'
          />
        </Box>

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: '900px' }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={row => row._id}
              rowsPerPageOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
              loading={loading}
              disableSelectionOnClick
            />
          </Box>
        </Box>
      </Box>

      <InstructorDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} user={editingUser} onSave={onSaveUser} />

      <AssignInstructor
        isOpen={assignOpen}
        onClose={handleCloseAssign}
        instructors={users} // Pass users as instructors list
        onAssign={handleAssignComplete}
      />
    </Card>
  )
}

export default InstructorList
