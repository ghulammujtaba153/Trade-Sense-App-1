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

import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { API_URL } from '@/configs/url'
import { toast } from 'react-toastify'

import { RemoveRedEye } from '@mui/icons-material'
import Link from 'next/link'
import PageLoader from '../loaders/PageLoader'


const TradingTable = () => {
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
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: params => (
        <Box display='flex' gap={1}>
          <Tooltip title='View User'
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
            <Link className='pt-2' href={`/trading/${params.row.id}`}>
              <RemoveRedEye />
            </Link>
          </Tooltip>
          
          
        </Box>
      )
    }
  ]


  if(loading) return <PageLoader/>

  return (
    <Card sx={{ pb: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' gap={2} mb={3}>
        <CardHeader title='Users List' />
        
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

        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <Box sx={{ minWidth: '900px' }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              rowsPerPageOptions={[5, 10, 20]}
              loading={loading}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5
                  }
                }
              }}
            />
          </Box>
        </Box>
      </Box>

      
    </Card>
  )
}

export default TradingTable
