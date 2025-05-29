'use client'

import { API_URL } from '@/configs/url'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Box, Button, CircularProgress, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Add, Edit, Delete, Visibility } from '@mui/icons-material'
import { toast } from 'react-toastify'
import FAQModal from './FAQModal'

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

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">FAQs</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openModal('add')}>
          Add FAQ
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Question</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {faq.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.question}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => openModal('view', item)}>
                      <Visibility />
                    </IconButton>
                    <IconButton color="success" onClick={() => openModal('edit', item)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item._id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
