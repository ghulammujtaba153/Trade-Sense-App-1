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
  Tooltip,
  Button
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { API_URL } from '@/configs/url'
import { toast } from 'react-toastify'
import UserModal from './UserModal'
import { RemoveRedEye } from '@mui/icons-material'
import Link from 'next/link'

const UserList = () => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null) // null means add new user

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/auth/users`)
      setUsers(res.data.users)
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
    try {
      await axios.patch(`${API_URL}/api/auth/users/${id}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      await axios.patch(`${API_URL}/api/auth/users/${id}/status`, {
        status: newStatus
      })
      toast.success(`User status updated to ${newStatus}`)
      fetchUsers()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  // Open modal for adding new user
  const openAddModal = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  // Open modal for editing existing user
  const openEditModal = user => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Called when user is added or updated successfully in modal
  const onUserSaved = () => {
    fetchUsers()
    closeModal()
  }

  const filteredUsers = users
    .filter(user => {
      const searchLower = searchText.toLowerCase()
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toString().includes(searchLower)
      )
    })
    .map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      experienceLevel: user.experienceLevel,
      gender: user.gender,
      status: user.status,
      fullData: user
    }))

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'experienceLevel', headerName: 'Experience Level', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => (
        <Switch
          checked={params.row.status === 'active'}
          onChange={() => handleStatusChange(params.row.id, params.row.status)}
          color='primary'
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box display="flex" gap={1}>
          <Tooltip title='View User'>
            <Link href={`/users/${params.row.id}`}>
              <RemoveRedEye />
            </Link>
          </Tooltip>
          <Tooltip title='Edit User'>
            <IconButton onClick={() => openEditModal(params.row.fullData)} color='primary'>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete User'>
            <IconButton onClick={() => handleDelete(params.row.id)} color='error'>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Card sx={{ pb: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} mb={3}>
        <CardHeader title='Users List' />
        <Button
          variant='contained'
          color='primary'
          sx={{ mr: 6 }}
          onClick={openAddModal}
        >
          Add User
        </Button>
      </Box>

      <Box px={6}>
        <Typography variant='body2' sx={{ mb: 2 }}>
          A table of users with contact info and account controls.
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

        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            pagination
            loading={loading}
          />
        </div>
      </Box>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
        onCustomerAdded={onUserSaved}
      />
    </Card>
  )
}

export default UserList
