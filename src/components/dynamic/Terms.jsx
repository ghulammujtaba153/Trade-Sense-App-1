'use client'

import React, { useEffect, useState } from 'react'
import { Box, Button, IconButton, Stack, Typography, Tooltip } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import axios from 'axios'
import { toast } from 'react-toastify'
import { API_URL } from '@/configs/url'
import PageLoader from '../loaders/PageLoader'
import TermsModal from './TermsModal' // make sure this is a modal component

const Terms = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)
  const [selectedTerm, setSelectedTerm] = useState(null)

  const fetchTerms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/terms`)
      setData(res.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load terms')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this term?')) return
    try {
      await axios.delete(`${API_URL}/api/terms/${id}`)
      toast.success('Deleted successfully')
      fetchTerms()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed')
    }
  }

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: params => (
        <Box display='flex h-full items-center justify-center' gap={1}>
          {/* <IconButton
            color="primary"
            onClick={() => alert(params.row.content)} // Or implement a ViewModal
          >
            <Visibility />
          </IconButton> */}
          <Tooltip
            title="Edit"
            slotProps={{
              popper: {
                className: 'capitalize',
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
                setSelectedTerm(params.row);
                setOpenModal(true);
              }}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip
            title="Delete"
            slotProps={{
              popper: {
                className: 'capitalize',
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
              <Delete />
            </IconButton>
          </Tooltip>

        </Box>
      )
    }
  ]

  useEffect(() => {
    fetchTerms()
  }, [])

  if (loading) return <PageLoader />

  return (
    <Box p={2}>
      <Stack direction='row' justifyContent='space-between' mb={2}>
        <Typography variant='h6'>Terms & Conditions</Typography>
        <Button
          variant='contained'
          startIcon={<Add />}
          onClick={() => {
            setSelectedTerm(null)
            setOpenModal(true)
          }}
        >
          Add Terms
        </Button>
      </Stack>

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <Box sx={{ minWidth: '900px' }}>
          <DataGrid rows={data} getRowId={row => row._id} columns={columns} pageSize={5} rowsPerPageOptions={[5, 10]} />
        </Box>
      </Box>

      {/* Modal to Add/Edit */}
      {openModal && (
        <TermsModal
          data={selectedTerm}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            fetchTerms()
            setOpenModal(false)
          }}
        />
      )}
    </Box>
  )
}

export default Terms
