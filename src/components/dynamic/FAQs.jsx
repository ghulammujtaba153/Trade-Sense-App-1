'use client'

import { API_URL } from '@/configs/url'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { toast } from 'react-toastify'
import FAQModal from './FAQModal'
import { DataGrid } from '@mui/x-data-grid'
import PageLoader from '../loaders/PageLoader'

const FAQs = () => {
  const [faq, setFaq] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFaq, setSelectedFaq] = useState(null)
  const [modalType, setModalType] = useState('')
  const [showModal, setShowModal] = useState(false)

  const fetch = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/faq`)
      setFaq(res.data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return
    try {
      await axios.delete(`${API_URL}/api/faq/${id}`)
      toast.success('FAQ deleted')
      fetch()
    } catch (error) {
      toast.error(error.message)
    }
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setSelectedFaq(item)
    setShowModal(true)
  }

  const columns = [
    {
      field: 'question',
      headerName: 'Question',
      flex: 150,
    },
    {
      field: 'answer',
      headerName: 'Answer',
      flex: 250,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <Tooltip
            title="View"
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
            <IconButton color="primary" onClick={() => openModal('view', params.row)}>
              <Visibility />
            </IconButton>
          </Tooltip>

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
            <IconButton color="success" onClick={() => openModal('edit', params.row)}>
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
        </>

      ),
    },
  ]

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          FAQs
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openModal('add')}>
          Add FAQ
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <PageLoader />
        </Box>
      ) : (
        <Box>
          <DataGrid
            rows={faq.map((item) => ({ ...item, id: item._id }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      )}

      {showModal && (
        <FAQModal
          open={showModal}
          type={modalType}
          data={selectedFaq}
          onClose={() => setShowModal(false)}
          onRefresh={fetch}
        />
      )}
    </Box>
  )
}

export default FAQs
