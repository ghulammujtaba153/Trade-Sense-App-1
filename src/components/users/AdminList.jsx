'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Switch,
  Button,
  Drawer,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { API_URL } from '@/configs/url'
import { toast } from 'react-toastify'
import AdminDrawer from './AdminDrawer'
import PageLoader from '../loaders/PageLoader'

const AdminList = () => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editUser, setEditUser] = useState(null) // null means Add mode

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/auth/admins`)
      setUsers(res.data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await axios.delete(`${API_URL}/api/auth/users/${id}`)
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

  const filteredUsers = users.filter(user =>
    `${user.name} ${user.email} ${user.phone}`.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => (
        <Switch
          checked={params.value === 'active'}
          onChange={() => updateStatus(params.row._id, params.value === 'active' ? 'suspended' : 'active')}
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      renderCell: params => (
        <Box display="flex" gap={1}>
          <Tooltip
            title="Edit Admin"
            slotProps={{
              popper: {
                className: 'capitalize',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              },
              tooltip: {
                sx: {
                  backgroundColor: 'var(--mui-palette-background-paper)',
                  color: 'var(--mui-palette-text-primary)',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem',
                },
              },
            }}
          >
            <IconButton
              color="primary"
              onClick={() => {
                setEditUser(params.row);
                setDrawerOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Delete Admin"
            slotProps={{
              popper: {
                className: 'capitalize',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              },
              tooltip: {
                sx: {
                  backgroundColor: 'var(--mui-palette-background-paper)',
                  color: 'var(--mui-palette-text-primary)',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem',
                },
              },
            }}
          >
            <IconButton color="error" onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>

      )
    }
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  // Close drawer handler & refresh list after add/edit
  const handleDrawerClose = (refresh = false) => {
    setDrawerOpen(false)
    setEditUser(null)
    if (refresh) fetchUsers()
  }


  if (loading) return <PageLoader />

  return (
    <Card sx={{ pb: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} mb={3} px={2}>
        <CardHeader title='Admin List' />
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            setEditUser(null) // Add mode
            setDrawerOpen(true)
          }}
        >
          Add Admin
        </Button>
      </Box>

      <Box px={6}>
        <Typography variant='body2' sx={{ mb: 2 }}>
          A table of users displaying their name, email, phone, and status. You can toggle their status or delete users.
        </Typography>

        <Box display='flex' gap={2} mb={3} flexWrap='wrap'>
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
              pageSize={pageSize}
              rowsPerPageOptions={[5, 10, 20]}
              onPageSizeChange={newPageSize => setPageSize(newPageSize)}
              loading={loading}
              pagination
            />
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor='right'
        open={drawerOpen}
        onClose={() => handleDrawerClose(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 450 } } }}
      >
        <AdminDrawer userData={editUser} onClose={handleDrawerClose} />
      </Drawer>
    </Card>
  )
}

export default AdminList
