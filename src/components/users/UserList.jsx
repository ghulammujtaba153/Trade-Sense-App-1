"use client"
import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  Typography,
  Box,
  TextField,
  InputAdornment,
  MenuItem
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { DataGrid } from '@mui/x-data-grid'
import Link from 'next/link'
import { Button } from '@mui/material'


const roles = ['all', 'admin', 'author', 'editor', 'maintainer', 'subscriber']

const userData = [
  {
    id: 1,
    avatar: '/images/avatars/1.png',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    role: 'admin',
    currentPlan: 'enterprise',
    billing: 'Auto Debit',
    status: 'active'
  },
  {
    id: 2,
    avatar: '/images/avatars/2.png',
    fullName: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
    role: 'author',
    currentPlan: 'team',
    billing: 'Manual - Paypal',
    status: 'pending'
  },
  {
    id: 3,
    avatar: '/images/avatars/3.png',
    fullName: 'Robert Johnson',
    username: 'robertj',
    email: 'robert.j@example.com',
    role: 'editor',
    currentPlan: 'basic',
    billing: 'Manual - Cash',
    status: 'inactive'
  },
  {
    id: 4,
    avatar: '/images/avatars/4.png',
    fullName: 'Maria Garcia',
    username: 'mariag',
    email: 'maria.g@example.com',
    role: 'maintainer',
    currentPlan: 'enterprise',
    billing: 'Auto Debit',
    status: 'active'
  },
  {
    id: 5,
    avatar: '/images/avatars/5.png',
    fullName: 'David Wilson',
    username: 'davidw',
    email: 'david.w@example.com',
    role: 'subscriber',
    currentPlan: 'team',
    billing: 'Manual - Credit Card',
    status: 'pending'
  }
]

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'fullName', headerName: 'Full Name', flex: 1 },
  { field: 'username', headerName: 'Username', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'role', headerName: 'Role', flex: 1 },
  { field: 'currentPlan', headerName: 'Plan', flex: 1 },
  { field: 'billing', headerName: 'Billing', flex: 1.5 },
  { field: 'status', headerName: 'Status', flex: 1 }
]

const UserList = () => {
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [pageSize, setPageSize] = useState(5)

  const filteredUsers = userData.filter(user => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.role.toLowerCase().includes(searchText.toLowerCase())

    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <Card sx={{ pb:4 }}>
      <Box display='flex' justifyContent='space-between'  alignItems='center' gap={2} mb={3}>

        <CardHeader title='Users List' />
        <Button
  component={Link}
  href='/users/add-user'
  variant='contained'
  color='primary'
  sx={{ mr: 6 }}
>
  Add User
</Button>
      </Box>
      <Box px={6}>
        <Typography variant='body2' sx={{ mb: 2 }}>
          A table of users displaying their information, role, plan, billing method, and status.
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

          {/* <TextField
            label='Filter by Role'
            select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            size='small'
          >
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </TextField> */}
        </Box>

        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 20]}
            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
            pagination
          />
        </div>
      </Box>
    </Card>
  )
}

export default UserList
