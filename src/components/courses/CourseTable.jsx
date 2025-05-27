'use client'
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardHeader,
  IconButton,
  TextField,
  Typography,
  Button
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'

const CourseTable = () => {
  const [searchText, setSearchText] = useState('')
  const [pageSize, setPageSize] = useState(5)

  const courseData = [
    {
      id: 1,
      courseName: 'React Basics',
      instructor: 'John Doe'
    },
    {
      id: 2,
      courseName: 'Advanced JavaScript',
      instructor: 'Jane Smith'
    },
    {
      id: 3,
      courseName: 'Node.js Mastery',
      instructor: 'Robert Johnson'
    },
    {
      id: 4,
      courseName: 'CSS Flex & Grid',
      instructor: 'Maria Garcia'
    },
    {
      id: 5,
      courseName: 'TypeScript in Depth',
      instructor: 'David Wilson'
    },
    {
      id: 6,
      courseName: 'MongoDB Essentials',
      instructor: 'Alice Johnson'
    }
  ]

  const filteredCourses = courseData.filter(course =>
    course.courseName.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    { field: 'courseName', headerName: 'Course Name', flex: 1 },
    { field: 'instructor', headerName: 'Instructor', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => (
        <Box>
          <IconButton color='primary' title='View'>
            <VisibilityIcon />
          </IconButton>
          <IconButton color='info' title='Edit'>
            <EditIcon />
          </IconButton>
          <IconButton color='error' title='Delete'>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ]

  return (
    <Card sx={{ p: 4 }}>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
        <CardHeader title='Courses' />
        <Button variant='contained' startIcon={<AddIcon />}>
          Add Course
        </Button>
      </Box>

      <Box mb={3} px={2}>
        <TextField
          label='Search by course name'
          variant='outlined'
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          size='small'
          fullWidth
        />
      </Box>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredCourses}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          onPageSizeChange={newPageSize => setPageSize(newPageSize)}
          pagination
        />
      </div>
    </Card>
  )
}

export default CourseTable
