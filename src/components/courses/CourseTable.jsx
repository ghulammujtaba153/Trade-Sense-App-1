'use client'

import React, { useEffect, useState } from 'react'
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'
import { Box, Typography, Menu, MenuItem, Button, Paper, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import axios from 'axios'
import { API_URL } from '@/configs/url'

// Import your modals here
import CourseModal from './CourseModal'
import ModuleModal from './ModuleModal'
import AddCourseModule from './AddCourseModule'
import PageLoader from '../loaders/PageLoader'
import Link from 'next/link'

const CourseTable = () => {
  const [courses, setCourses] = useState([])
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [menuCourseId, setMenuCourseId] = useState(null)
  const [viewModuleModal, setViewModuleModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const [addModuleModalOpen, setAddModuleModalOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/courses`)
      setCourses(response.data)
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`)
      setCourses(prev => prev.filter(course => course._id !== id))
    } catch (error) {
      console.error('Failed to delete course:', error)
    }
  }

  const handleOpenAddModal = () => {
    setSelectedCourse(null)
    setIsModalOpen(true)
  }

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'instructor',
      headerName: 'Instructor',
      flex: 1,
      renderCell: params => params.row?.instructor?.email || 'N/A'
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => (
        <Typography
          variant='caption'
          sx={{
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: params.value === 'published' ? 'green.100' : 'grey.100',
            color: params.value === 'published' ? 'green.800' : 'grey.800'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180, // Explicit width to make sure icons fit
      getActions: params => [
        <Tooltip title='Add Module'
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
        }}>
        <GridActionsCellItem
          key='add'
          icon={<AddIcon />}
          label='Add Module'
          onClick={() => {
            setSelectedCourse(params.row)
            setAddModuleModalOpen(true)
          }}
          showInMenu={false}
          color='success'
        />
        </Tooltip>
        ,
        <Tooltip title='View Modules'
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
        }}>
          <Link href={`/courses/${params.row._id}`}>
            <VisibilityIcon />
          </Link>
        {/* <GridActionsCellItem
          key='view'
          icon={<VisibilityIcon />}
          label='View Modules'
          onClick={() => {
            setSelectedCourse(params.row)
            setViewModuleModal(true)
          }}
          showInMenu={false}
          color='warning'
        /> */}
        </Tooltip>
        ,
        <Tooltip title='Edit Course'
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
        }}>
        <GridActionsCellItem
          key='edit'
          icon={<EditIcon />}
          label='Edit'
          onClick={() => {
            setSelectedCourse(params.row)
            setIsModalOpen(true)
          }}
          color='primary'
          showInMenu={false}
        />
        </Tooltip>
        ,
        <Tooltip title='Delete Course'
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
        }}>
        <GridActionsCellItem
          key='delete'
          icon={<DeleteIcon />}
          label='Delete'
          onClick={() => handleDelete(params.row._id)}
          showInMenu={false}
          color='error'
        />
        </Tooltip>
      ]
    }
  ]

  if (loading) return <PageLoader />

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Typography variant='h6'>Courses</Typography>
        <Button variant='contained' color='primary' startIcon={<AddIcon />} onClick={handleOpenAddModal}>
          Add Course
        </Button>
      </Box>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: '900px' }}>
          <DataGrid
            rows={courses}
            getRowId={row => row._id}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': { py: 2 }
            }}
          />
        </Box>
      </Box>

      {/* Course edit/add modal */}
      {isModalOpen && (
        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseData={selectedCourse}
          onSuccess={() => {
            setIsModalOpen(false)
            setSelectedCourse(null)
            fetchCourses()
          }}
        />
      )}

      {/* Module modal for viewing/editing modules */}
      {viewModuleModal && (
        <ModuleModal
          isOpen={viewModuleModal}
          onClose={() => {
            setViewModuleModal(false)
            setSelectedCourse(null)
          }}
          data={selectedCourse}
          onSuccess={() => {
            setViewModuleModal(false)
            setSelectedCourse(null)
            fetchCourses()
          }}
        />
      )}

      {/* AddCourseModule modal */}
      {addModuleModalOpen && (
        <AddCourseModule
          isOpen={addModuleModalOpen}
          onClose={() => {
            setAddModuleModalOpen(false)
            setSelectedCourse(null)
          }}
          data={selectedCourse}
          onSuccess={() => {
            setAddModuleModalOpen(false)
            setSelectedCourse(null)
            fetchCourses()
          }}
        />
      )}
    </Paper>
  )
}

export default CourseTable
