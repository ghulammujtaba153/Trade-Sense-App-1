'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import axios from 'axios'
import { toast } from 'react-toastify'

import { API_URL } from '@/configs/url'
import AddResource from './AddResource'
import ViewResource from "./ViewResource"

export default function ResourceTable() {
  const [resources, setResources] = useState([])
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  })
  const [showModal, setShowModal] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState(null)

  // Fetch resources from API
  const fetchResources = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/resources`)
      const dataWithId = res.data.map((r) => ({ ...r, id: r._id }))
      setResources(dataWithId)
    } catch (error) {
      console.error('Error fetching resources', error)
      toast.error("Failed to load resources")
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  // Delete resource by id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/resources/${id}`)
      toast.success("Deleted successfully")
      fetchResources()
    } catch (error) {
      console.error(error)
      toast.error("Error deleting resource")
    }
  }

  // Handle filter inputs change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  // Apply filtering to resources
  const filteredResources = resources.filter((res) => {
    const matchesType = filters.type ? res.type === filters.type : true
    const matchesCategory = filters.category ? res.category === filters.category : true
    const matchesSearch = filters.search
      ? res.title.toLowerCase().includes(filters.search.toLowerCase())
      : true
    return matchesType && matchesCategory && matchesSearch
  })

  // Columns for the DataGrid
  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'pillar', headerName: 'Pillar', width: 120 },
    { field: 'category', headerName: 'Category', width: 130 },
    {
      field: 'tags',
      headerName: 'Tags',
      flex: 1,
      renderCell: (params) =>
        Array.isArray(params.row.tags) ? params.row.tags.join(', ') : ''
    },
    {
      field: 'isPremium',
      headerName: 'Premium',
      width: 100,
      valueGetter: (params) => (params.row?.isPremium ? 'Yes' : 'No')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedResource(params.row)
                setViewModalOpen(true)
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="warning"
              onClick={() => {
                setSelectedResource(params.row)
                setShowModal(true)
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  return (
    <Paper sx={{  width: '100%', p: 2, position: 'relative' }}>
      {/* Top-right Add Resource Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 16,
          paddingBottom: 2,
          zIndex: 10,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedResource(null)
            setShowModal(true)
          }}
          
        >
          Add Resource
        </Button>
      </Box>

      {/* Search filter */}
      <TextField
        label="Search by Title"
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mb: 2, width: 300 }}
      />

      {/* DataGrid Table */}
      <DataGrid
        rows={filteredResources}
        columns={columns}
        pageSizeOptions={[5, 10, 25]}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 5 } }
        }}
        autoHeight
        disableRowSelectionOnClick
        sx={{ border: 0 }}
      />

      {/* Add / Edit Resource Modal */}
      {showModal && (
        <AddResource
          onClose={() => {
            setShowModal(false)
            setSelectedResource(null)
          }}
          onSuccess={() => {
            setShowModal(false)
            setSelectedResource(null)
            fetchResources()
          }}
          resource={selectedResource}
        />
      )}

      {/* View Resource Modal */}
      {viewModalOpen && (
        <ViewResource
          open={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false)
            setSelectedResource(null)
          }}
          resource={selectedResource}
        />
      )}
    </Paper>
  )
}
