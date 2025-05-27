'use client'

import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'type', headerName: 'Type', width: 120 },
  { field: 'pillar', headerName: 'Pillar', width: 120 },
  { field: 'category', headerName: 'Category', width: 130 },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 180,
    valueGetter: (params) =>
      Array.isArray(params.row?.tags) ? params.row.tags.join(', ') : ''
  },
  {
    field: 'premium',
    headerName: 'Premium',
    width: 100,
    valueGetter: (params) =>
      params.row?.premium ? 'Yes' : 'No'
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 130,
    sortable: false,
    filterable: false,
    renderCell: (params) => {
      if (!params.row) return null
      return (
        <Box>
          <Tooltip title="View">
            <IconButton color="primary" onClick={() => alert(`View ${params.row.id}`)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton color="warning" onClick={() => alert(`Edit ${params.row.id}`)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="error" onClick={() => alert(`Delete ${params.row.id}`)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  }
]

const rows = [
  {
    id: 1,
    title: 'Mindfulness Basics',
    type: 'Video',
    pillar: 'Mental Health',
    category: 'Wellbeing',
    tags: ['calm', 'focus'],
    premium: true
  },
  {
    id: 2,
    title: 'Meditation Guide',
    type: 'PDF',
    pillar: 'Spiritual',
    category: 'Guides',
    tags: ['peace', 'daily'],
    premium: false
  },
  {
    id: 3,
    title: 'Stress Relief Music',
    type: 'Audio',
    pillar: 'Emotional',
    category: 'Relaxation',
    tags: ['soothing', 'sleep'],
    premium: true
  }
]

const paginationModel = { page: 0, pageSize: 5 }

export default function ResourceTable() {
  return (
    <Paper sx={{ height: 450, width: '100%', p: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  )
}
